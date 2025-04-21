import React, { useState, useEffect } from "react";
import {
  Users,
  Tag,
  Bookmark,
  Filter,
  Search,
  Plus,
  BarChart,
  Settings as SettingsIcon,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import { useUser } from "@clerk/clerk-react";
import "../../components/components.css";
import "./adminDash.css";
import { ROLES, ROLECOLORS } from "../../components/constants.js";
import { ErrorModal } from "../../components/modal";
import { Bell } from "lucide-react";
import { Link } from "wouter";

function addStatusToExhibit(exhibit) {
  const today = new Date();
  const start = new Date(exhibit.startDate);
  const end = new Date(exhibit.endDate);

  let status;
  if (start > today) {
    status = "upcoming";
  } else if (end < today) {
    status = "past";
  } else {
    status = "ongoing";
  }

  return {
    ...exhibit,
    status,
  };
}

export function AdminDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  // Keep track of employees being deleted (for animation)
  const [deletingEmployees, setDeletingEmployees] = useState([]);

  // Keep track of exhibits being deleted (for animation)
  const [deletingExhibits, setDeletingExhibits] = useState([]);

  // State for employee being edited
  const [editingEmployee, setEditingEmployee] = useState(null);

  // State for exhibit being edited
  const [editingExhibit, setEditingExhibit] = useState(null);

  // State for storing form data when editing
  const [editFormData, setEditFormData] = useState({});

  // State for showing new employee form
  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false);

  const [exhibitsMap, setExhibitsMap] = useState([]);
  useEffect(() => {
    const getExhibitsMap = async () => {
      const url = new URL(
        "/api/getexhibitsmap/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setExhibitsMap(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getExhibitsMap();
  }, []);

  useEffect(() => {
    const getAdminInfo = async () => {
      const url = new URL(
        "/api/getadmininfo/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setAdminData({
          ...data.data,
          department: "Administration",
        });
      } catch (err) {
        console.log(err);
      }
    };
    getAdminInfo();
  }, []);

  // State for new employee form data
  const [newEmployeeData, setNewEmployeeData] = useState({
    id: "",
    name: "",
    exhibitId: "",
    ssn: "",
    phone: "",
    address: "",
    personalEmail: "",
    workEmail: "",
    birthDate: "",
    hiringDate: "",
    firedDate: "",
    salary: "",
    role: "",
  });

  // State for showing new exhibit form
  const [showNewExhibitForm, setShowNewExhibitForm] = useState(false);

  // State for new exhibit form data
  const [newExhibitData, setNewExhibitData] = useState({
    id: "",
    title: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  // Separate search queries for each tab
  const [searchQueries, setSearchQueries] = useState({
    employees: "",
    exhibits: "",
    reports: "",
  });

  // Function to update search query for current tab
  const updateSearchQuery = (value) => {
    setSearchQueries((prev) => ({
      ...prev,
      [activeTab]: value,
    }));
  };

  // Current search query based on active tab
  const currentSearchQuery = searchQueries[activeTab] || "";

  const [filters, setFilters] = useState({
    employees: {
      name: "",
      role: "",
      status: "",
    },
    exhibits: {
      title: "",
      status: "",
      date: "",
    },
  });

  // Function to filter items based on search query and advanced filters
  const filterItems = (items, type) => {
    let filteredItems = [...items];

    // Apply search query filter first
    const tabSearchQuery = searchQueries[type] || "";
    if (tabSearchQuery.trim()) {
      const query = tabSearchQuery.toLowerCase().trim();

      if (type === "employees") {
        filteredItems = filteredItems.filter((employee) =>
          employee.name.toLowerCase().includes(query),
        );
      } else if (type === "exhibits") {
        filteredItems = filteredItems.filter((exhibit) => {
          return exhibit.title.toLowerCase().includes(query);
        });
      }
    }

    // Then apply advanced filters
    if (type === "employees") {
      const { name, role, status } = filters.employees;

      if (name) {
        filteredItems = filteredItems.filter((employee) =>
          employee.name.toLowerCase().includes(name.toLowerCase()),
        );
      }

      if (role) {
        filteredItems = filteredItems.filter((employee) =>
          employee.role.toLowerCase().includes(role.toLowerCase()),
        );
      }

      if (status) {
        filteredItems = filteredItems.filter(
          (employee) => employee.status.toLowerCase() === status.toLowerCase(),
        );
      }
    } else if (type === "exhibits") {
      const { title, status, date } = filters.exhibits;

      if (title) {
        filteredItems = filteredItems.filter((exhibit) =>
          exhibit.title.toLowerCase().includes(title.toLowerCase()),
        );
      }

      if (status) {
        filteredItems = filteredItems.filter(
          (exhibit) => exhibit.status.toLowerCase() === status.toLowerCase(),
        );
      }

      if (date) {
        filteredItems = filteredItems.filter((exhibit) =>
          exhibit.startDate.toLowerCase().includes(date.toLowerCase()),
        );
      }
    }

    return filteredItems;
  };

  const [showSettings, setShowSettings] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    bio: "",
  });

  const [adminData, setAdminData] = useState({
    employeeID: "",
    name: "",
    title: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    joinDate: "",
  });

  useEffect(() => {
    const getEmployees = async () => {
      const url = new URL(
        "/api/getemployees/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setEmployees(
          data.data.map((emp) => ({
            ...emp,
            status: emp.firedDate === null ? "active" : "inactive",
          })),
        );
      } catch (err) {
        console.log(err);
      }
    };
    getEmployees();
  }, []);

  useEffect(() => {
    const getExhibits = async () => {
      const today = new Date();
      const url = new URL(
        "/api/getexhibits/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setExhibits(data.data.map(addStatusToExhibit));
      } catch (err) {
        console.log(err);
      }
    };
    getExhibits();
  }, []);

  const [employees, setEmployees] = useState([]);
  const [exhibits, setExhibits] = useState([]);

  // Function to handle editing an employee
  const handleEditEmployee = (employee) => {
    // Set the current employee as the one being edited
    setEditingEmployee(employee.id);

    // Initialize the form data with current employee values
    setEditFormData({
      name: employee.name,
      workEmail: employee.workEmail,
      phone: employee.phone,
      role: employee.role,
      status: employee.status,
      hiringDate: employee.hiringDate,
      salary: employee.salary,
    });
  };

  // Function to save edited employee data
  const handleSaveEmployee = async () => {
    const url = new URL("/api/setemployee/", process.env.REACT_APP_BACKEND_URL);
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editFormData, id: editingEmployee }),
      });
      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data.errors);
        setShowError(true);
      } else {
        // Update the employees array with edited data
        setEmployees(
          employees.map((employee) =>
            employee.id === editingEmployee
              ? { ...employee, ...editFormData }
              : employee,
          ),
        );
      }
    } catch (err) {
      console.log(err);
    }

    // Exit edit mode
    setEditingEmployee(null);
    setEditFormData({});
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setEditFormData({});
  };

  // Handle form field changes when editing employee
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Function to handle deleting an employee
  const handleDeleteEmployee = async (employeeId) => {
    // Add this employee to the deleting list (for animation)
    setDeletingEmployees([...deletingEmployees, employeeId]);

    // Wait for animation to complete before removing from the array
    setTimeout(() => {
      setEmployees(employees.filter((employee) => employee.id !== employeeId));
      setDeletingEmployees(deletingEmployees.filter((id) => id !== employeeId));
    }, 300);
    const url = new URL(
      "/api/deleteemployee/",
      process.env.REACT_APP_BACKEND_URL,
    );
    url.searchParams.append("id", user.id);
    try {
      await fetch(url.toString(), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: employeeId }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Function to handle editing an exhibit
  const handleEditExhibit = (exhibit) => {
    // Set the current exhibit as the one being edited
    setEditingExhibit(exhibit.id);

    // Initialize the form data with current exhibit values
    setEditFormData({
      title: exhibit.title,
      startDate: exhibit.startDate,
      endDate: exhibit.endDate,
      description: exhibit.description,
    });
  };

  // Function to save edited exhibit data
  const handleSaveExhibit = async () => {
    const url = new URL("/api/setexhibit/", process.env.REACT_APP_BACKEND_URL);
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editFormData, id: editingExhibit }),
      });
      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data.errors);
        setShowError(true);
      } else {
        setExhibits(
          exhibits.map((exhibit) =>
            exhibit.id === editingExhibit
              ? addStatusToExhibit({ ...exhibit, ...editFormData })
              : exhibit,
          ),
        );
      }
    } catch (err) {
      console.log(err);
    }

    // Exit edit mode
    setEditingExhibit(null);
    setEditFormData({});
  };

  // Function to cancel editing exhibit
  const handleCancelExhibitEdit = () => {
    setEditingExhibit(null);
    setEditFormData({});
  };

  // Function to handle deleting an exhibit
  const handleDeleteExhibit = async (exhibitId) => {
    // Add this exhibit to the deleting list (for animation)
    setDeletingExhibits([...deletingExhibits, exhibitId]);

    // Wait for animation to complete before removing from the array
    setTimeout(() => {
      setExhibits(exhibits.filter((exhibit) => exhibit.id !== exhibitId));
      setDeletingExhibits(deletingExhibits.filter((id) => id !== exhibitId));
    }, 300); // Match the CSS transition time
    const url = new URL(
      "/api/deleteexhibit/",
      process.env.REACT_APP_BACKEND_URL,
    );
    url.searchParams.append("id", user.id);
    try {
      await fetch(url.toString(), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exhibitId: exhibitId }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Handle form field changes when editing exhibit
  const handleExhibitFormChange = (e) => {
    const { name, value } = e.target;

    // If the field is for a number, convert the value to a number
    if (
      name === "visitorCount" ||
      name === "ticketsSold" ||
      name === "ticketPrice" ||
      name === "revenue"
    ) {
      setEditFormData({
        ...editFormData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  // Function to save a new employee
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSaveNewEmployee = async () => {
    const url = new URL("/api/addemployee/", process.env.REACT_APP_BACKEND_URL);
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployeeData),
      });
      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data.errors);
        setShowError(true);
        return;
      }
      newEmployeeData.id = parseInt(data.insertedId);
    } catch (err) {
      console.log(err);
    }

    // Add the new employee to the employees array
    setEmployees([
      ...employees,
      {
        ...newEmployeeData,
        status: newEmployeeData.firedDate === null ? "active" : "inactive",
      },
    ]);

    // Reset the form
    setNewEmployeeData({
      id: "",
      name: "",
      exhibitId: "",
      ssn: "",
      phone: "",
      address: "",
      personalEmail: "",
      workEmail: "",
      birthDate: "",
      hiringDate: "",
      firedDate: "",
      salary: "",
      role: "",
    });

    // Hide the new employee form
    setShowNewEmployeeForm(false);
  };

  // Function to save a new exhibit
  const handleSaveNewExhibit = async () => {
    const url = new URL("/api/addexhibit/", process.env.REACT_APP_BACKEND_URL);
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExhibitData),
      });
      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data.errors);
        setShowError(true);
        return;
      }
      newExhibitData.id = parseInt(data.insertedId);
    } catch (err) {
      console.log(err);
    }
    setExhibits([...exhibits, addStatusToExhibit(newExhibitData)]);

    // Reset the form
    setNewExhibitData({
      id: "",
      title: "",
      startDate: "",
      endDate: "",
      description: "",
    });

    // Hide the new exhibit form
    setShowNewExhibitForm(false);
  };

  // Handle form field changes for the new employee form
  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployeeData({
      ...newEmployeeData,
      [name]: value,
    });
  };

  // Handle form field changes for the new exhibit form
  const handleNewExhibitChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "visitorCount" ||
      name === "ticketsSold" ||
      name === "ticketPrice" ||
      name === "revenue"
    ) {
      setNewExhibitData({
        ...newExhibitData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setNewExhibitData({
        ...newExhibitData,
        [name]: value,
      });
    }
  };

  // Handle profile settings form submission
  const handleSaveSettings = async (e) => {
    setAdminData(formData);
    setShowSettings(false);
    const url = new URL(
      "/api/setadmininfo/",
      process.env.REACT_APP_BACKEND_URL,
    );
    url.searchParams.append("id", user.id);
    try {
      await fetch(url.toString(), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          employeeID: adminData.employeeID,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Handle profile form field changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [unresolvedCount, setUnresolvedCount] = useState(0);
  useEffect(() => {
    fetch("/api/fraud-alerts/unresolved-count")
      .then((res) => res.json())
      .then((data) => setUnresolvedCount(data.count || 0))
      .catch((err) => console.error("Failed to fetch alerts", err));
  }, []);

  // Initialize form data when entering edit mode
  useEffect(() => {
    if (showSettings) {
      setFormData({
        name: adminData.name,
        title: adminData.title,
        email: adminData.email,
        phone: adminData.phone,
        department: adminData.department,
        role: adminData.role,
        bio: adminData.bio,
      });
    }
  }, [showSettings, adminData]);

  // Handle filter form changes
  const handleFilterChange = (e, type) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: {
        ...prevFilters[type],
        [name]: value,
      },
    }));
  };

  // Filter employees and exhibits based on filters and search
  const filteredEmployees = filterItems(employees, "employees");
  const filteredExhibits = filterItems(exhibits, "exhibits");

  return (
    <div className="curator-dashboard" style={{ marginBottom: "3rem" }}>
      <div className="dashboard-header" style={{ paddingTop: "100px" }}>
        <div className="header-title">
          <h1>Curio Collection - Admin Portal</h1>
        </div>

        <div className="horizontal-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("profile");
              setShowAdvancedFilter(false);
            }}
          >
            <Users size={16} />
            <span>Profile</span>
          </button>
          <button
            className={`tab-button ${activeTab === "employees" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("employees");
              setShowAdvancedFilter(false);
            }}
          >
            <Tag size={16} />
            <span>Employees</span>
          </button>
          <button
            className={`tab-button ${activeTab === "exhibits" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("exhibits");
              setShowAdvancedFilter(false);
            }}
          >
            <Bookmark size={16} />
            <span>Exhibits</span>
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
          <div className="tab-button notification-icon">
            <Link href="/dashboard/notifications" aria-label="Notifications">
              <Bell size={20} />
              {unresolvedCount > 0 && (
                <span className="notification-badge">{unresolvedCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* Only show search on employees and exhibits tabs */}
        {activeTab === "employees" || activeTab === "exhibits" ? (
          <div className="header-search">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder={
                  activeTab === "employees"
                    ? "Search employee names..."
                    : activeTab === "exhibits"
                      ? "Search exhibit titles..."
                      : "Search..."
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
          </div>
        ) : null}
      </div>

      <div className="dashboard-content">
        {/* Advanced Filters for Employees */}
        {activeTab === "employees" && showAdvancedFilter && (
          <div
            className={`advanced-filter-panel ${showAdvancedFilter ? "open" : ""}`}
          >
            <div className="filter-row">
              <div className="filter-item">
                <label htmlFor="name-filter">Name</label>
                <input
                  type="text"
                  id="name-filter"
                  name="name"
                  value={filters.employees.name}
                  onChange={(e) => handleFilterChange(e, "employees")}
                  placeholder="Filter by name"
                />
              </div>
              <div className="filter-item">
                <label htmlFor="role-filter">Role</label>
                <input
                  type="text"
                  id="role-filter"
                  name="role"
                  value={filters.employees.role}
                  onChange={(e) => handleFilterChange(e, "employees")}
                  placeholder="Filter by role"
                />
              </div>
              <div className="filter-item">
                <label htmlFor="status-filter">Status</label>
                <select
                  id="status-filter"
                  name="status"
                  value={filters.employees.status}
                  onChange={(e) => handleFilterChange(e, "employees")}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Filters for Exhibits */}
        {activeTab === "exhibits" && showAdvancedFilter && (
          <div
            className={`advanced-filter-panel ${showAdvancedFilter ? "open" : ""}`}
          >
            <div className="filter-row">
              <div className="filter-item">
                <label htmlFor="title-filter">Title</label>
                <input
                  type="text"
                  id="title-filter"
                  name="title"
                  value={filters.exhibits.title}
                  onChange={(e) => handleFilterChange(e, "exhibits")}
                  placeholder="Filter by title"
                />
              </div>
              <div className="filter-item">
                <label htmlFor="status-filter">Status</label>
                <select
                  id="status-filter"
                  name="status"
                  value={filters.exhibits.status}
                  onChange={(e) => handleFilterChange(e, "exhibits")}
                >
                  <option value="">All Statuses</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="past">Past</option>
                </select>
              </div>
              <div className="filter-item">
                <label htmlFor="date-filter">Start Date</label>
                <input
                  type="text"
                  id="date-filter"
                  name="date"
                  value={filters.exhibits.date}
                  onChange={(e) => handleFilterChange(e, "exhibits")}
                  placeholder="Filter by date"
                />
              </div>
            </div>
          </div>
        )}

        <div className="tab-content">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <>
              <div className="profile-summary-card">
                <div className="profile-info-container">
                  <div className="profile-avatar">
                    <div className="profile-initials">
                      {(adminData.name || "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>
                  <div className="profile-summary-details">
                    <h2>{adminData.name}</h2>
                    <p className="curator-title">{adminData.title}</p>
                    <div className="curator-department">
                      <span>{adminData.department}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-stats">
                  <div className="profile-stat-item">
                    <span className="stat-number">{employees.length}</span>
                    <span className="stat-label">Employees</span>
                  </div>
                  <div className="profile-stat-item">
                    <span className="stat-number">{exhibits.length}</span>
                    <span className="stat-label">Exhibits</span>
                  </div>
                  <div className="profile-stat-item">
                    <span className="stat-number">
                      {exhibits.filter((e) => e.status === "ongoing").length}
                    </span>
                    <span className="stat-label">Ongoing Exhibits</span>
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
                          onChange={handleProfileChange}
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
                          onChange={handleProfileChange}
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
                          onChange={handleProfileChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="title">Job Title</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={adminData.title}
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
                          value={adminData.department}
                          disabled
                        />
                        <small className="field-note">
                          Department cannot be changed.
                        </small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="hiringDate">Start Date</label>
                        <input
                          type="text"
                          id="hiringDate"
                          name="hiringDate"
                          value={adminData.hiringDate}
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
                        <p>{adminData.department}</p>
                      </div>
                      <div className="detail-section">
                        <h3>Position</h3>
                        <p>{adminData.title}</p>
                      </div>
                      <div className="detail-section">
                        <h3>Start Date</h3>
                        <p>{adminData.hiringDate}</p>
                      </div>
                    </div>

                    <div className="profile-contact-info">
                      <h3>Contact Information</h3>
                      <p>
                        <strong>Email:</strong>{" "}
                        <span style={{ wordBreak: "break-word" }}>
                          {adminData.email}
                        </span>
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        <span style={{ wordBreak: "break-word" }}>
                          {adminData.phone}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Employees Tab */}
          {activeTab === "employees" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Employee Management</h2>
                <button
                  className={`action-button ${showNewEmployeeForm ? "action-button-cancel" : ""}`}
                  onClick={() => setShowNewEmployeeForm(!showNewEmployeeForm)}
                >
                  {showNewEmployeeForm ? (
                    <>
                      <X size={16} />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Add New Employee</span>
                    </>
                  )}
                </button>
              </div>
              <p className="section-description">
                Manage the employees of the museum. Track staff information,
                update details, and monitor performance metrics across different
                departments and roles.
              </p>

              {/* New Employee Form */}
              {showNewEmployeeForm && (
                <div className="new-artist-form">
                  <h3>Add New Employee</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveNewEmployee();
                    }}
                  >
                    <div className="form-row">
                      <div className="form-group">
                        <label className="required" htmlFor="name">
                          Employee Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={newEmployeeData.name}
                          onChange={handleNewEmployeeChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="required" htmlFor="ssn">
                          SSN
                        </label>
                        <input
                          type="text"
                          id="ssn"
                          name="ssn"
                          value={newEmployeeData.ssn}
                          onChange={handleNewEmployeeChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="required" htmlFor="new-exhibitId">
                          Exhibit
                        </label>
                        <select
                          id="new-exhibitId"
                          name="exhibitId"
                          value={newEmployeeData.exhibitId}
                          onChange={handleNewEmployeeChange}
                          required
                        >
                          <option disabled selected value="">
                            Select an exhibit
                          </option>
                          {exhibitsMap.map((exhibit) => (
                            <option key={exhibit.id} value={exhibit.id}>
                              {exhibit.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="required" htmlFor="personalEmail">
                          Personal Email
                        </label>
                        <input
                          type="email"
                          id="personalEmail"
                          name="personalEmail"
                          value={newEmployeeData.personalEmail}
                          onChange={handleNewEmployeeChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="required" htmlFor="workEmail">
                          Work Email
                        </label>
                        <input
                          type="email"
                          id="workEmail"
                          name="workEmail"
                          value={newEmployeeData.workEmail}
                          onChange={handleNewEmployeeChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="required" htmlFor="address">
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={newEmployeeData.address}
                          onChange={handleNewEmployeeChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="required" htmlFor="phone">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={newEmployeeData.phone}
                          onChange={handleNewEmployeeChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="required" htmlFor="role">
                          Role
                        </label>
                        <select
                          id="role"
                          name="role"
                          value={newEmployeeData.role}
                          onChange={handleNewEmployeeChange}
                          required
                        >
                          <option disabled selected value="">
                            Select a role
                          </option>
                          {ROLES.map((role, index) => (
                            <option key={index} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="required" htmlFor="salary">
                          Salary
                        </label>
                        <input
                          type="number"
                          id="salary"
                          name="salary"
                          value={newEmployeeData.salary}
                          onChange={handleNewEmployeeChange}
                          step="1"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="required" htmlFor="birthDate">
                          Birth Date
                        </label>
                        <input
                          type="date"
                          id="birthDate"
                          name="birthDate"
                          value={newEmployeeData.birthDate}
                          onChange={handleNewEmployeeChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="required" htmlFor="hiringDate">
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="hiringDate"
                          name="hiringDate"
                          value={newEmployeeData.hiringDate}
                          onChange={handleNewEmployeeChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="firedDate">Fired Date</label>
                        <input
                          type="date"
                          id="firedDate"
                          name="firedDate"
                          value={newEmployeeData.firedDate}
                          onChange={handleNewEmployeeChange}
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="save-button">
                        Add Employee
                      </button>
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setShowNewEmployeeForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Employees Table */}
              <div className="data-table-container">
                <table className="data-table artists-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Phone Number</th>
                      <th>Start Date</th>
                      <th>Status</th>
                      <th>Work Email</th>
                      <th>Salary</th>
                      <th className="actions-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => {
                      const isBeingDeleted = deletingEmployees.includes(
                        employee.id,
                      );
                      const isBeingEdited = editingEmployee === employee.id;
                      return (
                        <tr
                          key={employee.id}
                          className={`
                              ${isBeingDeleted ? "deleting" : ""}
                              ${isBeingEdited ? "editing" : ""}
                            `}
                        >
                          {isBeingEdited ? (
                            // Editing mode fields
                            <>
                              <td>
                                <input
                                  type="text"
                                  name="name"
                                  value={editFormData.name}
                                  onChange={handleEditFormChange}
                                  required
                                />
                              </td>
                              <td>
                                <select
                                  name="role"
                                  value={editFormData.role}
                                  onChange={handleEditFormChange}
                                  required
                                >
                                  {ROLES.map((role, index) => (
                                    <option key={index} value={role}>
                                      {role}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="tel"
                                  name="phone"
                                  value={editFormData.phone}
                                  onChange={handleEditFormChange}
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="date"
                                  name="hiringDate"
                                  value={editFormData.hiringDate}
                                  onChange={handleEditFormChange}
                                  required
                                />
                              </td>
                              <td>
                                <span
                                  className={`status-badge ${employee.status}`}
                                >
                                  {employee.status.charAt(0).toUpperCase() +
                                    employee.status.slice(1)}
                                </span>
                              </td>
                              <td>
                                <input
                                  type="email"
                                  name="workEmail"
                                  value={editFormData.workEmail}
                                  onChange={handleEditFormChange}
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  name="salary"
                                  value={editFormData.salary}
                                  onChange={handleEditFormChange}
                                  step="1"
                                  min="0"
                                  required
                                />
                              </td>
                              <td className="actions-cell">
                                <button
                                  className="icon-button save"
                                  onClick={handleSaveEmployee}
                                  title="Save"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                    <polyline points="7 3 7 8 15 8"></polyline>
                                  </svg>
                                </button>
                                <button
                                  className="icon-button cancel"
                                  onClick={handleCancelEdit}
                                  title="Cancel"
                                >
                                  <X size={16} />
                                </button>
                              </td>
                            </>
                          ) : (
                            // Normal view fields
                            <>
                              <td>
                                <div className="employee-name-cell">
                                  <span>{employee.name}</span>
                                </div>
                              </td>
                              <td>{employee.role}</td>
                              <td>{employee.phone}</td>
                              <td>{employee.hiringDate}</td>
                              <td>
                                <span
                                  className={`status-badge ${employee.status}`}
                                >
                                  {employee.status.charAt(0).toUpperCase() +
                                    employee.status.slice(1)}
                                </span>
                              </td>
                              <td
                                style={{
                                  maxWidth: "200px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {employee.workEmail}
                              </td>
                              <td>
                                ${parseInt(employee.salary).toLocaleString()}
                              </td>
                              <td className="actions-cell">
                                <button
                                  className="icon-button edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditEmployee(employee);
                                  }}
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  className="icon-button delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEmployee(employee.id);
                                  }}
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {employees.length === 0 && (
                  <div className="empty-state">
                    <p>No museum employees found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Exhibits Tab */}
          {activeTab === "exhibits" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Exhibit Management</h2>
                <button
                  className={`action-button ${showNewExhibitForm ? "action-button-cancel" : ""}`}
                  onClick={() => setShowNewExhibitForm(!showNewExhibitForm)}
                >
                  {showNewExhibitForm ? (
                    <>
                      <X size={16} />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Add New Exhibit</span>
                    </>
                  )}
                </button>
              </div>
              <p className="section-description">
                Manage the museum's exhibits and special collections. Track
                exhibit details, visitor statistics, and ticket sales for all
                shows past, present, and future.
              </p>

              {/* New Exhibit Form */}
              {showNewExhibitForm && (
                <div className="new-artist-form">
                  <h3>Add New Exhibit</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveNewExhibit();
                    }}
                  >
                    <div className="form-row">
                      <div className="form-group">
                        <label className="required" htmlFor="title">
                          Exhibit Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={newExhibitData.title}
                          onChange={handleNewExhibitChange}
                          required
                        />
                      </div>
                      <div className="form-group"></div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="required" htmlFor="startDate">
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={newExhibitData.startDate}
                          onChange={handleNewExhibitChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="required" htmlFor="endDate">
                          End Date
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          name="endDate"
                          value={newExhibitData.endDate}
                          onChange={handleNewExhibitChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label className="required" htmlFor="description">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={newExhibitData.description}
                        onChange={handleNewExhibitChange}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="save-button">
                        Add Exhibit
                      </button>
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setShowNewExhibitForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Exhibits Table */}
              <div className="data-table-container">
                <table className="data-table artists-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Visitors</th>
                      <th>Tickets Sold</th>
                      <th>Ticket Price</th>
                      <th>Revenue</th>
                      <th className="actions-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExhibits.map((exhibit) => {
                      const isBeingDeleted = deletingExhibits.includes(
                        exhibit.id,
                      );
                      const isBeingEdited = editingExhibit === exhibit.id;

                      return (
                        <tr
                          key={exhibit.id}
                          className={`
                              ${isBeingDeleted ? "deleting" : ""}
                              ${isBeingEdited ? "editing" : ""}
                            `}
                        >
                          {isBeingEdited ? (
                            // Editing mode fields
                            <>
                              <td>
                                <input
                                  type="text"
                                  name="title"
                                  value={editFormData.title}
                                  onChange={handleExhibitFormChange}
                                  required
                                />
                              </td>
                              <td>
                                {" "}
                                <span
                                  className={`status-badge ${exhibit.status}`}
                                >
                                  {exhibit.status.charAt(0).toUpperCase() +
                                    exhibit.status.slice(1)}
                                </span>
                              </td>
                              <td>
                                <input
                                  type="date"
                                  name="startDate"
                                  value={editFormData.startDate}
                                  onChange={handleExhibitFormChange}
                                  required
                                />
                              </td>
                              <td>
                                <input
                                  type="date"
                                  name="endDate"
                                  value={editFormData.endDate}
                                  onChange={handleExhibitFormChange}
                                />
                              </td>
                              <td>
                                {(
                                  parseInt(exhibit.visitorCount) || 0
                                ).toLocaleString()}
                              </td>
                              <td>
                                {(
                                  parseInt(exhibit.ticketsSold) || 0
                                ).toLocaleString()}
                              </td>
                              <td>
                                $
                                {(parseFloat(exhibit.ticketPrice) || 0).toFixed(
                                  2,
                                )}
                              </td>
                              <td>
                                $
                                {(
                                  parseInt(exhibit.revenue) || 0
                                ).toLocaleString()}
                              </td>
                              <td className="actions-cell">
                                <button
                                  className="icon-button save"
                                  onClick={handleSaveExhibit}
                                  title="Save"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                    <polyline points="7 3 7 8 15 8"></polyline>
                                  </svg>
                                </button>
                                <button
                                  className="icon-button cancel"
                                  onClick={handleCancelExhibitEdit}
                                  title="Cancel"
                                >
                                  <X size={16} />
                                </button>
                              </td>
                            </>
                          ) : (
                            // Normal view fields
                            <>
                              <td>{exhibit.title}</td>
                              <td>
                                <span
                                  className={`status-badge ${exhibit.status}`}
                                >
                                  {exhibit.status.charAt(0).toUpperCase() +
                                    exhibit.status.slice(1)}
                                </span>
                              </td>
                              <td>{exhibit.startDate}</td>
                              <td>{exhibit.endDate}</td>
                              <td>
                                {(
                                  parseInt(exhibit.visitorCount) || 0
                                ).toLocaleString()}
                              </td>
                              <td>
                                {(
                                  parseInt(exhibit.ticketsSold) || 0
                                ).toLocaleString()}
                              </td>
                              <td>
                                $
                                {(parseFloat(exhibit.ticketPrice) || 0).toFixed(
                                  2,
                                )}
                              </td>
                              <td>
                                $
                                {(
                                  parseInt(exhibit.revenue) || 0
                                ).toLocaleString()}
                              </td>
                              <td className="actions-cell">
                                <button
                                  className="icon-button edit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditExhibit(exhibit);
                                  }}
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  className="icon-button delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteExhibit(exhibit.id);
                                  }}
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="content-section">
              <div className="section-header">
                <h2>Administrative Reports</h2>
              </div>
              <p className="section-description">
                Review analytics for the entire museum. Generate reports on
                ticket sales, employee performance, and visitor statistics to
                make informed decisions about museum operations.
              </p>

              <div className="reports-grid">
                {/* Exhibit Ticket Sales Report */}
                <div
                  className="report-card exhibit-performance"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <h3>Exhibit Ticket Sales</h3>
                  <div className="chart-container" style={{ height: "350px" }}>
                    <Bar
                      data={{
                        labels: exhibits
                          .filter(
                            (ex) =>
                              ex.status !== "upcoming" || ex.ticketsSold > 0,
                          )
                          .map((ex) => ex.title),
                        datasets: [
                          {
                            label: "Tickets Sold",
                            data: exhibits
                              .filter(
                                (ex) =>
                                  ex.status !== "upcoming" ||
                                  ex.ticketsSold > 0,
                              )
                              .map((ex) => ex.ticketsSold),
                            backgroundColor: "rgba(59, 130, 246, 0.7)", // Blue
                            borderColor: "rgba(59, 130, 246, 1)",
                            borderWidth: 1,
                            yAxisID: "y",
                          },
                          {
                            label: "Revenue ($)",
                            data: exhibits
                              .filter(
                                (ex) =>
                                  ex.status !== "upcoming" ||
                                  ex.ticketsSold > 0,
                              )
                              .map((ex) => ex.revenue),
                            backgroundColor: "rgba(220, 38, 38, 0.7)", // Red
                            borderColor: "rgba(220, 38, 38, 1)",
                            borderWidth: 1,
                            yAxisID: "y1",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                const label = context.dataset.label || "";
                                const value = context.parsed.y;
                                if (label.includes("Revenue")) {
                                  return `${label}: $${value.toLocaleString()}`;
                                }
                                return `${label}: ${value.toLocaleString()}`;
                              },
                            },
                          },
                        },
                        scales: {
                          x: {
                            stacked: false,
                          },
                          y: {
                            type: "linear",
                            display: true,
                            position: "left",
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Tickets Sold",
                            },
                          },
                          y1: {
                            type: "linear",
                            display: true,
                            position: "right",
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Revenue ($)",
                            },
                            grid: {
                              drawOnChartArea: false,
                            },
                            ticks: {
                              callback: function (value) {
                                return "$" + value.toLocaleString();
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="report-summary">
                    <div className="summary-item">
                      <h4>Most Tickets Sold</h4>
                      <p>
                        {(() => {
                          const maxTickets = Math.max(
                            ...exhibits.map((ex) => ex.ticketsSold || 0),
                          );
                          const topExhibits = exhibits.filter(
                            (ex) => parseInt(ex.ticketsSold) === maxTickets,
                          );
                          return topExhibits.length > 1
                            ? "Multiple"
                            : topExhibits[0]?.title || "No data";
                        })()}
                      </p>
                    </div>
                    <div className="summary-item">
                      <h4>Highest Revenue</h4>
                      <p>
                        {(() => {
                          const maxRevenue = Math.max(
                            ...exhibits.map((ex) => ex.revenue || 0),
                          );
                          const topExhibits = exhibits.filter(
                            (ex) => parseInt(ex.revenue) === maxRevenue,
                          );
                          return topExhibits.length > 1
                            ? "Multiple"
                            : topExhibits[0]?.title || "No data";
                        })()}
                      </p>
                    </div>
                    <div className="summary-item">
                      <h4>Total Tickets</h4>
                      <p>
                        {exhibits
                          .reduce(
                            (sum, ex) => sum + (parseInt(ex.ticketsSold) || 0),
                            0,
                          )
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="data-table-container">
                    <table className="data-table artists-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Status</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Visitors</th>
                          <th>Tickets Sold</th>
                          <th>Ticket Price</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exhibits.map((exhibit) => {
                          return (
                            <tr key={exhibit.id}>
                              {
                                // Normal view fields
                                <>
                                  <td>{exhibit.title}</td>
                                  <td>
                                    <span
                                      className={`status-badge ${exhibit.status}`}
                                    >
                                      {exhibit.status.charAt(0).toUpperCase() +
                                        exhibit.status.slice(1)}
                                    </span>
                                  </td>
                                  <td>{exhibit.startDate}</td>
                                  <td>{exhibit.endDate}</td>
                                  <td>
                                    {(
                                      parseInt(exhibit.visitorCount) || 0
                                    ).toLocaleString()}
                                  </td>
                                  <td>
                                    {(
                                      parseInt(exhibit.ticketsSold) || 0
                                    ).toLocaleString()}
                                  </td>
                                  <td>
                                    $
                                    {(
                                      parseFloat(exhibit.ticketPrice) || 0
                                    ).toFixed(2)}
                                  </td>
                                  <td>
                                    $
                                    {(
                                      parseInt(exhibit.revenue) || 0
                                    ).toLocaleString()}
                                  </td>
                                </>
                              }
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Employee Role Distribution Report */}
                <div
                  className="report-card employee-performance"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <h3>Employee Role Distribution</h3>
                  <div className="chart-container" style={{ height: "350px" }}>
                    <Bar
                      data={{
                        labels: ROLES,
                        datasets: [
                          {
                            label: "Number of Employees",
                            data: ROLES.map(
                              (role) =>
                                employees.filter((emp) => emp.role === role)
                                  .length,
                            ),
                            backgroundColor: ROLES.map(
                              (role) => ROLECOLORS[role].bg,
                            ),
                            borderColor: ROLES.map(
                              (role) => ROLECOLORS[role].border,
                            ),
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                return `${context.parsed.y} employee(s)`;
                              },
                            },
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Number of Employees",
                            },
                            ticks: {
                              stepSize: 1,
                              precision: 0,
                            },
                          },
                          x: {
                            title: {
                              display: true,
                              text: "Employee Roles",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="report-summary">
                    <div className="summary-item">
                      <h4>Largest Role Group</h4>
                      <p>
                        {(() => {
                          const roleCounts = ROLES.map((role) => ({
                            role,
                            count: employees.filter((emp) => emp.role === role)
                              .length,
                          }));

                          const maxCount = Math.max(
                            ...roleCounts.map((rc) => rc.count),
                          );
                          const topRoles = roleCounts.filter(
                            (rc) => rc.count === maxCount,
                          );

                          return topRoles.length > 1
                            ? "Multiple"
                            : topRoles[0]?.role || "No data";
                        })()}
                      </p>
                    </div>
                    <div className="summary-item">
                      <h4>Total Employees</h4>
                      <p>{employees.length}</p>
                    </div>
                    <div className="summary-item">
                      <h4>Average Per Role</h4>
                      <p>{(employees.length / 5).toFixed(1)}</p>
                    </div>
                  </div>

                  {/* Employees Table */}
                  <div className="data-table-container">
                    <table className="data-table artists-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Phone Number</th>
                          <th>Start Date</th>
                          <th>Status</th>
                          <th>Work Email</th>
                          <th>Salary</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((employee) => {
                          return (
                            <tr key={employee.id}>
                              {
                                // Normal view fields
                                <>
                                  <td>
                                    <div className="employee-name-cell">
                                      <span>{employee.name}</span>
                                    </div>
                                  </td>
                                  <td>{employee.role}</td>
                                  <td>{employee.phone}</td>
                                  <td>{employee.hiringDate}</td>
                                  <td>
                                    <span
                                      className={`status-badge ${employee.status}`}
                                    >
                                      {employee.status.charAt(0).toUpperCase() +
                                        employee.status.slice(1)}
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      maxWidth: "200px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {employee.workEmail}
                                  </td>
                                  <td>
                                    $
                                    {parseInt(employee.salary).toLocaleString()}
                                  </td>
                                </>
                              }
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {employees.length === 0 && (
                      <div className="empty-state">
                        <p>No museum employees found.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ErrorModal
        show={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </div>
  );
}
