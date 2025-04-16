import "../components.css";

export function Features() {
  const features = [
    {
      title: "Curated Exhibitions",
      description:
        "Explore thoughtfully curated exhibitions featuring rare artifacts and compelling narratives from around the world.",
    },
    {
      title: "Permanent Collection",
      description:
        "Discover the core collection of unique objects spanning centuries of artistic and cultural history.",
    },
    {
      title: "Educational Programs",
      description:
        "Participate in engaging lectures, workshops, and school programs designed for all ages.",
    },
    {
      title: "Research & Archives",
      description:
        "Access a growing archive of historical materials and collaborate with scholars through our research initiatives.",
    },
  ];

  return (
    <section id="features" className="features section">
      <div className="container">
        <h2 className="section-title">
          What You'll Find at The Curio Collection
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
