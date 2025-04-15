import { FaBook } from "react-icons/fa";

export function SupportKnowledge() {
  const topics = [
    {
      title: "Understanding Artifact Management",
      summary: "Learn how to add, update, and categorize artifacts in your digital museum archive.",
    },
    {
      title: "Setting User Permissions",
      summary: "Configure role-based access controls for different team members across the platform.",
    },
    {
      title: "Integrating with External Systems",
      summary: "Connect your museum database to third-party APIs, CRMs, and analytics tools.",
    },
    {
      title: "Optimizing Search and Filters",
      summary: "Improve discoverability by setting up advanced filtering and search configurations.",
    },
    {
      title: "Membership Tier Customization",
      summary: "Build and tailor your membership programs with flexible tiered benefits.",
    },
    {
      title: "Tracking Exhibit Performance",
      summary: "Use dashboards and reports to monitor foot traffic, interest, and feedback.",
    }
  ];

  return (
    <div className="support-page container" style={{ paddingTop: "120px", maxWidth: "880px", margin: "0 auto" }}>
      <div className="support-header" style={{ marginBottom: '2rem' }}>
        <p className="breadcrumb">Home / Support / Knowledge Base</p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '700' }}>Knowledge Base</h1>
        <p className="support-subtitle" style={{ fontSize: '1.1rem', color: '#555' }}>
          Browse articles, walkthroughs, and in-depth explanations on how to get the most from the Curio Collection platform.
        </p>
      </div>

      <section className="support-section card hover-card" style={{ padding: '2rem' }}>
        <div className="icon-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Articles</h2>
        </div>

        <div className="knowledge-list">
          {topics.map((topic, idx) => (
            <div key={idx} className="knowledge-article" style={{
              background: '#fdfdfd',
              padding: '1.5rem',
              borderRadius: '10px',
              marginBottom: '1.2rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{topic.title}</h3>
              <p style={{ fontSize: '0.95rem', color: '#444' }}>{topic.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
