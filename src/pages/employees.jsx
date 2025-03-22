import { Operations } from "../components/operations";
import "../components/components.css";

export function EmployeeOperations() {
  const operations = [
    {
      title: "Add Employee",
      description: "Add a new employee to the museum collection",
      icon: "➕",
      path: "/login/employee/add",
    },
    {
      title: "Remove Employee",
      description: "Remove an existing employee from the collection",
      icon: "❌",
      path: "/login/employee/remove",
    },
    {
      title: "Modify Employee",
      description: "Update information for an existing employee",
      icon: "✏️",
      path: "/login/employee/modify",
    },
  ];

  return <Operations title="Employee" operations={operations} />;
}
