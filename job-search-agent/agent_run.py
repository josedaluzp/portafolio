#!/usr/bin/env python3
"""agent_run.py — Runner autónomo (Playwright) para LinkedIn Easy Apply.

Corre EN TU MÁQUINA, no en la nube. Abre un Chromium con un perfil persistente
(en .browser_profile/) para que inicies sesión UNA sola vez; a partir de ahí
reutiliza esa sesión en cada corrida.

Qué hace por cada `search_run` de config.json:
  1. Calcula remaining = max_applications - applied_today (leyendo el tracker).
  2. Abre LinkedIn Jobs con la query + filtros (última semana, ubicaciones,
     modalidad, nivel de experiencia).
  3. Por cada oferta: aplica exclusiones (empresa/keywords), corre el guard
     anti-duplicado, y si es "Easy Apply" intenta postular automáticamente
     destildando "Seguir empresa".
  4. Registra CADA intento con record_application.py (Aplicado / Incompleto).

Límites duros (nunca se violan — ver CLAUDE.md sección e):
  - No completa DNI/CUIT/pasaporte/SSN, no resuelve CAPTCHAs, no crea cuentas,
    no ingresa contraseñas, no inventa datos. Ante cualquiera → Incompleto.

Requisitos:
    pip install playwright openpyxl reportlab
    playwright install chromium

Uso:
    python agent_run.py                 # corre todos los search_runs habilitados
    python agent_run.py --headful       # ver el navegador (recomendado la 1ra vez)
    python agent_run.py --only ai_engineer
    python agent_run.py --dry-run       # navega y evalúa, pero NO postula ni registra
    python agent_run.py --self-test     # testea la lógica pura, sin navegador
"""

import argparse
import json
import os
import subprocess
import sys
import urllib.parse
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(HERE, "config.json")
TRACKER_JSON = os.path.join(HERE, "job_tracker.json")
PROFILE_DIR = os.path.join(HERE, ".browser_profile")

# Mapeo de nivel de experiencia -> códigos f_E de LinkedIn.
#   1 pasantía · 2 sin experiencia · 3 algo de responsabilidad (associate)
#   4 intermedio-senior · 5 director · 6 ejecutivo
LINKEDIN_EXPERIENCE = {
    "junior avanzado": ["2", "3"],
    "semi-senior": ["3", "4"],
}
# Palabras que, en un formulario, delatan un campo de identidad -> abortar.
IDENTITY_HINTS = ["dni", "cuit", "cuil", "passport", "pasaporte", "ssn",
                  "social security", "documento", "national id"]


# ───────────────────────── Lógica pura (testeable) ─────────────────────────

def _norm(v):
    return (v or "").strip().lower()


def company_excluded(company, excluded_companies):
    c = _norm(company)
    return any(c == _norm(x) or _norm(x) in c for x in excluded_companies)


def text_has_excluded_keyword(text, excluded_keywords):
    """Devuelve la primera keyword excluida encontrada, o None."""
    t = _norm(text)
    for kw in excluded_keywords:
        if _norm(kw) in t:
            return kw
    return None


def looks_like_identity_field(label):
    l = _norm(label)
    return any(h in l for h in IDENTITY_HINTS)


def build_linkedin_url(query, location, experience_levels, remote_only=True):
    params = {
        "keywords": query,
        "location": location,
        "f_TPR": "r604800",  # última semana (7 días en segundos)
    }
    if remote_only:
        params["f_WT"] = "2"  # 2 = remoto
    codes = []
    for lvl in experience_levels:
        codes.extend(LINKEDIN_EXPERIENCE.get(lvl, []))
    if codes:
        params["f_E"] = ",".join(sorted(set(codes)))
    return "https://www.linkedin.com/jobs/search/?" + urllib.parse.urlencode(params)


def applied_today_for_query(tracker, query, today_str):
    """Cuenta postulaciones válidas (no Incompleto) de hoy para la query."""
    return sum(
        1 for e in tracker
        if e.get("date") == today_str
        and e.get("search_query") == query
        and not _norm(e.get("status")).startswith("incompleto")
    )


