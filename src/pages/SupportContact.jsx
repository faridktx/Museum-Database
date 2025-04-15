import { useState } from "react";
import { Link } from "wouter";
import { FaPaperPlane } from "react-icons/fa";

export function SupportContact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: "service_b96q6sn",
        template_id: "template_ztghanp",
        user_id: "YTs5GW2nyxzFuwnmn",
        template_params: {
          name: form.name,
          email: form.email,
          message: form.message,
        },
      }),
    })
      .then((res) => {
        if (res.ok) setSubmitted(true);
        else alert("Failed to send message. Please try again.");
      })
      .catch(() => alert("There was an error connecting to the email service."));
    setSubmitted(true);
  };

  return (
    <div className="support-page container" style={{ paddingTop: '120px', maxWidth: '760px', margin: '0 auto' }}>
      <div className="support-header">
        <p className="breadcrumb">Home / Support / Contact Support</p>
        <h1>Contact Support</h1>
        <p className="support-subtitle">
          Reach out to our team for personalized assistance. We're here to help resolve your issue.
        </p>
      </div>

      {submitted ? (
        <div className="support-section card">
          <h2>✅ Message Sent</h2>
          <p>Thank you for contacting us. Our team will get back to you shortly.</p>
          <p>
            In the meantime, check out the <Link href="/support-knowledge">Knowledge Base</Link> or return to the <Link href="/support-center">Support Center</Link>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="support-section card hover-card contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="icon-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaPaperPlane size={24} />
            <h2 style={{ margin: 0 }}>Send Us a Message</h2>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" name="name" id="name" required value={form.name} onChange={handleChange} className="input" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" name="email" id="email" required value={form.email} onChange={handleChange} className="input" />
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea name="message" id="message" rows="6" required value={form.message} onChange={handleChange} className="textarea"></textarea>
          </div>

          <button type="submit" className="button primary-button">Send Message</button>
        </form>
      )}

      <footer className="support-footer" style={{ marginTop: '2rem' }}>
        <p>
          Prefer self-service? Visit our <Link href="/support-knowledge">Knowledge Base</Link> or return to the <Link href="/support-docs">Documentation</Link>.
        </p>
      </footer>
    </div>
  );
}
