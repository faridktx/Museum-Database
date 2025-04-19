import { Hero } from "../components/home/hero";
import { Features } from "../components/home/features";
import { Overview } from "../components/home/overview";
import { Contact } from "../components/home/contact";
import { ExhibitCarousel } from "../components/ExhibitCarousel";
import { TestimonialsSlider } from "../components/TestimonialsSlider";
import { MembershipPerks } from "../components/MembershipPerks";
import { EventsList } from "../components/EventsList";
import { ArtifactGallery } from "../components/ArtifactGallery";

export function Home() {
  return (
    <main>
      <Hero />
      <section id="featured">
        <ExhibitCarousel />
      </section>
      <TestimonialsSlider />
      <MembershipPerks />
      <EventsList />
      <Features />
      <Overview />

      <Contact />
    </main>
  );
}
