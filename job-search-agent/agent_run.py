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
    pip install -r requirements.txt
    playwright install chromium

Uso:
    python agent_run.py                 # corre todos los search_runs habilitados
    python agent_run.py --headful       # ver el navegador (recomendado la 1ra vez)
    python agent_run.py --only ai_engineer
    python agent_run.py --dry-run       # navega y evalúa, pero NO postula ni registra
    python agent_run.py --verify        # DIAGNÓSTICO: abre LinkedIn real y reporta
                                        #   qué ve (sin postular). Úsalo para
                                        #   confirmar/ajustar selectores.
    python agent_run.py --self-test     # valida la lógica pura sin navegador
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
LOGS_DIR = os.path.join(HERE, "logs")

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

# ── Selectores reales de la app autenticada de LinkedIn (con fallbacks) ──
# LinkedIn hace A/B testing de su DOM y cambia clases seguido; por eso cada
# campo tiene VARIOS selectores candidatos y se usa el primero que aparezca.
# Los aria-label de los botones del modal son lo más estable (EN y ES).
SEL = {
    "cards": [
        "div.job-card-container",
        "li.jobs-search-results__list-item",
        "li.scaffold-layout__list-item",
        "[data-job-id]",
        "div.base-card",
    ],
    "results_list": [
        "div.jobs-search-results-list",
        "ul.jobs-search__results-list",
        ".scaffold-layout__list",
    ],
    "title": [
        ".job-details-jobs-unified-top-card__job-title",
        ".jobs-unified-top-card__job-title",
        "h1.t-24",
        "h1",
    ],
    "company": [
        ".job-details-jobs-unified-top-card__company-name a",
        ".job-details-jobs-unified-top-card__company-name",
        ".jobs-unified-top-card__company-name",
        ".artdeco-entity-lockup__subtitle",
    ],
    "description": [
        "#job-details",
        ".jobs-description__content",
        ".jobs-box__html-content",
    ],
    "easy_apply_btn": [
        "button.jobs-apply-button",
        "button[aria-label*='Easy Apply']",
        "button[aria-label*='Solicitud sencilla']",
        "button:has-text('Easy Apply')",
        "button:has-text('Solicitud sencilla')",
    ],
    "modal": [
        "div.jobs-easy-apply-modal",
        "[data-test-modal][role='dialog']",
        "div[role='dialog']",
    ],
    "next_btn": [
        "button[aria-label='Continue to next step']",
        "button[aria-label='Continuar al siguiente paso']",
        "button[aria-label='Continuar a la siguiente etapa']",
        "button:has-text('Siguiente')",
        "button:has-text('Next')",
    ],
    "review_btn": [
        "button[aria-label='Review your application']",
        "button[aria-label='Revisar tu solicitud']",
        "button:has-text('Revisar')",
        "button:has-text('Review')",
    ],
    "submit_btn": [
        "button[aria-label='Submit application']",
        "button[aria-label='Enviar solicitud']",
        "button:has-text('Enviar solicitud')",
        "button:has-text('Submit application')",
    ],
    "follow_checkbox": [
        "#follow-company-checkbox:checked",
        "label:has-text('Seguir') input[type=checkbox]:checked",
        "label:has-text('Follow') input[type=checkbox]:checked",
    ],
    "dismiss_btn": [
        "button[aria-label='Dismiss']",
        "button[aria-label='Descartar']",
    ],
    "captcha": [
        "iframe[src*='captcha']",
        ":text('reCAPTCHA')",
        ":text('verificación de seguridad')",
        ":text('security verification')",
    ],
}


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


def resume_for(role_profile):
    label = {"ai_engineer": "AI-Engineer", "automation_engineer": "Automation-Engineer",
             "backend_python": "Python-Backend", "fullstack": "Full-Stack"}.get(
                 role_profile, role_profile)
    return os.path.join(HERE, "tailored_resumes", f"JoseDaLuzPereira_{label}.pdf")


# ───────────────────── Helpers de Playwright (robustez) ────────────────────

