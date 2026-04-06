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