def total_valid_today(tracker, today_str):
    return sum(
        1 for e in tracker
        if e.get("date") == today_str
        and not _norm(e.get("status")).startswith("incompleto")
    )


# ───────────────────────── Registro (vía helper) ──────────────────────────

def record(company, role, role_profile, search_query, location, platform,
           jd_url, status, notes="", dry_run=False):
    cmd = [
        sys.executable, os.path.join(HERE, "record_application.py"),
        "--company", company, "--role", role, "--role-profile", role_profile,
        "--search-query", search_query, "--location", location or "",
        "--platform", platform, "--jd-url", jd_url, "--status", status,
        "--notes", notes,
    ]
    if dry_run:
        cmd.append("--dry-run")
    r = subprocess.run(cmd, capture_output=True, text=True)
    print("   " + (r.stdout or r.stderr).strip())
    return r.returncode == 0


# ───────────────────────── Guard anti-duplicado (CLI) ─────────────────────

def guard_ok(company, role_profile):
    r = subprocess.run(
        [sys.executable, os.path.join(HERE, "check_company.py"),
         company, "--role-profile", role_profile],
        capture_output=True, text=True)
    if r.returncode != 0:
        print("   " + r.stdout.strip().splitlines()[0])
    return r.returncode == 0


# ───────────────────────── Navegación (Playwright) ────────────────────────

def try_easy_apply(page, resume_path):
    """Intenta un flujo Easy Apply. Devuelve (ok, motivo).

    Conservador: ante preguntas que no sabemos responder, campos de identidad,
    CAPTCHA o pasos inesperados -> aborta con Incompleto (nunca inventa datos).
    """
    try:
        btn = page.locator("button:has-text('Easy Apply'), button:has-text('Solicitud sencilla')").first
        if btn.count() == 0:
            return False, "Incompleto - postulación externa (sin Easy Apply)"
        btn.click(timeout=8000)
        page.wait_for_timeout(1500)

        for _ in range(8):  # como mucho 8 pasos en el modal
            # CAPTCHA / verificación -> abortar
            if page.locator("iframe[src*='captcha'], :text('reCAPTCHA'), :text('verificación de seguridad')").count() > 0:
                return False, "Incompleto - CAPTCHA"

            # Campos de identidad -> abortar
            labels = page.locator("label").all_inner_texts()
            if any(looks_like_identity_field(l) for l in labels):
                return False, "Incompleto - se solicita documento de identidad"

            # Inputs requeridos vacíos que no sabemos responder -> abortar
            required_empty = page.locator(
                "input[required]:not([type=hidden]), select[required], textarea[required]")
            n_req = required_empty.count()
            unresolved = 0
            for i in range(n_req):
                el = required_empty.nth(i)
                try:
                    if not (el.input_value() or "").strip():
                        unresolved += 1
                except Exception:
                    unresolved += 1
            if unresolved > 0:
                return False, f"Incompleto - {unresolved} pregunta(s) adicional(es) requerida(s)"

            # Subir CV si hay input file y no hay uno ya cargado
            file_input = page.locator("input[type=file]")
            if file_input.count() > 0 and resume_path and os.path.exists(resume_path):
                try:
                    file_input.first.set_input_files(resume_path)
                    page.wait_for_timeout(1000)
                except Exception:
                    pass

            # Destildar "Seguir empresa" / newsletter
            for foll in ["Seguir", "Follow", "newsletter"]:
                cb = page.locator(f"label:has-text('{foll}') input[type=checkbox]:checked")
                for i in range(cb.count()):
                    try:
                        cb.nth(i).uncheck()
                    except Exception:
                        pass

            # ¿Botón de enviar?
            submit = page.locator(
                "button:has-text('Enviar solicitud'), button:has-text('Submit application')").first
            if submit.count() > 0 and submit.is_enabled():
                submit.click(timeout=8000)
                page.wait_for_timeout(1500)
                return True, "Aplicado (Easy Apply)"

            # Si no, avanzar al siguiente paso
            nxt = page.locator(
                "button:has-text('Siguiente'), button:has-text('Next'), "
                "button:has-text('Revisar'), button:has-text('Review')").first
            if nxt.count() > 0 and nxt.is_enabled():
                nxt.click(timeout=8000)
                page.wait_for_timeout(1200)
                continue
            return False, "Incompleto - paso del formulario no reconocido"

        return False, "Incompleto - demasiados pasos en el formulario"
    except Exception as exc:  # noqa: BLE001
        return False, f"Incompleto - error de navegación ({type(exc).__name__})"