def first_visible(scope, selectors):
    """Devuelve el primer locator VISIBLE de la lista de selectores, o None."""
    for sel in selectors:
        loc = scope.locator(sel).first
        try:
            if loc.count() > 0 and loc.is_visible():
                return loc
        except Exception:
            continue
    return None


def any_present(scope, selectors):
    for sel in selectors:
        try:
            if scope.locator(sel).count() > 0:
                return True
        except Exception:
            continue
    return False


def safe_text(scope, selectors, timeout=3000):
    for sel in selectors:
        loc = scope.locator(sel).first
        try:
            if loc.count() > 0:
                return (loc.inner_text(timeout=timeout) or "").strip()
        except Exception:
            continue
    return ""


def dismiss_overlays(page):
    """Cierra banners de cookies / mensajería que tapan la lista."""
    for sel in ["button:has-text('Accept')", "button:has-text('Aceptar')",
                "button[aria-label*='Accept']", "button[aria-label*='cookies']"]:
        try:
            b = page.locator(sel).first
            if b.count() > 0 and b.is_visible():
                b.click(timeout=2000)
        except Exception:
            pass


def load_all_cards(page, want=25):
    """Scrollea la lista virtualizada para forzar la carga de más tarjetas."""
    last = 0
    for _ in range(8):
        cards = None
        for sel in SEL["cards"]:
            c = page.locator(sel)
            if c.count() > 0:
                cards = c
                break
        n = cards.count() if cards else 0
        if n >= want or n == last:
            break
        last = n
        try:
            cards.nth(n - 1).scroll_into_view_if_needed(timeout=3000)
        except Exception:
            page.mouse.wheel(0, 2000)
        page.wait_for_timeout(1200)
    return cards


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


def guard_ok(company, role_profile):
    r = subprocess.run(
        [sys.executable, os.path.join(HERE, "check_company.py"),
         company, "--role-profile", role_profile],
        capture_output=True, text=True)
    if r.returncode != 0 and r.stdout:
        print("   " + r.stdout.strip().splitlines()[0])
    return r.returncode == 0


# ───────────────────────── Motor Easy Apply ───────────────────────────────

def try_easy_apply(page, resume_path):
    """Intenta un flujo Easy Apply. Devuelve (ok, motivo).

    Conservador: ante preguntas que no sabemos responder, campos de identidad,
    CAPTCHA o pasos inesperados -> aborta con Incompleto (nunca inventa datos).
    """
    try:
        btn = first_visible(page, SEL["easy_apply_btn"])
        if btn is None:
            return False, "Incompleto - postulación externa (sin Easy Apply)"
        btn.click(timeout=8000)
        page.wait_for_timeout(1500)

        # El resto del flujo transcurre dentro del modal si existe.
        scope = first_visible(page, SEL["modal"]) or page

        for _ in range(10):  # como mucho 10 pasos en el modal
            # CAPTCHA / verificación -> abortar
            if any_present(page, SEL["captcha"]):
                return False, "Incompleto - CAPTCHA"

            # Campos de identidad -> abortar
            labels = scope.locator("label").all_inner_texts()
            if any(looks_like_identity_field(l) for l in labels):
                return False, "Incompleto - se solicita documento de identidad"

            # Inputs requeridos vacíos que no sabemos responder -> abortar
            req = scope.locator(
                "input[required]:not([type=hidden]):not([type=file]), "
                "select[required], textarea[required]")
            unresolved = 0
            for i in range(req.count()):
                el = req.nth(i)
                try:
                    if not (el.input_value() or "").strip():
                        unresolved += 1
                except Exception:
                    unresolved += 1
            if unresolved > 0:
                return False, f"Incompleto - {unresolved} pregunta(s) adicional(es) requerida(s)"

            # Subir CV si hay input file y no hay uno ya cargado
            file_input = scope.locator("input[type=file]")
            if file_input.count() > 0 and resume_path and os.path.exists(resume_path):
                try:
                    file_input.first.set_input_files(resume_path)
                    page.wait_for_timeout(1000)
                except Exception:
                    pass

            # Destildar "Seguir empresa" / newsletter
            for sel in SEL["follow_checkbox"]:
                cbs = scope.locator(sel)
                for i in range(cbs.count()):
                    try:
                        cbs.nth(i).uncheck()
                    except Exception:
                        pass

            # ¿Enviar? (solo si es visible)
            submit = first_visible(scope, SEL["submit_btn"])
            if submit is not None and submit.is_enabled():
                submit.click(timeout=8000)
                page.wait_for_timeout(1500)
                return True, "Aplicado (Easy Apply)"

            # ¿Revisar? -> avanzar
            review = first_visible(scope, SEL["review_btn"])
            if review is not None and review.is_enabled():
                review.click(timeout=8000)
                page.wait_for_timeout(1200)
                continue

            # ¿Siguiente? -> avanzar
            nxt = first_visible(scope, SEL["next_btn"])
            if nxt is not None and nxt.is_enabled():
                nxt.click(timeout=8000)
                page.wait_for_timeout(1200)
                continue

            return False, "Incompleto - paso del formulario no reconocido"

        return False, "Incompleto - demasiados pasos en el formulario"
    except Exception as exc:  # noqa: BLE001
        return False, f"Incompleto - error de navegación ({type(exc).__name__})"


