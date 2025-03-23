import React from "react";
import "../components/components.css";

export function Dashboard() {
  const handleGenerateReport = async (reportType) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/report?type=${reportType}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }
      const html = await response.text();
      const newWindow = window.open("", "_blank");
      newWindow.document.write(html);
      newWindow.document.close();
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      <div className="container dashboard-content">
        <h1 style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}>
          Museum Collection Dashboard
        </h1>
        <section className="dashboard-section">
          <h2>Reports</h2>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Collection Overview</h3>
              <p>View comprehensive reports about your museum's collection.</p>
              <button
                className="button"
                onClick={() => handleGenerateReport("collection")}
              >
                Generate Report
              </button>
            </div>
            <div className="dashboard-card">
              <h3>Exhibit Status</h3>
              <p>Track the current and past exhibits.</p>
              <button
                className="button"
                onClick={() => handleGenerateReport("exhibits")}
              >
                View Status
              </button>
            </div>
            <div className="dashboard-card">
              <h3>Employees</h3>
              <p>Review employee history.</p>
              <button
                className="button"
                onClick={() => handleGenerateReport("employee")}
              >
                Access History
              </button>
            </div>
          </div>
        </section>
        <section className="dashboard-section">
          <h2>Data Management</h2>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Update Artifacts</h3>
              <p>Add to or modify existing artifact information.</p>
              <button
                className="button"
                onClick={() => (window.location.href = "/login/artifact")}
              >
                Update Artifact
              </button>
            </div>
            <div className="dashboard-card">
              <h3>Update Artists</h3>
              <p>Add to or modify the existing artist database.</p>
              <button
                className="button"
                onClick={() => (window.location.href = "/login/artist")}
              >
                Update Artists
              </button>
            </div>
            <div className="dashboard-card">
              <h3>Update Employees</h3>
              <p>Modify existing museum employee information.</p>
              <button
                className="button"
                onClick={() => (window.location.href = "/login/employee")}
              >
                Update Records
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
