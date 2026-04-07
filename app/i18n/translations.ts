export const translations = {
  es: {
    nav: {
      projects: 'Proyectos',
      services: 'Servicios',
      stack: 'Stack',
      contact: 'Contacto',
      whatsapp: 'WhatsApp',
    },
    hero: {
      label: '// SISTEMA ACTIVO',
      heading: 'Construyo soluciones con <strong>AI</strong> que resuelven <strong>problemas reales</strong>.',
      cta1: 'Ver proyectos ↓',
      cta2: 'Contactame',
    },
    projects: {
      label: 'PROYECTOS',
      all: 'Todos',
      ai: 'IA & Automatización',
      web: 'Websites',
      pipeline: 'PRÓXIMOS PROYECTOS',
      comingSoon: 'Próximamente',
      demo: 'Demo',
      github: 'GitHub',
      video: 'Video',
      items: {
        forge: { title: 'FORGE', pitch: 'Un solo desarrollador gestionando múltiples proyectos en paralelo. FORGE coordina agentes de IA que planifican, ejecutan y monitorean tareas de desarrollo de forma autónoma.' },
        hsp70: { title: 'HSP-70 Gestión Fitness', pitch: 'Un gimnasio gestionaba socios, pagos y rutinas en planillas y cuadernos. Hoy opera con un sistema integral que centraliza toda la administración.' },
        pepeai: { title: 'PepeAI', pitch: 'Compañero de memoria con IA para personas con demencia. Un asistente de voz que conversa usando recuerdos reales del paciente, genera métricas cognitivas y emocionales medibles, y alerta al cuidador en tiempo real ante episodios de agitación.' },
        'tracker-servicios': { title: 'Tracker de Servicios', pitch: 'Gestión de servicios y gastos vía WhatsApp con Twilio. Un agente de IA interpreta comandos en lenguaje natural, actualiza precios, registra gastos y consulta totales — todo sincronizado en tiempo real con Google Sheets.' },
        'ecommerce-ropa': { title: 'E-commerce de ropa informal' },
        oftalmologia: { title: 'Centro de Oftalmología' },
        'consultorio-odontologico': { title: 'Consultorio Odontológico' },
        essen: { title: 'Tienda Essen' },
        'productos-3d': { title: 'Productos 3D' },
        artesanias: { title: 'Artesanías & Deco' },
        'websites-locales': { title: 'Websites para Locales' },
      },
    },
    services: {
      label: 'SERVICIOS',
      ai: {
        title: 'Automatización con IA',
        desc: '¿Tu equipo pierde horas en tareas repetitivas? Construyo agentes inteligentes que automatizan procesos y ahorran tiempo.',
      },
      web: {
        title: 'Desarrollo Web & Apps',
        desc: 'Sitios web y aplicaciones modernas, rápidas y optimizadas. Desde landing pages hasta plataformas complejas.',
      },
      consulting: {
        title: 'Consultoría Técnica',
        desc: '¿No sabés por dónde empezar con IA? Te ayudo a encontrar la solución correcta para tu negocio.',
      },
      cta: 'Hablemos de tu proyecto →',
    },
    stack: {
      label: 'TECNOLOGÍAS',
      certs: 'CERTIFICACIONES',
    },
    footer: {
      copy: '© 2024 Jose Da Luz · Córdoba, Argentina',
      available: 'Disponible para proyectos freelance',
    },
  },
  en: {
    nav: {
      projects: 'Projects',
      services: 'Services',
      stack: 'Stack',
      contact: 'Contact',
      whatsapp: 'WhatsApp',
    },
    hero: {
      label: '// SYSTEM ACTIVE',
      heading: 'I build <strong>AI</strong> solutions that solve <strong>real problems</strong>.',
      cta1: 'View projects ↓',
      cta2: 'Contact me',
    },
    projects: {
      label: 'PROJECTS',
      all: 'All',
      ai: 'AI & Automation',
      web: 'Websites',
      pipeline: 'UPCOMING PROJECTS',
      comingSoon: 'Coming Soon',
      demo: 'Demo',
      github: 'GitHub',
      video: 'Video',
      items: {
        forge: { title: 'FORGE', pitch: 'A single developer managing multiple projects in parallel. FORGE coordinates AI agents that plan, execute, and monitor development tasks autonomously.' },
        hsp70: { title: 'HSP-70 Fitness Management', pitch: 'A gym managed members, payments, and routines on spreadsheets and notebooks. Now it runs on an integrated system that centralizes all administration.' },
        pepeai: { title: 'PepeAI', pitch: 'AI-powered memory companion for people with dementia. A voice assistant that converses using real patient memories, generates measurable cognitive and emotional metrics, and alerts caregivers in real time during agitation episodes.' },
        'tracker-servicios': { title: 'Service Tracker', pitch: 'Service and expense management via WhatsApp with Twilio. An AI agent interprets natural language commands, updates pricing, logs expenses, and queries totals — all synced in real time with Google Sheets.' },
        'ecommerce-ropa': { title: 'Casual Clothing E-commerce' },
        oftalmologia: { title: 'Ophthalmology Center' },
        'consultorio-odontologico': { title: 'Dental Office' },
        essen: { title: 'Essen Store' },
        'productos-3d': { title: '3D Products' },
        artesanias: { title: 'Crafts & Decor' },
        'websites-locales': { title: 'Local Business Websites' },
      },
    },
    services: {
      label: 'SERVICES',
      ai: {
        title: 'AI Automation',
        desc: 'Is your team wasting hours on repetitive tasks? I build intelligent agents that automate processes and save time.',
      },
      web: {
        title: 'Web & App Development',
        desc: 'Modern, fast, optimized websites and applications. From landing pages to complex platforms.',
      },
      consulting: {
        title: 'Technical Consulting',
        desc: "Don't know where to start with AI? I help you find the right solution for your business.",
      },
      cta: "Let's talk about your project →",
    },
    stack: {
      label: 'TECHNOLOGIES',
      certs: 'CERTIFICATIONS',
    },
    footer: {
      copy: '© 2024 Jose Da Luz · Córdoba, Argentina',
      available: 'Available for freelance projects',
    },
  },
} as const;

export type Lang = 'es' | 'en';
export type TranslationKeys = (typeof translations)[Lang];
