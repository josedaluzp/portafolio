# Portfolio — Plan de implementación

## Dirección visual: Editorial

Estilo tipográfico, serif + sans-serif, whitespace generoso, paleta neutra cálida, íconos SVG minimalistas. Inspirado en portfolios editoriales tipo Stripe, Linear, o revistas de diseño.

---

## 1. Tech stack

| Componente | Tecnología | Razón |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | SSG para performance, deploy fácil en Vercel |
| Estilos | **Tailwind CSS** | Rápido, consistente, fácil de iterar con Claude Code |
| Tipografía | **Google Fonts**: `Playfair Display` (serif, headings) + `DM Sans` (sans, body) | Par editorial clásico, no genérico |
| Animaciones | **Framer Motion** | Ya tenés experiencia, transiciones suaves para scroll reveals |
| Deploy | **Vercel** (free tier) | Push to deploy, preview branches, analytics |
| DNS | **DonWeb** → CNAME a Vercel | Dominio principal + subdominios |
| Analytics | **Vercel Analytics** o **Plausible** (self-hosted) | Lightweight, privacy-friendly |

---

## 2. Estructura de archivos

```
portfolio/
├── app/
│   ├── layout.tsx          # Font imports, metadata, nav
│   ├── page.tsx            # Single-page portfolio (home)
│   ├── globals.css         # Tailwind + custom vars
│   └── components/
│       ├── Nav.tsx          # Navbar minimalista
│       ├── Hero.tsx         # Intro con nombre y pitch
│       ├── Projects.tsx     # Grid de proyectos con filtro por categoría
│       ├── ProjectCard.tsx  # Card individual reutilizable
│       ├── Services.tsx     # 3 cards de servicios
│       ├── Stack.tsx        # Skills agrupadas por categoría
│       ├── Certs.tsx        # Certificaciones relevantes
│       └── Footer.tsx       # Links + contacto
├── data/
│   └── projects.ts         # Array de proyectos (tipado con interface Project)
├── public/
│   ├── projects/           # Screenshots/GIFs de cada proyecto
│   │   ├── pm-agente.webp
│   │   ├── hsp70.webp
│   │   ├── rag.webp
│   │   ├── jira.webp
│   │   └── ... (se agregan a medida que se completan)
│   └── cv.pdf              # CV descargable
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 3. Secciones del portfolio

### 3.1 Navbar
- Logo: "JDL" o nombre completo en serif
- Links: Proyectos · Servicios · Contacto
- Sticky on scroll con backdrop blur sutil
- CTA discreto: botón "Hablemos" → link a WhatsApp

### 3.2 Hero
- Etiqueta superior: `DESARROLLADOR · IA & WEB · CÓRDOBA, AR` (uppercase, tracking wide, color muted)
- Heading serif grande: frase de impacto que cubra ambas verticales
  - Sugerencias:
    - "Desarrollo soluciones digitales con inteligencia artificial para negocios que quieren crecer."
    - "De la idea al producto: websites, automatizaciones y sistemas inteligentes."
- Subtítulo sans-serif en gris: "Websites para negocios · Automatización con IA · Agentes inteligentes"
- Links a GitHub, LinkedIn, Email, WhatsApp como texto underline

### 3.3 Proyectos (sección principal)

Divididos en dos categorías con tabs o secciones separadas.
Cada card tiene:
- Área visual superior (screenshot, GIF, o ícono SVG placeholder)
- Título en serif
- Descripción de 1-2 líneas enfocada en resultado/impacto
- Tags de tech stack en texto muted
- Link al sitio live y/o a GitHub

---

#### Categoría 1: IA & Automatización

1. **PM-AGENTE — Multi-agent coordination platform**
   - Pitch: "Plataforma de coordinación multi-agente con dashboard de observabilidad en tiempo real. Tesis de ingeniería."
   - Stack: Claude API · FastAPI · SQLite · MCP
   - Links: GitHub + video demo
   - Visual: screenshot del dashboard de observabilidad

2. **HSP-70 WhatsApp Bot**
   - Pitch: "Bot de automatización para gestión de gimnasios vía WhatsApp. Solución replicable como producto."
   - Stack: n8n · Supabase · Kapso · WhatsApp API
   - Links: GitHub + video demo
   - Visual: screenshot de conversación WhatsApp o flow de n8n

3. **RAG Pipeline**
   - Pitch: "Sistema de recuperación de información sobre documentos con arquitectura hexagonal. Búsqueda semántica en tiempo real."
   - Stack: LangChain · FastAPI · Supabase pgvector · Gemini
   - Links: GitHub + video demo
   - Visual: diagrama del pipeline o screenshot de la interfaz

4. **Jira Automation Orchestrator**
   - Pitch: "Workflow end-to-end: Slack command → Jira project → Tempo tracking → Google Sheets reports con notificaciones automáticas."
   - Stack: n8n · Jira · Tempo · Slack · Google Sheets
   - Links: GitHub (interno de Inforge)
   - Visual: diagrama del flow o screenshot del Slack Block Kit

---

#### Categoría 2: Websites & E-commerce

Estos proyectos se van agregando a medida que se completan.
Cada uno vive en su propio dominio (del cliente) o en un subdominio tuyo para demos.

5. **E-commerce de ropa informal**
   - Pitch: "Tienda online con catálogo, carrito, pagos integrados y gestión de stock."
   - Stack: Next.js · Tailwind · MercadoPago/Stripe · Supabase
   - Links: dominio del cliente + GitHub
   - Visual: screenshot del storefront

6. **Centro de Oftalmología**
   - Pitch: "Website institucional con turnos online, equipo médico y servicios."
   - Stack: Next.js · Tailwind · Google Calendar API (turnos)
   - Links: dominio del cliente
   - Visual: screenshot de la landing

7. **Consultorio Odontológico**
   - Pitch: "Sitio profesional para clínica dental con sistema de reservas y galería de tratamientos."
   - Stack: Next.js · Tailwind
   - Links: dominio del cliente
   - Visual: screenshot de la landing

8. **Tienda Essen (estilo mitiendaoficial.com.ar)**
   - Pitch: "Catálogo digital de productos con ficha técnica, precios y contacto directo vía WhatsApp."
   - Stack: Next.js · Tailwind
   - Links: subdominio o dominio propio
   - Visual: screenshot del catálogo

9. **Catálogo 3D — Veladores & productos personalizados**
   - Pitch: "Catálogo visual de productos impresos en 3D con visor interactivo y redirección a WhatsApp para pedidos."
   - Stack: Next.js · Tailwind · Three.js (visor 3D opcional)
   - Links: subdominio de josedaluz.com (ej: 3d.josedaluz.com)
   - Visual: foto/render de los productos

10. **Artesanías — Velas, difusores, decoración nórdica**
    - Pitch: "Tienda online de productos artesanales con catálogo visual, filtros por categoría y contacto por WhatsApp."
    - Stack: Next.js · Tailwind
    - Links: dominio propio del emprendimiento
    - Visual: foto de productos

---

#### Estrategia de crecimiento del portfolio

El componente ProjectCard es reutilizable. Para agregar un proyecto nuevo:
1. Agregar entrada al array de proyectos (puede ser un JSON o archivo MDX)
2. Subir screenshot a /public/projects/
3. Push a main → Vercel hace deploy automático

Estructura de datos sugerida para proyectos:

```typescript
interface Project {
  title: string;
  pitch: string;
  category: 'ai' | 'web';
  stack: string[];
  image: string;           // path en /public/projects/
  demoUrl?: string;        // link al sitio live
  repoUrl?: string;        // link a GitHub
  videoUrl?: string;       // link a video demo
  status: 'live' | 'wip' | 'coming';
}
```

Esto te permite filtrar por categoría en la UI y agregar proyectos sin tocar componentes.

---

#### Hosting de websites de clientes

Los sitios de clientes NO van en subdominios de josedaluz.com. Cada uno tiene su propio dominio:

| Proyecto | Dominio | Hosting | Costo estimado |
|---|---|---|---|
| Portfolio personal | josedaluz.com | Vercel free | $0 |
| E-commerce ropa | [dominio-cliente].com.ar | Vercel free | Dominio ~$5k ARS/año |
| Oftalmología | [clinica].com.ar | Vercel free | Dominio ~$5k ARS/año |
| Odontología | [consultorio].com.ar | Vercel free | Dominio ~$5k ARS/año |
| Tienda Essen | [tienda].com.ar | Vercel free | Dominio ~$5k ARS/año |
| Catálogo 3D | 3d.josedaluz.com | Vercel free | $0 (subdominio) |
| Artesanías | [marca].com.ar | Vercel free | Dominio ~$5k ARS/año |

Todos los sitios son estáticos o SSG → Vercel free los banca todos sin problema.
El único costo recurrente es el dominio de cada cliente (que lo paga el cliente).
Si un e-commerce necesita backend (pagos, stock), se agrega un API route en Next.js o un servicio en Render free.

### 3.4 Stack / Skills

NO usar barras de progreso ni porcentajes. Agrupar por categoría en columnas:

| AI & LLMs | Backend | Web & Frontend | Automatización | Datos |
|---|---|---|---|---|
| Claude API | Python | Next.js | n8n | Supabase |
| LangChain | FastAPI | React | Slack/Jira | pgvector |
| OpenAI/Gemini | REST APIs | Tailwind CSS | WhatsApp API | ChromaDB |
| MCP | Java | Framer Motion | Apify | SQL |
| | | Three.js | | MercadoPago |

Estilo: texto simple, sin íconos, agrupado con headers serif. Minimalista.

### 3.5 Servicios (sección nueva)

Sección orientada a potenciales clientes locales. 3 cards simples:

1. **Websites & E-commerce**
   - "Diseño y desarrollo de sitios web profesionales para negocios, clínicas, tiendas y emprendimientos."
   - Desde catálogos con contacto por WhatsApp hasta e-commerce con pagos integrados.

2. **Automatización con IA**
   - "Chatbots, asistentes virtuales y workflows automáticos que reducen trabajo manual."
   - WhatsApp bots, integración con sistemas existentes, notificaciones inteligentes.

3. **Consultoría técnica**
   - "Análisis de procesos y propuestas de soluciones digitales a medida."
   - Desde auditoría de workflows hasta diseño de arquitectura.

CTA al final: "¿Tenés un proyecto en mente?" → link a WhatsApp con mensaje pre-armado.

### 3.6 Certificaciones (solo las relevantes)

Mostrar las de Anthropic prominentemente (Claude Code in Action, Agent Skills, AI Fluency). Las de Udemy/Platzi más chicas o en hover.

### 3.7 Footer
- Línea separadora fina
- Dos columnas: año a la izquierda, links sociales a la derecha
- Email y WhatsApp clickeables
- Texto: "Disponible para freelance, consultoría y proyectos web"

---

## 4. Paleta de colores

```css
:root {
  --bg-primary: #faf9f6;       /* Fondo principal - warm white */
  --bg-card: #eae8e3;          /* Fondo de cards/áreas visuales */
  --text-primary: #1a1a1a;     /* Texto principal */
  --text-secondary: #777777;   /* Texto descriptivo */
  --text-muted: #b0a99f;       /* Labels, etiquetas, metadata */
  --border: #e8e6e1;           /* Líneas y separadores */
  --accent: #1a1a1a;           /* Links y CTAs (negro, no color) */
}

