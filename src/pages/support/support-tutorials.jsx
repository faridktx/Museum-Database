import { FaPlayCircle } from "react-icons/fa";

export function SupportTutorials() {
  const tutorials = [
    {
      title: "Platform Overview",
      description:
        "A walkthrough of the platform’s key features and how to navigate your dashboard.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      title: "Adding a New Artifact",
      description:
        "Learn how to upload, categorize, and publish artifacts to your museum collection.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      title: "Setting Up Membership Tiers",
      description:
        "Step-by-step guide for creating, pricing, and promoting membership levels.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      title: "Generating Custom Reports",
      description:
        "How to build and export insightful reports using analytics filters and data views.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  ];

  return (
    <div
      className="support-page container"
      style={{ paddingTop: "120px", maxWidth: "880px", margin: "0 auto" }}
    >
      <div className="support-header" style={{ marginBottom: "2rem" }}>
        <p className="breadcrumb">Home / Support / Tutorials</p>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "700" }}>
          Video Tutorials
        </h1>
        <p
          className="support-subtitle"
          style={{ fontSize: "1.1rem", color: "#555" }}
        >
          Watch our curated tutorial videos to get started and learn how to get
          the most out of the platform.
        </p>
      </div>

      <section
        className="support-section card hover-card"
        style={{ padding: "2rem" }}
      >
        <div
          className="icon-header"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Featured Tutorials</h2>
        </div>

        <div className="tutorial-list">
          {tutorials.map((item, idx) => (
            <div
              key={idx}
              className="tutorial-card"
              style={{
                background: "#fdfdfd",
                padding: "1.5rem",
                borderRadius: "10px",
                marginBottom: "1.2rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "transform 0.2s ease",
                cursor: "pointer",
              }}
            >
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#444",
                  marginBottom: "0.75rem",
                }}
              >
                {item.description}
              </p>
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="custom-link"
              >
                ▶ Watch Tutorial
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
