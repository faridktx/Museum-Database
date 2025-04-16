import "../components.css";

export function Hero() {
  return (
    <section className="hero section">
      <div className="container">
        <div className="hero-content">
          <h1>Welcome to The Curio Collection</h1>
          <p className="hero-subtitle">
            Discover the wonders of art, culture, and history at The Curio
            Collection — a museum dedicated to preserving and showcasing
            humanity’s most intriguing artifacts.
          </p>
          <a href="#contact" className="button">
            Learn More
          </a>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1491156855053-9cdff72c7f85"
            alt="Museum Collection Display"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