def run_linkedin(pw_page, run, config, args):
    query = run["search_query"]
    role_profile = run["role_profile"]
    role_title = run.get("role", query)
    max_apps = run["max_applications"]
    today_str = date.today().isoformat()

    tracker = json.load(open(TRACKER_JSON, encoding="utf-8")) if os.path.exists(TRACKER_JSON) else []
    remaining = max_apps - applied_today_for_query(tracker, query, today_str)
    cap = config.get("daily_application_cap", 10)
    if remaining <= 0:
        print(f"→ '{query}': sin cupo (remaining={remaining}). Salteando.")
        return
    if total_valid_today(tracker, today_str) >= cap:
        print(f"→ cap diario alcanzado ({cap}). Deteniendo.")
        return

    for location in config.get("locations", [""]):
        if remaining <= 0:
            break
        url = build_linkedin_url(query, location, config.get("experience_levels", []))
        print(f"\n→ [{query}] ubicación='{location}' remaining={remaining}\n   {url}")
        pw_page.goto(url, wait_until="domcontentloaded", timeout=45000)
        pw_page.wait_for_timeout(3000)

        cards = pw_page.locator("div.job-card-container, li.jobs-search-results__list-item")
        n = min(cards.count(), 25)
        for i in range(n):
            if remaining <= 0:
                break
            try:
                cards.nth(i).click(timeout=6000)
                pw_page.wait_for_timeout(1500)
            except Exception:
                continue

            title = (pw_page.locator("h1, .job-details-jobs-unified-top-card__job-title").first
                     .inner_text(timeout=4000) if pw_page.locator("h1").count() else "")
            company = (pw_page.locator(".job-details-jobs-unified-top-card__company-name").first
                       .inner_text(timeout=4000) if pw_page.locator(
                           ".job-details-jobs-unified-top-card__company-name").count() else "")
            desc = (pw_page.locator("#job-details, .jobs-description__content").first
                    .inner_text(timeout=4000) if pw_page.locator("#job-details").count() else "")
            jd_url = pw_page.url.split("?")[0]
            company = company.strip() or "(desconocida)"

            # Exclusiones
            if company_excluded(company, config.get("excluded_companies", [])):
                print(f"   SKIP empresa excluida: {company}")
                continue
            kw = text_has_excluded_keyword(f"{title} {desc}", config.get("excluded_keywords", []))
            if kw:
                print(f"   SKIP '{company}' por keyword excluida: '{kw}'")
                continue
            # Guard anti-duplicado
            if not guard_ok(company, role_profile):
                continue

            print(f"   → Postulando: {company} — {title[:60]}")
            if args.dry_run:
                print("   (dry-run) no se postula ni registra")
                continue

            label = {"ai_engineer": "AI-Engineer", "automation_engineer": "Automation-Engineer",
                     "backend_python": "Python-Backend", "fullstack": "Full-Stack"}.get(role_profile, role_profile)
            resume = os.path.join(HERE, "tailored_resumes", f"JoseDaLuzPereira_{label}.pdf")

            ok, status = try_easy_apply(pw_page, resume)
            recorded = record(company, title.strip() or role_title, role_profile, query,
                              location, "linkedin", jd_url, status, dry_run=False)
            if ok and recorded:
                remaining -= 1


