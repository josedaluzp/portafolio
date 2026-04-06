"use client";

import Image from "next/image";
import { Project } from "@/data/projects";
import { useLanguage } from "@/app/i18n";

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { t } = useLanguage();

  return (
    <div
      className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-[2px]"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        boxShadow: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-card-hover)";
        e.currentTarget.style.boxShadow = "var(--shadow-card)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-card)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image area */}
      <div className="relative aspect-video w-full overflow-hidden">
        {project.image && project.status !== "coming" ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center">
            {/* Gradient placeholder */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, var(--cyan-dim) 0%, transparent 60%)",
              }}
            />
            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        <h3
          className="text-lg font-bold"
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            color: "var(--text)",
          }}
        >
          {project.title}
        </h3>

        <p
          className="mt-1.5 text-sm leading-relaxed"
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            color: "var(--text-secondary)",
          }}
        >
          {project.pitch}
        </p>

        {/* Stack tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full px-2 py-0.5 text-xs"
              style={{
                background: "var(--pill-bg)",
                border: "1px solid var(--pill-border)",
                color: "var(--text-secondary)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Link buttons */}
        {(project.demoUrl || project.repoUrl || project.videoUrl) && (
          <div className="mt-4 flex gap-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={t.projects.demo}
                className="flex items-center justify-center rounded-lg p-2 transition-colors"
                style={{
                  background: "var(--pill-bg)",
                  border: "1px solid var(--pill-border)",
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-card-hover)";
                  e.currentTarget.style.color = "var(--cyan)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--pill-border)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <ExternalLinkIcon />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={t.projects.github}
                className="flex items-center justify-center rounded-lg p-2 transition-colors"
                style={{
                  background: "var(--pill-bg)",
                  border: "1px solid var(--pill-border)",
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-card-hover)";
                  e.currentTarget.style.color = "var(--cyan)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--pill-border)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <GitHubIcon />
              </a>
            )}
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={t.projects.video}
                className="flex items-center justify-center rounded-lg p-2 transition-colors"
                style={{
                  background: "var(--pill-bg)",
                  border: "1px solid var(--pill-border)",
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-card-hover)";
                  e.currentTarget.style.color = "var(--cyan)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--pill-border)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <VideoIcon />
              </a>
            )}
          </div>
        )}
      </div>

      {/* "Proximamente" overlay for coming-soon projects */}
      {project.status === "coming" && (
        <div
          className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]"
          style={{ background: "rgba(5,5,8,0.65)" }}
        >
          <span
            className="rounded-full px-4 py-1.5 text-xs font-medium"
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              color: "var(--text-secondary)",
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
            }}
          >
            {t.projects.comingSoon}
          </span>
        </div>
      )}
    </div>
  );
}
