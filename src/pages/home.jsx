import { Hero } from "../components/home/hero";
import { Features } from "../components/home/features";
import { Overview } from "../components/home/overview";
import { Contact } from "../components/home/contact";

export function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Overview />
      <Contact />
    </main>
  );
}
