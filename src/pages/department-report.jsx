import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@clerk/clerk-react";
import { Bar, Line } from "react-chartjs-2";
import { apiFetch } from "../components/utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ArrowLeft, Download } from "lucide-react";
import "../components/components.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

export function DepartmentReport() {
  const { user } = useUser();
  const [, navigate] = useLocation();
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const loadReportData = async () => {
      const response = await apiFetch(
        "/api/department-report/",
        "GET",
        user.id,
      );
      setReportData(response.data);
    };
    loadReportData();
  }, []);

  const prepareChartData = () => {
    const exhibits = [...new Set(reportData.map((item) => item.exhibit_name))];
    const roles = [...new Set(reportData.map((item) => item.role))];

    const colors = {
      Curator: "rgba(74, 111, 165, 1)", // Museum blue
      Educator: "rgba(108, 195, 213, 1)", // Light cyan
      Reception: "rgba(227, 119, 104, 1)", // Soft red
      Custodian: "rgba(118, 169, 125, 1)", // Sage green
      Administrator: "rgba(124, 148, 207, 1)", // Soft blue
      Development: "rgba(201, 184, 102, 1)", // Gold
      Security: "rgba(92, 135, 39, 1)", // Olive green
      Retail: "rgba(183, 146, 104, 1)", // Tan
    };

    const backgroundColors = {
      Curator: "rgba(74, 111, 165, 0.1)",
      Educator: "rgba(108, 195, 213, 0.1)",
      Reception: "rgba(227, 119, 104, 0.1)",
      Custodian: "rgba(118, 169, 125, 0.1)",
      Administrator: "rgba(124, 148, 207, 0.1)",
      Development: "rgba(201, 184, 102, 0.1)",
      Security: "rgba(92, 135, 39, 0.1)",
      Retail: "rgba(183, 146, 104, 0.1)",
    };

    const datasets = roles.map((role) => {
      return {
        label: role,
        data: exhibits.map((exhibit) => {
          const match = reportData.find(
            (item) => item.exhibit_name === exhibit && item.role === role,
          );
          return match ? match.active_employees : 0;
        }),
        borderColor: colors[role] || colors["Other"],
        backgroundColor: backgroundColors[role] || backgroundColors["Other"],
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      };
    });

    return {
      labels: exhibits,
      datasets,
    };
  };

  const prepareSalaryChartData = () => {
    const exhibits = [...new Set(reportData.map((item) => item.exhibit_name))];
    const roles = [...new Set(reportData.map((item) => item.role))];

    const colors = {
      Curator: "rgba(74, 111, 165, 1)", // Museum blue
      Educator: "rgba(108, 195, 213, 1)", // Light cyan
      Reception: "rgba(227, 119, 104, 1)", // Soft red
      Custodian: "rgba(118, 169, 125, 1)", // Sage green
      Administrator: "rgba(124, 148, 207, 1)", // Soft blue
      Development: "rgba(201, 184, 102, 1)", // Gold
      Security: "rgba(92, 135, 39, 1)", // Olive green
      Retail: "rgba(183, 146, 104, 1)", // Tan
    };

    const datasets = roles.map((role) => {
      return {
        label: role,
        data: exhibits.map((exhibit) => {
          const match = reportData.find(
            (item) => item.exhibit_name === exhibit && item.role === role,
          );
          return match ? match.average_salary : 0;
        }),
        backgroundColor: colors[role] || colors["Other"],
      };
    });

    return {
      labels: exhibits,
      datasets,
    };
  };

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
    link.setAttribute("download", "department_overlook.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Active Employees by Exhibit and Role",
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        title: {
          display: true,
          text: "Exhibit",
        },
      },
      y: {
        stacked: false,
        title: {
          display: true,
          text: "Number of Employees",
        },
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  const salaryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Average Salary by Exhibit and Role ($)",
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        title: {
          display: true,
          text: "Exhibit",
        },
      },
      y: {
        stacked: false,
        title: {
          display: true,
          text: "Average Salary ($)",
        },
        ticks: {
          callback: function (value) {
            return "$" + Number(value).toLocaleString();
          },
        },
      },
    },
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
              <div className="custom-legend">
                {prepareChartData().datasets.map((dataset, index) => (
                  <div key={index} className="legend-item">
                    <div
                      className="legend-color"
                      style={{
                        backgroundColor:
                          dataset.borderColor || dataset.backgroundColor,
                      }}
                    ></div>
                    <span>{dataset.label}</span>
                  </div>
                ))}
              </div>

              <div className="chart-container">
                <Line data={prepareChartData()} options={chartOptions} />
              </div>

              <div className="chart-container">
                <Bar
                  data={prepareSalaryChartData()}
                  options={salaryChartOptions}
                />
              </div>

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
