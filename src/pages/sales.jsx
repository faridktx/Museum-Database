import { Operations } from "../components/operations";
import "../components/components.css";

export function SalesOperations() {
  const operations = [
    {
      title: "Add Sale",
      description: "Add a new sale to the museum collection",
      icon: "➕",
      path: "/dashboard/sales/add",
    },
    {
      title: "Remove Sale",
      description: "Remove an existing sale from the collection",
      icon: "❌",
      path: "/dashboard/sales/remove",
    },
    {
      title: "Modify Sale",
      description: "Update information for an existing sale",
      icon: "✏️",
      path: "/dashboard/sales/modify",
    },
  ];

  return <Operations title="Sale" operations={operations} />;
}
