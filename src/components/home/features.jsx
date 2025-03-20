import '../components.css';

export function Features() {
  const features = [
    {
      title: "Digital Cataloging",
      description: "Efficiently catalog and organize your entire collection with our intuitive digital system."
    },
    {
      title: "Asset Tracking",
      description: "Real-time tracking of artifacts, loans, and exhibitions with comprehensive audit trails."
    },
    {
      title: "Conservation Management",
      description: "Monitor and schedule conservation tasks while maintaining detailed condition reports."
    },
    {
      title: "Research Access",
      description: "Facilitate research with easy access to collection data and high-resolution imagery."
    }
  ];

  return (
    <section id="features" className="features section">
      <div className="container">
        <h2 className="section-title">Key Features</h2>
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
