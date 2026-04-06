"use client";

import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "../i18n/LanguageContext";

const WHATSAPP_URL = "https://wa.me/5493517561122";

const NAV_SECTIONS = [
  { href: "#proyectos", key: "projects" as const },
  { href: "#servicios", key: "services" as const },
  { href: "#stack", key: "stack" as const },
  { href: "#contacto", key: "contact" as const },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { lang, setLang, t } = useLanguage();

  // Close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleLang = () => {
    setLang(lang === "es" ? "en" : "es");
  };

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50"
      style={{
        background: "var(--bg-nav)",
        backdropFilter: "var(--glass-blur)",
        WebkitBackdropFilter: "var(--glass-blur)",
        borderBottom: "1px solid var(--border-nav)",
        transition: "background-color 0.4s ease, border-color 0.4s ease",
      }}
    >
      {/* Main bar */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <a
          href="#"
          className="text-[1.4rem] font-bold tracking-[0.04em]"
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            color: "var(--text)",
            transition: "color 0.3s",
          }}
        >
          JDL
          <span
            className="ml-px align-super text-[0.5em]"
            style={{ color: "var(--cyan)" }}
          >
            .
          </span>
        </a>

        {/* Center nav links -- desktop */}
        <ul className="hidden items-center gap-8 md:flex list-none">
          {NAV_SECTIONS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="nav-link text-xs font-medium uppercase tracking-[0.14em]"
              >
                {t.nav[link.key]}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side controls -- desktop */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="lang-toggle-btn rounded text-[0.68rem] tracking-[0.1em]"
            style={{
              color: "var(--text-muted)",
              background: "none",
              border: "1px solid var(--border-card)",
              padding: "0.3rem 0.7rem",
              borderRadius: "4px",
              transition: "all 0.25s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.borderColor = "var(--border-card-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.borderColor = "var(--border-card)";
            }}
          >
            <span style={{ color: lang === "es" ? "var(--cyan)" : undefined }}>
              ES
            </span>
            {" | "}
            <span style={{ color: lang === "en" ? "var(--cyan)" : undefined }}>
              EN
            </span>
          </button>

          {/* Theme toggle wrapper */}
          <div
            className="flex items-center justify-center"
            style={{
              width: "36px",
              height: "36px",
              border: "1px solid var(--border-card)",
              borderRadius: "8px",
              transition: "all 0.25s",
            }}
          >
            <ThemeToggle />
          </div>

          {/* WhatsApp CTA */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider"
            style={{
              color: "var(--bg)",
              background: "var(--cyan)",
              padding: "0.5rem 1.2rem",
              borderRadius: "6px",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t.nav.whatsapp}
          </a>
        </div>

        {/* Mobile right side: theme toggle + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <div
            className="flex items-center justify-center"
            style={{
              width: "36px",
              height: "36px",
              border: "1px solid var(--border-card)",
              borderRadius: "8px",
            }}
          >
            <ThemeToggle />
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            className="flex items-center justify-center p-1 text-2xl"
            style={{
              color: "var(--text)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {menuOpen ? "\u2715" : "\u2630"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="flex flex-col md:hidden"
          style={{
            padding: "1rem 2rem 1.5rem",
            borderTop: "1px solid var(--border-nav)",
          }}
        >
          {NAV_SECTIONS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="nav-link block text-[0.8rem] uppercase tracking-[0.1em]"
              style={{
                padding: "0.75rem 0",
                color: "var(--text-secondary)",
                borderBottom: "1px solid var(--border-card)",
              }}
            >
              {t.nav[link.key]}
            </a>
          ))}

          {/* Language toggle in mobile */}
          <button
            onClick={toggleLang}
            className="text-left text-[0.8rem] uppercase tracking-[0.1em]"
            style={{
              padding: "0.75rem 0",
              color: "var(--text-secondary)",
              background: "none",
              border: "none",
              borderBottom: "1px solid var(--border-card)",
              cursor: "pointer",
            }}
          >
            <span style={{ color: lang === "es" ? "var(--cyan)" : undefined }}>
              ES
            </span>
            {" | "}
            <span style={{ color: lang === "en" ? "var(--cyan)" : undefined }}>
              EN
            </span>
          </button>

          {/* WhatsApp link in mobile */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="nav-link block text-[0.8rem] uppercase tracking-[0.1em]"
            style={{
              padding: "0.75rem 0",
              color: "var(--text-secondary)",
            }}
          >
            WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
}
