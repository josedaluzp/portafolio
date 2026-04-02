"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-border">
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-bg-primary"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
      >
        <p className="mb-4 text-[0.6875rem] font-sans uppercase tracking-[0.1em] text-text-muted">
          Desarrollador · IA &amp; Web · Córdoba, AR
        </p>

        <h1
          className="font-serif text-3xl leading-tight tracking-tight md:text-[2.5rem] md:leading-[1.2] text-text-primary max-w-3xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          Desarrollo soluciones digitales con inteligencia artificial para
          negocios que quieren crecer.
        </h1>

        <p className="mt-4 text-base text-text-secondary md:text-lg">
          Websites para negocios · Automatización con IA · Agentes inteligentes
        </p>
      </motion.div>
    </section>
  );
}
