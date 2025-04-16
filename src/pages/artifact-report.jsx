import { Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { apiFetch } from "../components/utils";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "../components/components.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function ArtifactReport() {
  const { user } = useUser();
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const loadReportData = async () => {
      const response = await apiFetch("/api/artifact-report/", "GET", user.id);
      setReportData(response.data);
    };
    loadReportData();
  }, []);

  const prepareChartData = () => {
    const years = [...new Set(reportData.map((item) => item.acquisition_year))];
    const nationalities = [
      ...new Set(reportData.map((item) => item.nationality)),
    ];

    const datasets = nationalities.map((nationality, index) => {
      const colors = [
        "rgba(74, 111, 165, 0.7)", // blue
        "rgba(155, 133, 121, 0.7)", // brown
        "rgba(108, 195, 213, 0.7)", // cyan
        "rgba(227, 119, 104, 0.7)", // red
        "rgba(118, 169, 125, 0.7)", // green
        "rgba(156, 99, 169, 0.7)", // purple
        "rgba(220, 176, 89, 0.7)", // yellow
        "rgba(130, 130, 130, 0.7)", // gray
        "rgba(183, 146, 104, 0.7)", // tan
        "rgba(89, 158, 142, 0.7)", // teal
        "rgba(222, 125, 178, 0.7)", // pink
        "rgba(124, 148, 207, 0.7)", // light blue
        "rgba(201, 184, 102, 0.7)", // gold
        "rgba(96, 182, 110, 0.7)", // lime
        "rgba(190, 119, 84, 0.7)", // orange
      ];

      const data = years.map((year) => {
        const entry = reportData.find(
          (item) =>
            item.acquisition_year === year && item.nationality === nationality,
        );
        return entry ? entry.total_artifacts : 0;
      });

      return {
        label: nationality,
        data: data,
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length].replace("0.7", "1"),
        borderWidth: 1,
      };
    });

    return {
      labels: years,
      datasets,
    };
  };

  const prepareValueChartData = () => {
    const years = [...new Set(reportData.map((item) => item.acquisition_year))];
    const nationalities = [
      ...new Set(reportData.map((item) => item.nationality)),
    ];

    const datasets = nationalities.map((nationality, index) => {
      const colors = [
        "rgba(74, 111, 165, 0.7)",
        "rgba(155, 133, 121, 0.7)",
        "rgba(108, 195, 213, 0.7)",
        "rgba(227, 119, 104, 0.7)",
        "rgba(118, 169, 125, 0.7)",
        "rgba(156, 99, 169, 0.7)",
        "rgba(220, 176, 89, 0.7)",
        "rgba(130, 130, 130, 0.7)",
        "rgba(183, 146, 104, 0.7)",
        "rgba(89, 158, 142, 0.7)",
        "rgba(222, 125, 178, 0.7)",
        "rgba(124, 148, 207, 0.7)",
        "rgba(201, 184, 102, 0.7)",
        "rgba(96, 182, 110, 0.7)",
        "rgba(190, 119, 84, 0.7)",
      ];

      const data = years.map((year) => {
        const entry = reportData.find(
          (item) =>
            item.acquisition_year === year && item.nationality === nationality,
        );
        return entry ? entry.total_value : 0;
      });

      return {
        label: nationality,
        data: data,
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length].replace("0.7", "1"),
        borderWidth: 1,
      };
    });

    return {
      labels: years,
      datasets,
    };
  };

  const exportToCsv = () => {
    const headers = [
      "acquisition_year",
      "nationality",
      "total_artifacts",
      "value",
    ];
    const rows = reportData.map((item) => [
      item.acquisition_year,
      item.nationality,
      item.total_artifacts,
      item.total_value,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "artifact_report.csv");
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
        text: "Artifact Count by Year and Nationality",
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Acquisition Year",
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Number of Artifacts",
        },
      },
    },
  };

  const valueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Total Artifact Value by Year and Nationality ($)",
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Acquisition Year",
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Total Value ($)",
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
          <h1>Artifact Acquisition Report</h1>
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
              <h2>Artifact Acquisition Analysis by Year and Nationality</h2>
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
                      style={{ backgroundColor: dataset.backgroundColor }}
                    ></div>
                    <span>{dataset.label}</span>
                  </div>
                ))}
              </div>

              <div className="chart-container">
                <Bar data={prepareChartData()} options={chartOptions} />
              </div>

              <div className="chart-container">
                <Bar
                  data={prepareValueChartData()}
                  options={valueChartOptions}
                />
              </div>

              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Acquisition Year</th>
                      <th>Nationality</th>
                      <th>Total Artifacts</th>
                      <th>Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.acquisition_year}</td>
                        <td>{item.nationality}</td>
                        <td>{item.total_artifacts}</td>
                        <td>${Number(item.total_value).toLocaleString()}</td>
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
