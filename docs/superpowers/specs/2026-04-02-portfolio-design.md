# Portfolio Profesional — Spec de Diseño

## Resumen

Portfolio profesional single-page para José De La Luz, desarrollador de IA & Web en Córdoba, Argentina. Estilo editorial minimalista con tipografía serif/sans-serif, paleta neutra cálida, animaciones moderadas con parallax, y dark mode con toggle manual.

**URL objetivo:** josedaluz.com  
**Framework:** Next.js 14 (App Router) + Tailwind CSS + Framer Motion  
**Deploy:** Vercel (free tier)

---

## Decisiones de diseño validadas

| Decisión | Elección |
|---|---|
| Proyectos iniciales | 4 IA live + Websites como "coming soon" |
| Idioma | Híbrido: UI en español, nombres técnicos y stack en inglés |
| Hero | Enfoque en soluciones: "Desarrollo soluciones digitales con inteligencia artificial para negocios que quieren crecer." |
| Animaciones | Moderado: fade-in + slide-up + stagger + parallax sutil en scroll |
| WhatsApp CTA | Mensaje genérico pre-armado |
| Dark mode | Toggle manual (sol/luna) desde el inicio |
| Certificaciones | Todas visibles: Anthropic destacadas + secundarias en fila menor |
| Arquitectura | Single-page monolítico con scroll y anchor navigation |
| Íconos sociales | Solo en el footer (GitHub, LinkedIn, Email, WhatsApp) — no en el hero |

---

## Estructura de archivos

```
portfolio/
├── app/
│   ├── layout.tsx              # Font imports, metadata global, ThemeProvider
│   ├── page.tsx                # Single-page: importa todos los section components
│   ├── globals.css             # Tailwind base + CSS custom properties (light/dark)
│   └── components/
│       ├── Nav.tsx             # Navbar sticky con backdrop blur, links, CTA, theme toggle
│       ├── Hero.tsx            # Etiqueta, heading serif, subtítulo (sin íconos sociales)
│       ├── Projects.tsx        # Sección con tabs de filtro + grid de ProjectCards
│       ├── ProjectCard.tsx     # Card reutilizable con imagen, título, descripción, tags, links
│       ├── Services.tsx        # 3 cards de servicios + CTA WhatsApp
│       ├── Stack.tsx           # Skills agrupadas por categoría en columnas de texto
│       ├── Certs.tsx           # Certificaciones: Anthropic destacadas + secundarias
│       ├── Footer.tsx          # Copyright + íconos sociales (GitHub, LinkedIn, Email, WhatsApp)
│       ├── ThemeToggle.tsx     # Botón sol/luna para dark mode
│       ├── ScrollReveal.tsx    # Wrapper Framer Motion para fade-in + slide-up al scroll
│       └── ParallaxHero.tsx    # Wrapper parallax para el fondo del hero
├── data/
│   ├── projects.ts            # Array tipado de proyectos con interface Project
│   └── certifications.ts      # Array tipado de certificaciones con interface Certification
├── public/
│   ├── projects/              # Screenshots/GIFs de cada proyecto (se agregan progresivamente)
│   └── cv.pdf                 # CV descargable (opcional)
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## Tipado de datos

```typescript
interface Project {
  id: string;
  title: string;
  pitch: string;
  category: 'ai' | 'web';
  stack: string[];
  image: string;           // path en /public/projects/
  demoUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  status: 'live' | 'wip' | 'coming';
}

interface Certification {
  name: string;
  provider: 'anthropic' | 'udemy' | 'platzi' | 'other';
  url?: string;
}
```

---

## Secciones detalladas

### 1. Nav

- **Posición:** Sticky top, `backdrop-filter: blur(8px)`, fondo semi-transparente
- **Izquierda:** Logo "JDL" en Playfair Display serif, bold
- **Derecha:** Links de anchor scroll (Proyectos · Servicios · Contacto), botón "Hablemos" (fondo negro, texto blanco, abre WhatsApp), ThemeToggle (ícono luna/sol)
- **Mobile:** Hamburger menu (ícono ☰) que abre un panel con los links y el CTA. Cierra al clickear un link o fuera del panel.
- **Borde inferior:** 1px `#e8e6e1` (light) / `#2a2a28` (dark)

### 2. Hero

- **Etiqueta superior:** `DESARROLLADOR · IA & WEB · CÓRDOBA, AR` — uppercase, letter-spacing 0.1em, color muted `#b0a99f`
- **Heading:** "Desarrollo soluciones digitales con inteligencia artificial para negocios que quieren crecer." — Playfair Display, ~2.5rem, color `#1a1a1a`, letter-spacing -0.02em
- **Subtítulo:** "Websites para negocios · Automatización con IA · Agentes inteligentes" — DM Sans, color `#777`
- **Sin íconos sociales** (se muestran solo en el footer)
- **Parallax:** El hero tiene un efecto de parallax donde el contenido se mueve a velocidad reducida (0.5x) al scrollear, creando sensación de profundidad. Implementado con Framer Motion `useScroll` + `useTransform`.
- **Animación de entrada:** Fade-in + slide-up al cargar la página (800ms ease-out)

