# Portfolio Futuristic Redesign — Design Spec

## Overview

Redesign the entire portfolio (Nav, Hero, Projects, Services, Stack, Footer) with a futuristic/sci-fi/cyberpunk elegant aesthetic that communicates "I solve problems with AI". Must be visually consistent with the Iron Man 3D splash screen that precedes it.

## Design System

### Typography
- **Headings:** Outfit (ultralight for labels, bold for emphasis)
- **Body/UI:** Space Grotesk
- **Both already loaded** in layout.tsx via next/font/google

### Color Palette

**Dark mode (default):**
- Background: #050508
- Text primary: #f0ede6
- Text muted: rgba(240,237,230,0.4)
- Cyan accent: #00d4ff
- Gold gradient: #d4a853 → #f0c66e
- Card bg: rgba(255,255,255,0.03)
- Card border: rgba(255,255,255,0.06)
- Glass: backdrop-filter blur(12px)

**Light mode:**
- Background: #faf9f6
- Text primary: #1a1a1a
- Text muted: #666
- Cyan accent: #0077aa
- Gold: #b8860b
- Card bg: rgba(0,0,0,0.02)
- Card border: rgba(0,0,0,0.08)

### Visual Elements
- Subtle CSS grid pattern background (no matrix rain — that stays in splash only)
- Glassmorphism cards (semi-transparent bg, backdrop blur, thin borders)
- Dividers: thin gradient lines (cyan in dark, gold in light)
- Hover: cyan glow border, slight scale/lift
- Scroll reveal: staggered fade-up via IntersectionObserver

## Sections

### 1. Nav (sticky)
- Glassmorphism background (backdrop-blur, semi-transparent)
- Logo: "JDL" in Outfit bold + cyan dot accent
- Links: Proyectos, Servicios, Stack, Contacto (uppercase, tracked, Space Grotesk)
- Right side: Language toggle (ES | EN), Theme toggle (moon/sun), WhatsApp CTA button
- Thin bottom border
- Mobile: hamburger menu
- Fix existing link navigation issues

### 2. Hero (reduced)
- Max one viewport height
- Small label: "// SISTEMA ACTIVO" (cyan, monospace-style)
- Heading: "Construyo soluciones con AI que resuelven problemas reales." (Outfit, gradient on key words)
- Two CTAs: "Ver proyectos ↓" (primary, cyan border) + "Contactame" (ghost)
- Subtle animated gradient orb background (CSS only)
- NO name/title (splash already covered that)

### 3. Projects
- Section label: "PROYECTOS" (small, tracked, cyan)
- Category filter pills: Todos / IA & Automatizacion / Websites
- 2-column grid (desktop), 1-column (mobile)

**Real projects as full cards (4):**
1. FORGE — AI agent coordination (Claude API, Python, FastAPI, Supabase)
2. HSP-70 — Fitness management (React, Supabase, Tailwind, PWA)
3. Tracker de Servicios — SMS notifications (Next.js, PostgreSQL, Twilio)
4. PepeAI — Voice assistant for dementia (React Native, Claude API, Whisper) — with logo + mobile screenshot

**Card design:**
- Dark glassmorphism with thin border
- Image area (aspect-video, grid overlay on placeholder)
- Title (Outfit bold), pitch (Space Grotesk, muted)
- Stack tags as small pills
- Link icons (Demo, GitHub, Video)

**Pipeline section (below cards):**
- Label: "PROXIMOS PROYECTOS"
- Compact chips with dashed borders: E-commerce, Oftalmologia, Odontologia, Essen, Locales, Productos 3D, Artesanias

### 4. Services (problem-focused)
- Section label: "SERVICIOS"
- 3 glassmorphism cards:

1. **Automatizacion con IA** (lead position)
   - "¿Tu equipo pierde horas en tareas repetitivas? Construyo agentes inteligentes que automatizan procesos y ahorran tiempo."

2. **Desarrollo Web & Apps**
   - "Sitios web y aplicaciones modernas, rapidas y optimizadas. Desde landing pages hasta plataformas complejas."

3. **Consultoria Tecnica**
   - "¿No sabes por donde empezar con IA? Te ayudo a encontrar la solucion correcta para tu negocio."

- Each card: SVG icon with cyan glow, hover lift
- Bottom: WhatsApp CTA "Hablemos de tu proyecto →"

### 5. Stack (with certs integrated)
- Section label: "TECNOLOGIAS"
- 5 categorized rows with pill badges:
  - AI & LLMs: Claude API, LangChain, OpenAI/Gemini, MCP
  - Backend: Python, FastAPI, REST APIs, Java
  - Frontend: Next.js, React, Tailwind CSS, Framer Motion, Three.js
  - Automatizacion: n8n, Slack/Jira, WhatsApp API, Apify
  - Data: Supabase, pgvector, ChromaDB, SQL, MercadoPago

- Certifications integrated at bottom as compact badges:
  - Anthropic: Claude Code in Action, Agent Skills, AI Fluency
  - Other: Python, React, FastAPI

### 6. Footer
- Compact, thin cyan gradient top border
- Left: "© 2024 Jose Da Luz · Cordoba, Argentina"
- Center: "Disponible para proyectos freelance" (green dot)
- Right: Social icons (GitHub, LinkedIn, Email, WhatsApp)

## Internationalization (i18n)

- Two languages: Espanol (default) + English
- Simple approach: JSON translation files, context provider
- Toggle in Nav switches all visible text
- URL stays the same (no /en/ routes — client-side only)

## Theme Toggle

- Dark mode (default) / Light mode
- data-theme attribute on html element
- CSS custom properties for all colors
- Persists to localStorage
- Smooth 300ms transitions

## Removed

- **Certs section** — integrated into Stack
- **Hero parallax** — replaced with reduced hero
- **Light mode as default** — dark is now default

## Reference Mockup

`mockups/portfolio-redesign.html` — approved by user, use as visual reference for implementation.

## Architecture

### File Changes
- Modify: Nav.tsx, Hero.tsx, Projects.tsx, Services.tsx, Stack.tsx, Footer.tsx, ProjectCard.tsx
- Modify: globals.css (new CSS variables, dark-first approach)
- Delete: Certs.tsx (content moves to Stack)
- Create: i18n context + translation files
- Modify: data/projects.ts, data/certifications.ts (if needed)

### Dependencies
No new dependencies — uses existing Tailwind, Framer Motion, next/font.
