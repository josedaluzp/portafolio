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
    pitch: "Plataforma de coordinación multi-agente con dashboard de observabilidad en tiempo real. Tesis de ingeniería.",
    category: "ai",
    stack: ["Claude API", "FastAPI", "SQLite", "MCP"],
    image: "", // placeholder until real screenshot is added
    repoUrl: "https://github.com/josedaluz/pm-agente",
    status: "live",
  },
  {
    id: "hsp70",
    title: "HSP-70 WhatsApp Bot",
    pitch: "Bot de automatización para gestión de gimnasios vía WhatsApp. Solución replicable como producto.",
    category: "ai",
    stack: ["n8n", "Supabase", "Kapso", "WhatsApp API"],
    image: "", // placeholder until real screenshot is added
    repoUrl: "https://github.com/josedaluz/hsp70",
    status: "live",
  },
  {
    id: "rag",
    title: "RAG Pipeline",
    pitch: "Sistema de recuperación de información sobre documentos con arquitectura hexagonal. Búsqueda semántica en tiempo real.",
    category: "ai",
    stack: ["LangChain", "FastAPI", "Supabase pgvector", "Gemini"],
    image: "", // placeholder until real screenshot is added
    repoUrl: "https://github.com/josedaluz/rag-pipeline",
    status: "live",
  },
  {
    id: "jira",
    title: "Jira Automation Orchestrator",
    pitch: "Workflow end-to-end: Slack command → Jira project → Tempo tracking → Google Sheets reports con notificaciones automáticas.",
    category: "ai",
    stack: ["n8n", "Jira", "Tempo", "Slack", "Google Sheets"],
    image: "", // placeholder until real screenshot is added
    status: "live",
  },
  {
    id: "ecommerce-ropa",
    title: "E-commerce de ropa informal",
    pitch: "Tienda online con catálogo, carrito, pagos integrados y gestión de stock.",
    category: "web",
    stack: ["Next.js", "Tailwind", "MercadoPago", "Supabase"],
    image: "", // placeholder until real screenshot is added
    status: "coming",
  },
  {
    id: "oftalmologia",
    title: "Centro de Oftalmología",
    pitch: "Website institucional con turnos online, equipo médico y servicios.",
    category: "web",
    stack: ["Next.js", "Tailwind", "Google Calendar API"],
    image: "", // placeholder until real screenshot is added
    status: "coming",
  },
];
