import { FaHeadset, FaTicketAlt, FaClock } from "react-icons/fa";
import { Link } from "wouter";
import styles from "./support.module.css";

export function SupportCenter() {
  return (
    <div className={styles["support-page"]}>
      <div
        className={styles["support-header"]}
        style={{ marginBottom: "2rem" }}
      >
        <p className={styles["breadcrumb"]}>Home / Support / Support Center</p>
        <h1>Support Center</h1>
        <p className={styles["support-subtitle"]}>
          Our support center provides multiple ways to receive assistance—from
          submitting tickets to exploring our self-service resources.
        </p>
      </div>

      <section className={styles["support-section"]}>
        <div className={styles["icon-header"]}>
          <FaHeadset size={26} />
          <h2>Speak With Support</h2>
        </div>
        <p>
          Our team is available Monday through Friday from 9:00am to 6:00pm CST.
          If you require direct assistance, use the live chat feature or{" "}
          <Link className={styles["custom-link"]} href="/support-contact">
            submit a contact request
          </Link>
          .
        </p>
      </section>

      <section className={styles["support-section"]}>
        <div className={styles["icon-header"]}>
          <FaTicketAlt size={22} />
          <h2>Report an Issue</h2>
        </div>
        <p>
          For technical issues, bugs, or account concerns, please report the
          issue to our support team using our secure form.
        </p>
        <Link className={styles["custom-link"]} href="/support-report">
          Submit a Report →
        </Link>
      </section>

      <section className={styles["support-section"]}>
        <div className={styles["icon-header"]}>
          <FaClock size={20} />
          <h2>Resources & Guides</h2>
        </div>
        <p>
          Prefer to resolve issues on your own? Explore our library of support
          tools and documentation:
        </p>
        <ul className={styles["styled-list"]}>
          <li>
            <Link className={styles["custom-link"]} href="/support-docs">
              Platform Documentation
            </Link>
          </li>
          <li>
            <Link className={styles["custom-link"]} href="/support-tutorials">
              Tutorial Library
            </Link>
          </li>
          <li>
            <Link className={styles["custom-link"]} href="/support-knowledge">
              Knowledge Base Articles
            </Link>
          </li>
        </ul>
      </section>

      <section
        className={styles["support-section"]}
        style={{ marginTop: "2rem" }}
      >
        <div className={styles["icon-header"]}>
          <h2>More Ways to Get Help</h2>
        </div>
        <p>You can also:</p>
        <ul className={styles["styled-list"]}>
          <li>Check your existing tickets in the dashboard</li>
          <li>Join a support webinar or orientation session</li>
          <li>Subscribe to updates for downtime and maintenance windows</li>
        </ul>
      </section>
    </div>
  );
}
