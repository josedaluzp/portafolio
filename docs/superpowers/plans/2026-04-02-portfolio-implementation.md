# Portfolio Profesional Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page editorial portfolio for José De La Luz with project showcase, services, dark mode, parallax, and scroll animations.

**Architecture:** Next.js 14 App Router single-page site. All sections are server/client components in `app/components/`. Project and certification data lives in `data/`. CSS custom properties handle theming (light/dark). Framer Motion handles scroll reveals, stagger, and parallax. No backend, no API routes — pure static/SSG.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS 3, Framer Motion 11, Google Fonts (Playfair Display + DM Sans)

---

## File Map

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Root layout: font imports, metadata, ThemeProvider wrapper |
| `app/page.tsx` | Single-page assembly: imports all section components |
| `app/globals.css` | Tailwind directives + CSS custom properties (light/dark palettes) |
| `app/components/ThemeProvider.tsx` | Client component: reads/writes localStorage, applies `data-theme` attribute |
| `app/components/ThemeToggle.tsx` | Client component: sun/moon button, toggles theme |
| `app/components/ScrollReveal.tsx` | Client component: Framer Motion wrapper for fade-in + slide-up on scroll |
| `app/components/Nav.tsx` | Client component: sticky navbar, anchor links, CTA, theme toggle, mobile hamburger |
| `app/components/Hero.tsx` | Client component: hero section with parallax effect |
| `app/components/Projects.tsx` | Client component: category filter tabs + project card grid with stagger |
| `app/components/ProjectCard.tsx` | Client component: individual project card with hover effect and status badge |
| `app/components/Services.tsx` | Server component: 3 service cards + WhatsApp CTA |
| `app/components/Stack.tsx` | Server component: skills grouped in 5 columns |
| `app/components/Certs.tsx` | Server component: certification badges (Anthropic highlighted + secondary) |
| `app/components/Footer.tsx` | Server component: copyright + SVG social icons |
| `data/projects.ts` | Project data array with typed interface |
| `data/certifications.ts` | Certification data array with typed interface |
| `tailwind.config.ts` | Tailwind config: custom colors, fonts, extend theme |
| `next.config.js` | Next.js config (minimal, defaults) |

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`, `tailwind.config.ts`, `next.config.js`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `tsconfig.json`, `.gitignore`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd C:/Users/PC/jose/portafolio
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

Expected: Project scaffolded with `app/` directory, `tailwind.config.ts`, `package.json`.

- [ ] **Step 2: Install Framer Motion**

```bash
cd C:/Users/PC/jose/portafolio
npm install framer-motion
```

Expected: `framer-motion` added to `package.json` dependencies.

- [ ] **Step 3: Initialize git repository**

```bash
cd C:/Users/PC/jose/portafolio
git init
git add -A
git commit -m "chore: scaffold Next.js 14 project with Tailwind and Framer Motion"
```

- [ ] **Step 4: Verify dev server starts**

```bash
cd C:/Users/PC/jose/portafolio
npm run dev
```

Expected: Server starts on `localhost:3000` without errors. Kill after verifying.

---

## Task 2: Tailwind Config + CSS Custom Properties + Fonts

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Configure Tailwind with custom theme**

Replace `tailwind.config.ts` with:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          card: "var(--bg-card)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          description: "var(--text-description)",
          tags: "var(--text-tags)",
        },
        border: {
          DEFAULT: "var(--border)",
        },
        accent: "var(--accent)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Write globals.css with CSS custom properties**

Replace `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

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

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 300ms ease, color 300ms ease;
}

* {
  transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease;
}
```

- [ ] **Step 3: Configure fonts in layout.tsx**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "José De La Luz — Desarrollador IA & Web",
  description:
    "Desarrollo soluciones digitales con inteligencia artificial para negocios. Websites, automatización, agentes inteligentes. Córdoba, Argentina.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify build succeeds**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add tailwind.config.ts app/globals.css app/layout.tsx
git commit -m "feat: configure Tailwind theme, CSS custom properties, and Google Fonts"
```

---

## Task 3: ThemeProvider + ThemeToggle

**Files:**
- Create: `app/components/ThemeProvider.tsx`
- Create: `app/components/ThemeToggle.tsx`

- [ ] **Step 1: Create ThemeProvider**

Create `app/components/ThemeProvider.tsx`:

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

- [ ] **Step 2: Create ThemeToggle**

Create `app/components/ThemeToggle.tsx`:

