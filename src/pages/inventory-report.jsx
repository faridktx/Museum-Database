import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { apiFetch } from "../components/utils";
import { Download } from "lucide-react";
import "../components/components.css";

export function InventoryReport() {
  const { user } = useUser();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [nameSearch, setNameSearch] = useState('');
  const [idSearch, setIdSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [quantityMin, setQuantityMin] = useState('');
  const [quantityMax, setQuantityMax] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await apiFetch("/api/giftshop-inventory", "GET", user.id);
        const data = response.data;
        
        // Extract unique categories from inventory data
        const uniqueCategories = [...new Set(data.map(item => item.category))].filter(Boolean);
        
        setInventory(data);
        setFilteredInventory(data);
        setCategories(['All', ...uniqueCategories]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        setLoading(false);
      }
    };

    fetchInventory();
  }, [user.id]);

  useEffect(() => {
    applyFilters();
  }, [inventory, nameSearch, idSearch, selectedCategories, quantityMin, quantityMax]);

  const applyFilters = () => {
    let filtered = [...inventory];

    // Name filter
    if (nameSearch) {
      filtered = filtered.filter(item => 
        item.item_name.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }

    // ID filter
    if (idSearch) {
      filtered = filtered.filter(item => 
        item.item_id.toString().includes(idSearch)
      );
    }

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes('All')) {
      filtered = filtered.filter(item => 
        selectedCategories.includes(item.category)
      );
    }

    // Quantity range filter
    if (quantityMin) {
      filtered = filtered.filter(item => 
        item.quantity >= Number(quantityMin)
      );
    }
    if (quantityMax) {
      filtered = filtered.filter(item => 
        item.quantity <= Number(quantityMax)
      );
    }

    setFilteredInventory(filtered);
  };

  const handleClearFilters = () => {
    setNameSearch('');
    setIdSearch('');
    setSelectedCategories([]);
    setQuantityMin('');
    setQuantityMax('');
  };

  const exportToCsv = () => {
    const headers = [
      "ID",
      "Item Name",
      "Description",
      "Category",
      "Quantity",
      "Unit Price",
      "Total Value"
    ];
    
    const rows = filteredInventory.map(item => [
      item.item_id,
      item.item_name,
      item.description,
      item.category,
      item.quantity,
      `$${item.unit_price.toFixed(2)}`,
      `$${(item.quantity * item.unit_price).toFixed(2)}`
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "giftshop_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading">Loading inventory data...</div>;

  return (
    <div className="reports-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Gift Shop Inventory</h1>
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
                {/* Name Search */}
                <div className="filter-item">
                  <input
                    id="name-search"
                    type="text"
                    placeholder="Item Name"
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    className="rounded-input"
                  />
                </div>

                {/* ID Search */}
                <div className="filter-item">
                  <input
                    id="id-search"
                    type="text"
                    placeholder="Item ID"
                    value={idSearch}
                    onChange={(e) => setIdSearch(e.target.value)}
                    className="rounded-input"
                  />
                </div>

                {/* Category Filter */}
                <div className="filter-item">
                  <label htmlFor="category-filter">Category:</label>
                  <select
                    id="category-filter"
                    multiple
                    value={selectedCategories}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions, option => option.value);
                      setSelectedCategories(options);
                    }}
                    className="rounded-input multi-select"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {selectedCategories.length > 0 && (
                    <div className="selected-count">
                      {selectedCategories.length} selected
                    </div>
                  )}
                </div>

                {/* Quantity Range */}
                <div className="filter-item">
                  <label>Quantity Range:</label>
                  <div className="range-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={quantityMin}
                      onChange={(e) => setQuantityMin(e.target.value)}
                      className="rounded-input"
                      min="0"
                    />
                    <span className="range-separator">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={quantityMax}
                      onChange={(e) => setQuantityMax(e.target.value)}
                      className="rounded-input"
                      min="0"
                    />
                  </div>
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

            <div className="report-table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => (
                        <tr key={item.item_id} className={item.quantity < 65 ? "low-quantity" : ""}>
                        <td>{item.item_id}</td>
                        <td>{item.item_name}</td>
                        <td>{item.description || 'N/A'}</td>
                        <td>{item.category || 'N/A'}</td>
                        <td>{item.quantity}</td>
                        <td>${item.unit_price.toFixed(2)}</td>
                        <td>${(item.quantity * item.unit_price).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-results">
                        No items match the current filters
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