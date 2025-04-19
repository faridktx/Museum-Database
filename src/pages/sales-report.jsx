import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { apiFetch } from "../components/utils";
import { Download } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import "../components/components.css";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export function SalesReport() {
  const { user } = useUser();
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [itemSearch, setItemSearch] = useState("");
  const [saleIdSearch, setSaleIdSearch] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, inventoryRes] = await Promise.all([
          apiFetch("/api/giftshop-sales", "GET", user.id),
          apiFetch("/api/giftshop-inventory", "GET", user.id),
        ]);

        const salesData = salesRes.data;
        const inventoryData = inventoryRes.data;

        // Map item names to sales
        const salesWithItemNames = salesData.map((sale) => {
          const item = inventoryData.find((i) => i.item_id === sale.item_id);
          return {
            ...sale,
            item_name: item?.item_name || "Unknown",
            category: item?.category || "Uncategorized",
          };
        });

        setSales(salesWithItemNames);
        setFilteredSales(salesWithItemNames);
        setInventory(inventoryData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  useEffect(() => {
    applyFilters();
  }, [sales, itemSearch, saleIdSearch, dateStart, dateEnd]);

  const applyFilters = () => {
    let filtered = [...sales];

    // Item name filter
    if (itemSearch) {
      filtered = filtered.filter((sale) =>
        sale.item_name.toLowerCase().includes(itemSearch.toLowerCase()),
      );
    }

    // Sale ID filter
    if (saleIdSearch) {
      filtered = filtered.filter((sale) =>
        sale.sale_id.toString().includes(saleIdSearch),
      );
    }

    // Date range filter
    if (dateStart) {
      filtered = filtered.filter(
        (sale) => new Date(sale.sale_date) >= new Date(dateStart),
      );
    }
    if (dateEnd) {
      filtered = filtered.filter(
        (sale) => new Date(sale.sale_date) <= new Date(dateEnd),
      );
    }

    setFilteredSales(filtered);
  };

  const prepareChartData = () => {
    const salesByCategory = {};

    filteredSales.forEach((sale) => {
      const category = sale.category || "Uncategorized";
      salesByCategory[category] =
        (salesByCategory[category] || 0) + sale.total_cost;
    });

    const categories = Object.keys(salesByCategory);
    const totals = Object.values(salesByCategory);

    // Generate distinct colors for each category
    const backgroundColors = categories.map((_, i) => {
      const hue = ((i * 360) / categories.length) % 360;
      return `hsl(${hue}, 70%, 60%)`;
    });

    return {
      labels: categories,
      datasets: [
        {
          data: totals,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleClearFilters = () => {
    setItemSearch("");
    setSaleIdSearch("");
    setDateStart("");
    setDateEnd("");
  };

  const exportToCsv = () => {
    const headers = [
      "Sale ID",
      "Item Name",
      "Category",
      "Guest ID",
      "Date",
      "Quantity",
      "Total Cost",
    ];

    const rows = filteredSales.map((sale) => [
      sale.sale_id,
      sale.item_name,
      sale.category,
      sale.guest_id,
      sale.sale_date,
      sale.quantity,
      sale.total_cost.toFixed(2),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "giftshop_sales.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading">Loading sales data...</div>;

  return (
    <div className="reports-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Gift Shop Sales</h1>
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
            <div className="filters-container-horizontal">
              <div className="filter-row">
                {/* Item Name Search */}
                <div className="filter-item">
                  <input
                    id="item-search"
                    type="text"
                    placeholder="Item Name"
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    className="rounded-input"
                  />
                </div>

                {/* Sale ID Search */}
                <div className="filter-item">
                  <input
                    id="sale-id-search"
                    type="text"
                    placeholder="Sale ID"
                    value={saleIdSearch}
                    onChange={(e) => setSaleIdSearch(e.target.value)}
                    className="rounded-input"
                  />
                </div>

                {/* Date Range */}
                <div className="filter-item date-range">
                  <label>Sale Date:</label>
                  <input
                    type="date"
                    placeholder="From"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="rounded-input date-input"
                  />
                  <span className="date-separator">to</span>
                  <input
                    type="date"
                    placeholder="To"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="rounded-input date-input"
                  />
                </div>

                {/* Clear Filters Button */}
                <div className="filter-item">
                  <button
                    className="clear-filters rounded-button"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div
              className="chart-container"
              style={{ height: "400px", marginBottom: "2rem" }}
            >
              <Pie
                data={prepareChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: "Sales by Category",
                      font: {
                        size: 16,
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.label}: $${context.raw.toFixed(2)}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>

            <div className="report-table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Sale ID</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Guest ID</th>
                    <th>Date</th>
                    <th>Quantity</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.length > 0 ? (
                    filteredSales.map((sale) => (
                      <tr key={sale.sale_id}>
                        <td>{sale.sale_id}</td>
                        <td>{sale.item_name}</td>
                        <td>{sale.category}</td>
                        <td>{sale.guest_id}</td>
                        <td>{formatDate(sale.sale_date)}</td>
                        <td>{sale.quantity}</td>
                        <td>${sale.total_cost.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-results">
                        No sales match the current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