```tsx
"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
      className="text-text-primary hover:text-text-secondary transition-colors text-lg"
    >
      {theme === "light" ? "☽" : "☀"}
    </button>
  );
}
```

- [ ] **Step 3: Wrap layout with ThemeProvider**

Modify `app/layout.tsx` — wrap `{children}` inside `<body>`:

```tsx
// Add import at top:
import { ThemeProvider } from "./components/ThemeProvider";

// Change body content to:
<body className="font-sans">
  <ThemeProvider>{children}</ThemeProvider>
</body>
```

- [ ] **Step 4: Verify build succeeds**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add app/components/ThemeProvider.tsx app/components/ThemeToggle.tsx app/layout.tsx
git commit -m "feat: add dark mode with ThemeProvider and ThemeToggle"
```

---

## Task 4: ScrollReveal Wrapper

**Files:**
- Create: `app/components/ScrollReveal.tsx`

- [ ] **Step 1: Create ScrollReveal component**

Create `app/components/ScrollReveal.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add app/components/ScrollReveal.tsx
git commit -m "feat: add ScrollReveal component for scroll animations"
```

---

## Task 5: Data Layer

**Files:**
- Create: `data/projects.ts`
- Create: `data/certifications.ts`

- [ ] **Step 1: Create projects data**

Create `data/projects.ts`:

```typescript
export interface Project {
  id: string;
  title: string;
  pitch: string;
  category: "ai" | "web";
  stack: string[];
  image: string;
  demoUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  status: "live" | "wip" | "coming";
}

export const projects: Project[] = [
  {
    id: "pm-agente",
    title: "PM-AGENTE",
    pitch:
      "Plataforma de coordinación multi-agente con dashboard de observabilidad en tiempo real. Tesis de ingeniería.",
    category: "ai",
    stack: ["Claude API", "FastAPI", "SQLite", "MCP"],
    image: "/projects/pm-agente.webp",
    repoUrl: "https://github.com/josedaluz/pm-agente",
    status: "live",
  },
  {
    id: "hsp70",
    title: "HSP-70 WhatsApp Bot",
    pitch:
      "Bot de automatización para gestión de gimnasios vía WhatsApp. Solución replicable como producto.",
    category: "ai",
    stack: ["n8n", "Supabase", "Kapso", "WhatsApp API"],
    image: "/projects/hsp70.webp",
    repoUrl: "https://github.com/josedaluz/hsp70",
    status: "live",
  },
  {
    id: "rag",
    title: "RAG Pipeline",
    pitch:
      "Sistema de recuperación de información sobre documentos con arquitectura hexagonal. Búsqueda semántica en tiempo real.",
    category: "ai",
    stack: ["LangChain", "FastAPI", "Supabase pgvector", "Gemini"],
    image: "/projects/rag.webp",
    repoUrl: "https://github.com/josedaluz/rag-pipeline",
    status: "live",
  },
  {
    id: "jira",
    title: "Jira Automation Orchestrator",
    pitch:
      "Workflow end-to-end: Slack command → Jira project → Tempo tracking → Google Sheets reports con notificaciones automáticas.",
    category: "ai",
    stack: ["n8n", "Jira", "Tempo", "Slack", "Google Sheets"],
    image: "/projects/jira.webp",
    status: "live",
  },
  {
    id: "ecommerce-ropa",
    title: "E-commerce de ropa informal",
    pitch:
      "Tienda online con catálogo, carrito, pagos integrados y gestión de stock.",
    category: "web",
    stack: ["Next.js", "Tailwind", "MercadoPago", "Supabase"],
    image: "/projects/ecommerce-ropa.webp",
    status: "coming",
  },
  {
    id: "oftalmologia",
    title: "Centro de Oftalmología",
    pitch:
      "Website institucional con turnos online, equipo médico y servicios.",
    category: "web",
    stack: ["Next.js", "Tailwind", "Google Calendar API"],
    image: "/projects/oftalmologia.webp",
    status: "coming",
  },
];
```

- [ ] **Step 2: Create certifications data**

Create `data/certifications.ts`:

```typescript
export interface Certification {
  name: string;
  provider: "anthropic" | "udemy" | "platzi" | "other";
  url?: string;
}

