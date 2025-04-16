import "../components.css";

export function Overview() {
  return (
    <section id="overview" className="overview section">
      <div className="container">
        <div className="overview-grid">
          <div className="overview-content">
            <h2>About The Curio Collection</h2>
            <p>
              The Curio Collection is dedicated to preserving and showcasing
              unique artifacts that reflect the wonder of human creativity
              across cultures and time. Our mission is to inspire curiosity,
              spark imagination, and foster a deeper appreciation for the
              stories objects can tell.
            </p>
            <ul className="overview-list">
              <li>Rotating exhibitions of rare and eclectic pieces</li>
              <li>Permanent collections spanning centuries</li>
              <li>
                Programs for education, research, and community engagement
              </li>
              <li>Collaborations with artists, scholars, and institutions</li>
              <li>Preservation efforts to protect cultural heritage</li>
            </ul>
          </div>
          <div className="overview-image">
            <img
              src="https://images.unsplash.com/photo-1620928572438-075c466c48da"
              alt="Exhibit inside The Curio Collection"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
