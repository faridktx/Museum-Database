import { Operations } from "../components/operations";
import "../components/components.css";

export function ExhibitOperations() {
  const operations = [
    {
      title: "Add Exhibit",
      description: "Add a new exhibit to the museum collection",
      icon: "➕",
      path: "/dashboard/exhibit/add",
    },
    {
      title: "Remove Exhibit",
      description: "Remove an existing exhibit from the collection",
      icon: "❌",
      path: "/dashboard/exhibit/remove",
    },
    {
      title: "Modify Exhibit",
      description: "Update information for an existing exhibit",
      icon: "✏️",
      path: "/dashboard/exhibit/modify",
    },
  ];

  return <Operations title="Exhibit" operations={operations} />;
}