export const certifications: Certification[] = [
  // Anthropic — destacadas
  {
    name: "Claude Code in Action",
    provider: "anthropic",
    url: "",
  },
  {
    name: "Agent Skills",
    provider: "anthropic",
    url: "",
  },
  {
    name: "AI Fluency",
    provider: "anthropic",
    url: "",
  },
  // Secundarias — el usuario completará la lista con sus certificaciones reales
  {
    name: "Python",
    provider: "udemy",
    url: "",
  },
  {
    name: "React",
    provider: "platzi",
    url: "",
  },
  {
    name: "FastAPI",
    provider: "udemy",
    url: "",
  },
];
```

- [ ] **Step 3: Verify build succeeds**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

- [ ] **Step 4: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add data/projects.ts data/certifications.ts
git commit -m "feat: add typed project and certification data"
```

---

## Task 6: Nav Component

**Files:**
- Create: `app/components/Nav.tsx`

- [ ] **Step 1: Create Nav component**

Create `app/components/Nav.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const WHATSAPP_URL =
  "https://wa.me/54XXXXXXXXXX?text=Hola%20Jos%C3%A9%2C%20vi%20tu%20portfolio%20y%20me%20interesa%20consultar%20sobre%20tus%20servicios.";

const NAV_LINKS = [
  { href: "#proyectos", label: "Proyectos" },
  { href: "#servicios", label: "Servicios" },
  { href: "#contacto", label: "Contacto" },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg-primary/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="font-serif text-xl font-bold text-text-primary">
          JDL
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-text-primary after:transition-all hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-accent px-4 py-1.5 text-sm text-bg-primary transition-opacity hover:opacity-80"
          >
            Hablemos
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile hamburger + theme toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
            className="text-text-primary text-2xl"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border px-6 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-block rounded bg-accent px-4 py-1.5 text-sm text-bg-primary transition-opacity hover:opacity-80"
          >
            Hablemos
          </a>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add app/components/Nav.tsx
git commit -m "feat: add sticky Nav with mobile hamburger and WhatsApp CTA"
```

---

## Task 7: Hero with Parallax

**Files:**
- Create: `app/components/Hero.tsx`

- [ ] **Step 1: Create Hero component**

Create `app/components/Hero.tsx`:

```tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-border">
      {/* Parallax background layer */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-bg-primary"
        aria-hidden
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
      >
        <p className="mb-4 text-[0.6875rem] font-sans uppercase tracking-[0.1em] text-text-muted">
          Desarrollador · IA &amp; Web · Córdoba, AR
        </p>

        <h1 className="font-serif text-3xl leading-tight tracking-tight md:text-[2.5rem] md:leading-[1.2] text-text-primary max-w-3xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          Desarrollo soluciones digitales con inteligencia artificial para
          negocios que quieren crecer.
        </h1>

        <p className="mt-4 text-base text-text-secondary md:text-lg">
          Websites para negocios · Automatización con IA · Agentes inteligentes
        </p>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add app/components/Hero.tsx
git commit -m "feat: add Hero section with parallax scrolling"
```

---

## Task 8: ProjectCard Component

**Files:**
- Create: `app/components/ProjectCard.tsx`

- [ ] **Step 1: Create ProjectCard component**

Create `app/components/ProjectCard.tsx`:

```tsx
import { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Image area */}
      <div className="aspect-video w-full bg-border">
        {project.image && project.status !== "coming" ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted text-sm">
            {project.status === "coming" ? "" : "Screenshot"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-text-primary">
          {project.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-text-description">
          {project.pitch}
        </p>
        <p className="mt-2 text-xs text-text-tags">
          {project.stack.join(" · ")}
        </p>

        {/* Links */}
        {(project.demoUrl || project.repoUrl || project.videoUrl) && (
          <div className="mt-3 flex gap-3 text-xs">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary underline hover:text-text-secondary transition-colors"
              >
                Demo
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary underline hover:text-text-secondary transition-colors"
              >
                GitHub
              </a>
            )}
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary underline hover:text-text-secondary transition-colors"
              >
                Video
              </a>
            )}
          </div>
        )}
      </div>

      {/* Coming soon overlay */}
      {project.status === "coming" && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/60 backdrop-blur-[2px]">
          <span className="rounded-full bg-bg-card px-4 py-1.5 text-xs font-medium text-text-secondary">
            Próximamente
          </span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add app/components/ProjectCard.tsx
git commit -m "feat: add ProjectCard with hover effects and coming-soon overlay"
```

---

## Task 9: Projects Section with Filter

**Files:**
- Create: `app/components/Projects.tsx`

- [ ] **Step 1: Create Projects component**

