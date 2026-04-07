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
    id: "forge",
    title: "FORGE",
    pitch: "Un solo desarrollador gestionando múltiples proyectos en paralelo. FORGE coordina agentes de IA que planifican, ejecutan y monitorean tareas de desarrollo de forma autónoma.",
    category: "ai",
    stack: ["Claude API", "Python", "FastAPI", "SQLite", "WebSockets"],
    image: "", // placeholder until real screenshot is added
    status: "live",
  },
  {
    id: "hsp70",
    title: "HSP-70 Gestión Fitness",
    pitch: "Un gimnasio gestionaba socios, pagos y rutinas en planillas y cuadernos. Hoy opera con un sistema integral que centraliza toda la administración.",
    category: "ai",
    stack: ["FastAPI", "React", "SQLAlchemy", "MercadoPago", "Tailwind"],
    image: "", // placeholder until real screenshot is added
    repoUrl: "https://github.com/josedaluzp/hsp70-gestion",
    status: "live",
  },
  {
    id: "pepeai",
    title: "PepeAI",
    pitch: "Pacientes con demencia que pierden conexión con su historia personal. Pepe es un asistente de voz con IA que les habla usando sus propios recuerdos, con alertas emocionales para el cuidador.",
    category: "ai",
    stack: ["React Native", "FastAPI", "Supabase", "LangChain", "Expo"],
    image: "/projects/pepeai.png",
    repoUrl: "https://github.com/josedaluzp/pepeai",
    status: "wip",
  },
  {
    id: "tracker-servicios",
    title: "Tracker de Servicios",
    pitch: "Clientes que no recibían actualizaciones sobre el estado de sus servicios. Ahora reciben notificaciones automáticas por SMS y llamadas en cada etapa.",
    category: "ai",
    stack: ["n8n", "Gemini API", "Twilio", "Google Sheets"],
    image: "/projects/tracker-servicios.png",
    status: "live",
  },
  {
    id: "ecommerce-ropa",
    title: "E-commerce de ropa informal",
    pitch: "Tienda online con catálogo, carrito, pagos integrados y gestión de stock.",
    category: "web",
    stack: ["Tiendanube", "MercadoPago", "CSS personalizado"],
    image: "", // placeholder until real screenshot is added
    status: "coming",
  },
  {
    id: "oftalmologia",
    title: "Centro de Oftalmología",
    pitch: "Catálogo de lentes, solicitud de visitas y consultas online para centro oftalmológico.",
    category: "web",
    stack: ["Next.js", "Tailwind", "Google Calendar API"],
    image: "", // placeholder until real screenshot is added
    status: "coming",
  },
  {
    id: "consultorio-odontologico",
    title: "Consultorio Odontológico",
    pitch: "Turnero online con selección de especialistas, solicitud de visitas y perfil del consultorio.",
    category: "web",
    stack: ["Next.js", "Tailwind", "Supabase", "Google Calendar API"],
    image: "", // placeholder until real screenshot is added
    status: "coming",
  },
  {
    id: "essen",
    title: "Tienda Essen",
    pitch: "Catálogo de productos Essen con fichas técnicas, precios y pedidos online.",
    category: "web",
    stack: ["Tiendanube", "MercadoPago", "CSS personalizado"],
    image: "", // placeholder until real screenshot is added
    status: "coming",
  },
  {
    id: "productos-3d",
    title: "Productos 3D",
    pitch: "Catálogo de veladores, copas del mundo y personalizados en impresión 3D con precios y contacto por WhatsApp.",
    category: "web",
    stack: ["Next.js", "Tailwind", "WhatsApp API"],
    image: "", // placeholder until real screenshot is added
    status: "coming",
  },
  {
    id: "artesanias",
    title: "Artesanías & Deco",
    pitch: "Tienda de velas aromáticas, difusores, lámparas nórdicas y mantas con catálogo y contacto directo.",
    category: "web",
    stack: ["Next.js", "Tailwind", "WhatsApp API"],
    image: "", // placeholder until real screenshot is added
    status: "coming",
  },
  {
    id: "websites-locales",
    title: "Websites para Locales",
    pitch: "Desarrollo de presencia web para negocios y emprendimientos que aún no tienen su página.",
    category: "web",
    stack: ["Next.js", "Tailwind", "Vercel"],
    image: "", // placeholder until real screenshot is added
    status: "coming",
  },
];
