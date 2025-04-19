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
  const [graphData, setGraphData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [filteredReportData, setFilteredReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [idSearch, setIdSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [selectedNationalities, setSelectedNationalities] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [valueMin, setValueMin] = useState("");
  const [valueMax, setValueMax] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [graphRes, reportRes] = await Promise.all([
          apiFetch("/api/artifact-graph/", "GET", user.id),
          apiFetch("/api/artifact-report/", "GET", user.id),
        ]);

        setGraphData(graphRes.data);
        setReportData(reportRes.data);
        setFilteredReportData(reportRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    reportData,
    idSearch,
    nameSearch,
    selectedNationalities,
    selectedArtists,
    valueMin,
    valueMax,
    yearMin,
    yearMax,
  ]);

  const applyFilters = () => {
    let filtered = [...reportData];

    // ID filter
    if (idSearch) {
      filtered = filtered.filter((item) =>
        item.Artifact_ID.toString().includes(idSearch),
      );
    }

    // Name filter
    if (nameSearch) {
      filtered = filtered.filter((item) =>
        item.Artifact_Name.toLowerCase().includes(nameSearch.toLowerCase()),
      );
    }

    // Nationality filter
    if (selectedNationalities.length > 0) {
      filtered = filtered.filter((item) =>
        selectedNationalities.includes(item.Nationality),
      );
    }

    // Artist filter
    if (selectedArtists.length > 0) {
      filtered = filtered.filter((item) =>
        selectedArtists.includes(item.Artist_Name),
      );
    }

    // Value range filter
    if (valueMin) {
      filtered = filtered.filter((item) => item.Value >= Number(valueMin));
    }
    if (valueMax) {
      filtered = filtered.filter((item) => item.Value <= Number(valueMax));
    }

    // Year range filter
    if (yearMin) {
      filtered = filtered.filter(
        (item) => new Date(item.acquisition_year) >= new Date(yearMin),
      );
    }
    if (yearMax) {
      filtered = filtered.filter(
        (item) => new Date(item.acquisition_year) <= new Date(yearMax),
      );
    }

    setFilteredReportData(filtered);
  };

  const handleClearFilters = () => {
    setIdSearch("");
    setNameSearch("");
    setSelectedNationalities([]);
    setSelectedArtists([]);
    setValueMin("");
    setValueMax("");
    setYearMin("");
    setYearMax("");
  };

  const prepareChartData = () => {
    const years = [...new Set(graphData.map((item) => item.acquisition_year))];
    const nationalities = [
      ...new Set(graphData.map((item) => item.nationality)),
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
        const entry = graphData.find(
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
    const years = [...new Set(graphData.map((item) => item.acquisition_year))];
    const nationalities = [
      ...new Set(graphData.map((item) => item.nationality)),
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
        const entry = graphData.find(
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
      "Artifact ID",
      "Artifact Name",
      "Description",
      "Value",
      "Artist",
      "Nationality",
      "Acquisition Year",
    ];
    const rows = filteredReportData.map((item) => [
      item.Artifact_ID,
      item.Artifact_Name,
      item.Artifact_Description,
      item.Value,
      item.Artist_Name,
      item.Nationality,
      item.acquisition_year || "",
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

  // Get unique values for filters
  const nationalities = [
    ...new Set(reportData.map((item) => item.Nationality)),
  ].filter(Boolean);
  const artists = [
    ...new Set(reportData.map((item) => item.Artist_Name)),
  ].filter(Boolean);
  const years = [...new Set(reportData.map((item) => item.acquisition_year))]
    .filter(Boolean)
    .sort();

  if (loading) return <div className="loading">Loading artifact data...</div>;

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
            {/* Filters Section */}
            <div className="filters-container">
              <div className="filter-row">
                {/* ID Search */}
                <div className="filter-group">
                  <label>Artifact ID:</label>
                  <input
                    type="text"
                    placeholder="Search by ID"
                    value={idSearch}
                    onChange={(e) => setIdSearch(e.target.value)}
                    className="filter-input"
                  />
                </div>

                {/* Name Search */}
                <div className="filter-group">
                  <label>Artifact Name:</label>
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    className="filter-input"
                  />
                </div>

                {/* Nationality Filter */}
                <div className="filter-group">
                  <label>Nationality:</label>
                  <select
                    multiple
                    value={selectedNationalities}
                    onChange={(e) =>
                      setSelectedNationalities(
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value,
                        ),
                      )
                    }
                    className="filter-select"
                  >
                    {nationalities.map((nationality) => (
                      <option key={nationality} value={nationality}>
                        {nationality}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Artist Filter */}
                <div className="filter-group">
                  <label>Artist:</label>
                  <select
                    multiple
                    value={selectedArtists}
                    onChange={(e) =>
                      setSelectedArtists(
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value,
                        ),
                      )
                    }
                    className="filter-select"
                  >
                    {artists.map((artist) => (
                      <option key={artist} value={artist}>
                        {artist}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Value Range */}
                <div className="filter-group">
                  <label>Value Range ($):</label>
                  <div className="range-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={valueMin}
                      onChange={(e) => setValueMin(e.target.value)}
                      className="filter-input"
                      min="0"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={valueMax}
                      onChange={(e) => setValueMax(e.target.value)}
                      className="filter-input"
                      min="0"
                    />
                  </div>
                </div>

                {/* Year Range */}
                <div className="filter-group">
                  <label>Year Range:</label>
                  <div className="range-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={yearMin}
                      onChange={(e) => setYearMin(e.target.value)}
                      className="filter-input"
                      min={years[0]}
                      max={years[years.length - 1]}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={yearMax}
                      onChange={(e) => setYearMax(e.target.value)}
                      className="filter-input"
                      min={years[0]}
                      max={years[years.length - 1]}
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
                      <th>Artifact ID</th>
                      <th>Artifact Name</th>
                      <th>Description</th>
                      <th>Value</th>
                      <th>Artist</th>
                      <th>Nationality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReportData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.Artifact_ID}</td>
                        <td>{item.Artifact_Name}</td>
                        <td>{item.Artifact_Description}</td>
                        <td>${Number(item.Value).toLocaleString()}</td>
                        <td>{item.Artist_Name}</td>
                        <td>{item.Nationality}</td>
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
