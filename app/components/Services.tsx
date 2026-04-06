"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

const WHATSAPP_URL = "https://wa.me/5493517561122";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const labelVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function AIIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--cyan)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4V11h3a3 3 0 0 1 3 3v1.6c1.2.6 2 1.9 2 3.4a4 4 0 0 1-8 0c0-1.5.8-2.8 2-3.4V14a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1.6c1.2.6 2 1.9 2 3.4a4 4 0 0 1-8 0c0-1.5.8-2.8 2-3.4V14a3 3 0 0 1 3-3h3V9.4C8.8 8.8 8 7.5 8 6a4 4 0 0 1 4-4z" />
    </svg>
  );
}

function WebIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--cyan)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ConsultingIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--cyan)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M9 10h.01M12 10h.01M15 10h.01" />
    </svg>
  );
}

export function Services() {
  const { t } = useLanguage();

  const services = [
    { key: "ai", data: t.services.ai, Icon: AIIcon },
    { key: "web", data: t.services.web, Icon: WebIcon },
    { key: "consulting", data: t.services.consulting, Icon: ConsultingIcon },
  ] as const;

  return (
    <section id="servicios" className="py-24">
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
        {/* Section label */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={labelVariants}
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--cyan)",
            marginBottom: "3rem",
          }}
        >
          {t.services.label}
        </motion.p>

        {/* Cards grid */}
        <motion.div
          className="services-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          {services.map(({ key, data, Icon }) => (
            <motion.div
              key={key}
              className="service-card"
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Icon wrapper */}
              <div className="service-icon-wrap">
                <Icon />
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "var(--text)",
                  marginBottom: "0.75rem",
                }}
              >
                {data.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  color: "var(--text-secondary)",
                }}
              >
                {data.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* WhatsApp CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={labelVariants}
          style={{ textAlign: "center", marginTop: "3rem" }}
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="services-cta-btn"
          >
            {t.services.cta}
          </a>
        </motion.div>
      </div>

      <style jsx global>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
        }

        .service-card {
          background: var(--bg-card);
          border: 1px solid var(--border-card);
          border-radius: 16px;
          padding: 2rem;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: border-color 0.35s cubic-bezier(0.23, 1, 0.32, 1),
            box-shadow 0.35s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .service-card:hover {
          border-color: var(--border-card-hover);
          box-shadow: var(--shadow-card, 0 4px 24px rgba(0, 0, 0, 0.18)),
            0 0 30px var(--cyan-glow, rgba(0, 212, 255, 0.12));
        }

        .service-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: var(--cyan-dim, rgba(0, 212, 255, 0.08));
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          filter: var(--icon-glow, drop-shadow(0 0 6px rgba(0, 212, 255, 0.5)));
          transition: transform 0.3s ease;
        }
        .service-card:hover .service-icon-wrap {
          transform: scale(1.08);
        }

        .services-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-space-grotesk), sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: var(--cyan);
          padding: 0.8rem 2rem;
          border: 1px solid var(--cyan);
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .services-cta-btn:hover {
          background: var(--cyan-dim, rgba(0, 212, 255, 0.08));
          box-shadow: 0 0 20px var(--cyan-glow, rgba(0, 212, 255, 0.2));
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
