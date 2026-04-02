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
                  transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
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
