# APPLICATION_POLICY.md — Reglas anti-duplicado

Estas reglas se evalúan **antes de aplicar a cualquier oferta**. Si se cumple
cualquiera de ellas, la oferta se **SALTEA (SKIP)** y no se postula.

La "ventana anti-duplicados" está definida en `config.json` como
`duplicate_check_days_threshold` (por defecto **60 días**). Se compara la fecha
de hoy contra el campo `date` de cada entrada en `job_tracker.json`.

---

## Regla 1 — Misma empresa + mismo perfil de rol, dentro de la ventana → SKIP

Si ya existe una postulación a **la misma empresa** con **el mismo
`role_profile`** cuya `date` está dentro de los últimos N días → **SKIP**.

> Motivo: ya nos postulamos a ese rol en esa empresa recientemente.

## Regla 2 — Misma empresa + distinto perfil de rol, dentro de la ventana → SKIP

Si ya existe una postulación a **la misma empresa** con **cualquier otro
`role_profile`** cuya `date` está dentro de los últimos N días → **SKIP**.

> Motivo: evitamos bombardear a la misma empresa con múltiples postulaciones
> en un período corto, aunque sea para roles distintos.

## Regla 3 — Misma URL de oferta ya registrada → SKIP

Si el `jd_url` de la oferta ya aparece en **cualquier** entrada de
`job_tracker.json` (sin importar la fecha) → **SKIP**.

> Motivo: nunca aplicar dos veces a la misma oferta puntual.

## Regla 4 — Empresa en `excluded_companies` → SKIP siempre

Si la empresa figura en `excluded_companies` de `config.json` → **SKIP**
(independientemente de fechas o perfiles). Esta regla **nunca** caduca.

> Empresas excluidas actuales: Inforge, Tenfold (usetenfold.ai).

---

### Notas de implementación

- La verificación de las Reglas 1, 2 y 4 la automatiza `check_company.py`
  (ver `python check_company.py "<Empresa>" --role-profile <id> --days-threshold <N>`).
- La Regla 3 (URL exacta) se verifica adicionalmente por el agente al leer
  `job_tracker.json` antes de cada postulación.
- La comparación de nombres de empresa es **case-insensitive** y tolerante a
  espacios (se normaliza con `strip()` + `lower()`).
