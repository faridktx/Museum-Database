import { useState } from "react";
import styles from "./support.module.css";

export function SupportReport() {
  const [form, setForm] = useState({ subject: "", details: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles["support-page"]}>
      <div className={styles["support-header"]} style={{ marginBottom: "2rem" }}>
        <p className={styles["breadcrumb"]}>Home / Support / Report an Issue</p>
        <h1>Report an Issue</h1>
        <p className={styles["support-subtitle"]}>
          Found a bug or error? Help us improve the platform by reporting any
          issues you’ve encountered.
        </p>
      </div>

      {submitted ? (
        <div className={styles["support-section"]}>
          <h2>✅ Report Submitted</h2>
          <p>
            Thank you for your feedback. Our team will investigate the issue as
            soon as possible.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={styles["support-section"]}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div className={styles["icon-header"]}>
            <h2>Submit a Report</h2>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="subject">Issue Subject</label>
            <input
              type="text"
              name="subject"
              id="subject"
              required
              value={form.subject}
              onChange={handleChange}
              className={styles["input"]}
            />
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="details">Details / Steps to Reproduce</label>
            <textarea
              name="details"
              id="details"
              rows="6"
              required
              value={form.details}
              onChange={handleChange}
              className={styles["textarea"]}
            ></textarea>
          </div>

          <button type="submit" className={`${styles["button"]} ${styles["primary-button"]}`}>
            Send Report
          </button>
        </form>
      )}
    </div>
  );
}