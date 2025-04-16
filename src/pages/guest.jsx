import { Operations } from "../components/operations";
import "../components/components.css";

export function GuestOperations() {
  const operations = [
    {
      title: "Remove Guest",
      description: "Remove an existing guest from the collection",
      icon: "❌",
      path: "/dashboard/guest/remove",
    },
    {
      title: "Modify Guest",
      description: "Update information for an existing guest",
      icon: "✏️",
      path: "/dashboard/guest/modify",
    },
  ];

  return <Operations title="Guest" operations={operations} />;
}
