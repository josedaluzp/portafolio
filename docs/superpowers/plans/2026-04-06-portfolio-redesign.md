# Portfolio Futuristic Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the entire portfolio with futuristic/cyberpunk aesthetic matching the Iron Man splash screen, add i18n (ES/EN), and restructure content.

**Architecture:** Replace CSS variables and component styles to match the approved mockup at `mockups/portfolio-redesign.html`. Each component is rewritten with Tailwind + the new design tokens. i18n uses a React context with JSON translation objects. Certs section is removed and integrated into Stack.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion

**Reference:** `mockups/portfolio-redesign.html` contains all visual code. Each task ports the relevant section from that mockup.

---

### Task 1: Update globals.css and design tokens

**Files:**
- Modify: `app/globals.css`

This is the foundation — new CSS variables, dark-first theme, grid background, scroll reveal classes.

- [ ] **Step 1: Rewrite globals.css**

Replace the entire content of `app/globals.css` with the new design system. The key change: dark mode is now the DEFAULT (`:root`), light mode is `[data-theme="light"]`.

Read the current `app/globals.css` then rewrite it with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #050508;
  --bg-card: rgba(255,255,255,0.03);
  --bg-nav: rgba(5,5,8,0.72);
  --text: #f0ede6;
  --text-secondary: rgba(240,237,230,0.55);
  --text-muted: rgba(240,237,230,0.3);
  --cyan: #00d4ff;
  --cyan-dim: rgba(0,212,255,0.15);
  --cyan-glow: rgba(0,212,255,0.35);
  --gold: #d4a853;
  --gold-end: #f0c66e;
  --border-card: rgba(255,255,255,0.06);
  --border-card-hover: rgba(0,212,255,0.3);
  --border-nav: rgba(255,255,255,0.06);
  --grid-color: rgba(255,255,255,0.02);
  --pill-bg: rgba(255,255,255,0.04);
  --pill-border: rgba(255,255,255,0.08);
  --shadow-card: 0 4px 32px rgba(0,0,0,0.4);
  --glass-blur: blur(18px);
  --icon-glow: drop-shadow(0 0 8px rgba(0,212,255,0.4));

  /* Legacy compat for existing components during migration */
  --bg-primary: #050508;
  --text-primary: #f0ede6;
  --border: rgba(255,255,255,0.06);
  --accent: #f0ede6;
}

[data-theme="light"] {
  --bg: #faf9f6;
  --bg-card: rgba(0,0,0,0.02);
  --bg-nav: rgba(250,249,246,0.82);
  --text: #1a1a1a;
  --text-secondary: rgba(26,26,26,0.6);
  --text-muted: rgba(26,26,26,0.35);
  --cyan: #0077aa;
  --cyan-dim: rgba(0,119,170,0.08);
  --cyan-glow: rgba(0,119,170,0.2);
  --gold: #b8860b;
  --gold-end: #d4a853;
  --border-card: rgba(0,0,0,0.06);
  --border-card-hover: rgba(0,119,170,0.35);
  --border-nav: rgba(0,0,0,0.06);
  --grid-color: rgba(0,0,0,0.025);
  --pill-bg: rgba(0,0,0,0.03);
  --pill-border: rgba(0,0,0,0.08);
  --shadow-card: 0 4px 24px rgba(0,0,0,0.06);
  --glass-blur: blur(18px);
  --icon-glow: drop-shadow(0 0 6px rgba(0,119,170,0.3));

  --bg-primary: #faf9f6;
  --text-primary: #1a1a1a;
  --border: rgba(0,0,0,0.06);
  --accent: #1a1a1a;
}

html { scroll-behavior: smooth; }

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-space-grotesk), 'Space Grotesk', sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.4s ease, color 0.4s ease;
}

/* Subtle grid background */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: 60px 60px;
}

* { transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease; }
```

- [ ] **Step 2: Update ThemeProvider to default to dark**

Read `app/components/ThemeProvider.tsx`. Change the default theme from "light" to "dark". The provider should check localStorage first, fallback to "dark".

- [ ] **Step 3: Verify the app loads with dark theme**

Run `npm run dev`, open localhost:3000, click through splash. The portfolio should appear with the dark background (#050508) and grid pattern.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/components/ThemeProvider.tsx
git commit -m "feat: update design tokens to futuristic dark-first theme"
```

---

### Task 2: Create i18n system

**Files:**
- Create: `app/i18n/translations.ts`
- Create: `app/i18n/LanguageContext.tsx`
- Create: `app/i18n/index.ts`

