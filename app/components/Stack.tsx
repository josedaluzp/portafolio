import { ScrollReveal } from "./ScrollReveal";

const STACK_CATEGORIES = [
  { title: "AI & LLMs", items: ["Claude API", "LangChain", "OpenAI/Gemini", "MCP"] },
  { title: "Backend", items: ["Python", "FastAPI", "REST APIs", "Java"] },
  { title: "Frontend", items: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Three.js"] },
  { title: "Automation", items: ["n8n", "Slack/Jira", "WhatsApp API", "Apify"] },
  { title: "Data", items: ["Supabase", "pgvector", "ChromaDB", "SQL", "MercadoPago"] },
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
                    <li key={item} className="text-sm text-text-description">
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
