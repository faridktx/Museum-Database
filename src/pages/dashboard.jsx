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
        relation: "artist",
      },
      {
        dataTitle: "Update Exhibits",
        relation: "exhibit",
      },
    ],
    admin: [

      {
        dataTitle: "Update Departments",
        reportTitle: "Department Overlook",
        relation: "department",
      },
      {
        dataTitle: "Update Employees",
        reportTitle: "Employee Report",
        relation: "employee",
      },
      {
        dataTitle: "Update Guests",
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
            {roleData[role]?.map((card) => {
              if (!card?.reportTitle) {
                return (
                  <div
                    key={`${card.reportTitle}-undefined`}
                    className="dashboard-card"
                  ></div>
                );
              }

              return (
                <div key={card.relation} className="dashboard-card">
                  <h3>{card.reportTitle}</h3>
                  <p>
                    View comprehensive reports about your museum's{" "}
                    {card.relation}
                    s.
                  </p>
                  <Link href={`/dashboard/${card.relation}-report`}>
                    <button className="button">Access Report</button>
                  </Link>
                </div>
              );
            })}
            {Array.from({ length: 3 - roleData[role]?.length }, (_, i) => (
              <div key={i} className="dashboard-card"></div>
            ))}
          </div>
        </section>
        <section className="dashboard-section">
          <h2>Data Management</h2>
          <div className="dashboard-grid">
            {roleData[role]?.map((card) => {
              if (!card?.dataTitle) {
                return (
                  <div
                    key={`${card.dataTitle}-undefined`}
                    className="dashboard-card"
                  ></div>
                );
              }

              return (
                <div key={card.relation} className="dashboard-card">
                  <h3>{card.dataTitle}</h3>
                  <p>
                    View comprehensive reports about your museum's{" "}
                    {card.relation}
                    s.
                  </p>
                  <Link href={`/dashboard/${card.relation}/modify`}>
                    <button className="button">Modify Data</button>
                  </Link>
                </div>
              );
            })}
            {Array.from({ length: 3 - roleData[role]?.length }, (_, i) => (
              <div key={i} className="dashboard-card"></div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
