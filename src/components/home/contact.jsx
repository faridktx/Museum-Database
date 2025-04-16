import "../components.css";

export function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <h2 className="section-title">Contact The Curio Collection</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>We'd Love to Hear from You</h3>
            <p>
              Whether you have questions about exhibitions, upcoming events,
              group visits, or our educational programs, The Curio Collection
              welcomes your inquiries. Reach out and a member of our team will
              be in touch.
            </p>
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf"
              alt="Gallery at The Curio Collection"
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
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="4" required></textarea>
            </div>
            <button type="submit" className="button" style={{ width: "100%" }}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
