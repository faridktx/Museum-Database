import { FaHeadset, FaTicketAlt, FaClock } from "react-icons/fa";
import { Link } from "wouter";

export function SupportCenter() {
  return (
    <div className="support-page container" style={{ paddingTop: "120px", maxWidth: "880px", margin: "0 auto" }}>
      <div className="support-header" style={{ marginBottom: '2rem' }}>
        <p className="breadcrumb">Home / Support / Support Center</p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '700' }}>Support Center</h1>
        <p className="support-subtitle" style={{ fontSize: '1.1rem', color: '#555' }}>
          Our support center provides multiple ways to receive assistance—from submitting tickets to exploring our self-service resources.
        </p>
      </div>

      <section className="support-section card hover-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div className="icon-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <FaHeadset size={26} style={{ color: '#334155' }} />
          <h2 style={{ margin: 0, fontSize: '1.45rem' }}>Speak With Support</h2>
        </div>
        <p style={{ fontSize: '0.98rem', color: '#333' }}>
          Our team is available Monday through Friday from 9:00am to 6:00pm CST. If you require direct assistance, use the live chat feature or <Link className="custom-link" href="/support-contact">submit a contact request</Link>.
        </p>
      </section>

      <section className="support-section card hover-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div className="icon-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <FaTicketAlt size={22} style={{ color: '#166534' }} />
          <h2 style={{ margin: 0, fontSize: '1.45rem' }}>Report an Issue</h2>
        </div>
        <p style={{ fontSize: '0.98rem', color: '#333' }}>
          For technical issues, bugs, or account concerns, please report the issue to our support team using our secure form.
        </p>
        <Link className="custom-link" href="/support-report">Submit a Report →</Link>
      </section>

      <section className="support-section card hover-card" style={{ padding: '2rem' }}>
        <div className="icon-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <FaClock size={20} style={{ color: '#ea580c' }} />
          <h2 style={{ margin: 0, fontSize: '1.45rem' }}>Resources & Guides</h2>
        </div>
        <p style={{ fontSize: '0.98rem', color: '#333' }}>
          Prefer to resolve issues on your own? Explore our library of support tools and documentation:
        </p>
        <ul className="styled-list">
          <li><Link className="custom-link" href="/support-docs">Platform Documentation</Link></li>
          <li><Link className="custom-link" href="/support-tutorials">Tutorial Library</Link></li>
          <li><Link className="custom-link" href="/support-knowledge">Knowledge Base Articles</Link></li>
        </ul>
      </section>

      <section className="support-section card hover-card" style={{ padding: '2rem', marginTop: '2rem' }}>
        <div className="icon-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.45rem' }}>More Ways to Get Help</h2>
        </div>
        <p style={{ fontSize: '0.98rem', color: '#333' }}>
          You can also:
        </p>
        <ul className="styled-list">
          <li>Check your existing tickets in the dashboard</li>
          <li>Join a support webinar or orientation session</li>
          <li>Subscribe to updates for downtime and maintenance windows</li>
        </ul>
      </section>
    </div>
  );
}
