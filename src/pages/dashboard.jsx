import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import "../components/components.css";
import { useUser } from "@clerk/clerk-react";
import { apiFetch } from "../components/utils";

export function Dashboard() {
  const { user } = useUser();
  const [role, setRole] = useState(null);

  const roleData = {
    curator: [
      {
        dataTitle: "Update Artifacts",
        reportTitle: "Artifacts Overview",
        relation: "artifact",
      },
      {
        dataTitle: "Update Artists",
        reportTitle: "Artists Overview",
        relation: "artist",
      },
      {
        dataTitle: "Update Exhibits",
        reportTitle: "Exhibits Overview",
        relation: "exhibit",
      },
    ],
    admin: [
      {
        dataTitle: "Update Employees",
        reportTitle: "Employees Overview",
        relation: "employee",
      },
      {
        dataTitle: "Update Guests",
        reportTitle: "Guests Overview",
        relation: "guest",
      },
    ],
    "gift-shop": [
      {
        dataTitle: "Update Inventory",
        reportTitle: "Inventory Overview",
        relation: "inventory",
      },
      {
        dataTitle: "Update Sales",
        reportTitle: "Sales Overview",
        relation: "sales",
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiFetch("/api/role", "GET", user.id);
      setRole(response.data.role);
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <div className="container dashboard-content">
        <h1 style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
          Museum Collection Dashboard
        </h1>
        <section className="dashboard-section">
          <h2>Reports</h2>
          <div className="dashboard-grid">
            {roleData[role]?.map((card) => (
                <div key={card.relation} className="dashboard-card">
                  <h3>{card.reportTitle}</h3>
                  <p>
                    View comprehensive reports about your museum's{" "}
                    {card.relation}
                    s.
                  </p>
                  <Link href={`/dashboard/${card.relation}`}>
                    <button className="button">Access Report</button>
                  </Link>
                </div>
              ))}
          </div>
        </section>
        <section className="dashboard-section">
          <h2>Data Management</h2>
          <div className="dashboard-grid">
            {roleData[role]?.map((card) => (
                <div key={card.relation} className="dashboard-card">
                  <h3>{card.dataTitle}</h3>
                  <p>Add to or modify existing {card.relation} information.</p>
                  <Link href={`/dashboard/${card.relation}`}>
                    <button className="button">Modify Data</button>
                  </Link>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