/* Dark mode (opcional, para después) */
[data-theme="dark"] {
  --bg-primary: #111110;
  --bg-card: #1c1c1a;
  --text-primary: #f0ede6;
  --text-secondary: #999990;
  --text-muted: #666660;
  --border: #2a2a28;
}
```

---

## 5. Tipografía

```css
/* Headings */
font-family: 'Playfair Display', Georgia, serif;
/* H1: 2.5rem (40px), H2: 1.75rem (28px), H3: 1.25rem (20px) */
/* letter-spacing: -0.02em para headings grandes */

/* Body / UI */
font-family: 'DM Sans', system-ui, sans-serif;
/* Body: 1rem (16px), Small: 0.875rem (14px), Label: 0.75rem (12px) */
/* line-height: 1.6 para body text */

/* Labels / Tags */
/* uppercase, letter-spacing: 0.1em, font-size: 0.6875rem (11px) */
```

---

## 6. Setup DNS en DonWeb

### Dominio principal → Vercel

**josedaluz.com** → Portfolio

1. En Vercel: Project Settings → Domains → agregar `josedaluz.com` y `www.josedaluz.com`
2. En DonWeb panel DNS: agregar registros:
   - `A` → `76.76.21.21` (para `josedaluz.com`)
   - `CNAME` `www` → `cname.vercel-dns.com`

### Subdominios para proyectos

Cada subdominio apunta al hosting correspondiente. En DonWeb, agregar registros CNAME:

```
agents.josedaluz.com  → CNAME → [URL del deploy en Railway/Render/Vercel]
hsp70.josedaluz.com   → CNAME → [URL del deploy en Railway/Render]
rag.josedaluz.com     → CNAME → [URL del deploy en Vercel/Railway]
```

En cada plataforma de hosting (Railway, Render, Vercel), agregar el subdominio como custom domain para que lo reconozca.

### Verificación
```bash
# Verificar que los DNS propagaron (puede tardar hasta 48hs)
dig josedaluz.com +short
dig agents.josedaluz.com +short
nslookup josedaluz.com
```

---

## 7. Checklist de contenido (antes de codear)

- [x] Dominio: **josedaluz.com** (DonWeb)
- [ ] Escribir pitch del hero (1 frase de impacto que cubra IA + web)
- [ ] Preparar screenshots/GIFs de proyectos AI existentes (4 imágenes)
- [ ] Escribir descripción de impacto de cada proyecto (1-2 líneas)
- [ ] Definir qué certificaciones mostrar (recomiendo top 4-5)
- [ ] Links de GitHub de cada proyecto (verificar repos públicos con README)
- [ ] Foto profesional (opcional pero recomendado)
- [ ] Número de WhatsApp para CTA de servicios
- [ ] Definir precios orientativos de servicios web (opcional, puede ir sin precio)

---

## 8. Prompt para Claude Code

Cuando arranques con Claude Code, podés usar este prompt como punto de partida:

```
Creá un portfolio web minimalista con estilo editorial usando Next.js 14 (App Router) + Tailwind CSS + Framer Motion.

