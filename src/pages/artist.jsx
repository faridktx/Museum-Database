import { Operations } from "../components/operations";
import "../components/components.css";

export function ArtistOperations() {
  const operations = [
    {
      title: "Add Artist",
      description: "Add a new artist to the museum collection",
      icon: "➕",
      path: "/dashboard/artist/add",
    },
    {
      title: "Remove Artist",
      description: "Remove an existing artist from the collection",
      icon: "❌",
      path: "/dashboard/artist/remove",
    },
    {
      title: "Modify Artist",
      description: "Update information for an existing artist",
      icon: "✏️",
      path: "/dashboard/artist/modify",
    },
  ];

  return <Operations title="Artist" operations={operations} />;
}
