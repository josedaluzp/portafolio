"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

const WHATSAPP_URL =
  "https://wa.me/542975027842?text=Hola%20Jos%C3%A9%2C%20vi%20tu%20portfolio%20y%20me%20interesa%20consultar%20sobre%20tus%20servicios.";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
      style={{ padding: "2rem" }}
    >
      {/* Animated gradient orb */}
      <div
        className="hero-orb"
        aria-hidden="true"
        style={{ left: "50%", top: "50%" }}
      />

      {/* Content */}
      <div className="relative z-[1]" style={{ maxWidth: 750 }}>
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="mb-6"
          style={{
            fontFamily: "var(--font-space-grotesk), monospace",
            fontSize: "0.72rem",
            fontWeight: 400,
            letterSpacing: "0.18em",
            color: "var(--cyan)",
          }}
        >
          {t.hero.label}
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="hero-heading"
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.4rem)",
            fontWeight: 300,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: "var(--text)",
            marginBottom: "2.5rem",
          }}
          dangerouslySetInnerHTML={{ __html: t.hero.heading }}
        />

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <a
            href="#proyectos"
            className="hero-btn-primary"
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.06em",
              padding: "0.75rem 2rem",
              border: "1px solid var(--cyan)",
              background: "transparent",
              color: "var(--cyan)",
              borderRadius: 8,
              transition: "all 0.3s ease",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {t.hero.cta1}
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn-ghost"
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.06em",
              padding: "0.75rem 2rem",
              border: "1px solid var(--border-card)",
              background: "transparent",
              color: "var(--text-secondary)",
              borderRadius: 8,
              transition: "all 0.3s ease",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {t.hero.cta2}
          </a>
        </motion.div>
      </div>

      {/* Scoped styles for orb animation & hover states & strong gradient */}
      <style jsx global>{`
        .hero-orb {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(0, 212, 255, 0.08) 0%,
            rgba(212, 168, 83, 0.04) 40%,
            transparent 70%
          );
          filter: blur(80px);
          animation: heroOrbFloat 8s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        [data-theme="light"] .hero-orb {
          background: radial-gradient(
            circle,
            rgba(0, 119, 170, 0.06) 0%,
            rgba(184, 134, 11, 0.03) 40%,
            transparent 70%
          );
        }

        @keyframes heroOrbFloat {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          33% {
            transform: translate(-45%, -55%) scale(1.1);
          }
          66% {
            transform: translate(-55%, -45%) scale(0.95);
          }
        }

        .hero-heading strong {
          font-weight: 700;
          background: linear-gradient(
            135deg,
            var(--cyan),
            var(--gold),
            var(--gold-end)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-btn-primary:hover {
          background: var(--cyan-dim) !important;
          box-shadow: 0 0 20px var(--cyan-glow),
            inset 0 0 20px rgba(0, 212, 255, 0.05);
          transform: translateY(-2px);
        }

        .hero-btn-ghost:hover {
          border-color: var(--text-secondary) !important;
          color: var(--text) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