def close_any_modal(page):
    """Cierra el modal de Easy Apply si quedó abierto (para seguir con la próxima)."""
    dismiss = first_visible(page, SEL["dismiss_btn"])
    if dismiss is not None:
        try:
            dismiss.click(timeout=3000)
            page.wait_for_timeout(500)
            # confirmar descarte si pregunta
            for sel in ["button:has-text('Descartar')", "button:has-text('Discard')"]:
                b = page.locator(sel).first
                if b.count() > 0 and b.is_visible():
                    b.click(timeout=2000)
        except Exception:
            pass


# ───────────────────────── Corrida por plataforma ─────────────────────────

def run_linkedin(page, run, config, args):
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

    resume = resume_for(role_profile)
    for location in config.get("locations", [""]):
        if remaining <= 0:
            break
        url = build_linkedin_url(query, location, config.get("experience_levels", []))
        print(f"\n→ [{query}] ubicación='{location}' remaining={remaining}\n   {url}")
        page.goto(url, wait_until="domcontentloaded", timeout=45000)
        page.wait_for_timeout(3000)
        dismiss_overlays(page)
        cards = load_all_cards(page, want=25)
        n = min(cards.count(), 25) if cards else 0
        print(f"   {n} ofertas cargadas")

        for i in range(n):
            if remaining <= 0:
                break
            try:
                cards.nth(i).click(timeout=6000)
                page.wait_for_timeout(1500)
            except Exception:
                continue

            title = safe_text(page, SEL["title"])
            company = safe_text(page, SEL["company"]) or "(desconocida)"
            desc = safe_text(page, SEL["description"])
            jd_url = page.url.split("?")[0]

            if company_excluded(company, config.get("excluded_companies", [])):
                print(f"   SKIP empresa excluida: {company}")
                continue
            kw = text_has_excluded_keyword(f"{title} {desc}", config.get("excluded_keywords", []))
            if kw:
                print(f"   SKIP '{company}' por keyword excluida: '{kw}'")
                continue
            if not guard_ok(company, role_profile):
                continue

            print(f"   → Postulando: {company} — {title[:60]}")
            if args.dry_run:
                print("   (dry-run) no se postula ni registra")
                continue

            ok, status = try_easy_apply(page, resume)
            close_any_modal(page)
            recorded = record(company, title or role_title, role_profile, query,
                              location, "linkedin", jd_url, status)
            if ok and recorded:
                remaining -= 1


# ───────────────────────── Modo diagnóstico ───────────────────────────────

