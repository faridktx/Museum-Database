import { Link } from "wouter";
import { FaBookOpen, FaCompass, FaLightbulb } from "react-icons/fa";
import styles from "./support.module.css";

export function SupportDocumentation() {
  return (
    <div className={styles["support-page"]}>
      <div className={styles["support-header"]}>
        <p className={styles["breadcrumb"]}>Home / Support / Documentation</p>
        <h1>Documentation</h1>
        <p className={styles["support-subtitle"]}>
          Your central source for understanding features, functions, and
          technical capabilities of the Curio Collection platform.
        </p>
      </div>

      <section className={styles["support-section"]}>
        <div className={styles["icon-header"]}>
          <FaCompass size={24} />
          <h2>Getting Started</h2>
        </div>
        <ul className={styles["styled-list"]}>
          <li>
            <Link href="/support-tutorials">Installing & Accessing the Platform</Link>
          </li>
          <li>
            <Link href="/support-account">Setting Up Your Account</Link>
          </li>
          <li>
            <Link href="/support-api">API Authentication Guide</Link>
          </li>
        </ul>
      </section>

      <section className={styles["support-section"]}>
        <div className={styles["icon-header"]}>
          <FaBookOpen size={24} />
          <h2>Core Concepts</h2>
        </div>
        <ul className={styles["styled-list"]}>
          <li><Link href="/support-docs">Working with Artifacts</Link></li>
          <li><Link href="/support-docs">Managing Exhibits and Artists</Link></li>
          <li><Link href="/support-docs">Permissions & Role-based Access</Link></li>
        </ul>
      </section>

      <section className={styles["support-section"]}>
        <div className={styles["icon-header"]}>
          <FaLightbulb size={24} />
          <h2>Advanced Topics</h2>
        </div>
        <ul className={styles["styled-list"]}>
          <li><Link href="/support-api">API Endpoints Reference</Link></li>
          <li><Link href="/support-docs">Custom Report Generation</Link></li>
          <li><Link href="/support-docs">Integrating External Systems</Link></li>
        </ul>
      </section>

      <footer className={styles["support-footer"]}>
        <p>
          Still need help? Visit our{" "}
          <Link href="/support-knowledge">Knowledge Base</Link> or{" "}
          <Link href="/support-contact">Contact Support</Link>.
        </p>
      </footer>
    </div>
  );
}
