# CLAUDE.md — Manual operativo del Agente de búsqueda y postulación de empleo

> **Este es el archivo más importante. Cada sesión futura empieza leyéndolo
> completo antes de hacer nada.** El objetivo del agente es buscar ofertas en
> LinkedIn e Indeed, evaluarlas, postular automáticamente con el CV adecuado y
> registrar cada intento en el tracker.

Candidato: **Jose Da Luz Pereira** — AI Engineer (~1,5 años). Todos los datos
del candidato viven en `base_resume.json`. Todos los parámetros de operación
viven en `config.json`.

---

## a) ANTES DE HACER CUALQUIER COSA

Al arrancar **cada** sesión, en este orden:

1. **Leer `config.json`** — cargar `daily_application_cap`,
   `duplicate_check_days_threshold`, `date_posted_filter`, `locations`,
   `workplace_types`, `experience_levels`, `excluded_companies`,
   `excluded_keywords`, `search_runs` y `role_profiles_enabled`.
2. **Leer `APPLICATION_POLICY.md`** — internalizar las 4 reglas anti-duplicado.
3. **Leer `job_tracker.json`** — para calcular, **antes de arrancar cada query**,
   cuántas postulaciones ya se enviaron hoy (`applied_today`) y cuántas quedan
   (`remaining`) por `search_query`. Ver la fórmula en la sección (b).
4. Confirmar que existen los PDFs en `tailored_resumes/`. Si faltan o se editó
   `base_resume.json`, regenerarlos con `python resume_generator.py`.
5. Saltear cualquier perfil cuyo flag en `role_profiles_enabled` sea `false`.

**Nunca** postular sin haber leído estos tres archivos primero.

---

## b) Fórmula de seguimiento de progreso diario

Para cada `search_query` de `config.json.search_runs`:

```
applied_today = cantidad de entradas en job_tracker.json donde
                  date == hoy (YYYY-MM-DD)
                  Y search_query == <la query actual>
                  Y status NO empieza con "Incompleto"   (las incompletas no cuentan)

remaining     = max_applications - applied_today
```

- Si `remaining <= 0` → **saltear esta query** y pasar a la siguiente.
- Además, mantener un contador global `total_applied_today` (todas las entradas
  de hoy con status válido, sin importar la query). Si
  `total_applied_today >= daily_application_cap` (10) → **detener todo el run**.

> Las postulaciones con status `"Incompleto - <motivo>"` **no** se cuentan ni
> en `applied_today` ni en el cap diario.

---

## c) Procedimiento estándar para LinkedIn (paso a paso)

1. **Navegar a LinkedIn Jobs** con la `search_query` del run actual, aplicando
   los filtros:
   - Fecha de publicación = `date_posted_filter` ("última semana").
   - Ubicación = cada una de las de `locations`.
   - Modalidad de trabajo = `workplace_types` (remoto; híbrido solo si es en
     Córdoba o Comodoro Rivadavia).
   - Nivel de experiencia = `experience_levels` (junior avanzado, semi-senior).
2. **Para cada oferta** de la lista:
   - **Filtro de exclusión**: saltear si la empresa está en
     `excluded_companies`, **o** si el título o la descripción contienen
     cualquier palabra de `excluded_keywords` (comparación case-insensitive).
   - **Guard anti-duplicado**: ejecutar
     `python check_company.py "<Empresa>" --role-profile <id> --days-threshold <N>`.
     Si el resultado es **SKIP** (exit 1) → saltear la oferta.
     Verificar también que el `jd_url` no exista ya en `job_tracker.json`
     (Regla 3).
   - **Aplicar** usando `tailored_resumes/JoseDaLuzPereira_<EtiquetaPerfil>.pdf`
     correspondiente al `role_profile` del run
     (ai_engineer → `AI-Engineer`, automation_engineer → `Automation-Engineer`,
     backend_python → `Python-Backend`, fullstack → `Full-Stack`).
   - **Antes de enviar**: destildar cualquier casilla de "Seguir empresa"
     ("Follow company") o suscripción a newsletter.
   - **Registrar inmediatamente** en `job_tracker.json` **y** en
     `job_tracker.xlsx` (hoja "Postulaciones") — ver la sección (g).
   - **Si no se puede completar** (CAPTCHA, se pide DNI/CUIT/pasaporte, hay que
     crear cuenta, sitio bloqueado, login requerido): registrar con
     `status = "Incompleto - <motivo>"`. **No** contar la incompleta en
     `remaining` ni en el cap diario. Dejar nota en las notas de handoff.