Create `app/components/Projects.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ScrollReveal } from "./ScrollReveal";

const CATEGORIES = [
  { key: "ai" as const, label: "IA & Automatización" },
  { key: "web" as const, label: "Websites" },
];

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<"ai" | "web">("ai");
  const filtered = projects.filter((p) => p.category === activeCategory);

  return (
    <section id="proyectos" className="border-b border-border">
      <ScrollReveal>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-2 text-[0.6875rem] font-sans uppercase tracking-[0.1em] text-text-muted">
            Proyectos
          </p>
          <h2 className="font-serif text-2xl text-text-primary md:text-[1.75rem]">
            Trabajo seleccionado
          </h2>

          {/* Filter tabs */}
          <div className="mt-6 flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  activeCategory === cat.key
                    ? "bg-accent text-bg-primary"
                    : "bg-bg-card text-text-secondary hover:text-text-primary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Project grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 grid gap-6 sm:grid-cols-2"
            >
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: i * 0.1,
                  }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add app/components/Projects.tsx
git commit -m "feat: add Projects section with category filter and stagger animation"
```

---

## Task 10: Services Section

**Files:**
- Create: `app/components/Services.tsx`

- [ ] **Step 1: Create Services component**

Create `app/components/Services.tsx`:

```tsx
import { ScrollReveal } from "./ScrollReveal";

const WHATSAPP_URL =
  "https://wa.me/54XXXXXXXXXX?text=Hola%20Jos%C3%A9%2C%20vi%20tu%20portfolio%20y%20me%20interesa%20consultar%20sobre%20tus%20servicios.";

const SERVICES = [
  {
    title: "Websites & E-commerce",
    description:
      "Diseño y desarrollo de sitios web profesionales para negocios, clínicas, tiendas y emprendimientos.",
  },
  {
    title: "Automatización con IA",
    description:
      "Chatbots, asistentes virtuales y workflows automáticos que reducen trabajo manual.",
  },
  {
    title: "Consultoría técnica",
    description:
      "Análisis de procesos y propuestas de soluciones digitales a medida.",
  },
];

export function Services() {
  return (
    <section id="servicios" className="border-b border-border">
      <ScrollReveal>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-2 text-[0.6875rem] font-sans uppercase tracking-[0.1em] text-text-muted">
            Servicios
          </p>
          <h2 className="font-serif text-2xl text-text-primary md:text-[1.75rem]">
            ¿Cómo puedo ayudarte?
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-lg bg-bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-serif text-lg font-semibold text-text-primary">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-description">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded bg-accent px-6 py-2.5 text-sm text-bg-primary transition-opacity hover:opacity-80"
            >
              ¿Tenés un proyecto en mente? →
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add app/components/Services.tsx
git commit -m "feat: add Services section with 3 cards and WhatsApp CTA"
```

---

## Task 11: Stack Section

**Files:**
- Create: `app/components/Stack.tsx`

- [ ] **Step 1: Create Stack component**

Create `app/components/Stack.tsx`:

```tsx
import { ScrollReveal } from "./ScrollReveal";

const STACK_CATEGORIES = [
  {
    title: "AI & LLMs",
    items: ["Claude API", "LangChain", "OpenAI/Gemini", "MCP"],
  },
  {
    title: "Backend",
    items: ["Python", "FastAPI", "REST APIs", "Java"],
  },
  {
    title: "Frontend",
    items: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Three.js"],
  },
  {
    title: "Automation",
    items: ["n8n", "Slack/Jira", "WhatsApp API", "Apify"],
  },
  {
    title: "Data",
    items: ["Supabase", "pgvector", "ChromaDB", "SQL", "MercadoPago"],
  },
];

export function Stack() {
  return (
    <section className="border-b border-border">
      <ScrollReveal>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-2 text-[0.6875rem] font-sans uppercase tracking-[0.1em] text-text-muted">
            Stack
          </p>
          <h2 className="font-serif text-2xl text-text-primary md:text-[1.75rem]">
            Tecnologías
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {STACK_CATEGORIES.map((cat) => (
              <div key={cat.title}>
                <h3 className="font-serif text-sm font-semibold text-text-primary">
                  {cat.title}
                </h3>
                <ul className="mt-2 space-y-1">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-text-description"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add app/components/Stack.tsx
git commit -m "feat: add Stack section with categorized tech skills"
```

---

## Task 12: Certifications Section

**Files:**
- Create: `app/components/Certs.tsx`

- [ ] **Step 1: Create Certs component**

Create `app/components/Certs.tsx`:

