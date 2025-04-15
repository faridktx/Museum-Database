import { useState } from "react";
import { FaBug } from "react-icons/fa";

export function SupportReport() {
  const [form, setForm] = useState({ subject: "", details: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Integrate backend/EmailJS logic here
    setSubmitted(true);
  };

  return (
    <div className="support-page container" style={{ paddingTop: "120px", maxWidth: "720px", margin: "0 auto" }}>
      <div className="support-header" style={{ marginBottom: '2rem' }}>
        <p className="breadcrumb">Home / Support / Report an Issue</p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '700' }}>Report an Issue</h1>
        <p className="support-subtitle" style={{ fontSize: '1.1rem', color: '#555' }}>
          Found a bug or error? Help us improve the platform by reporting any issues you’ve encountered.
        </p>
      </div>

      {submitted ? (
        <div className="support-section card" style={{ padding: '2rem' }}>
          <h2>✅ Report Submitted</h2>
          <p>Thank you for your feedback. Our team will investigate the issue as soon as possible.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="support-section card hover-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="icon-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ margin: 0 }}>Submit a Report</h2>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Issue Subject</label>
            <input type="text" name="subject" id="subject" required value={form.subject} onChange={handleChange} className="input" />
          </div>

          <div className="form-group">
            <label htmlFor="details">Details / Steps to Reproduce</label>
            <textarea name="details" id="details" rows="6" required value={form.details} onChange={handleChange} className="textarea"></textarea>
          </div>

          <button type="submit" className="button primary-button">Send Report</button>
        </form>
      )}
    </div>
  );
}
