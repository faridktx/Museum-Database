import React from "react";
import "../components/components.css";

export function Dashboard() {
  const handleGenerateReport = async (reportType) => {
    try {
      // Fetch the report from the backend based on the report type
      const response = await fetch(
        `http://localhost:3000/api/report?type=${reportType}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }
      const { columns, data } = await response.json();

      // Generate the HTML report dynamically
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${reportType} Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f4f4f4;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <h1>${reportType} Report</h1>
          <table>
            <thead>
              <tr>
                ${columns.map((column) => `<th>${column}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>
                  ${columns.map((column) => `<td>${row[column]}</td>`).join("")}
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;

      // Open a new tab and write the HTML content to it
      const newWindow = window.open("", "_blank");
      newWindow.document.write(html);
      newWindow.document.close(); // Close the document to finish rendering
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
                onClick={() => handleGenerateReport("Collection")}
              >
                Generate Report
              </button>
            </div>
            <div className="dashboard-card">
              <h3>Exhibit Status</h3>
              <p>Track the current and past exhibits.</p>
              <button
                className="button"
                onClick={() => handleGenerateReport("Exhibits")}
              >
                View Status
              </button>
            </div>
            <div className="dashboard-card">
              <h3>Employees</h3>
              <p>Review employee history.</p>
              <button
                className="button"
                onClick={() => handleGenerateReport("Employee")}
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
