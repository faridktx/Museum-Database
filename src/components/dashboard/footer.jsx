import "../components.css";
import { Link } from "wouter";

export function DashboardFooter() {
  return (
    <footer className="dashboard-footer">
      <div className="container">
        <div className="dashboard-footer-grid">
          <div className="dashboard-footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link href="/support-docs">Documentation</Link>
              </li>
              <li>
                <Link href="/support-center">Support Center</Link>
              </li>
              <li>
                <Link href="/support-account">Account Settings</Link>
              </li>
            </ul>
          </div>
          <div className="dashboard-footer-section">
            <h3>Resources</h3>
            <ul>
              <li>
                <Link href="/support-tutorials">Tutorials</Link>
              </li>
              <li>
                <Link href="/support-api">API Documentation</Link>
              </li>
              <li>
                <Link href="/support-faq">FAQ</Link>
              </li>
            </ul>
          </div>
          <div className="dashboard-footer-section">
            <h3>Support</h3>
            <ul>
              <li>
                <Link href="/support-contact">Contact Support</Link>
              </li>
              <li>
                <Link href="/support-knowledge">Knowledge Base</Link>
              </li>
              <li>
                <Link href="/support-report">Report an Issue</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="dashboard-footer-bottom">
          <p>
            © 2025 The Curio Collection. <a href="/terms">Terms</a> ·{" "}
            <a href="/privacy">Privacy</a> · <a href="/security">Security</a>
          </p>
        </div>
      </div>
    </footer>
  );
}