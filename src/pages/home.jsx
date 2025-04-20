import { Hero } from "../components/home/hero";
import { Features } from "../components/home/features";
import { Overview } from "../components/home/overview";
import { Contact } from "../components/home/contact";
import { ExhibitCarousel } from "../components/exhibit-carousel";
import { TestimonialsSlider } from "../components/testimonials-slider";
import { MembershipPerks } from "../components/membership-perks.";
import { EventsList } from "../components/events-list";

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
