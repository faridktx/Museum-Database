import { FaPlayCircle } from "react-icons/fa";
import styles from "./support.module.css";

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
    <div className={styles["support-page"]}>
      <div className={styles["support-header"]} style={{ marginBottom: "2rem" }}>
        <p className={styles["breadcrumb"]}>Home / Support / Tutorials</p>
        <h1>Video Tutorials</h1>
        <p className={styles["support-subtitle"]}>
          Watch our curated tutorial videos to get started and learn how to get
          the most out of the platform.
        </p>
      </div>

      <section className={styles["support-section"]}>
        <div className={styles["icon-header"]}>
          <FaPlayCircle size={20} />
          <h2>Featured Tutorials</h2>
        </div>

        <div className={styles["tutorial-list"]}>
          {tutorials.map((item, idx) => (
            <div key={idx} className={styles["tutorial-card"]}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles["custom-link"]}
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
