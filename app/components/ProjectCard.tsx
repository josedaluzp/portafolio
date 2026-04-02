import Image from "next/image";
import { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-video w-full bg-border relative">
        {project.image && project.status !== "coming" ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted text-sm">
            {project.status === "coming" ? "" : "Screenshot"}
          </div>
        )}
      </div>

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

        {(project.demoUrl || project.repoUrl || project.videoUrl) && (
          <div className="mt-3 flex gap-3 text-xs">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                className="text-text-primary underline hover:text-text-secondary transition-colors">
                Demo
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                className="text-text-primary underline hover:text-text-secondary transition-colors">
                GitHub
              </a>
            )}
            {project.videoUrl && (
              <a href={project.videoUrl} target="_blank" rel="noopener noreferrer"
                className="text-text-primary underline hover:text-text-secondary transition-colors">
                Video
              </a>
            )}
          </div>
        )}
      </div>

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