- [ ] **Step 1: Create translations file**

Create `app/i18n/translations.ts` with all UI text in ES and EN. This is a single object with nested keys for each section. Include ALL text from the mockup: nav links, hero, services, section labels, footer, buttons.

- [ ] **Step 2: Create LanguageContext**

Create `app/i18n/LanguageContext.tsx` — a React context that provides `{ lang, setLang, t }` where `t` is a function that looks up translation keys. Persists to localStorage. Default: 'es'.

- [ ] **Step 3: Create barrel export**

Create `app/i18n/index.ts` exporting `{ LanguageProvider, useLanguage }`.

- [ ] **Step 4: Wrap app in LanguageProvider**

Modify `app/page.tsx` to wrap the portfolio content in `<LanguageProvider>`.

- [ ] **Step 5: Commit**

```bash
git add app/i18n/
git commit -m "feat: add i18n system with ES/EN translations"
```

---

### Task 3: Redesign Nav

**Files:**
- Modify: `app/components/Nav.tsx`

Port the nav design from the mockup. Read the current Nav.tsx first, then rewrite it completely.

- [ ] **Step 1: Rewrite Nav.tsx**

The new Nav must include:
- Glassmorphism sticky background (backdrop-blur, semi-transparent)
- "JDL" logo with cyan dot (Outfit font)
- Section links: Proyectos, Servicios, Stack, Contacto (smooth scroll)
- Language toggle (ES | EN) using the i18n context
- Theme toggle (existing ThemeToggle component, restyled)
- WhatsApp CTA button (cyan bg)
- Mobile hamburger menu
- Use `useLanguage()` hook for translated link labels

Reference: mockup lines 151-300 for all CSS styles, converted to Tailwind classes.

- [ ] **Step 2: Verify nav renders correctly**

Check: glassmorphism bg, links work (smooth scroll to sections), language toggle switches text, theme toggle works, responsive hamburger on mobile.

- [ ] **Step 3: Commit**

```bash
git add app/components/Nav.tsx
git commit -m "feat: redesign Nav with glassmorphism, language toggle, futuristic style"
```

---

### Task 4: Redesign Hero

**Files:**
- Modify: `app/components/Hero.tsx`

- [ ] **Step 1: Rewrite Hero.tsx**

Reduced hero — one viewport max. Content:
- "// SISTEMA ACTIVO" label (cyan, monospace-style)
- Main heading: "Construyo soluciones con AI que resuelven problemas reales." — key words in gradient (cyan→gold)
- Two CTA buttons: "Ver proyectos ↓" (primary, cyan border) + "Contactame" (ghost)
- Animated gradient orb in background (CSS animation)
- Framer Motion entrance animations (fade up, staggered)
- Use `useLanguage()` for translated text
- The heading, label, and button text should all come from translations

Reference: mockup lines 302-410 for styles.

- [ ] **Step 2: Commit**

```bash
git add app/components/Hero.tsx
git commit -m "feat: redesign Hero with reduced layout, gradient heading, CTAs"
```

---

### Task 5: Redesign Projects + ProjectCard

**Files:**
- Modify: `app/components/Projects.tsx`
- Modify: `app/components/ProjectCard.tsx`

- [ ] **Step 1: Rewrite ProjectCard.tsx**

Futuristic card design:
- Dark glassmorphism card (bg-card, border-card, backdrop-blur)
- Image area with aspect-video ratio (gradient placeholder + grid overlay if no image)
- Title in Outfit bold
- Pitch in Space Grotesk, text-secondary color
- Stack tags as small pills (pill-bg, pill-border)
- Link icons for Demo/GitHub/Video
- "Próximamente" translucent overlay badge for coming-soon
- Hover: border-card-hover color, slight translateY(-2px), shadow
- Use `useLanguage()` for "Próximamente" and link labels

- [ ] **Step 2: Rewrite Projects.tsx**

Section with:
- Section label "PROYECTOS" (cyan, tracked, uppercase)
- Category filter pills: Todos / IA & Automatización / Websites (active = cyan bg)
- 2-column grid with ProjectCards (only live + wip projects)
- AnimatePresence for filter transitions
- Pipeline section below: "PRÓXIMOS PROYECTOS" label + compact chips with dashed borders for the 7 coming-soon projects
- Framer Motion whileInView for scroll reveal
- Use translations for labels

- [ ] **Step 3: Commit**

