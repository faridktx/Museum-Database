import '../components.css';

export function Overview() {
  return (
    <section id="overview" className="overview section">
      <div className="container">
        <div className="overview-grid">
          <div className="overview-content">
            <h2>Advanced Collection Tracking</h2>
            <p>
              MuseoCore provides comprehensive tracking capabilities for museums of all sizes. 
              Our system helps you maintain detailed records of acquisitions, loans, 
              conservation treatments, and exhibition histories.
            </p>
            <ul className="overview-list">
              <li>Detailed artifact documentation</li>
              <li>Location and movement tracking</li>
              <li>Conservation history logging</li>
              <li>Exhibition management</li>
              <li>Customizable metadata fields</li>
            </ul>
          </div>
          <div className="overview-image">
            <img 
              src="https://images.unsplash.com/photo-1620928572438-075c466c48da"
              alt="Collection Management Interface"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
