"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
      className="text-text-primary hover:text-text-secondary transition-colors text-lg"
    >
      {theme === "light" ? "☽" : "☀"}
    </button>
  );
}
