import "../components.css";

export function DashboardFooter() {
  return (
    <footer className="dashboard-footer">
      <div className="container">
        <div className="dashboard-footer-grid">
          <div className="dashboard-footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/documentation">Documentation</a>
              </li>
              <li>
                <a href="/support">Support Center</a>
              </li>
              <li>
                <a href="/settings">Account Settings</a>
              </li>
            </ul>
          </div>
          <div className="dashboard-footer-section">
            <h3>Resources</h3>
            <ul>
              <li>
                <a href="/tutorials">Tutorials</a>
              </li>
              <li>
                <a href="/api-docs">API Documentation</a>
              </li>
              <li>
                <a href="/faq">FAQ</a>
              </li>
            </ul>
          </div>
          <div className="dashboard-footer-section">
            <h3>Support</h3>
            <ul>
              <li>
                <a href="/contact-support">Contact Support</a>
              </li>
              <li>
                <a href="/knowledge-base">Knowledge Base</a>
              </li>
              <li>
                <a href="/report-issue">Report an Issue</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="dashboard-footer-bottom">
          <p>
            © 2025 MuseoCore. <a href="/terms">Terms</a> ·{" "}
            <a href="/privacy">Privacy</a> · <a href="/security">Security</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
