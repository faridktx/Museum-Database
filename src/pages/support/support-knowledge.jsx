import { FaBook } from "react-icons/fa";
import styles from "./support.module.css";

export function SupportKnowledge() {
  const topics = [
    {
      title: "Understanding Artifact Management",
      summary:
        "Learn how to add, update, and categorize artifacts in your digital museum archive.",
    },
    {
      title: "Setting User Permissions",
      summary:
        "Configure role-based access controls for different team members across the platform.",
    },
    {
      title: "Integrating with External Systems",
      summary:
        "Connect your museum database to third-party APIs, CRMs, and analytics tools.",
    },
    {
      title: "Optimizing Search and Filters",
      summary:
        "Improve discoverability by setting up advanced filtering and search configurations.",
    },
    {
      title: "Membership Tier Customization",
      summary:
        "Build and tailor your membership programs with flexible tiered benefits.",
    },
    {
      title: "Tracking Exhibit Performance",
      summary:
        "Use dashboards and reports to monitor foot traffic, interest, and feedback.",
    },
  ];

  return (
    <div className={styles["support-page"]}>
      <div className={styles["support-header"]} style={{ marginBottom: "2rem" }}>
        <p className={styles["breadcrumb"]}>Home / Support / Knowledge Base</p>
        <h1>Knowledge Base</h1>
        <p className={styles["support-subtitle"]}>
          Browse articles, walkthroughs, and in-depth explanations on how to get
          the most from the Curio Collection platform.
        </p>
      </div>

      <section className={styles["support-section"]}>
        <div className={styles["icon-header"]}>
          <FaBook size={20} />
          <h2>Articles</h2>
        </div>

        <div className={styles["knowledge-list"]}>
          {topics.map((topic, idx) => (
            <div key={idx} className={styles["knowledge-article"]}>
              <h3>{topic.title}</h3>
              <p>{topic.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
