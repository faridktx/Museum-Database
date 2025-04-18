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
  Lock,
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function GiftShopDashboard() {
  // Tab state
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
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  // Selection states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [newProductData, setNewProductData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    cost: "",
    inStock: 0,
    minimumStock: 0,
    supplier: "",
  });

  const [editFormData, setEditFormData] = useState({});

  // Mock employee data
  const [employeeData, setEmployeeData] = useState({
    name: "Taylor Morgan",
    title: "Gift Shop Manager",
    email: "taylor.morgan@museum.org",
    phone: "(555) 789-0123",
    department: "Gift Shop",
    startDate: "June 15, 2021",
  });

  // Mock inventory data
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "Art History Book",
      category: "Books",
      description: "Comprehensive guide to art movements throughout history",
      price: 34.99,
      cost: 17.5,
      inStock: 25,
      minimumStock: 5,
      supplier: "Academic Publishers Inc.",
    },
    {
      id: 2,
      name: "Museum Logo T-Shirt",
      category: "Apparel",
      description: "Cotton t-shirt with embroidered museum logo",
      price: 24.99,
      cost: 8.75,
      inStock: 48,
      minimumStock: 10,
      supplier: "Textile Creations Ltd.",
    },
    {
      id: 3,
      name: "Impressionist Prints Set",
      category: "Prints",
      description: "Set of 5 high-quality prints of impressionist masterpieces",
      price: 45.99,
      cost: 22.3,
      inStock: 15,
      minimumStock: 3,
      supplier: "Fine Art Reproductions Co.",
    },
    {
      id: 4,
      name: "Artist Sketchbook",
      category: "Art Supplies",
      description: "Premium quality artist sketchbook with acid-free paper",
      price: 18.99,
      cost: 7.25,
      inStock: 32,
      minimumStock: 8,
      supplier: "Creative Supplies Inc.",
    },
    {
      id: 5,
      name: "Museum Ceramic Mug",
      category: "Homewares",
      description: "Handcrafted ceramic mug with museum artwork print",
      price: 22.5,
      cost: 9.75,
      inStock: 37,
      minimumStock: 10,
      supplier: "Artisan Ceramics LLC",
    },
    {
      id: 6,
      name: "Renaissance Magnet Set",
      category: "Accessories",
      description:
        "Set of 8 decorative magnets featuring Renaissance paintings",
      price: 15.99,
      cost: 5.3,
      inStock: 42,
      minimumStock: 12,
      supplier: "Heritage Gift Products",
    },
  ]);

  // Mock sales data
  const [sales, setSales] = useState([
    {
      id: 101,
      date: "2023-06-15",
      products: [
        { id: 1, name: "Art History Book", quantity: 2, price: 34.99 },
        { id: 5, name: "Museum Ceramic Mug", quantity: 1, price: 22.5 },
      ],
      customer: "Sarah Johnson",
      total: 92.48, // 2 * 34.99 + 1 * 22.5 = 92.48
      paymentMethod: "Credit Card",
      status: "Completed",
    },
    {
      id: 102,
      date: "2023-06-16",
      products: [
        { id: 2, name: "Museum Logo T-Shirt", quantity: 1, price: 24.99 },
        { id: 6, name: "Renaissance Magnet Set", quantity: 2, price: 15.99 },
      ],
      customer: "Mike Thompson",
      total: 56.97, // 1 * 24.99 + 2 * 15.99 = 56.97
      paymentMethod: "Cash",
      status: "Completed",
    },
    {
      id: 103,
      date: "2023-06-17",
      products: [
        { id: 3, name: "Impressionist Prints Set", quantity: 1, price: 45.99 },
      ],
      customer: "Emma Wilson",
      total: 45.99, // 1 * 45.99 = 45.99
      paymentMethod: "Credit Card",
      status: "Completed",
    },
    {
      id: 104,
      date: "2023-06-18",
      products: [
        { id: 4, name: "Artist Sketchbook", quantity: 3, price: 18.99 },
        { id: 2, name: "Museum Logo T-Shirt", quantity: 2, price: 24.99 },
      ],
      customer: "James Brown",
      total: 106.95, // 3 * 18.99 + 2 * 24.99 = 56.97 + 49.98 = 106.95
      paymentMethod: "Debit Card",
      status: "Completed",
    },
    {
      id: 105,
      date: "2023-06-19",
      products: [
        { id: 1, name: "Art History Book", quantity: 1, price: 34.99 },
        { id: 6, name: "Renaissance Magnet Set", quantity: 1, price: 15.99 },
        { id: 5, name: "Museum Ceramic Mug", quantity: 2, price: 22.5 },
      ],
      customer: "Alex Martinez",
      total: 95.98, // 1 * 34.99 + 1 * 15.99 + 2 * 22.5 = 95.98
      paymentMethod: "Credit Card",
      status: "Completed",
    },
  ]);

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

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Handle password form submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");

    // Password validation
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    // Mock successful password change
    setPasswordSuccess(true);

    // Reset form data
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Hide success message after 3 seconds
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordForm(false);
    }, 3000);
  };

  // Handle saving profile settings
  const handleSaveSettings = () => {
    // Update employee data with form data - only name, email, and phone can be changed
    setEmployeeData({
      ...employeeData,
      name: formData.name || employeeData.name,
      email: formData.email || employeeData.email,
      phone: formData.phone || employeeData.phone,
    });

    // Close settings form
    setShowSettings(false);
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
  const handleSaveNewProduct = () => {
    // Create new product with ID
    const newId = Math.max(...inventory.map((p) => p.id), 0) + 1;
    const newProduct = {
      ...newProductData,
      id: newId,
      price: parseFloat(newProductData.price) || 0,
      cost: parseFloat(newProductData.cost) || 0,
      inStock: parseInt(newProductData.inStock) || 0,
      minimumStock: parseInt(newProductData.minimumStock) || 0,
    };

    // Add to inventory
    setInventory([...inventory, newProduct]);

    // Reset form
    setNewProductData({
      name: "",
      category: "",
      description: "",
      price: "",
      cost: "",
      inStock: 0,
      minimumStock: 0,
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
      cost: "",
      inStock: 0,
      minimumStock: 0,
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
      cost: product.cost,
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
  const handleSaveProduct = () => {
    // Update inventory with edited data
    setInventory(
      inventory.map((item) => {
        if (item.id === editingProduct) {
          return {
            ...item,
            name: editFormData.name,
            category: editFormData.category,
            description: editFormData.description,
            price: parseFloat(editFormData.price) || 0,
            cost: parseFloat(editFormData.cost) || 0,
            inStock: parseInt(editFormData.inStock) || 0,
            minimumStock: parseInt(editFormData.minimumStock) || 0,
            supplier: editFormData.supplier,
          };
        }
        return item;
      }),
    );

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
  const handleDeleteProduct = (productId) => {
    // Mark for deletion (visual effect)
    setDeletingProducts([...deletingProducts, productId]);

    // Remove after animation
    setTimeout(() => {
      setInventory(inventory.filter((product) => product.id !== productId));
      setDeletingProducts(deletingProducts.filter((id) => id !== productId));
    }, 300);
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
                      className={`action-button ${showPasswordForm ? "action-button-cancel" : ""}`}
                      onClick={() => {
                        setShowPasswordForm(!showPasswordForm);
                        if (showSettings) setShowSettings(false);
                        setPasswordError("");
                        setPasswordSuccess(false);
                      }}
                    >
                      {showPasswordForm ? (
                        <>
                          <X size={16} />
                          <span>Cancel</span>
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          <span>Change Password</span>
                        </>
                      )}
                    </button>
                    <button
                      className={`action-button ${showSettings ? "action-button-cancel" : ""}`}
                      onClick={() => {
                        setShowSettings(!showSettings);
                        if (showPasswordForm) setShowPasswordForm(false);
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

                {showPasswordForm ? (
                  <div className="settings-form password-form">
                    <h3>Change Password</h3>
                    {passwordSuccess && (
                      <div className="form-success-message">
                        Password changed successfully!
                      </div>
                    )}
                    {passwordError && (
                      <div className="form-error-message">{passwordError}</div>
                    )}
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="form-group">
                        <label htmlFor="currentPassword">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirmPassword">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="form-actions">
                        <button
                          type="button"
                          className="cancel-button"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordData({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                            setPasswordError("");
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="save-button">
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                ) : null}

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
                        <label htmlFor="new-name">Product Name</label>
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
                        <label htmlFor="new-category">Category</label>
                        <input
                          type="text"
                          id="new-category"
                          name="category"
                          value={newProductData.category}
                          onChange={handleNewProductChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="new-price">Price ($)</label>
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
                        <label htmlFor="new-cost">Cost ($)</label>
                        <input
                          type="number"
                          id="new-cost"
                          name="cost"
                          step="0.01"
                          min="0"
                          value={newProductData.cost}
                          onChange={handleNewProductChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="new-inStock">Current Stock</label>
                        <input
                          type="number"
                          id="new-inStock"
                          name="inStock"
                          min="0"
                          value={newProductData.inStock}
                          onChange={handleNewProductChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="new-supplier">Supplier</label>
                        <input
                          type="text"
                          id="new-supplier"
                          name="supplier"
                          value={newProductData.supplier}
                          onChange={handleNewProductChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="new-description">Description</label>
                      <textarea
                        id="new-description"
                        name="description"
                        value={newProductData.description}
                        onChange={handleNewProductChange}
                        rows={3}
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
                            ${selectedProduct?.id === product.id ? "selected" : ""}
                            ${deletingProducts.includes(product.id) ? "deleting" : ""}
                            ${editingProduct === product.id ? "editing" : ""}
                          `}
                          onClick={() => {
                            if (editingProduct !== product.id) {
                              setSelectedProduct(
                                selectedProduct?.id === product.id
                                  ? null
                                  : product,
                              );
                            }
                          }}
                        >
                          {editingProduct === product.id ? (
                            // Edit mode - show input fields
                            <>
                              <td>
                                <input
                                  type="text"
                                  name="name"
                                  value={editFormData.name || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="category"
                                  value={editFormData.category || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  name="price"
                                  step="0.01"
                                  min="0"
                                  value={editFormData.price || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  name="inStock"
                                  min="0"
                                  value={editFormData.inStock || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="supplier"
                                  value={editFormData.supplier || ""}
                                  onChange={handleEditFormChange}
                                  onClick={(e) => e.stopPropagation()}
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
                              <td>${product.price.toFixed(2)}</td>
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
                        {selectedProduct?.id === product.id && (
                          <tr className="detail-row">
                            <td colSpan="6">
                              <div className="inline-detail-view">
                                <h3>Product Details</h3>
                                <div className="detail-content">
                                  <h4>{selectedProduct.name}</h4>
                                  <div className="artist-detail-section">
                                    <h5>Category</h5>
                                    <p>{selectedProduct.category}</p>
                                  </div>
                                  <div className="artist-detail-section">
                                    <h5>Description</h5>
                                    <p>{selectedProduct.description}</p>
                                  </div>
                                  <div className="artist-detail-section">
                                    <h5>Pricing</h5>
                                    <p>
                                      <strong>Price:</strong> $
                                      {selectedProduct.price.toFixed(2)}
                                      <br />
                                      <strong>Cost:</strong> $
                                      {selectedProduct.cost.toFixed(2)}
                                      <br />
                                      <strong>Profit Margin:</strong> $
                                      {(
                                        selectedProduct.price -
                                        selectedProduct.cost
                                      ).toFixed(2)}
                                      (
                                      {Math.round(
                                        ((selectedProduct.price -
                                          selectedProduct.cost) /
                                          selectedProduct.price) *
                                          100,
                                      )}
                                      %)
                                    </p>
                                  </div>
                                  <div className="artist-detail-section">
                                    <h5>Inventory</h5>
                                    <p>
                                      <strong>Current Stock:</strong>{" "}
                                      {selectedProduct.inStock}
                                      <br />
                                      <strong>Minimum Stock:</strong>{" "}
                                      {selectedProduct.minimumStock}
                                      <br />
                                      <strong>Status:</strong>{" "}
                                      {isLowStock(selectedProduct) ? (
                                        <span className="text-danger">
                                          Low Stock - Reorder Needed
                                          {selectedProduct.inStock <=
                                            lowInventoryThreshold &&
                                            " (Below Global Threshold)"}
                                          {selectedProduct.inStock <=
                                            selectedProduct.minimumStock &&
                                            " (Below Product Minimum)"}
                                        </span>
                                      ) : (
                                        "In Stock"
                                      )}
                                    </p>
                                  </div>
                                  <div className="artist-detail-section">
                                    <h5>Supplier Information</h5>
                                    <p>{selectedProduct.supplier}</p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
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
                        <tr
                          className={
                            selectedSale?.id === sale.id ? "selected" : ""
                          }
                          onClick={() => {
                            setSelectedSale(
                              selectedSale?.id === sale.id ? null : sale,
                            );
                          }}
                        >
                          <td>#{sale.id}</td>
                          <td>{new Date(sale.date).toLocaleDateString()}</td>
                          <td>{sale.customer}</td>
                          <td>{sale.products.length}</td>
                          <td>${sale.total.toFixed(2)}</td>
                          <td>{sale.paymentMethod}</td>
                        </tr>
                        {selectedSale?.id === sale.id && (
                          <tr className="detail-row">
                            <td colSpan="6">
                              <div className="inline-detail-view">
                                <h3>Sale Details</h3>
                                <div className="detail-content">
                                  <h4>Order #{selectedSale.id}</h4>
                                  <p>
                                    <strong>Date:</strong>{" "}
                                    {new Date(
                                      selectedSale.date,
                                    ).toLocaleDateString()}
                                    <br />
                                    <strong>Customer:</strong>{" "}
                                    {selectedSale.customer}
                                    <br />
                                    <strong>Payment Method:</strong>{" "}
                                    {selectedSale.paymentMethod}
                                    <br />
                                    <strong>Status:</strong>{" "}
                                    {selectedSale.status}
                                  </p>
                                  <div className="artist-detail-section">
                                    <h5>Items Purchased</h5>
                                    <table className="nested-table">
                                      <thead>
                                        <tr>
                                          <th>Product</th>
                                          <th>Quantity</th>
                                          <th>Price</th>
                                          <th>Subtotal</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {selectedSale.products.map(
                                          (item, index) => (
                                            <tr key={`item-${index}`}>
                                              <td>{item.name}</td>
                                              <td>{item.quantity}</td>
                                              <td>${item.price.toFixed(2)}</td>
                                              <td>
                                                $
                                                {(
                                                  item.price * item.quantity
                                                ).toFixed(2)}
                                              </td>
                                            </tr>
                                          ),
                                        )}
                                        <tr className="total-row">
                                          <td
                                            colSpan="3"
                                            className="text-right"
                                          >
                                            <strong>Total:</strong>
                                          </td>
                                          <td>
                                            <strong>
                                              ${selectedSale.total.toFixed(2)}
                                            </strong>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
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
                        ${(getTotalSales() / sales.length).toFixed(2)}
                      </span>
                    </div>
                    <div className="metric-description">
                      <p>Average value per transaction</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales Analysis Chart */}
              <div className="content-section chart-section">
                <div className="section-header">
                  <h3>Sales Analysis by Category</h3>
                </div>
                <div className="chart-container">
                  <div className="sales-chart">
                    <Bar
                      data={{
                        labels: [
                          "Books",
                          "Apparel",
                          "Accessories",
                          "Art Supplies",
                          "Homewares",
                          "Prints",
                        ],
                        datasets: [
                          {
                            label: "Revenue ($)",
                            data: [104.97, 74.97, 47.97, 56.97, 67.5, 45.99],
                            backgroundColor: "rgba(74, 111, 165, 0.7)",
                            borderColor: "rgba(74, 111, 165, 1)",
                            borderWidth: 1,
                            borderRadius: 5,
                            barThickness: 40,
                          },
                          {
                            label: "Units Sold",
                            data: [3, 3, 3, 3, 3, 1],
                            backgroundColor: "rgba(155, 133, 121, 0.7)",
                            borderColor: "rgba(155, 133, 121, 1)",
                            borderWidth: 1,
                            borderRadius: 5,
                            barThickness: 40,
                          },
                        ],
                      }}
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
                                if (label) {
                                  label += ": ";
                                }
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
                            grid: {
                              display: false,
                            },
                            ticks: {
                              font: {
                                family: "'Playfair Display', serif",
                              },
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
                      height={340}
                    />
                    <div className="chart-insights">
                      <h4>Key Insights:</h4>
                      <ul>
                        <li>
                          <strong>Books:</strong> $104.97 revenue from 3 units
                          sold{" "}
                          <span className="top-performer">
                            (Top performing category)
                          </span>
                        </li>
                        <li>
                          <strong>Apparel:</strong> $74.97 revenue from 3 units
                          sold
                        </li>
                        <li>
                          <strong>Homewares:</strong> $67.50 revenue from 3
                          units sold
                        </li>
                        <li>
                          <strong>Art Supplies:</strong> $56.97 revenue from 3
                          units sold
                        </li>
                        <li>
                          <strong>Accessories:</strong> $47.97 revenue from 3
                          units sold
                        </li>
                        <li>
                          <strong>Prints:</strong> $45.99 revenue from 1 unit
                          sold
                        </li>
                      </ul>
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
                          sale.products.forEach((item) => {
                            if (!productSales[item.id]) {
                              productSales[item.id] = {
                                id: item.id,
                                name: item.name,
                                quantity: 0,
                                revenue: 0,
                                category:
                                  inventory.find((p) => p.id === item.id)
                                    ?.category || "Unknown",
                              };
                            }

                            productSales[item.id].quantity += item.quantity;
                            productSales[item.id].revenue +=
                              item.price * item.quantity;
                          });
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
                            <td>${product.revenue.toFixed(2)}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

                <div className="section-header">
                  <h3>Low Stock Alert</h3>
                </div>
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Current Stock</th>
                        <th>Minimum Required</th>
                        <th>Reorder Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory
                        .filter((item) => isLowStock(item))
                        .map((item, index) => (
                          <tr key={`low-stock-${index}`} className="alert-row">
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.inStock}</td>
                            <td>{item.minimumStock}</td>
                            <td>
                              {Math.max(
                                item.minimumStock * 2 - item.inStock,
                                5,
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
