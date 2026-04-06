"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { useLanguage } from "@/app/i18n";

type CategoryFilter = "all" | "ai" | "web";

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const { t } = useLanguage();

  const CATEGORIES: { key: CategoryFilter; label: string }[] = [
    { key: "all", label: t.projects.all },
    { key: "ai", label: t.projects.ai },
    { key: "web", label: t.projects.web },
  ];

  // Full cards: live + wip projects only
  const visibleProjects = projects.filter(
    (p) => p.status === "live" || p.status === "wip"
  );

  const filtered =
    activeCategory === "all"
      ? visibleProjects
      : visibleProjects.filter((p) => p.category === activeCategory);

  // Coming-soon projects for compact chips
  const comingProjects = projects.filter((p) => p.status === "coming");

  return (
    <motion.section
      id="proyectos"
      className="py-24"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-[1140px] px-8">
        {/* Section label */}
        <p
          className="mb-8 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            color: "var(--cyan)",
          }}
        >
          {t.projects.label}
        </p>

        {/* Category filter pills */}
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                ...(activeCategory === cat.key
                  ? {
                      background: "var(--cyan)",
                      color: "var(--bg)",
                      border: "1px solid var(--cyan)",
                    }
                  : {
                      background: "var(--pill-bg)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--pill-border)",
                    }),
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: i * 0.08,
                }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Coming-soon pipeline */}
        {comingProjects.length > 0 && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                color: "var(--cyan)",
              }}
            >
              {t.projects.pipeline}
            </p>

            <div className="flex flex-wrap gap-2">
              {comingProjects.map((project) => (
                <span
                  key={project.id}
                  className="rounded-full px-3 py-1.5 text-xs"
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    color: "var(--text-muted)",
                    border: "1px dashed var(--pill-border)",
                    background: "transparent",
                  }}
                >
                  {(t.projects.items as Record<string, { title: string }>)[project.id]?.title || project.title}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
