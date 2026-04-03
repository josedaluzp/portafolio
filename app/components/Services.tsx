import { ScrollReveal } from "./ScrollReveal";

const WHATSAPP_URL =
  "https://wa.me/542975027842?text=Hola%20Jos%C3%A9%2C%20vi%20tu%20portfolio%20y%20me%20interesa%20consultar%20sobre%20tus%20servicios.";

const SERVICES = [
  {
    title: "Websites & E-commerce",
    description: "Diseño y desarrollo de sitios web profesionales para negocios, clínicas, tiendas y emprendimientos.",
  },
  {
    title: "Automatización con IA",
    description: "Chatbots, asistentes virtuales y workflows automáticos que reducen trabajo manual.",
  },
  {
    title: "Consultoría técnica",
    description: "Análisis de procesos y propuestas de soluciones digitales a medida.",
  },
];

export function Services() {
  return (
    <section id="servicios" className="border-b border-border">
      <ScrollReveal>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-2 text-[0.6875rem] font-sans uppercase tracking-[0.1em] text-text-muted">
            Servicios
          </p>
          <h2 className="font-serif text-2xl text-text-primary md:text-[1.75rem]">
            ¿Cómo puedo ayudarte?
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-lg bg-bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-serif text-lg font-semibold text-text-primary">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-description">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded bg-accent px-6 py-2.5 text-sm text-bg-primary transition-opacity hover:opacity-80"
            >
              ¿Tenés un proyecto en mente? →
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