```bash
git add app/components/Projects.tsx app/components/ProjectCard.tsx
git commit -m "feat: redesign Projects with glassmorphism cards, pipeline section"
```

---

### Task 6: Redesign Services

**Files:**
- Modify: `app/components/Services.tsx`

- [ ] **Step 1: Rewrite Services.tsx**

3 glassmorphism cards with problem-focused copy:

1. **Automatización con IA** — brain/circuit SVG icon, cyan glow
   "¿Tu equipo pierde horas en tareas repetitivas? Construyo agentes inteligentes que automatizan procesos y ahorran tiempo."

2. **Desarrollo Web & Apps** — globe/code SVG icon
   "Sitios web y aplicaciones modernas, rápidas y optimizadas. Desde landing pages hasta plataformas complejas."

3. **Consultoría Técnica** — lightbulb/chat SVG icon
   "¿No sabés por dónde empezar con IA? Te ayudo a encontrar la solución correcta para tu negocio."

- Hover: card lifts (-2px), border goes cyan
- Bottom: WhatsApp CTA "Hablemos de tu proyecto →"
- Use translations for all text
- Framer Motion whileInView

Reference: mockup lines for Services section.

- [ ] **Step 2: Commit**

```bash
git add app/components/Services.tsx
git commit -m "feat: redesign Services with AI-first messaging, glassmorphism cards"
```

---

### Task 7: Redesign Stack + integrate Certs

**Files:**
- Modify: `app/components/Stack.tsx`
- Delete: `app/components/Certs.tsx`
- Modify: `app/page.tsx` (remove Certs import)

- [ ] **Step 1: Rewrite Stack.tsx**

Section label: "TECNOLOGÍAS"

5 category rows, each with:
- Category name (cyan label)
- Tech pills (pill-bg, pill-border)

Categories:
- AI & LLMs: Claude API, LangChain, OpenAI/Gemini, MCP
- Backend: Python, FastAPI, REST APIs, Java
- Frontend: Next.js, React, Tailwind CSS, Framer Motion, Three.js
- Automatización: n8n, Slack/Jira, WhatsApp API, Apify
- Data: Supabase, pgvector, ChromaDB, SQL, MercadoPago

Below: "CERTIFICACIONES" row with cert badges:
- 3 Anthropic certs (gold accent border)
- 3 other certs (regular border)
- Each badge: small pill with star icon + cert name + issuer

Use translations, Framer Motion whileInView.

- [ ] **Step 2: Remove Certs.tsx and its import**

Delete `app/components/Certs.tsx`. Remove `<Certs />` from page.tsx.

- [ ] **Step 3: Commit**

```bash
git add app/components/Stack.tsx app/page.tsx
git rm app/components/Certs.tsx
git commit -m "feat: redesign Stack with integrated certs, remove Certs section"
```

---

### Task 8: Redesign Footer

**Files:**
- Modify: `app/components/Footer.tsx`

- [ ] **Step 1: Rewrite Footer.tsx**

Compact footer:
- Top border: thin cyan gradient line
- 3-column layout (responsive):
  - Left: "© 2024 Jose Da Luz · Córdoba, Argentina"
  - Center: "Disponible para proyectos freelance" with green dot
  - Right: Social icons (GitHub, LinkedIn, Email, WhatsApp) as SVG icon buttons
- Use translations
- Framer Motion fade in

Reference: mockup footer section.

- [ ] **Step 2: Commit**

```bash
git add app/components/Footer.tsx
git commit -m "feat: redesign Footer with compact layout, social icons"
```

---

### Task 9: Final build verification and cleanup

**Files:**
- Possibly modify any file with build errors

- [ ] **Step 1: Run build**

```bash
npx next build
```

Fix any TypeScript or lint errors.

- [ ] **Step 2: Test full flow**

Open localhost:3000:
1. Splash screen → click → helmet assembles → audio → clap/button
2. Portfolio appears with new design
3. Verify: Nav (glassmorphism, links, language toggle, theme toggle)
4. Verify: Hero (gradient heading, CTAs, orb animation)
5. Verify: Projects (filter pills, cards, pipeline section)
6. Verify: Services (3 cards, AI-first)
7. Verify: Stack (5 categories + certs)
8. Verify: Footer (compact, social links)
9. Toggle theme dark/light
10. Toggle language ES/EN
11. Test mobile responsive (Chrome DevTools)

- [ ] **Step 3: Cleanup mockup**

```bash
rm -f mockups/portfolio-redesign.html
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup, portfolio redesign complete"
```
