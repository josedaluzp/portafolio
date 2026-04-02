import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Services } from "./components/Services";
import { Stack } from "./components/Stack";
import { Certs } from "./components/Certs";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Services />
        <Stack />
        <Certs />
      </main>
      <Footer />
    </>
  );
}
