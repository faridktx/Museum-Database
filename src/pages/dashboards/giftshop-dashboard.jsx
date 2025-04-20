import React, { useState, useEffect } from "react";
import {
  User,
  Filter,
  Search,
  BarChart,
  Package,
  DollarSign,
  X,
  Plus,
  Settings as SettingsIcon,
} from "lucide-react";
import "../../components/components.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useUser } from "@clerk/clerk-react";
import { SHOPCATEGORIES } from "../../components/constants.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function generateSalesChartData(sales) {
  console.log("Sales data:", sales);
  console.log(SHOPCATEGORIES);

  const categoryTotals = {};
  for (const cat of SHOPCATEGORIES) {
    categoryTotals[cat] = { revenue: 0, units: 0 };
  }

  // Aggregate data
  for (const sale of sales) {
    const { category, quantity, total } = sale;
    if (!category || !categoryTotals[category]) continue;

    categoryTotals[category].revenue += total;
    categoryTotals[category].units += quantity;
  }

  const revenueData = SHOPCATEGORIES.map((cat) => categoryTotals[cat].revenue);
  const unitsData = SHOPCATEGORIES.map((cat) => categoryTotals[cat].units);

  return {
    labels: SHOPCATEGORIES,
    datasets: [
      {
        label: "Revenue ($)",
        data: revenueData,
        backgroundColor: "rgba(102, 153, 255, 0.7)", // Calm blue
        borderColor: "rgba(102, 153, 255, 1)",
        borderWidth: 1,
        borderRadius: 5,
        barThickness: 40,
      },
      {
        label: "Units Sold",
        data: unitsData,
        backgroundColor: "rgba(255, 204, 102, 0.7)", // Soft amber
        borderColor: "rgba(255, 204, 102, 1)",
        borderWidth: 1,
        borderRadius: 5,
        barThickness: 40,
      },
    ],
  };
}