```tsx
import { certifications } from "@/data/certifications";
import { ScrollReveal } from "./ScrollReveal";

export function Certs() {
  const highlighted = certifications.filter((c) => c.provider === "anthropic");
  const secondary = certifications.filter((c) => c.provider !== "anthropic");

  return (
    <section className="border-b border-border">
      <ScrollReveal>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-2 text-[0.6875rem] font-sans uppercase tracking-[0.1em] text-text-muted">
            Certificaciones
          </p>

          {/* Anthropic — highlighted */}
          <div className="mt-6 flex flex-wrap gap-2">
            {highlighted.map((cert) => {
              const Tag = cert.url ? "a" : "span";
              return (
                <Tag
                  key={cert.name}
                  {...(cert.url
                    ? { href: cert.url, target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="rounded bg-accent px-3 py-1.5 text-sm font-semibold text-bg-primary transition-opacity hover:opacity-80"
                >
                  Anthropic: {cert.name}
                </Tag>
              );
            })}
          </div>

          {/* Secondary */}
          <div className="mt-4 flex flex-wrap gap-2">
            {secondary.map((cert) => {
              const Tag = cert.url ? "a" : "span";
              const providerLabel =
                cert.provider.charAt(0).toUpperCase() + cert.provider.slice(1);
              return (
                <Tag
                  key={cert.name}
                  {...(cert.url
                    ? { href: cert.url, target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="rounded bg-bg-card px-3 py-1 text-xs text-text-description transition-opacity hover:opacity-80"
                >
                  {providerLabel}: {cert.name}
                </Tag>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add app/components/Certs.tsx
git commit -m "feat: add Certifications section with highlighted Anthropic badges"
```

---

## Task 13: Footer with Social Icons

**Files:**
- Create: `app/components/Footer.tsx`

- [ ] **Step 1: Create Footer component**

Create `app/components/Footer.tsx`:

```tsx
const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/josedaluz",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/josedaluz",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:contacto@josedaluz.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/54XXXXXXXXXX",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div>
          <p className="text-sm font-medium text-text-primary">
            © 2026 José De La Luz
          </p>
          <p className="text-xs text-text-secondary">
            Disponible para freelance, consultoría y proyectos web
          </p>
        </div>

        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add app/components/Footer.tsx
git commit -m "feat: add Footer with SVG social icons"
```

---

## Task 14: Assemble Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace page.tsx with full assembly**

Replace `app/page.tsx` with:

```tsx
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Services } from "./components/Services";
import { Stack } from "./components/Stack";
import { Certs } from "./components/Certs";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Services />
        <Stack />
        <Certs />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create placeholder project images directory**

```bash
mkdir -p C:/Users/PC/jose/portafolio/public/projects
```

- [ ] **Step 3: Verify build succeeds**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

Expected: Full build with all components resolving. No errors.

- [ ] **Step 4: Verify dev server renders the full page**

```bash
cd C:/Users/PC/jose/portafolio
npm run dev
```

Open `http://localhost:3000` — all sections should be visible: Nav, Hero, Projects (with filter tabs), Services, Stack, Certs, Footer. Dark mode toggle should work. Kill server after verifying.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add app/page.tsx
git commit -m "feat: assemble full single-page portfolio"
```

---

## Task 15: Responsive Polish + Final Touches

**Files:**
- Modify: various components as needed for responsive edge cases

- [ ] **Step 1: Verify responsive behavior at all breakpoints**

```bash
cd C:/Users/PC/jose/portafolio
npm run dev
```

Check in browser dev tools at:
- 375px (mobile)
- 768px (tablet)
- 1024px (desktop)
- 1440px (large desktop)

Verify: Nav hamburger on mobile, single column grids on mobile, proper spacing at all sizes.

- [ ] **Step 2: Run production build**

```bash
cd C:/Users/PC/jose/portafolio
npm run build
```

Expected: Build succeeds with no warnings. Check output for page sizes.

- [ ] **Step 3: Run production preview**

```bash
cd C:/Users/PC/jose/portafolio
npm run start
```

Verify: Full page renders correctly in production mode. Dark mode persists across page refresh. Parallax smooth. Scroll animations fire. Kill server.

- [ ] **Step 4: Final commit**

```bash
cd C:/Users/PC/jose/portafolio
git add -A
git commit -m "feat: responsive polish and production-ready portfolio"
```

---

## Task 16: Gitignore and Cleanup

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Ensure .gitignore includes brainstorm files**

Append to `.gitignore`:

```
# Superpowers brainstorm sessions
.superpowers/
```

- [ ] **Step 2: Commit**

```bash
cd C:/Users/PC/jose/portafolio
git add .gitignore
git commit -m "chore: add .superpowers to gitignore"
```
