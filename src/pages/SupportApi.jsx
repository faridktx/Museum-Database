import { Link } from "wouter";
import { FaKey, FaCodeBranch, FaShieldAlt } from "react-icons/fa";

export function SupportApi() {
  return (
    <div className="support-page container" style={{ paddingTop: "120px" }}>
      <div className="support-header">
        <p className="breadcrumb">Home / Support / API Documentation</p>
        <h1>API Documentation</h1>
        <p className="support-subtitle">
          Learn how to access, authenticate, and use the Curio Collection API to
          power your integrations with security and flexibility.
        </p>
      </div>

      <section className="support-section card hover-card">
        <div className="icon-header">
          <FaKey size={24} />
          <h2>Authentication</h2>
        </div>
        <p>
          To interact with our API, include your personal bearer token in the
          Authorization header of every request. Tokens are required for all
          endpoints.
        </p>
        <div className="code-block">
          <pre>GET /api/artifacts Authorization: Bearer YOUR_API_KEY</pre>
        </div>
        <p>
          You can view and regenerate your API keys anytime from your{" "}
          <strong>Developer Settings</strong> page.
        </p>
      </section>

      <section className="support-section card hover-card">
        <div className="icon-header">
          <FaCodeBranch size={24} />
          <h2>Core Endpoints</h2>
        </div>
        <p>
          These endpoints allow you to manage artifacts, artists, employees, and
          exhibits. Each accepts standard REST methods.
        </p>
        <ul className="styled-list">
          <li>
            <code>GET /api/artifacts</code> — Retrieve all artifacts
          </li>
          <li>
            <code>POST /api/artifacts</code> — Create a new artifact
          </li>
          <li>
            <code>GET /api/artists</code> — List all artists
          </li>
          <li>
            <code>PUT /api/exhibits/:id</code> — Update an exhibit by ID
          </li>
          <li>
            <code>DELETE /api/employees/:id</code> — Remove an employee record
          </li>
        </ul>
      </section>

      <section className="support-section card hover-card">
        <div className="icon-header">
          <FaShieldAlt size={24} />
          <h2>Security Best Practices</h2>
        </div>
        <p>
          To maintain the safety of your data and integrations, please follow
          these best practices:
        </p>
        <ul className="styled-list">
          <li>🔐 Never expose your API key in front-end/public code.</li>
          <li>🌐 Always use HTTPS for secure transmission.</li>
          <li>♻️ Rotate keys regularly and deactivate unused ones.</li>
          <li>
            🎯 Scope access per role to limit exposure of sensitive endpoints.
          </li>
        </ul>
      </section>

      <footer className="support-footer">
        <p>
          Still need help with the API?{" "}
          <Link href="/support-contact">Contact Support</Link> or explore more
          in the <Link href="/support-knowledge">Knowledge Base</Link>.
        </p>
      </footer>
    </div>
  );
}
