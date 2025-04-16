import { Operations } from "../components/operations";
import "../components/components.css";

export function InventoryOperations() {
  const operations = [
    {
      title: "Add Inventory",
      description: "Add a new inventory to the museum collection",
      icon: "➕",
      path: "/dashboard/inventory/add",
    },
    {
      title: "Remove Inventory",
      description: "Remove an existing inventory from the collection",
      icon: "❌",
      path: "/dashboard/inventory/remove",
    },
    {
      title: "Modify Inventory",
      description: "Update information for an existing inventory",
      icon: "✏️",
      path: "/dashboard/inventory/modify",
    },
  ];

  return <Operations title="Inventory" operations={operations} />;
}
