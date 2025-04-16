import "../components.css";

export function Hero() {
  return (
    <section className="hero section">
      <div className="container">
        <div className="hero-content">
          <h1>Welcome to The Curio Collection</h1>
          <p className="hero-subtitle">
            Explore and manage artifacts from The Curio Collection — your
            gateway to curated history and digital preservation.
          </p>
          <a href="#contact" className="button">
            Learn More
          </a>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1491156855053-9cdff72c7f85"
            alt="Museum Collection Interface"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
