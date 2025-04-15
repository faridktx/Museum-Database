import { Link } from "wouter";
import { FaBookOpen, FaCompass, FaLightbulb } from "react-icons/fa";

export function SupportDocumentation() {
  return (
    <div className="support-page container" style={{ paddingTop: '120px', maxWidth: '760px', margin: '0 auto' }}>
      <div className="support-header">
        <p className="breadcrumb">Home / Support / Documentation</p>
        <h1>Documentation</h1>
        <p className="support-subtitle">
          Your central source for understanding features, functions, and technical capabilities of the Curio Collection platform.
        </p>
      </div>

      <section className="support-section card hover-card">
        <div className="icon-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaCompass size={24} />
          <h2 style={{ margin: 0 }}>Getting Started</h2>
        </div>
        <ul className="styled-list">
          <li><Link href="/support-tutorials">Installing & Accessing the Platform</Link></li>
          <li><Link href="/support-account">Setting Up Your Account</Link></li>
          <li><Link href="/support-api">API Authentication Guide</Link></li>
        </ul>
      </section>

      <section className="support-section card hover-card">
        <div className="icon-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaBookOpen size={24} />
          <h2 style={{ margin: 0 }}>Core Concepts</h2>
        </div>
        <ul className="styled-list">
          <li><Link href="/support-docs">Working with Artifacts</Link></li>
          <li><Link href="/support-docs">Managing Exhibits and Artists</Link></li>
          <li><Link href="/support-docs">Permissions & Role-based Access</Link></li>
        </ul>
      </section>

      <section className="support-section card hover-card">
        <div className="icon-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaLightbulb size={24} />
          <h2 style={{ margin: 0 }}>Advanced Topics</h2>
        </div>
        <ul className="styled-list">
          <li><Link href="/support-api">API Endpoints Reference</Link></li>
          <li><Link href="/support-docs">Custom Report Generation</Link></li>
          <li><Link href="/support-docs">Integrating External Systems</Link></li>
        </ul>
      </section>

      <footer className="support-footer" style={{ marginTop: '2rem' }}>
        <p>
          Still need help? Visit our <Link href="/support-knowledge">Knowledge Base</Link> or <Link href="/support-contact">Contact Support</Link>.
        </p>
      </footer>
    </div>
  );
}