Estética: tipografía serif (Playfair Display) para headings + sans-serif (DM Sans) para body. Paleta warm neutral (#faf9f6 fondo, #1a1a1a texto, #b0a99f muted). Mucho whitespace. Sin gradientes ni sombras. Bordes finos #e8e6e1.

Estructura single-page con secciones:
1. Navbar sticky con backdrop blur — links: Proyectos · Servicios · Contacto
2. Hero con etiqueta "DESARROLLADOR · IA & WEB · CÓRDOBA, AR", heading serif grande, subtítulo, links a GitHub/LinkedIn/WhatsApp
3. Proyectos con filtro por categoría (IA & Automatización / Websites). Grid 2 columnas. Cada card con: imagen, título serif, descripción, tags de stack, link a demo/repo. Los proyectos se cargan desde un archivo data/projects.ts con interface tipada.
4. Servicios: 3 cards (Websites & E-commerce, Automatización con IA, Consultoría). CTA a WhatsApp.
5. Stack/Skills agrupado por categoría (texto simple, sin barras)
6. Certificaciones (las de Anthropic destacadas)
7. Footer minimalista con WhatsApp y email

Animaciones: fade-in + slide-up al scroll con Framer Motion (staggered).
Responsive: 1 columna en mobile, 2 en desktop.
Deploy target: Vercel.
```

---

## 9. Roadmap

| Fase | Tarea | Tiempo estimado |
|---|---|---|
| 1 | Setup proyecto Next.js + Tailwind + fonts | 30 min |
| 2 | Navbar + Hero + Footer | 1-2 hrs |
| 3 | data/projects.ts + ProjectCard + filtro por categoría | 1-2 hrs |
| 4 | Sección Servicios (3 cards + CTA WhatsApp) | 1 hr |
| 5 | Stack + Certificaciones | 30 min |
| 6 | Animaciones con Framer Motion | 1 hr |
| 7 | Responsive + pulido visual | 1 hr |
| 8 | Deploy en Vercel + DNS en DonWeb | 30 min |
| 9 | Preparar screenshots y contenido real de proyectos AI (4 existentes) | 1-2 hrs |
| **Total fase 1** | **Portfolio live con proyectos AI** | **~8-10 hrs** |
| 10 | Agregar proyectos web a medida que se completen | ~30 min c/u |
