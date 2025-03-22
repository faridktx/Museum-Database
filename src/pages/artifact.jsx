import { Operations } from "../components/operations";
import "../components/components.css";

export function ArtifactOperations() {
  const operations = [
    {
      title: "Add Artifact",
      description: "Add a new artifact to the museum collection",
      icon: "➕",
      path: "/login/artifact/add",
    },
    {
      title: "Remove Artifact",
      description: "Remove an existing artifact from the collection",
      icon: "❌",
      path: "/login/artifact/remove",
    },
    {
      title: "Modify Artifact",
      description: "Update information for an existing artifact",
      icon: "✏️",
      path: "/login/artifact/modify",
    },
  ];

  return <Operations title="Artifact" operations={operations} />;
}
