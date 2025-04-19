import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import "../../components/components.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// Sample data for quarterly acquisition growth
const quarterlyGrowthData = {
  labels: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
  datasets: [
    {
      label: "New Acquisitions",
      data: [12, 15, 8, 17],
      backgroundColor: "rgba(74, 111, 165, 0.7)",
      borderColor: "rgba(74, 111, 165, 1)",
      borderWidth: 1,
    },
    {
      label: "Loans",
      data: [4, 6, 7, 5],
      backgroundColor: "rgba(155, 133, 121, 0.7)",
      borderColor: "rgba(155, 133, 121, 1)",
      borderWidth: 1,
    },
    {
      label: "Donations",
      data: [8, 5, 10, 12],
      backgroundColor: "rgba(93, 64, 55, 0.7)",
      borderColor: "rgba(93, 64, 55, 1)",
      borderWidth: 1,
    },
  ],
};

// Sample data for acquisition by department
const departmentDistributionData = {
  labels: [
    "Modern & Contemporary",
    "Renaissance",
    "Impressionist",
    "Ancient Art",
    "Asian Art",
  ],
  datasets: [
    {
      label: "Acquisitions by Department",
      data: [35, 20, 15, 12, 18],
      backgroundColor: [
        "rgba(74, 111, 165, 0.7)",
        "rgba(155, 133, 121, 0.7)",
        "rgba(93, 64, 55, 0.7)",
        "rgba(120, 88, 166, 0.7)",
        "rgba(82, 145, 128, 0.7)",
      ],
      borderColor: [
        "rgba(74, 111, 165, 1)",
        "rgba(155, 133, 121, 1)",
        "rgba(93, 64, 55, 1)",
        "rgba(120, 88, 166, 1)",
        "rgba(82, 145, 128, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

// Sample data for acquisition value trend
const yearlyValueTrendData = {
  labels: ["2021", "2022", "2023", "2024"],
  datasets: [
    {
      label: "Total Acquisition Value (in $1000s)",
      data: [580, 620, 750, 890],
      backgroundColor: "rgba(74, 111, 165, 0.1)",
      borderColor: "rgba(74, 111, 165, 1)",
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    },
  ],
};

// Chart options
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Quarterly Acquisition Growth",
      font: {
        size: 16,
        family: "'Playfair Display', serif",
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      titleColor: "#333",
      bodyColor: "#555",
      borderColor: "#ddd",
      borderWidth: 1,
      titleFont: {
        family: "'Playfair Display', serif",
        weight: "bold",
      },
      bodyFont: {
        family: "'Helvetica Neue', Arial, sans-serif",
      },
      boxPadding: 10,
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${context.parsed.y} pieces`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          family: "'Helvetica Neue', Arial, sans-serif",
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          family: "'Helvetica Neue', Arial, sans-serif",
        },
      },
    },
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        font: {
          family: "'Helvetica Neue', Arial, sans-serif",
        },
      },
    },
    title: {
      display: true,
      text: "Acquisitions by Department (2024)",
      font: {
        size: 16,
        family: "'Playfair Display', serif",
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      titleColor: "#333",
      bodyColor: "#555",
      borderColor: "#ddd",
      borderWidth: 1,
      callbacks: {
        label: function (context) {
          const label = context.label || "";
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Annual Acquisition Value Trend",
      font: {
        size: 16,
        family: "'Playfair Display', serif",
      },
      padding: {
        top: 10,
        bottom: 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      titleColor: "#333",
      bodyColor: "#555",
      borderColor: "#ddd",
      borderWidth: 1,
      callbacks: {
        label: function (context) {
          return `Value: $${context.parsed.y}K`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
    },
    y: {
      beginAtZero: false,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        callback: function (value) {
          return "$" + value + "K";
        },
      },
    },
  },
};

export function CollectionGrowthCharts() {
  return (
    <div className="charts-container">
      <div className="charts-header">
        <h3>Quarterly Collection Growth</h3>
        <p className="charts-description">
          Analysis of collection growth over time, departmental distribution,
          and acquisition value trends.
        </p>
      </div>

      <div className="charts-grid">
        <div className="chart-item">
          <div className="chart-container">
            <Bar data={quarterlyGrowthData} options={barOptions} />
          </div>
          <div className="chart-description">
            <h4>Quarterly Acquisitions</h4>
            <p>
              Distribution of new acquisitions, loans, and donations across 2024
              quarters. The upward trend in Q4 suggests increasing collection
              growth.
            </p>
          </div>
        </div>

        <div className="chart-item">
          <div className="chart-container">
            <Pie data={departmentDistributionData} options={pieOptions} />
          </div>
          <div className="chart-description">
            <h4>Departmental Distribution</h4>
            <p>
              Modern & Contemporary art comprises the largest portion of our
              acquisitions, followed by Renaissance and Asian art collections.
            </p>
          </div>
        </div>

        <div className="chart-item wide">
          <div className="chart-container">
            <Line data={yearlyValueTrendData} options={lineOptions} />
          </div>
          <div className="chart-description">
            <h4>Acquisition Value Trend</h4>
            <p>
              The total value of acquisitions has shown steady growth over the
              past four years, with 2024 showing a significant increase compared
              to previous years.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
