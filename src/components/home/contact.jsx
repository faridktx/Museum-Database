import "../components.css";

export function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <h2 className="section-title">Get Started with MuseoCore</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Transform Your Collection Management</h3>
            <p>
              Ready to elevate your museum's collection management? Contact us
              today to schedule a personalized demo of MuseoCore's capabilities.
            </p>
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf"
              alt="Professional Museum Environment"
              loading="lazy"
            />
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="institution">Institution</label>
              <input type="text" id="institution" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="4" required></textarea>
            </div>
            <button type="submit" className="button" style={{ width: "100%" }}>
              Request Demo
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
