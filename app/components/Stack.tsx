'use client';

import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

const STACK_CATEGORIES = [
  { title: "AI & LLMs", items: ["Claude API", "LangChain", "OpenAI/Gemini", "MCP"] },
  { title: "Backend", items: ["Python", "FastAPI", "REST APIs", "Java"] },
  { title: "Frontend", items: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Three.js"] },
  { title: "Automatización", items: ["n8n", "Slack/Jira", "WhatsApp API", "Apify"] },
  { title: "Data", items: ["Supabase", "pgvector", "ChromaDB", "SQL", "MercadoPago"] },
];

const CERTS = [
  { name: "Claude Code in Action", provider: "anthropic", label: "Claude Code in Action (Anthropic)" },
  { name: "Agent Skills", provider: "anthropic", label: "Agent Skills (Anthropic)" },
  { name: "AI Fluency", provider: "anthropic", label: "AI Fluency (Anthropic)" },
  { name: "Python", provider: "udemy", label: "Python (Udemy)" },
  { name: "React", provider: "platzi", label: "React (Platzi)" },
  { name: "FastAPI", provider: "udemy", label: "FastAPI (Udemy)" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Stack() {
  const { t } = useLanguage();

  return (
    <section id="stack" className="py-24">
      <div className="max-w-[1140px] mx-auto px-8">
        {/* Section label */}
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-10"
          style={{ color: "var(--cyan)" }}>
          {t.stack.label}
        </p>

        {/* Category rows */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {STACK_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              variants={itemVariants}
              className={i < STACK_CATEGORIES.length - 1 ? "mb-6" : ""}
            >
              <p className="text-sm font-medium mb-3"
                style={{ color: "var(--text-secondary)" }}>
                {cat.title}
              </p>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 text-xs rounded-full"
                    style={{
                      background: "var(--pill-bg)",
                      border: "1px solid var(--pill-border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="my-8 h-px" style={{ background: "var(--divider)" }} />

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: "var(--text-secondary)" }}>
            {t.stack.certs}
          </p>
          <div className="flex flex-wrap gap-2">
            {CERTS.map((cert) => {
              const isAnthropicCert = cert.provider === "anthropic";
              return (
                <span
                  key={cert.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full"
                  style={{
                    background: "var(--pill-bg)",
                    border: isAnthropicCert
                      ? "1px solid var(--gold)"
                      : "1px solid var(--pill-border)",
                    color: isAnthropicCert
                      ? "var(--gold)"
                      : "var(--text-secondary)",
                  }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                    aria-hidden="true"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  {cert.label}
                </span>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
