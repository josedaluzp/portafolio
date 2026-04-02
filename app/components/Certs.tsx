import { certifications } from "@/data/certifications";
import { ScrollReveal } from "./ScrollReveal";

export function Certs() {
  const highlighted = certifications.filter((c) => c.provider === "anthropic");
  const secondary = certifications.filter((c) => c.provider !== "anthropic");

  return (
    <section className="border-b border-border">
      <ScrollReveal>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-2 text-[0.6875rem] font-sans uppercase tracking-[0.1em] text-text-muted">
            Certificaciones
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {highlighted.map((cert) => {
              const Tag = cert.url ? "a" : "span";
              return (
                <Tag
                  key={cert.name}
                  {...(cert.url ? { href: cert.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="rounded bg-accent px-3 py-1.5 text-sm font-semibold text-bg-primary transition-opacity hover:opacity-80"
                >
                  Anthropic: {cert.name}
                </Tag>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {secondary.map((cert) => {
              const Tag = cert.url ? "a" : "span";
              const providerLabel = cert.provider.charAt(0).toUpperCase() + cert.provider.slice(1);
              return (
                <Tag
                  key={cert.name}
                  {...(cert.url ? { href: cert.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="rounded bg-bg-card px-3 py-1 text-xs text-text-description transition-opacity hover:opacity-80"
                >
                  {providerLabel}: {cert.name}
                </Tag>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
