import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@clerk/clerk-react";
import { apiFetch } from "../components/utils";
import { Download } from "lucide-react";
import "../components/components.css";

export function DepartmentReport() {
  const { user } = useUser();
  const [, navigate] = useLocation();
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const loadReportData = async () => {
      const response = await apiFetch("/api/department-report/", "GET", user.id);
      setReportData(response.data);
    };
    loadReportData();
  }, []);

  const exportToCsv = () => {
    const headers = [
      "exhibit_name",
      "role",
      "total_employees",
      "active_employees",
      "average_salary",
    ];
    const rows = reportData.map((item) => [
      item.exhibit_name,
      item.role,
      item.total_employees,
      item.active_employees,
      item.average_salary,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "employee_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reports-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Department Overlook</h1>
        </div>

        <div className="report-controls-simplified">
          <div className="report-header-actions">
            <button
              className="button button-outline export-button"
              onClick={exportToCsv}
            >
              <Download size={16} />
              Export to CSV
            </button>
          </div>

          <div className="report-results">
            <div className="report-header">
              <h2>Exhibit Staffing Analysis by Role</h2>
              <span className="report-date">
                Generated on {new Date().toLocaleDateString()}
              </span>
            </div>

            <div className="report-content">
              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Exhibit</th>
                      <th>Role</th>
                      <th>Total Employees</th>
                      <th>Active Employees</th>
                      <th>Average Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.exhibit_name}</td>
                        <td>{item.role}</td>
                        <td>{item.total_employees}</td>
                        <td>{item.active_employees}</td>
                        <td>${Number(item.average_salary).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
