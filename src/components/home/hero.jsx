import '../components.css';

export function Hero() {
  return (
    <section className="hero section">
      <div className="container">
        <div className="hero-content">
          <h1>Professional Museum Collection Management</h1>
          <p className="hero-subtitle">
            Streamline your museum's artifact tracking and collection management with MuseoCore's comprehensive digital solution.
          </p>
          <a href="#contact" className="button">Schedule a Demo</a>
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