### 3. Proyectos

- **Label:** "PROYECTOS" — uppercase, muted
- **Título:** "Trabajo seleccionado" — Playfair Display serif
- **Filtro:** Tabs/pills clickeables: "IA & Automatización" (activo: fondo negro, texto blanco) | "Websites" (inactivo: fondo card, texto gris). Cambian el grid con transición suave.
- **Grid:** 2 columnas en desktop, 1 en mobile, gap 16px
- **Scroll reveal:** Toda la sección hace fade-in + slide-up al entrar en viewport
- **Cards stagger:** Cada card aparece con 100ms de delay respecto a la anterior

#### ProjectCard

- **Área visual superior:** Imagen/screenshot del proyecto (o placeholder gris si no hay imagen aún)
- **Título:** Playfair Display serif, font-weight 600, color `#1a1a1a`
- **Descripción:** DM Sans, 1-2 líneas, color `#555`
- **Tags de stack:** Texto muted `#999`, separados por "·"
- **Links:** Íconos o texto underline para demo/repo/video (solo si existen)
- **Hover:** translateY(-2px) + box-shadow sutil (200ms ease)
- **Status "coming":** Overlay semitransparente con badge "Próximamente" centrado
- **Border-radius:** 8px, fondo `#eae8e3` (light) / `#1c1c1a` (dark)

#### Proyectos iniciales (4 IA live)

1. **PM-AGENTE** — "Plataforma de coordinación multi-agente con dashboard de observabilidad en tiempo real. Tesis de ingeniería." — Stack: Claude API · FastAPI · SQLite · MCP — Status: live
2. **HSP-70 WhatsApp Bot** — "Bot de automatización para gestión de gimnasios vía WhatsApp. Solución replicable como producto." — Stack: n8n · Supabase · Kapso · WhatsApp API — Status: live
3. **RAG Pipeline** — "Sistema de recuperación de información sobre documentos con arquitectura hexagonal. Búsqueda semántica en tiempo real." — Stack: LangChain · FastAPI · Supabase pgvector · Gemini — Status: live
4. **Jira Automation Orchestrator** — "Workflow end-to-end: Slack command → Jira project → Tempo tracking → Google Sheets reports." — Stack: n8n · Jira · Tempo · Slack · Google Sheets — Status: live

#### Proyectos coming soon (Websites)

5. **E-commerce de ropa informal** — Status: coming
6. **Centro de Oftalmología** — Status: coming

### 4. Servicios

- **Label:** "SERVICIOS" — uppercase, muted
- **Título:** "¿Cómo puedo ayudarte?" — Playfair Display serif
- **Grid:** 3 columnas en desktop, 1 en mobile
- **Cards:**
  1. **Websites & E-commerce** — "Diseño y desarrollo de sitios web profesionales para negocios, clínicas, tiendas y emprendimientos."
  2. **Automatización con IA** — "Chatbots, asistentes virtuales y workflows automáticos que reducen trabajo manual."
  3. **Consultoría técnica** — "Análisis de procesos y propuestas de soluciones digitales a medida."
- **CTA:** Botón centrado debajo: "¿Tenés un proyecto en mente?" → link a WhatsApp con mensaje pre-armado: "Hola José, vi tu portfolio y me interesa consultar sobre tus servicios."
- **Hover en cards:** Mismo efecto lift que ProjectCard

### 5. Stack / Skills

- **Label:** "STACK" — uppercase, muted
- **Título:** "Tecnologías" — Playfair Display serif
- **Layout:** 5 columnas en desktop (responsive a 2-3 en tablet, 1 en mobile)
- **Sin barras de progreso, sin íconos.** Solo texto agrupado.
- **Categorías:**

| AI & LLMs | Backend | Frontend | Automation | Data |
|---|---|---|---|---|
| Claude API | Python | Next.js | n8n | Supabase |
| LangChain | FastAPI | React | Slack/Jira | pgvector |
| OpenAI/Gemini | REST APIs | Tailwind CSS | WhatsApp API | ChromaDB |
| MCP | Java | Framer Motion | Apify | SQL |
| | | Three.js | | MercadoPago |

- **Header de categoría:** Playfair Display serif, font-weight 600, color `#1a1a1a`
- **Items:** DM Sans, color `#555`

### 6. Certificaciones

- **Label:** "CERTIFICACIONES" — uppercase, muted
- **Fila destacada (Anthropic):** Badges con fondo `#1a1a1a`, texto blanco, border-radius 4px, font-weight 600
  - Claude Code in Action
  - Agent Skills
  - AI Fluency