3. **Detener la query** cuando `remaining` llega a 0; **detener todo el run**
   cuando `total_applied_today` alcanza el `daily_application_cap`.

---

## d) Procedimiento para Indeed

Misma lógica de filtros, exclusiones, guard anti-duplicado, CV, destildar
"seguir/newsletter" y registro que LinkedIn. Cambia el formato de URL:

```
https://ar.indeed.com/jobs?q=<search_query>&l=<ubicacion>&fromage=7&sc=0kf%3Aattr(DSQF7)%3B
```

- `q` = `search_query` (URL-encoded).
- `l` = ubicación (dejar vacío o "Remoto" según corresponda).
- `fromage=7` = publicadas en los últimos 7 días (≈ "última semana").
- `sc=0kf%3Aattr(DSQF7)%3B` = filtra por **remoto**. **Quitar** este parámetro
  para búsquedas presenciales/híbridas.

---

## e) Límites que el agente NUNCA debe violar

- ❌ **Nunca** ingresar documentos de identidad (DNI, CUIT, pasaporte, SSN).
- ❌ **Nunca** completar ni evadir CAPTCHAs.
- ❌ **Nunca** crear cuentas en nombre del candidato.
- ❌ **Nunca** ingresar contraseñas.
- ❌ **Nunca** fabricar experiencia, fechas o estudios que no estén en el CV
  (`base_resume.json` es la única fuente de verdad).
- ❌ **Nunca** aplicar dos veces a la misma empresa dentro de la ventana
  anti-duplicados (`duplicate_check_days_threshold`).

Ante cualquiera de estas situaciones → registrar `status = "Incompleto - <motivo>"`
y continuar con la siguiente oferta.

---

## f) Notas de handoff (actualizar al FINAL de cada corrida)

Cada corrida debe dejar, en la sección de abajo, un bloque nuevo con:

- **Fecha de hoy**.
- **Postulaciones enviadas por `search_query`** (sólo status válidos).
- **Bloqueantes encontrados**, con instrucciones concretas para la persona
  (ej. "Empresa X pide crear cuenta → completar login manualmente en <url>").
- **Estado de cada `search_query`**: `completa` / `agotada` (sin más ofertas
  disponibles) / `quedan N slots`.
- Recordatorio: **la próxima corrida arranca desde cero y re-verifica los
  contadores** leyendo `job_tracker.json` (los contadores NO se guardan; se
  recalculan siempre desde el tracker).

---

## g) Formato de registro (cada postulación)

Agregar una entrada a `job_tracker.json` (array) y una fila a
`job_tracker.xlsx` (hoja "Postulaciones") con estos campos, en este orden de
columnas para el Excel:

| ID | Fecha | Empresa | Rol | Perfil de Rol | Query de Búsqueda | Ubicación | Plataforma | URL Oferta | CV Usado | Estado | Notas |

Campos JSON: `id`, `date` (YYYY-MM-DD), `company`, `role`, `role_profile`,
`search_query`, `location`, `platform`, `jd_url`, `resume_pdf`, `status`,
`notes`.

- `id`: correlativo o corto único (ej. `2026-07-14-001`).
- `status`: `"Aplicado"` en caso de éxito, o `"Incompleto - <motivo>"`.
- `resume_pdf`: ruta relativa al PDF usado
  (ej. `tailored_resumes/JoseDaLuzPereira_AI-Engineer.pdf`).

Mantener **ambos archivos sincronizados**: una fila en el xlsx por cada entrada
del json.

**Forma recomendada de registrar** (mantiene JSON + XLSX sincronizados y
re-valida anti-duplicado y cap automáticamente):

```
python record_application.py \
  --company "<Empresa>" --role "<Rol>" --role-profile <id> \
  --search-query "<query>" --location "<ubicación>" \
  --platform <linkedin|indeed> --jd-url "<url>" \
  --status "Aplicado"            # o "Incompleto - <motivo>"
```

- El helper asigna el `id` correlativo del día, completa `resume_pdf` según el
  perfil, rechaza duplicados (Reglas 1–4) y rechaza si se agotó el cap de la
  query o el diario. Las incompletas se registran pero no consumen cupo.
- Usar `--dry-run` para ver qué registraría sin escribir; `--force` para
  saltear validaciones (sólo en casos excepcionales).

---

## Notas de handoff — historial

<!-- Agregar el bloque más reciente arriba de todo. -->

### (aún sin corridas)

- El sistema fue inicializado el 2026-07-14. `job_tracker.json` y
  `job_tracker.xlsx` están vacíos (solo encabezados). Aún no se envió ninguna
  postulación. La primera corrida debe arrancar por la sección (a).