def verify(page, config, args):
    """Abre LinkedIn real y reporta qué ve, sin postular. Sirve para confirmar
    o ajustar los selectores contra el DOM real."""
    os.makedirs(LOGS_DIR, exist_ok=True)
    runs = [r for r in config.get("search_runs", []) if "linkedin" in r.get("platform", [])]
    if args.only:
        runs = [r for r in runs if r["role_profile"] == args.only]
    run = runs[0]
    loc = config.get("locations", ["Argentina"])[0]
    url = build_linkedin_url(run["search_query"], loc, config.get("experience_levels", []))

    print(f"\n=== VERIFY ===\nURL: {url}")
    page.goto(url, wait_until="domcontentloaded", timeout=45000)
    page.wait_for_timeout(3000)
    dismiss_overlays(page)

    if "login" in page.url or "authwall" in page.url:
        print("⚠  Sin sesión de LinkedIn (redirigió a login). Corré con --headful"
              " y logueate primero.")
        return 1

    cards = load_all_cards(page, want=25)
    n = cards.count() if cards else 0
    which = next((s for s in SEL["cards"] if page.locator(s).count() > 0), None)
    print(f"Tarjetas encontradas: {n}  (selector activo: {which})")

    for i in range(min(n, 3)):
        try:
            cards.nth(i).click(timeout=6000)
            page.wait_for_timeout(1500)
            title = safe_text(page, SEL["title"])
            company = safe_text(page, SEL["company"])
            ea = first_visible(page, SEL["easy_apply_btn"])
            print(f"  [{i+1}] company='{company}' | title='{title[:55]}' | "
                  f"EasyApply={'sí' if ea else 'no (externa)'}")
        except Exception as e:
            print(f"  [{i+1}] error leyendo la oferta: {type(e).__name__}")

    shot = os.path.join(LOGS_DIR, "verify_linkedin.png")
    page.screenshot(path=shot, full_page=False)
    dump = os.path.join(LOGS_DIR, "verify_first_card.html")
    try:
        html = cards.nth(0).inner_html(timeout=3000) if n else "(sin tarjetas)"
        open(dump, "w", encoding="utf-8").write(html)
    except Exception:
        pass
    print(f"\nScreenshot: {shot}\nHTML 1ra tarjeta: {dump}")
    print("Si algo salió vacío o en 0, pegame el contenido de esos dos archivos y ajusto los selectores.")
    return 0


# ───────────────────────── main ───────────────────────────────────────────

def _launch(pw, headful):
    """Lanza el contexto persistente. En tu máquina usa el chromium de
    'playwright install'; permite override con la env PW_CHROME."""
    kwargs = dict(headless=not headful, viewport={"width": 1360, "height": 900},
                  args=["--disable-dev-shm-usage"])
    exe = os.environ.get("PW_CHROME")
    if exe:
        kwargs["executable_path"] = exe
    return pw.chromium.launch_persistent_context(PROFILE_DIR, **kwargs)


def main():
    ap = argparse.ArgumentParser(description="Runner autónomo LinkedIn Easy Apply.")
    ap.add_argument("--only", help="correr solo este role_profile id")
    ap.add_argument("--headful", action="store_true", help="mostrar el navegador")
    ap.add_argument("--dry-run", action="store_true", help="evaluar sin postular ni registrar")
    ap.add_argument("--verify", action="store_true", help="diagnóstico: reportar qué ve, sin postular")
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
    if not runs and not args.verify:
        print("No hay search_runs habilitados para LinkedIn.")
        return 0

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("Falta Playwright. Instalá:  pip install -r requirements.txt && playwright install chromium")
        return 1

    with sync_playwright() as pw:
        ctx = _launch(pw, args.headful or args.verify)
        page = ctx.pages[0] if ctx.pages else ctx.new_page()

        page.goto("https://www.linkedin.com/feed/", wait_until="domcontentloaded", timeout=45000)
        page.wait_for_timeout(3000)
        if "login" in page.url or "authwall" in page.url:
            print("\n⚠  No hay sesión de LinkedIn. Corré con --headful, logueate a mano,")
            print("   dejá la ventana abierta y volvé a ejecutar. La sesión queda guardada.")
            if not (args.headful or args.verify):
                ctx.close(); return 1
            input("   Logueate en la ventana y presioná ENTER acá para continuar...")

        if args.verify:
            rc = verify(page, config, args)
            ctx.close(); return rc

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
    check("resume_for mapea etiqueta", resume_for("ai_engineer").endswith("JoseDaLuzPereira_AI-Engineer.pdf"))
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