- **Fila secundaria:** Badges con fondo `#eae8e3`, texto `#555`, tamaño menor
  - Listar todas las certificaciones de Udemy, Platzi, etc.
- **Los badges son clickeables** si tienen URL de verificación

### 7. Footer

- **Línea separadora:** 1px `#e8e6e1`
- **Izquierda:** "© 2026 José De La Luz" + "Disponible para freelance, consultoría y proyectos web"
- **Derecha:** Íconos SVG de GitHub, LinkedIn, Email (mailto:), WhatsApp — minimalistas, monocromáticos, con hover color transition
- **Estos son los ÚNICOS íconos sociales en toda la página**

---

## Paleta de colores

```css
:root {
  --bg-primary: #faf9f6;
  --bg-card: #eae8e3;
  --text-primary: #1a1a1a;
  --text-secondary: #555555;
  --text-muted: #b0a99f;
  --text-description: #555555;
  --text-tags: #999999;
  --border: #e8e6e1;
  --accent: #1a1a1a;
}

[data-theme="dark"] {
  --bg-primary: #111110;
  --bg-card: #1c1c1a;
  --text-primary: #f0ede6;
  --text-secondary: #999990;
  --text-muted: #666660;
  --text-description: #aaaaaa;
  --text-tags: #777770;
  --border: #2a2a28;
  --accent: #f0ede6;
}
```

---

## Tipografía

- **Headings:** Playfair Display (Google Fonts), serif. H1: 2.5rem, H2: 1.75rem, H3: 1.25rem. Letter-spacing: -0.02em en H1.
- **Body/UI:** DM Sans (Google Fonts), sans-serif. Body: 1rem, Small: 0.875rem. Line-height: 1.6.
- **Labels/Tags:** DM Sans, uppercase, letter-spacing 0.1em, font-size 0.6875rem (11px).

---

## Animaciones

| Elemento | Animación | Duración | Easing |
|---|---|---|---|
| Hero entrada | fade-in + slide-up (translateY 20px→0) | 800ms | ease-out |
| Hero parallax | translateY al scroll (velocidad 0.5x) | continuo | linear |
| Secciones (scroll reveal) | fade-in + slide-up (translateY 20px→0) | 600ms | ease-out |
| Project cards (stagger) | fade-in + slide-up, delay 100ms entre cards | 600ms | ease-out |
| Card hover | translateY(-2px) + box-shadow | 200ms | ease |
| Dark mode transition | background-color + color | 300ms | ease |
| Nav links hover | underline animado izquierda→derecha | 200ms | ease |
| Tab filter switch | opacity cross-fade del grid | 300ms | ease |

**Implementación:** Framer Motion `useScroll`, `useTransform` para parallax. `useInView` + `motion.div` con `variants` para scroll reveals y stagger.

---

## Dark mode

- **Toggle:** Botón en la nav con ícono luna (light) / sol (dark)
- **Persistencia:** `localStorage` para recordar preferencia del usuario
- **Implementación:** Atributo `data-theme="dark"` en `<html>`, CSS custom properties cambian valores. Transición global de 300ms en background-color y color.
- **ThemeProvider:** Client component que lee localStorage al montar y aplica el theme. Evita flash of wrong theme con script inline en `<head>`.

---

## Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (≥1024px) | Grid 2 col para proyectos, 3 col servicios, 5 col stack |
| Tablet (≥768px) | Grid 2 col proyectos, 2 col servicios, 3 col stack |
| Mobile (<768px) | 1 col todo, nav con hamburger, hero text más chico |

---

## SEO y Metadata

- **Title:** "José De La Luz — Desarrollador IA & Web"
- **Description:** "Desarrollo soluciones digitales con inteligencia artificial para negocios. Websites, automatización, agentes inteligentes. Córdoba, Argentina."
- **OG Image:** Screenshot del hero (se genera después del deploy)
- **Favicon:** Letras "JDL" minimalista

---

## WhatsApp CTA

- **URL:** `https://wa.me/54XXXXXXXXXX?text=Hola%20José%2C%20vi%20tu%20portfolio%20y%20me%20interesa%20consultar%20sobre%20tus%20servicios.`
- **Número:** A definir por el usuario
- **Aparece en:** Botón "Hablemos" de la nav + CTA de servicios + ícono en footer

---

## Dependencias

```json
{
  "next": "^14",
  "react": "^18",
  "react-dom": "^18",
  "tailwindcss": "^3",
  "framer-motion": "^11",
  "@next/font": "built-in (next/font/google)"
}
```

Sin dependencias adicionales. Íconos SVG inline para GitHub, LinkedIn, Email, WhatsApp.

---

## Estrategia de crecimiento

Para agregar un nuevo proyecto:
1. Agregar entrada al array en `data/projects.ts`
2. Subir screenshot a `public/projects/`
3. Push a main → Vercel deploy automático

No requiere tocar componentes. El filtro por categoría y el status badge se manejan automáticamente.
