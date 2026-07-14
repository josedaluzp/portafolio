#!/usr/bin/env python3
"""check_company.py — Guard CLI anti-duplicado.

Uso:
    python check_company.py "<Nombre Empresa>" --role-profile <id> --days-threshold <N>

Lee job_tracker.json y config.json y decide si se puede aplicar a una empresa.

Imprime:
    OK    -> no se encontró duplicado, se puede aplicar        (exit code 0)
    SKIP  -> duplicado encontrado (muestra la regla y la entrada)  (exit code 1)

Reglas evaluadas (ver APPLICATION_POLICY.md):
    Regla 4 -> empresa en excluded_companies                 -> SKIP siempre
    Regla 1 -> misma empresa + mismo role_profile dentro de N -> SKIP
    Regla 2 -> misma empresa + distinto role_profile dentro de N -> SKIP
"""

import argparse
import json
import os
import sys
from datetime import date, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
TRACKER_PATH = os.path.join(HERE, "job_tracker.json")
CONFIG_PATH = os.path.join(HERE, "config.json")


def _norm(value: str) -> str:
    """Normaliza un nombre de empresa: sin espacios extra y en minúsculas."""
    return (value or "").strip().lower()


def _load_json(path: str, default):
    if not os.path.exists(path):
        return default
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def _parse_date(value: str):
    """Parsea una fecha ISO (YYYY-MM-DD). Devuelve None si no se puede."""
    if not value:
        return None
    try:
        return datetime.strptime(value[:10], "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return None


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Guard anti-duplicado para postulaciones de empleo."
    )
    parser.add_argument("company", help="Nombre de la empresa a verificar")
    parser.add_argument(
        "--role-profile",
        required=True,
        help="ID del perfil de rol (ej. ai_engineer)",
    )
    parser.add_argument(
        "--days-threshold",
        type=int,
        default=None,
        help="Ventana anti-duplicados en días (por defecto: config.json)",
    )
    args = parser.parse_args()

    config = _load_json(CONFIG_PATH, {})
    tracker = _load_json(TRACKER_PATH, [])

    days_threshold = args.days_threshold
    if days_threshold is None:
        days_threshold = config.get("duplicate_check_days_threshold", 60)

    company_norm = _norm(args.company)
    role_profile = args.role_profile
    today = date.today()

    # --- Regla 4: empresa excluida ---
    excluded = [_norm(c) for c in config.get("excluded_companies", [])]
    if company_norm in excluded:
        print(f"SKIP — Regla 4: '{args.company}' está en excluded_companies. "
              f"Nunca aplicar a esta empresa.")
        return 1

    # --- Reglas 1 y 2: misma empresa dentro de la ventana ---
    for entry in tracker:
        if _norm(entry.get("company")) != company_norm:
            continue

        entry_date = _parse_date(entry.get("date"))
        if entry_date is None:
            continue

        days_ago = (today - entry_date).days
        if days_ago < 0 or days_ago > days_threshold:
            continue  # fuera de la ventana anti-duplicados

        same_profile = entry.get("role_profile") == role_profile
        rule = "Regla 1" if same_profile else "Regla 2"
        detail = "mismo perfil de rol" if same_profile else "distinto perfil de rol"
        print(
            f"SKIP — {rule}: ya existe una postulación a '{args.company}' "
            f"({detail}) hace {days_ago} día(s), dentro de la ventana de "
            f"{days_threshold} días.\n"
            f"       Entrada: id={entry.get('id')} | date={entry.get('date')} | "
            f"role={entry.get('role')} | role_profile={entry.get('role_profile')} | "
            f"jd_url={entry.get('jd_url')}"
        )
        return 1

    print(f"OK — no se encontró duplicado para '{args.company}' "
          f"(perfil '{role_profile}', ventana {days_threshold} días). Se puede aplicar.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
