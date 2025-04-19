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
  const [filteredData, setFilteredData] = useState([]);
  const [exhibits, setExhibits] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedExhibits, setSelectedExhibits] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [employeeStatus, setEmployeeStatus] = useState("all");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  useEffect(() => {
    const loadReportData = async () => {
      const response = await apiFetch(
        "/api/department-report/",
        "GET",
        user.id,
      );
      const data = response.data;

      // Extract unique exhibits and roles
      const uniqueExhibits = [
        ...new Set(data.map((item) => item.exhibit_name)),
      ];
      const uniqueRoles = [...new Set(data.map((item) => item.role))];

      setReportData(data);
      setFilteredData(data);
      setExhibits(uniqueExhibits);
      setRoles(uniqueRoles);
      setLoading(false);
    };
    loadReportData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    reportData,
    selectedExhibits,
    selectedRoles,
    employeeStatus,
    salaryMin,
    salaryMax,
  ]);

  const applyFilters = () => {
    let filtered = [...reportData];

    // Exhibit filter
    if (selectedExhibits.length > 0) {
      filtered = filtered.filter((item) =>
        selectedExhibits.includes(item.exhibit_name),
      );
    }

    // Role filter
    if (selectedRoles.length > 0) {
      filtered = filtered.filter((item) => selectedRoles.includes(item.role));
    }

    // Employee status filter
    if (employeeStatus === "active") {
      filtered = filtered.filter((item) => item.active_employees > 0);
    } else if (employeeStatus === "inactive") {
      filtered = filtered.filter((item) => item.active_employees === 0);
    }

    // Salary range filter
    if (salaryMin) {
      filtered = filtered.filter(
        (item) => item.average_salary >= Number(salaryMin),
      );
    }
    if (salaryMax) {
      filtered = filtered.filter(
        (item) => item.average_salary <= Number(salaryMax),
      );
    }

    setFilteredData(filtered);
  };

  const handleClearFilters = () => {
    setSelectedExhibits([]);
    setSelectedRoles([]);
    setEmployeeStatus("all");
    setSalaryMin("");
    setSalaryMax("");
  };

  const prepareChartData = () => {
    const filteredExhibits = [
      ...new Set(filteredData.map((item) => item.exhibit_name)),
    ];
    const filteredRoles = [...new Set(filteredData.map((item) => item.role))];

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
            {/* New Filters Section */}
            <div className="filters-container">
              <div className="filter-row">
                {/* Exhibit Filter */}
                <div className="filter-group">
                  <label>Exhibits:</label>
                  <select
                    multiple
                    value={selectedExhibits}
                    onChange={(e) =>
                      setSelectedExhibits(
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value,
                        ),
                      )
                    }
                    className="filter-select"
                  >
                    {exhibits.map((exhibit) => (
                      <option key={exhibit} value={exhibit}>
                        {exhibit}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role Filter */}
                <div className="filter-group">
                  <label>Roles:</label>
                  <select
                    multiple
                    value={selectedRoles}
                    onChange={(e) =>
                      setSelectedRoles(
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value,
                        ),
                      )
                    }
                    className="filter-select"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Employee Status Filter */}
                <div className="filter-group">
                  <label>Employee Status:</label>
                  <select
                    value={employeeStatus}
                    onChange={(e) => setEmployeeStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Employees</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>

                {/* Salary Range Filter */}
                <div className="filter-group">
                  <label>Salary Range:</label>
                  <div className="range-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      className="filter-input"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      className="filter-input"
                    />
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button className="clear-filters" onClick={handleClearFilters}>
                  Clear All Filters
                </button>
              </div>
            </div>

            <div className="report-header">
              <h2>Exhibit Staffing Analysis by Role</h2>
              <span className="report-date">
                Generated on {new Date().toLocaleDateString()}
              </span>
            </div>

            {/* ... (rest of your existing JSX remains the same, but using filteredData instead of reportData) */}
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
                    {filteredData.map((item, index) => (
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
