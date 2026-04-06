'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Services } from "./components/Services";
import { Stack } from "./components/Stack";
import { Certs } from "./components/Certs";
import { Footer } from "./components/Footer";
import { LanguageProvider } from "./i18n";

const SplashScreen = dynamic(
  () => import('./components/SplashScreen/SplashScreen'),
  { ssr: false }
);

export default function Home() {
  const [showPortfolio, setShowPortfolio] = useState(false);

  if (!showPortfolio) {
    return <SplashScreen onComplete={() => setShowPortfolio(true)} />;
  }

  return (
    <LanguageProvider>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Services />
        <Stack />
        <Certs />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
