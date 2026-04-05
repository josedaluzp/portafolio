import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          card: "var(--bg-card)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          description: "var(--text-description)",
          tags: "var(--text-tags)",
        },
        border: {
          DEFAULT: "var(--border)",
        },
        accent: "var(--accent)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-subtle': {
          '0%, 100%': {
            borderColor: 'rgba(212,168,83,0.2)',
            transform: 'scale(1)',
          },
          '50%': {
            borderColor: 'rgba(212,168,83,0.5)',
            transform: 'scale(1.08)',
          },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease forwards',
        'bounce-subtle': 'bounce-subtle 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