export function GiftShopDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  // Filter states
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    inventory: {
      name: "",
      category: "",
      price: "",
      inStock: "",
    },
    sales: {
      date: "",
      product: "",
      customer: "",
      amount: "",
    },
  });

  // Form states
  const [showSettings, setShowSettings] = useState(false);
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  // Selection states
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProducts, setDeletingProducts] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    department: "",
    startDate: "",
  });

  const [newProductData, setNewProductData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    inStock: 0,
    supplier: "",
  });

  const [editFormData, setEditFormData] = useState({});
  const [employeeData, setEmployeeData] = useState({
    employeeId: "",
    name: "",
    title: "",
    email: "",
    phone: "",
    department: "",
    startDate: "",
  });

  useEffect(() => {
    const getEmployeeInfo = async () => {
      const url = new URL(
        "/api/getemployeeinfo/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setEmployeeData({
          ...data.data,
          department: "Gift Shop",
        });
      } catch (err) {
        console.log(err);
      }
    };
    getEmployeeInfo();
  }, []);

  useEffect(() => {
    const getInventory = async () => {
      const url = new URL(
        "/api/getinventory/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setInventory(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getInventory();
  }, []);

  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const getSales = async () => {
      const url = new URL("/api/getsales/", process.env.REACT_APP_BACKEND_URL);
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setSales(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getSales();
  }, []);
  const [sales, setSales] = useState([]);

  // Update search query
  const updateSearchQuery = (query) => {
    setCurrentSearchQuery(query);
  };

  // Filter items based on search and filters
  const filterItems = (items, type) => {
    let filteredItems = [...items];

    // Text search
    if (currentSearchQuery.trim()) {
      const query = currentSearchQuery.toLowerCase();

      if (type === "inventory") {
        filteredItems = filteredItems.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.supplier.toLowerCase().includes(query),
        );
      } else if (type === "sales") {
        filteredItems = filteredItems.filter(
          (item) =>
            item.customer.toLowerCase().includes(query) ||
            item.products.some((p) => p.name.toLowerCase().includes(query)) ||
            item.paymentMethod.toLowerCase().includes(query) ||
            item.status.toLowerCase().includes(query),
        );
      }
    }

    // Advanced filters
    if (showAdvancedFilter) {
      if (type === "inventory") {
        const invFilters = filters.inventory;
        if (invFilters.name) {
          filteredItems = filteredItems.filter((item) =>
            item.name.toLowerCase().includes(invFilters.name.toLowerCase()),
          );
        }
        if (invFilters.category) {
          filteredItems = filteredItems.filter((item) =>
            item.category
              .toLowerCase()
              .includes(invFilters.category.toLowerCase()),
          );
        }
        if (invFilters.price) {
          filteredItems = filteredItems.filter((item) =>
            item.price.toString().includes(invFilters.price),
          );
        }
        if (invFilters.inStock) {
          filteredItems = filteredItems.filter((item) =>
            item.inStock.toString().includes(invFilters.inStock),
          );
        }
      } else if (type === "sales") {
        const salesFilters = filters.sales;
        if (salesFilters.date) {
          filteredItems = filteredItems.filter((item) =>
            item.date.includes(salesFilters.date),
          );
        }
        if (salesFilters.product) {
          filteredItems = filteredItems.filter((item) =>
            item.products.some((p) =>
              p.name.toLowerCase().includes(salesFilters.product.toLowerCase()),
            ),
          );
        }
        if (salesFilters.customer) {
          filteredItems = filteredItems.filter((item) =>
            item.customer
              .toLowerCase()
              .includes(salesFilters.customer.toLowerCase()),
          );
        }
        if (salesFilters.amount) {
          filteredItems = filteredItems.filter((item) =>
            item.total.toString().includes(salesFilters.amount),
          );
        }
      }
    }

    return filteredItems;
  };

  // Global low inventory threshold that can be customized
  const [lowInventoryThreshold, setLowInventoryThreshold] = useState(5);

  // Check if product stock is low (using product's minimumStock or global threshold)
  const isLowStock = (product) => {
    return (
      product.inStock <= product.minimumStock ||
      product.inStock <= lowInventoryThreshold
    );
  };

  // Get total inventory value
  const getTotalInventoryValue = () => {
    return inventory.reduce(
      (total, item) => total + item.price * item.inStock,
      0,
    );
  };

  // Get total inventory items
  const getTotalInventoryItems = () => {
    return inventory.reduce((total, item) => total + item.inStock, 0);
  };

  // Get total sales
  const getTotalSales = () => {
    return sales.reduce((total, sale) => total + sale.total, 0);
  };

  // Handle form change for profile editing
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle saving profile settings
  const handleSaveSettings = async () => {
    setEmployeeData(formData);

    // Close settings form
    setShowSettings(false);
    const url = new URL(
      "/api/setemployeeinfo/",
      process.env.REACT_APP_BACKEND_URL,
    );
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          employeeId: employeeData.employeeId,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Handle new product form change
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProductData({
      ...newProductData,
      [name]: value,
    });
  };

  // Handle save new product
  const handleSaveNewProduct = async () => {
    // Create new product with ID
    const newProduct = {
      ...newProductData,
      price: parseFloat(newProductData.price),
      inStock: parseInt(newProductData.inStock),
    };

    const url = new URL(
      "/api/addinventory/",
      process.env.REACT_APP_BACKEND_URL,
    );
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProductData),
      });
    } catch (err) {
      console.log(err);
    }

    // Add to inventory
    setInventory([...inventory, newProduct]);

    // Reset form
    setNewProductData({
      name: "",
      category: "",
      description: "",
      price: "",
      inStock: 0,
      supplier: "",
    });

    // Close form
    setShowNewProductForm(false);
  };

  // Handle cancel new product
  const handleCancelNewProduct = () => {
    // Reset form data
    setNewProductData({
      name: "",
      category: "",
      description: "",
      price: "",
      inStock: 0,
      supplier: "",
    });

    // Close form
    setShowNewProductForm(false);
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setEditFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      inStock: product.inStock,
      minimumStock: product.minimumStock,
      supplier: product.supplier,
    });
  };

  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle save product edit
  const handleSaveProduct = async () => {
    // Update inventory with edited data
    setInventory(
      inventory.map((item) => {
        if (item.id === editingProduct) {
          return {
            ...item,
            name: editFormData.name,
            category: editFormData.category,
            description: editFormData.description,
            price: parseFloat(editFormData.price),
            inStock: parseInt(editFormData.inStock),
            supplier: editFormData.supplier,
          };
        }
        return item;
      }),
    );

    const url = new URL(
      "/api/setinventory/",
      process.env.REACT_APP_BACKEND_URL,
    );
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editFormData, id: editingProduct }),
      });
    } catch (err) {
      console.log(err);
    }

    // Reset editing state
    setEditingProduct(null);
    setEditFormData({});
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditFormData({});
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    // Mark for deletion (visual effect)
    setDeletingProducts([...deletingProducts, productId]);

    // Remove after animation
    setTimeout(() => {
      setInventory(inventory.filter((product) => product.id !== productId));
      setDeletingProducts(deletingProducts.filter((id) => id !== productId));
    }, 300);

    const url = new URL(
      "/api/deleteinventory/",
      process.env.REACT_APP_BACKEND_URL,
    );
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: productId }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Initialize form data when showing settings
  useEffect(() => {
    if (showSettings) {
      setFormData({
        name: employeeData.name,
        title: employeeData.title,
        email: employeeData.email,
        phone: employeeData.phone,
        department: employeeData.department,
        startDate: employeeData.startDate,
      });
    }
  }, [showSettings, employeeData]);

  return (
    <div className="curator-dashboard" style={{ marginBottom: "3rem" }}>
      <div className="dashboard-header">
        <div className="header-title">
          <h1>MuseoCore Gift Shop Portal</h1>
        </div>

        <div className="horizontal-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("profile");
              setShowAdvancedFilter(false);
            }}
          >
            <User size={16} />
            <span>Profile</span>
          </button>
          <button
            className={`tab-button ${activeTab === "inventory" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("inventory");
              setShowAdvancedFilter(false);
            }}
          >
            <Package size={16} />
            <span>Inventory</span>
          </button>
          <button
            className={`tab-button ${activeTab === "sales" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("sales");
              setShowAdvancedFilter(false);
            }}
          >
            <DollarSign size={16} />
            <span>Sales</span>
          </button>
          <button
            className={`tab-button ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("reports");
              setShowAdvancedFilter(false);
            }}
          >
            <BarChart size={16} />
            <span>Reports</span>
          </button>
        </div>

        {/* Search and filter for inventory and sales tabs only */}
        {activeTab === "inventory" || activeTab === "sales" ? (
          <div className="header-search">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder={
                  activeTab === "inventory"
                    ? "Search products..."
                    : "Search sales..."
                }
                value={currentSearchQuery}
                onChange={(e) => updateSearchQuery(e.target.value)}
              />
              {currentSearchQuery && (
                <button
                  className="search-clear-button"
                  onClick={() => updateSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              className={`filter-button ${showAdvancedFilter ? "active" : ""}`}
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            >
              <Filter size={16} />
              <span>Advanced Filter</span>
            </button>
            {activeTab === "inventory" && (
              <div className="threshold-control">
                <label htmlFor="low-inventory-threshold">
                  Low Stock Alert:
                </label>
                <div className="threshold-input-container">
                  <button
                    className="threshold-button decrease"
                    onClick={() =>
                      setLowInventoryThreshold(
                        Math.max(0, lowInventoryThreshold - 1),
                      )
                    }
                    aria-label="Decrease threshold"
                  >
                    <span>−</span>
                  </button>
                  <input
                    type="number"
                    id="low-inventory-threshold"
                    min="0"
                    value={lowInventoryThreshold}
                    onChange={(e) =>
                      setLowInventoryThreshold(parseInt(e.target.value) || 0)
                    }
                  />
                  <button
                    className="threshold-button increase"
                    onClick={() =>
                      setLowInventoryThreshold(lowInventoryThreshold + 1)
                    }
                    aria-label="Increase threshold"
                  >
                    <span>+</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === "reports" ? (
          /* Reports tab - only show threshold control */
          <div className="header-search reports-only-threshold">
            <div className="threshold-control">
              <label htmlFor="report-low-inventory-threshold">
                Low Stock Alert:
              </label>
              <div className="threshold-input-container">
                <button
                  className="threshold-button decrease"
                  onClick={() =>
                    setLowInventoryThreshold(
                      Math.max(0, lowInventoryThreshold - 1),
                    )
                  }
                  aria-label="Decrease threshold"
                >
                  <span>−</span>
                </button>
                <input
                  type="number"
                  id="report-low-inventory-threshold"
                  min="0"
                  value={lowInventoryThreshold}
                  onChange={(e) =>
                    setLowInventoryThreshold(parseInt(e.target.value) || 0)
                  }
                />
                <button
                  className="threshold-button increase"
                  onClick={() =>
                    setLowInventoryThreshold(lowInventoryThreshold + 1)
                  }
                  aria-label="Increase threshold"
                >
                  <span>+</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Advanced Filter Panel - visible for selected tabs */}
      {showAdvancedFilter &&
        (activeTab === "inventory" || activeTab === "sales") && (
          <div
            className={`advanced-filter-panel ${showAdvancedFilter ? "open" : ""}`}
          >
            {activeTab === "inventory" && (
              <>
                <div className="filter-row">
                  <div className="filter-item">
                    <label htmlFor="product-name">Product Name</label>
                    <input
                      type="text"
                      id="product-name"
                      placeholder="Filter by name"
                      value={filters.inventory.name}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          inventory: {
                            ...filters.inventory,
                            name: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="filter-item">
                    <label htmlFor="product-category">Category</label>
                    <input
                      type="text"
                      id="product-category"
                      placeholder="Filter by category"
                      value={filters.inventory.category}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          inventory: {
                            ...filters.inventory,
                            category: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="filter-item">
                    <label htmlFor="product-price">Price</label>
                    <input
                      type="text"
                      id="product-price"
                      placeholder="Filter by price"
                      value={filters.inventory.price}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          inventory: {
                            ...filters.inventory,
                            price: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="filter-item">
                    <label htmlFor="product-stock">Stock Quantity</label>
                    <input
                      type="text"
                      id="product-stock"
                      placeholder="Filter by stock"
                      value={filters.inventory.inStock}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          inventory: {
                            ...filters.inventory,
                            inStock: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="filter-actions">
                  <button
                    className="reset-filter-button"
                    onClick={() => {
                      setFilters({
                        ...filters,
                        inventory: {
                          name: "",
                          category: "",
                          price: "",
                          inStock: "",
                        },
                      });
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </>
            )}

            {activeTab === "sales" && (
              <>
                <div className="filter-row">
                  <div className="filter-item">
                    <label htmlFor="sale-date">Date</label>
                    <input
                      type="text"
                      id="sale-date"
                      placeholder="Filter by date (YYYY-MM-DD)"
                      value={filters.sales.date}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          sales: {
                            ...filters.sales,
                            date: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="filter-item">
                    <label htmlFor="sale-product">Product</label>
                    <input
                      type="text"
                      id="sale-product"
                      placeholder="Filter by product"
                      value={filters.sales.product}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          sales: {
                            ...filters.sales,
                            product: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="filter-item">
                    <label htmlFor="sale-customer">Customer</label>
                    <input
                      type="text"
                      id="sale-customer"
                      placeholder="Filter by customer"
                      value={filters.sales.customer}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          sales: {
                            ...filters.sales,
                            customer: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="filter-item">
                    <label htmlFor="sale-amount">Amount</label>
                    <input
                      type="text"
                      id="sale-amount"
                      placeholder="Filter by amount"
                      value={filters.sales.amount}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          sales: {
                            ...filters.sales,
                            amount: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="filter-actions">
                  <button
                    className="reset-filter-button"
                    onClick={() => {
                      setFilters({
                        ...filters,
                        sales: {
                          date: "",
                          product: "",
                          customer: "",
                          amount: "",
                        },
                      });
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      <div className="dashboard-content">
        <div className="main-content">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <>
              <div className="profile-summary-card">
                <div className="profile-info-container">
                  <div className="profile-avatar">
                    <div className="profile-initials">
                      {employeeData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>
                  <div className="profile-summary-details">
                    <h2>{employeeData.name}</h2>
                    <p className="curator-title">{employeeData.title}</p>
                    <div className="curator-department">
                      <span>{employeeData.department}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-stats">
                  <div className="profile-stat-item">
                    <span className="stat-number">{inventory.length}</span>
                    <span className="stat-label">Products</span>
                  </div>
                  <div className="profile-stat-item">
                    <span className="stat-number">{sales.length}</span>
                    <span className="stat-label">Recent Sales</span>
                  </div>
                  <div className="profile-stat-item">
                    <span className="stat-number">
                      {inventory.filter((p) => isLowStock(p)).length}
                    </span>
                    <span className="stat-label">Low Stock</span>
                  </div>
                </div>
              </div>

              <div className="content-section">
                <div className="section-header">
                  <h2>Personal Information</h2>
                  <div className="profile-actions">
                    <button
                      className={`action-button ${showSettings ? "action-button-cancel" : ""}`}
                      onClick={() => {
                        setShowSettings(!showSettings);
                      }}
                    >
                      {showSettings ? (
                        <>
                          <X size={16} />
                          <span>Cancel</span>
                        </>
                      ) : (
                        <>
                          <SettingsIcon size={16} />
                          <span>Edit Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {showSettings ? (
                  <div className="settings-form">
                    <h3>Edit Profile Information</h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveSettings();
                      }}
                    >
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="title">Job Title</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          disabled
                        />
                        <small className="field-note">
                          Job title cannot be changed.
                        </small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <input
                          type="text"
                          id="department"
                          name="department"
                          value={formData.department}
                          disabled
                        />
                        <small className="field-note">
                          Department cannot be changed.
                        </small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                          type="text"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          disabled
                        />
                        <small className="field-note">
                          Start date cannot be changed.
                        </small>
                      </div>

                      <div className="form-buttons">
                        <button
                          type="button"
                          className="button-cancel"
                          onClick={() => setShowSettings(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="button-save">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="curator-profile">
                    <div className="profile-details">
                      <div className="detail-section">
                        <h3>Department</h3>
                        <p>{employeeData.department}</p>
                      </div>
                      <div className="detail-section">
                        <h3>Position</h3>
                        <p>{employeeData.title}</p>
                      </div>
                      <div className="detail-section">
                        <h3>Start Date</h3>
                        <p>{employeeData.startDate}</p>
                      </div>
                    </div>

                    <div className="profile-contact-info">
                      <h3>Contact Information</h3>
                      <p>
                        <strong>Email:</strong>{" "}
                        <span style={{ wordBreak: "break-word" }}>
                          {employeeData.email}
                        </span>
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        <span style={{ wordBreak: "break-word" }}>
                          {employeeData.phone}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Inventory Management</h2>
                <button
                  className={`action-button ${showNewProductForm ? "action-button-cancel" : ""}`}
                  onClick={() => setShowNewProductForm(!showNewProductForm)}
                >
                  {showNewProductForm ? (
                    <>
                      <X size={16} />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Add New Product</span>
                    </>
                  )}
                </button>
              </div>
              <p className="section-description">
                Manage your gift shop inventory items, update product details,
                track stock levels, and monitor which products need to be
                replenished.
              </p>

              {/* New Product Form */}
              {showNewProductForm && (
                <div className="new-artist-form">
                  <h3>Add New Product</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveNewProduct();
                    }}
                  >
                    <div className="form-row">
                      <div className="form-group">
                        <label className="required" htmlFor="new-name">
                          Product Name
                        </label>
                        <input
                          type="text"
                          id="new-name"
                          name="name"
                          value={newProductData.name}
                          onChange={handleNewProductChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="required" htmlFor="new-category">
                          Category
                        </label>
                        <select
                          id="new-category"
                          name="category"
                          value={newProductData.category}
                          onChange={handleNewProductChange}
                          required
                        >
                          <option disabled selected value="">
                            Select a category
                          </option>
                          {SHOPCATEGORIES.map((category, index) => (
                            <option key={index} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="required" htmlFor="new-price">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          id="new-price"
                          name="price"
                          step="0.01"
                          min="0"
                          value={newProductData.price}
                          onChange={handleNewProductChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="required" htmlFor="new-inStock">
                          Current Stock
                        </label>
                        <input
                          type="number"
                          id="new-inStock"
                          name="inStock"
                          min="0"
                          step="1"
                          value={newProductData.inStock}
                          onChange={handleNewProductChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="required" htmlFor="new-supplier">
                          Supplier
                        </label>
                        <input
                          type="text"
                          id="new-supplier"
                          name="supplier"
                          value={newProductData.supplier}
                          onChange={handleNewProductChange}
                          required
                        />
                      </div>
                      <div className="form-group"></div>
                    </div>

                    <div className="form-group">
                      <label className="required" htmlFor="new-description">
                        Description
                      </label>
                      <textarea
                        id="new-description"
                        name="description"
                        value={newProductData.description}
                        onChange={handleNewProductChange}
                        rows={2}
                        required
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={handleCancelNewProduct}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="button-primary">
                        Save Product
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="legend-container">
                <div className="table-legend">
                  <span className="legend-item">
                    ❗ Low stock warning (below product minimum or global
                    threshold of {lowInventoryThreshold})
                  </span>
                </div>
              </div>

              <div className="data-table-container">
                <table className="data-table artists-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Supplier</th>
                      <th className="actions-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterItems(inventory, "inventory").map((product) => (
                      <React.Fragment key={`product-row-${product.id}`}>
                        <tr
                          className={`
                            ${deletingProducts.includes(product.id) ? "deleting" : ""}
                            ${editingProduct === product.id ? "editing" : ""}
                          `}
                        >
                          {editingProduct === product.id ? (
                            // Edit mode - show input fields
                            <>
                              <td>
                                <input
                                  type="text"
                                  name="name"
                                  value={editFormData.name}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                  required
                                />
                              </td>
                              <td>
                                <select
                                  name="category"
                                  value={editFormData.category}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                  required
                                >
                                  {SHOPCATEGORIES.map((category, index) => (
                                    <option key={index} value={category}>
                                      {category}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  name="price"
                                  step="0.01"
                                  min="0"
                                  value={editFormData.price}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  name="inStock"
                                  min="0"
                                  step="1"
                                  value={editFormData.inStock}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="supplier"
                                  value={editFormData.supplier}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                  required
                                />
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="button-small button-success"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveProduct();
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  className="button-small button-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelEdit();
                                  }}
                                >
                                  Cancel
                                </button>
                              </td>
                            </>
                          ) : (
                            // View mode - display data
                            <>
                              <td>
                                {product.name}
                                {isLowStock(product) && (
                                  <span className="no-artifacts-flag"> ❗</span>
                                )}
                              </td>
                              <td>{product.category}</td>
                              <td>${parseFloat(product.price).toFixed(2)}</td>
                              <td>{product.inStock}</td>
                              <td>{product.supplier}</td>
                              <td className="action-buttons">
                                <button
                                  className="button-small button-edit"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row selection
                                    handleEditProduct(product);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="button-small button-danger"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row selection
                                    handleDeleteProduct(product.id);
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                {inventory.length === 0 && (
                  <div className="empty-state">
                    <p>No gift shop inventory items found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sales Tab */}
          {activeTab === "sales" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Sales Records</h2>
              </div>
              <p className="section-description">
                View and manage sales transactions from the gift shop. Track
                purchases, customer information, and payment methods.
              </p>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterItems(sales, "sales").map((sale) => (
                      <React.Fragment key={`sale-row-${sale.id}`}>
                        <tr>
                          <td>#{sale.id}</td>
                          <td>{new Date(sale.date).toLocaleDateString()}</td>
                          <td>{sale.customer}</td>
                          <td>{sale.quantity}</td>
                          <td>${parseFloat(sale.total).toFixed(2)}</td>
                          <td>{sale.paymentMethod}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                {sales.length === 0 && (
                  <div className="empty-state">
                    <p>No gift shop item sales found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Shop Reports</h2>
              </div>
              <p className="section-description">
                View reports and analytics for the gift shop performance,
                including inventory value, sales summaries, and financial data.
              </p>

              <div className="report-metrics">
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Total Inventory Value</h3>
                    </div>
                    <div className="metric-value">
                      <DollarSign size={24} />
                      <span>${getTotalInventoryValue().toFixed(2)}</span>
                    </div>
                    <div className="metric-description">
                      <p>Current retail value of all inventory items</p>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Total Products</h3>
                    </div>
                    <div className="metric-value">
                      <Package size={24} />
                      <span>{inventory.length}</span>
                    </div>
                    <div className="metric-description">
                      <p>Number of unique products in inventory</p>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Total Items</h3>
                    </div>
                    <div className="metric-value">
                      <Package size={24} />
                      <span>{getTotalInventoryItems()}</span>
                    </div>
                    <div className="metric-description">
                      <p>Total count of all stocked items</p>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Low Stock Items</h3>
                    </div>
                    <div className="metric-value alert">
                      <span>
                        {inventory.filter((p) => isLowStock(p)).length}
                      </span>
                    </div>
                    <div className="metric-description">
                      <p>
                        Items below minimum stock threshold or global threshold
                      </p>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Recent Sales Total</h3>
                    </div>
                    <div className="metric-value">
                      <DollarSign size={24} />
                      <span>${getTotalSales().toFixed(2)}</span>
                    </div>
                    <div className="metric-description">
                      <p>Sum of sales from recent transactions</p>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Average Sale Value</h3>
                    </div>
                    <div className="metric-value">
                      <DollarSign size={24} />
                      <span>
                        {sales.length > 0
                          ? `$${(getTotalSales() / sales.length).toFixed(2)}`
                          : "$0.00"}
                      </span>
                    </div>
                    <div className="metric-description">
                      <p>Average value per transaction</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="report-tables">
                <div className="section-header">
                  <h3>Top Selling Products</h3>
                </div>
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Units Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Calculate and display top selling products */}
                      {(() => {
                        // Calculate product sales from all transactions
                        const productSales = {};

                        sales.forEach((sale) => {
                          if (!productSales[sale.productId]) {
                            productSales[sale.productId] = {
                              id: sale.productId,
                              name: sale.productName,
                              quantity: 0,
                              revenue: 0,
                              category:
                                inventory.find((p) => p.id === sale.productId)
                                  ?.category || "Unknown",
                            };
                          }

                          productSales[sale.productId].quantity +=
                            sale.quantity;
                          productSales[sale.productId].revenue +=
                            sale.price * sale.quantity;
                        });

                        // Convert to array and sort by quantity
                        const topProducts = Object.values(productSales)
                          .sort((a, b) => b.quantity - a.quantity)
                          .slice(0, 5);

                        return topProducts.map((product, index) => (
                          <tr key={`top-product-${index}`}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.quantity}</td>
                            <td>${parseInt(product.revenue).toFixed(2)}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                  {sales.length === 0 && (
                    <div className="empty-state">
                      <p>No gift shop item sales found.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sales Analysis Chart */}
              <div className="content-section chart-section">
                <div className="section-header">
                  <h3>Sales Analysis by Category</h3>
                </div>
                <div
                  className="sales-chart"
                  style={{ margin: "0 auto", height: "300px", width: "80%" }}
                >
                  <Bar
                    data={generateSalesChartData(sales)}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                          labels: {
                            font: {
                              family: "'Playfair Display', serif",
                              size: 14,
                            },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              let label = context.dataset.label || "";
                              if (label) label += ": ";
                              if (context.dataset.label === "Revenue ($)") {
                                label += "$" + context.parsed.y;
                              } else {
                                label += context.parsed.y;
                              }
                              return label;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: {
                            font: { family: "'Playfair Display', serif" },
                          },
                        },
                        y: {
                          beginAtZero: true,
                          ticks: {
                            font: {
                              family: "'Helvetica Neue', Arial, sans-serif",
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterItems(sales, "sales").map((sale) => (
                      <React.Fragment key={`sale-row-${sale.id}`}>
                        <tr>
                          <td>#{sale.id}</td>
                          <td>{new Date(sale.date).toLocaleDateString()}</td>
                          <td>{sale.customer}</td>
                          <td>{sale.quantity}</td>
                          <td>${parseFloat(sale.total).toFixed(2)}</td>
                          <td>{sale.paymentMethod}</td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                {sales.length === 0 && (
                  <div className="empty-state">
                    <p>No gift shop item sales found.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
