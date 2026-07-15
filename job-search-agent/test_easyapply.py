#!/usr/bin/env python3
"""test_easyapply.py — Prueba del motor try_easy_apply contra páginas locales
que imitan el flujo REAL de LinkedIn (botones por aria-label, modal multi-paso,
checkbox "Seguir empresa") y los casos de aborto (CAPTCHA, DNI, pregunta
requerida, postulación externa).

No toca internet: monta HTML local y verifica el control de flujo.

Uso:
    python test_easyapply.py
    PW_CHROME=/ruta/al/chrome python test_easyapply.py   # forzar binario

Sale con código 0 si pasan todos los casos, 1 si falla alguno.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import agent_run  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

RESUME = agent_run.resume_for("ai_engineer")

# Flujo feliz: modal de 2 pasos con aria-label reales + checkbox "Seguir empresa".
HAPPY = """
<h1 class="job-details-jobs-unified-top-card__job-title">AI Engineer</h1>
<button class="jobs-apply-button" aria-label="Easy Apply to AI Engineer">Easy Apply</button>
<div class="jobs-easy-apply-modal" role="dialog" style="display:none">
  <div id="step1">
    <input type="file">
    <label>Seguir empresa <input type="checkbox" checked id="follow-company-checkbox"></label>
    <button aria-label="Continue to next step">Siguiente</button>
  </div>
  <div id="step2" style="display:none">
    <button aria-label="Review your application">Revisar</button>
  </div>
  <div id="step3" style="display:none">
    <button aria-label="Submit application">Enviar solicitud</button>
  </div>
</div>
<script>
  const q=s=>document.querySelector(s);
  q('.jobs-apply-button').onclick=()=>{q('.jobs-easy-apply-modal').style.display='block';
     q('.jobs-apply-button').style.display='none';};
  q('[aria-label="Continue to next step"]').onclick=()=>{step1.style.display='none';step2.style.display='block';};
  q('[aria-label="Review your application"]').onclick=()=>{step2.style.display='none';step3.style.display='block';};
  q('[aria-label="Submit application"]').onclick=()=>{document.body.setAttribute('data-submitted','1');
     q('.jobs-easy-apply-modal').innerHTML='<p>Enviada</p>';};
</script>
"""

IDENTITY = """
<h1>AI Engineer</h1>
<button class="jobs-apply-button">Easy Apply</button>
<div class="jobs-easy-apply-modal" role="dialog" style="display:none">
  <label>Ingrese su DNI <input type="text" required></label>
  <button aria-label="Submit application">Enviar solicitud</button>
</div>
<script>document.querySelector('.jobs-apply-button').onclick=()=>{
  document.querySelector('.jobs-easy-apply-modal').style.display='block';};</script>
"""

CAPTCHA = """
<h1>AI Engineer</h1>
<button class="jobs-apply-button">Easy Apply</button>
<div class="jobs-easy-apply-modal" role="dialog" style="display:none">
  <div>reCAPTCHA</div>
  <button aria-label="Submit application">Enviar solicitud</button>
</div>
<script>document.querySelector('.jobs-apply-button').onclick=()=>{
  document.querySelector('.jobs-easy-apply-modal').style.display='block';};</script>
"""

QUESTION = """
<h1>AI Engineer</h1>
<button class="jobs-apply-button">Easy Apply</button>
<div class="jobs-easy-apply-modal" role="dialog" style="display:none">
  <label>¿Cuántos años con Kubernetes? <input type="text" required></label>
  <button aria-label="Submit application">Enviar solicitud</button>
</div>
<script>document.querySelector('.jobs-apply-button').onclick=()=>{
  document.querySelector('.jobs-easy-apply-modal').style.display='block';};</script>
"""

EXTERNAL = "<h1>AI Engineer</h1><a href='#'>Solicitar en el sitio de la empresa</a>"

CASES = [
    ("Easy Apply feliz",   HAPPY,    True,  "aplicado"),
    ("Pide DNI",           IDENTITY, False, "documento de identidad"),
    ("CAPTCHA",            CAPTCHA,  False, "captcha"),
    ("Pregunta requerida", QUESTION, False, "pregunta"),
    ("Sin Easy Apply",     EXTERNAL, False, "externa"),
]


def find_chrome():
    if os.environ.get("PW_CHROME"):
        return os.environ["PW_CHROME"]
    # Binario típico de 'playwright install' en distintos entornos
    import glob
    for pat in ["/opt/pw-browsers/chromium-*/chrome-linux/chrome",
                os.path.expanduser("~/.cache/ms-playwright/chromium-*/chrome-linux/chrome"),
                os.path.expanduser("~/AppData/Local/ms-playwright/chromium-*/chrome-win/chrome.exe"),
                os.path.expanduser("~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium")]:
        hits = sorted(glob.glob(pat))
        if hits:
            return hits[-1]
    return None


def main():
    launch = {"headless": True, "args": ["--no-sandbox", "--disable-dev-shm-usage"]}
    chrome = find_chrome()
    if chrome:
        launch["executable_path"] = chrome

    passed = 0
    with sync_playwright() as pw:
        try:
            b = pw.chromium.launch(**launch)
        except Exception:
            launch.pop("executable_path", None)
            b = pw.chromium.launch(**launch)  # deja que Playwright resuelva el binario
        for name, html, exp_ok, exp_sub in CASES:
            page = b.new_page()
            page.set_content(html)
            ok, status = agent_run.try_easy_apply(page, RESUME)
            good = (ok == exp_ok) and (exp_sub in status.lower())
            if name == "Easy Apply feliz":
                submitted = page.get_attribute("body", "data-submitted") == "1"
                follow = page.locator("#follow-company-checkbox")
                follow_off = (not follow.is_checked()) if follow.count() else True
                good = good and submitted and follow_off
            passed += good
            print(f"{'PASS' if good else 'FAIL'} — {name:22s} ok={ok} status='{status}'")
            page.close()
        b.close()

    print(f"\n{passed}/{len(CASES)} casos OK")
    return 0 if passed == len(CASES) else 1


if __name__ == "__main__":
    sys.exit(main())