def main():
    ap = argparse.ArgumentParser(description="Runner autónomo LinkedIn Easy Apply.")
    ap.add_argument("--only", help="correr solo este role_profile id")
    ap.add_argument("--headful", action="store_true", help="mostrar el navegador")
    ap.add_argument("--dry-run", action="store_true", help="evaluar sin postular ni registrar")
    ap.add_argument("--self-test", action="store_true", help="testear lógica pura y salir")
    args = ap.parse_args()

    if args.self_test:
        return self_test()

    config = json.load(open(CONFIG_PATH, encoding="utf-8"))
    enabled = config.get("role_profiles_enabled", {})
    runs = [r for r in config.get("search_runs", [])
            if enabled.get(r["role_profile"], True)
            and (not args.only or r["role_profile"] == args.only)
            and "linkedin" in r.get("platform", [])]
    if not runs:
        print("No hay search_runs habilitados para LinkedIn.")
        return 0

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("Falta Playwright. Instalá:  pip install playwright && playwright install chromium")
        return 1

    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            PROFILE_DIR, headless=not args.headful,
            viewport={"width": 1360, "height": 900})
        page = ctx.pages[0] if ctx.pages else ctx.new_page()

        page.goto("https://www.linkedin.com/feed/", wait_until="domcontentloaded", timeout=45000)
        page.wait_for_timeout(3000)
        if "login" in page.url or "authwall" in page.url:
            print("\n⚠  No hay sesión de LinkedIn. Corré con --headful, logueate a mano,")
            print("   dejá la ventana abierta y volvé a ejecutar. La sesión queda guardada.")
            if not args.headful:
                ctx.close(); return 1
            input("   Logueate en la ventana y presioná ENTER acá para continuar...")

        for run in runs:
            run.setdefault("role", run["search_query"])
            run_linkedin(page, run, config, args)

        ctx.close()
    print("\n✓ Corrida finalizada. Revisá job_tracker.xlsx y actualizá las notas de handoff en CLAUDE.md.")
    return 0


def self_test():
    ok = True

    def check(name, cond):
        nonlocal ok
        print(("PASS" if cond else "FAIL") + f" — {name}")
        ok = ok and cond

    check("company_excluded exacto", company_excluded("Inforge", ["Inforge", "Tenfold"]))
    check("company_excluded substring", company_excluded("Tenfold SA", ["Tenfold"]))
    check("company NO excluida", not company_excluded("Globant", ["Inforge"]))
    check("keyword excluida detecta 'Senior Lead'",
          text_has_excluded_keyword("Senior Lead Engineer", ["Lead", "Manager"]) == "Lead")
    check("keyword excluida detecta '5+ years'",
          text_has_excluded_keyword("Requires 5+ years", ["5+ years"]) == "5+ years")
    check("sin keyword excluida",
          text_has_excluded_keyword("AI Engineer Ssr", ["Lead", "Manager"]) is None)
    check("identity field dni", looks_like_identity_field("Ingrese su DNI"))
    check("identity field passport", looks_like_identity_field("Passport number"))
    check("no identity field", not looks_like_identity_field("Años de experiencia"))
    url = build_linkedin_url("AI Engineer", "Argentina", ["semi-senior"])
    check("url tiene keywords", "keywords=AI+Engineer" in url)
    check("url filtra última semana", "f_TPR=r604800" in url)
    check("url filtra remoto", "f_WT=2" in url)
    check("url mapea experiencia semi-senior", "f_E=3%2C4" in url or "f_E=3,4" in url)
    tracker = [
        {"date": "2026-07-15", "search_query": "AI Engineer", "status": "Aplicado"},
        {"date": "2026-07-15", "search_query": "AI Engineer", "status": "Incompleto - CAPTCHA"},
    ]
    check("applied_today ignora incompletas",
          applied_today_for_query(tracker, "AI Engineer", "2026-07-15") == 1)
    check("total_valid_today ignora incompletas",
          total_valid_today(tracker, "2026-07-15") == 1)

    print("\n" + ("TODO OK ✓" if ok else "HAY FALLOS ✗"))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
