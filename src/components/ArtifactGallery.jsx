import { useEffect, useState } from "react";
import "./ArtifactGallery.css";
import { apiFetch } from "./utils";
import { useUser } from "@clerk/clerk-react";

export function ArtifactGallery() {
  const { user } = useUser();
  const [artifacts, setArtifacts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    const loadArtifacts = async () => {
      const response = await apiFetch("/api/getartifacts/", "GET", user.id);
      if (response.success) {
        setArtifacts(response.data);
      }
    };
    loadArtifacts();
  }, [user]);

  const themes = [
    "All",
    ...new Set(artifacts.map((a) => a.theme || "Unknown")),
  ];

  const filtered =
    selectedFilter === "All"
      ? artifacts
      : artifacts.filter((a) => a.theme === selectedFilter);

  return (
    <section className="artifact-gallery-section">
      <h2 className="section-title">Artifact Gallery</h2>

      <div className="filter-buttons">
        {themes.map((theme, i) => (
          <button
            key={i}
            className={`filter-btn ${selectedFilter === theme ? "active" : ""}`}
            onClick={() => setSelectedFilter(theme)}
          >
            {theme}
          </button>
        ))}
      </div>

      <div className="artifact-grid">
        {filtered.map((artifact, i) => (
          <div key={i} className="artifact-card">
            <img
              src={
                artifact.image_url ||
                "https://images.unsplash.com/photo-1604475470078-3a7fdb0b9931"
              }
              alt={artifact.artifact_name}
              className="artifact-img"
            />
            <h3>{artifact.artifact_name}</h3>
            <p className="artifact-theme">
              {artifact.theme || "Unknown Theme"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
