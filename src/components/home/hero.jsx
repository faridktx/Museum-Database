import "../components.css";

export function Hero() {
  return (
    <section className="hero-apple">
      <div className="hero-apple-overlay blur-bg">
  <h1>The Curio Collection</h1>
  <p>
    Discover the wonders of art, culture, and history — all in one place.
  </p>
  <a href="/plan-your-visit" className="button">
  Plan Your Visit
</a>
</div>
<a href="#featured" className="scroll-arrow" aria-label="Scroll to Featured Exhibits">
  ↓
</a>
      <img
        className="hero-apple-bg"
        src="https://images.unsplash.com/photo-1491156855053-9cdff72c7f85?auto=format&fit=crop&w=1600&q=80"
        alt="Museum Hero"
      />
    </section>
  );
}