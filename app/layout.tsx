import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "José De La Luz — Desarrollador IA & Web",
  description:
    "Desarrollo soluciones digitales con inteligencia artificial para negocios. Websites, automatización, agentes inteligentes. Córdoba, Argentina.",
  metadataBase: new URL("https://josedaluz.com"),
  openGraph: {
    title: "José De La Luz — Desarrollador IA & Web",
    description:
      "Desarrollo soluciones digitales con inteligencia artificial para negocios. Websites, automatización, agentes inteligentes.",
    url: "https://josedaluz.com",
    siteName: "José De La Luz",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "José De La Luz — Desarrollador IA & Web",
    description:
      "Desarrollo soluciones digitales con inteligencia artificial para negocios. Websites, automatización, agentes inteligentes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable} ${outfit.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans"><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
