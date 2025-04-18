import React, { useState, useEffect } from "react";
import {
  User,
  Edit,
  Trash2,
  X,
  Search,
  UserPlus,
  FilePlus,
  BarChart2,
  Users,
  Layers,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import "../../components/components.css";

export function AdminDashboard() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("profile");
  const [showSettings, setShowSettings] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showExhibitForm, setShowExhibitForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingExhibit, setEditingExhibit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [employeesFilter, setEmployeesFilter] = useState("all");
  const [exhibitsFilter, setExhibitsFilter] = useState("all");
  const [formData, setFormData] = useState({});
  const [employeeFormData, setEmployeeFormData] = useState({
    id: null,
    name: "",
    title: "",
    department: "",
    email: "",
    phone: "",
    startDate: "",
    hourlyRate: 0,
    status: "active",
  });
  const [exhibitFormData, setExhibitFormData] = useState({
    id: null,
    title: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    status: "upcoming",
  });

  // Admin profile data
  const adminData = {
    id: "A001",
    name: "Morgan Richards",
    title: "Museum Director",
    email: "morgan.richards@museocore.com",
    phone: "(555) 123-4567",
    department: "Administration",
    startDate: "January 15, 2015",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  };

  // Mock employee data
  const [employees, setEmployees] = useState([
    {
      id: "E001",
      name: "Jamie Smith",
      title: "Senior Curator",
      department: "Collections",
      email: "jamie.smith@museocore.com",
      phone: "(555) 234-5678",
      startDate: "March 10, 2018",
      hourlyRate: 22.5,
      status: "active",
      avatar: "https://randomuser.me/api/portraits/women/43.jpg",
      role: "Curator",
      performance: {
        attendance: 98,
        taskCompletion: 95,
      },
    },
    {
      id: "E002",
      name: "Alex Johnson",
      title: "Gallery Guide",
      department: "Visitor Services",
      email: "alex.johnson@museocore.com",
      phone: "(555) 345-6789",
      startDate: "June 5, 2020",
      hourlyRate: 16.75,
      status: "active",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      role: "Guide",
      performance: {
        attendance: 92,
        taskCompletion: 88,
      },
    },
    {
      id: "E003",
      name: "Taylor Garcia",
      title: "Conservation Specialist",
      department: "Collections",
      email: "taylor.garcia@museocore.com",
      phone: "(555) 456-7890",
      startDate: "November 15, 2019",
      hourlyRate: 21.25,
      status: "active",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      role: "Conservator",
      performance: {
        attendance: 97,
        taskCompletion: 96,
      },
    },
    {
      id: "E004",
      name: "Jordan Lee",
      title: "Gift Shop Manager",
      department: "Retail",
      email: "jordan.lee@museocore.com",
      phone: "(555) 567-8901",
      startDate: "April 20, 2017",
      hourlyRate: 19.5,
      status: "active",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
      role: "Manager",
      performance: {
        attendance: 94,
        taskCompletion: 92,
      },
    },
    {
      id: "E005",
      name: "Riley Wilson",
      title: "Educational Programmer",
      department: "Education",
      email: "riley.wilson@museocore.com",
      phone: "(555) 678-9012",
      startDate: "August 3, 2021",
      hourlyRate: 18.0,
      status: "active",
      avatar: "https://randomuser.me/api/portraits/women/57.jpg",
      role: "Educator",
      performance: {
        attendance: 96,
        taskCompletion: 90,
      },
    },
    {
      id: "E006",
      name: "Morgan Chen",
      title: "Gallery Guide",
      department: "Visitor Services",
      email: "morgan.chen@museocore.com",
      phone: "(555) 789-0123",
      startDate: "February 12, 2022",
      hourlyRate: 16.75,
      status: "active",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      role: "Guide",
      performance: {
        attendance: 93,
        taskCompletion: 91,
      },
    },
    {
      id: "E007",
      name: "Casey Brown",
      title: "Assistant Curator",
      department: "Collections",
      email: "casey.brown@museocore.com",
      phone: "(555) 890-1234",
      startDate: "July 21, 2021",
      hourlyRate: 20.25,
      status: "active",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      role: "Curator",
      performance: {
        attendance: 95,
        taskCompletion: 94,
      },
    },
    {
      id: "E008",
      name: "Dana Kim",
      title: "Educational Assistant",
      department: "Education",
      email: "dana.kim@museocore.com",
      phone: "(555) 901-2345",
      startDate: "September 8, 2022",
      hourlyRate: 17.5,
      status: "active",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      role: "Educator",
      performance: {
        attendance: 97,
        taskCompletion: 93,
      },
    },
  ]);

  // Mock exhibits data
  const [exhibits, setExhibits] = useState([
    {
      id: "EX001",
      title: "Ancient Civilizations: Mesopotamia",
      startDate: "January 15, 2023",
      endDate: "April 30, 2023",
      location: "East Wing, Gallery 3",
      description:
        "Explore the cradle of civilization through a collection of artifacts from ancient Mesopotamia.",
      status: "active",
      visitorCount: 3250,
      ticketsSold: 4150,
      ticketPrice: 22,
      revenue: 91300,
    },
    {
      id: "EX002",
      title: "Modern Art Movements",
      startDate: "March 1, 2023",
      endDate: "July 15, 2023",
      location: "West Wing, Gallery 2",
      description:
        "A journey through the most influential art movements of the 20th century.",
      status: "active",
      visitorCount: 2800,
      ticketsSold: 3450,
      ticketPrice: 24,
      revenue: 82800,
    },
    {
      id: "EX003",
      title: "Natural Wonders: Geological Marvels",
      startDate: "June 10, 2023",
      endDate: "September 30, 2023",
      location: "North Wing, Special Exhibition Hall",
      description:
        "Discover extraordinary minerals, fossils, and geological formations from around the world.",
      status: "upcoming",
      visitorCount: 0,
      ticketsSold: 1250, // Pre-sales
      ticketPrice: 20,
      revenue: 25000,
    },
    {
      id: "EX004",
      title: "Renaissance Masters",
      startDate: "October 1, 2022",
      endDate: "January 10, 2023",
      location: "Central Gallery",
      description:
        "A curated collection of prints and reproductions from the Renaissance period.",
      status: "past",
      visitorCount: 4200,
      ticketsSold: 5180,
      ticketPrice: 26,
      revenue: 134680,
    },
    {
      id: "EX005",
      title: "Photography Through the Ages",
      startDate: "May 5, 2023",
      endDate: "August 15, 2023",
      location: "South Wing, Gallery 1",
      description:
        "The evolution of photography from early daguerreotypes to digital innovation.",
      status: "active",
      visitorCount: 1950,
      ticketsSold: 2420,
      ticketPrice: 18,
      revenue: 43560,
    },
  ]);

  // Filter employees based on search query and department filter
  const filteredEmployees = employees.filter((employee) => {
    // Search by name, department, or title
    const matchesSearch =
      searchQuery === "" ||
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.title.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by department
    const matchesFilter =
      employeesFilter === "all" || employee.department === employeesFilter;

    return matchesSearch && matchesFilter;
  });

  // Filter exhibits based on search query and status filter
  const filteredExhibits = exhibits.filter((exhibit) => {
    // Search by title or location
    const matchesSearch =
      searchQuery === "" ||
      exhibit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exhibit.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesFilter =
      exhibitsFilter === "all" || exhibit.status === exhibitsFilter;

    return matchesSearch && matchesFilter;
  });

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle employee form changes
  const handleEmployeeFormChange = (e) => {
    const { name, value } = e.target;
    setEmployeeFormData({
      ...employeeFormData,
      [name]: name === "hourlyRate" ? parseFloat(value) : value,
    });
  };

  // Handle exhibit form changes
  const handleExhibitFormChange = (e) => {
    const { name, value } = e.target;
    setExhibitFormData({
      ...exhibitFormData,
      [name]: value,
    });
  };

  // Save admin settings
  const handleSaveSettings = () => {
    // In a real application, this would update the backend
    // For now, we'll just close the form
    setShowSettings(false);
  };

  // Add/edit employee
  const handleSaveEmployee = () => {
    if (editingEmployee !== null) {
      // Edit existing employee
      const updatedEmployees = employees.map((emp) => {
        if (emp.id === employeeFormData.id) {
          return { ...emp, ...employeeFormData };
        }
        return emp;
      });
      setEmployees(updatedEmployees);
    } else {
      // Add new employee
      const newEmployee = {
        ...employeeFormData,
        id: `E${String(employees.length + 1).padStart(3, "0")}`,
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 70)}.jpg`,
        performance: {
          attendance: 95,
          taskCompletion: 90,
          visitorFeedback: 4.5,
        },
      };
      setEmployees([...employees, newEmployee]);
    }
    setShowEmployeeForm(false);
    setEditingEmployee(null);
    setEmployeeFormData({
      id: null,
      name: "",
      title: "",
      department: "",
      email: "",
      phone: "",
      startDate: "",
      hourlyRate: 0,
      status: "active",
    });
  };

  // Add/edit exhibit
  const handleSaveExhibit = () => {
    if (editingExhibit !== null) {
      // Edit existing exhibit
      const updatedExhibits = exhibits.map((ex) => {
        if (ex.id === exhibitFormData.id) {
          return { ...ex, ...exhibitFormData };
        }
        return ex;
      });
      setExhibits(updatedExhibits);
    } else {
      // Add new exhibit
      const newExhibit = {
        ...exhibitFormData,
        id: `EX${String(exhibits.length + 1).padStart(3, "0")}`,
        visitorCount: 0,
        feedback: 0,
      };
      setExhibits([...exhibits, newExhibit]);
    }
    setShowExhibitForm(false);
    setEditingExhibit(null);
    setExhibitFormData({
      id: null,
      title: "",
      startDate: "",
      endDate: "",
      location: "",
      description: "",
      status: "upcoming",
    });
  };

  // Delete employee
  const handleDeleteEmployee = (id) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmployees);
  };

  // Delete exhibit
  const handleDeleteExhibit = (id) => {
    const updatedExhibits = exhibits.filter((ex) => ex.id !== id);
    setExhibits(updatedExhibits);
  };

  // Edit employee
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee.id);
    setEmployeeFormData({ ...employee });
    setShowEmployeeForm(true);
  };

  // Edit exhibit
  const handleEditExhibit = (exhibit) => {
    setEditingExhibit(exhibit.id);
    setExhibitFormData({ ...exhibit });
    setShowExhibitForm(true);
  };

  // Initialize form data when showing settings
  useEffect(() => {
    if (showSettings) {
      setFormData({
        name: adminData.name,
        title: adminData.title,
        email: adminData.email,
        phone: adminData.phone,
        department: adminData.department,
        startDate: adminData.startDate,
      });
    }
  }, [showSettings]);

  return (
    <div className="curator-dashboard" style={{ marginBottom: "3rem" }}>
      <div className="dashboard-header">
        <div className="header-title">
          <h1>MuseoCore Admin Portal</h1>
        </div>

        <div className="horizontal-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={16} />
            <span>Profile</span>
          </button>
          <button
            className={`tab-button ${activeTab === "employees" ? "active" : ""}`}
            onClick={() => setActiveTab("employees")}
          >
            <Users size={16} />
            <span>Employees</span>
          </button>
          <button
            className={`tab-button ${activeTab === "exhibits" ? "active" : ""}`}
            onClick={() => setActiveTab("exhibits")}
          >
            <Layers size={16} />
            <span>Exhibits</span>
          </button>
          <button
            className={`tab-button ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <BarChart2 size={16} />
            <span>Reports</span>
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="profile-content">
            <div className="profile-header">
              <div className="profile-avatar">
                <img src={adminData.avatar} alt="Admin Avatar" />
              </div>
              <div className="profile-info">
                <h2>{adminData.name}</h2>
                <p className="profile-title">{adminData.title}</p>
                <p className="profile-department">{adminData.department}</p>
                <p className="profile-contact">
                  <span>{adminData.email}</span> |{" "}
                  <span>{adminData.phone}</span>
                </p>
                <div className="profile-actions">
                  <button
                    className="action-button"
                    onClick={() => setShowSettings(true)}
                  >
                    <Edit size={16} />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            <div className="profile-details">
              <div className="details-section">
                <h3>Administration Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Admin ID:</span>
                  <span className="detail-value">{adminData.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{adminData.department}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Start Date:</span>
                  <span className="detail-value">{adminData.startDate}</span>
                </div>
              </div>

              <div className="details-section">
                <h3>Museum Overview</h3>
                <div className="detail-row">
                  <span className="detail-label">Total Employees:</span>
                  <span className="detail-value">{employees.length}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Active Exhibits:</span>
                  <span className="detail-value">
                    {exhibits.filter((ex) => ex.status === "active").length}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Upcoming Exhibits:</span>
                  <span className="detail-value">
                    {exhibits.filter((ex) => ex.status === "upcoming").length}
                  </span>
                </div>
              </div>
            </div>

            {/* Settings Form */}
            {showSettings && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>Edit Profile</h3>
                    <button
                      className="close-button"
                      onClick={() => setShowSettings(false)}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="modal-body">
                    <form className="settings-form">
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.phone || ""}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="title">Job Title (Read Only)</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title || ""}
                          readOnly
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="department">
                          Department (Read Only)
                        </label>
                        <input
                          type="text"
                          id="department"
                          name="department"
                          value={formData.department || ""}
                          readOnly
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="startDate">
                          Start Date (Read Only)
                        </label>
                        <input
                          type="text"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate || ""}
                          readOnly
                          disabled
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="cancel-button"
                      onClick={() => setShowSettings(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="save-button"
                      onClick={handleSaveSettings}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <div className="employees-content">
            <div className="content-header">
              <h2>Employee Management</h2>
              <div className="filter-controls">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="filter-box">
                  <label htmlFor="departmentFilter">Department:</label>
                  <select
                    id="departmentFilter"
                    value={employeesFilter}
                    onChange={(e) => setEmployeesFilter(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    <option value="Collections">Collections</option>
                    <option value="Visitor Services">Visitor Services</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                <button
                  className="action-button"
                  onClick={() => {
                    setEditingEmployee(null);
                    setEmployeeFormData({
                      id: null,
                      name: "",
                      title: "",
                      department: "",
                      email: "",
                      phone: "",
                      startDate: "",
                      hourlyRate: 0,
                      status: "active",
                    });
                    setShowEmployeeForm(true);
                  }}
                >
                  <UserPlus size={16} />
                  Add Employee
                </button>
              </div>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Start Date</th>
                    <th>Hourly Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center" }}>
                        No employees found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>
                          <div className="employee-name-cell">
                            <img
                              src={employee.avatar}
                              alt={employee.name}
                              className="employee-avatar-small"
                            />
                            <span>{employee.name}</span>
                          </div>
                        </td>
                        <td>{employee.title}</td>
                        <td>{employee.department}</td>
                        <td>{employee.email}</td>
                        <td>{employee.phone}</td>
                        <td>{employee.startDate}</td>
                        <td>${employee.hourlyRate.toFixed(2)}</td>
                        <td className="actions-cell">
                          <button
                            className="icon-button edit"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="icon-button delete"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Employee Form Modal */}
            {showEmployeeForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>
                      {editingEmployee ? "Edit Employee" : "Add New Employee"}
                    </h3>
                    <button
                      className="close-button"
                      onClick={() => setShowEmployeeForm(false)}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="modal-body">
                    <form className="settings-form">
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={employeeFormData.name}
                          onChange={handleEmployeeFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="title">Job Title</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={employeeFormData.title}
                          onChange={handleEmployeeFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <select
                          id="department"
                          name="department"
                          value={employeeFormData.department}
                          onChange={handleEmployeeFormChange}
                          required
                        >
                          <option value="">Select Department</option>
                          <option value="Collections">Collections</option>
                          <option value="Visitor Services">
                            Visitor Services
                          </option>
                          <option value="Education">Education</option>
                          <option value="Retail">Retail</option>
                          <option value="Administration">Administration</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={employeeFormData.email}
                          onChange={handleEmployeeFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={employeeFormData.phone}
                          onChange={handleEmployeeFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                          type="text"
                          id="startDate"
                          name="startDate"
                          value={employeeFormData.startDate}
                          onChange={handleEmployeeFormChange}
                          required
                          placeholder="Month DD, YYYY"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="hourlyRate">Hourly Rate ($)</label>
                        <input
                          type="number"
                          id="hourlyRate"
                          name="hourlyRate"
                          min="0"
                          step="0.01"
                          value={employeeFormData.hourlyRate}
                          onChange={handleEmployeeFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                          id="status"
                          name="status"
                          value={employeeFormData.status}
                          onChange={handleEmployeeFormChange}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="on_leave">On Leave</option>
                        </select>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="cancel-button"
                      onClick={() => setShowEmployeeForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="save-button"
                      onClick={handleSaveEmployee}
                    >
                      {editingEmployee ? "Save Changes" : "Add Employee"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Exhibits Tab */}
        {activeTab === "exhibits" && (
          <div className="exhibits-content">
            <div className="content-header">
              <h2>Exhibit Management</h2>
              <div className="filter-controls">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search exhibits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="filter-box">
                  <label htmlFor="statusFilter">Status:</label>
                  <select
                    id="statusFilter"
                    value={exhibitsFilter}
                    onChange={(e) => setExhibitsFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>

                <button
                  className="action-button"
                  onClick={() => {
                    setEditingExhibit(null);
                    setExhibitFormData({
                      id: null,
                      title: "",
                      startDate: "",
                      endDate: "",
                      location: "",
                      description: "",
                      status: "upcoming",
                    });
                    setShowExhibitForm(true);
                  }}
                >
                  <FilePlus size={16} />
                  Add Exhibit
                </button>
              </div>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Visitor Count</th>
                    <th>Tickets Sold</th>
                    <th>Ticket Price</th>
                    <th>Revenue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExhibits.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center" }}>
                        No exhibits found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredExhibits.map((exhibit) => (
                      <tr key={exhibit.id}>
                        <td>{exhibit.id}</td>
                        <td>{exhibit.title}</td>
                        <td>{exhibit.location}</td>
                        <td>{exhibit.startDate}</td>
                        <td>{exhibit.endDate}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              exhibit.status === "active"
                                ? "active"
                                : exhibit.status === "upcoming"
                                  ? "upcoming"
                                  : "past"
                            }`}
                          >
                            {exhibit.status}
                          </span>
                        </td>
                        <td>{exhibit.visitorCount.toLocaleString()}</td>
                        <td>{exhibit.ticketsSold.toLocaleString()}</td>
                        <td>${exhibit.ticketPrice.toFixed(2)}</td>
                        <td>${exhibit.revenue.toLocaleString()}</td>
                        <td className="actions-cell">
                          <button
                            className="icon-button edit"
                            onClick={() => handleEditExhibit(exhibit)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="icon-button delete"
                            onClick={() => handleDeleteExhibit(exhibit.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Exhibit Form Modal */}
            {showExhibitForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>
                      {editingExhibit ? "Edit Exhibit" : "Add New Exhibit"}
                    </h3>
                    <button
                      className="close-button"
                      onClick={() => setShowExhibitForm(false)}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="modal-body">
                    <form className="settings-form">
                      <div className="form-group">
                        <label htmlFor="title">Exhibit Title</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={exhibitFormData.title}
                          onChange={handleExhibitFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={exhibitFormData.location}
                          onChange={handleExhibitFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                          type="text"
                          id="startDate"
                          name="startDate"
                          value={exhibitFormData.startDate}
                          onChange={handleExhibitFormChange}
                          required
                          placeholder="Month DD, YYYY"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                          type="text"
                          id="endDate"
                          name="endDate"
                          value={exhibitFormData.endDate}
                          onChange={handleExhibitFormChange}
                          required
                          placeholder="Month DD, YYYY"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                          id="description"
                          name="description"
                          value={exhibitFormData.description}
                          onChange={handleExhibitFormChange}
                          rows={4}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                          id="status"
                          name="status"
                          value={exhibitFormData.status}
                          onChange={handleExhibitFormChange}
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="active">Active</option>
                          <option value="past">Past</option>
                        </select>
                      </div>
                      {editingExhibit && (
                        <>
                          <div className="form-group">
                            <label htmlFor="visitorCount">Visitor Count</label>
                            <input
                              type="number"
                              id="visitorCount"
                              name="visitorCount"
                              value={exhibitFormData.visitorCount}
                              onChange={handleExhibitFormChange}
                              min="0"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="ticketsSold">Tickets Sold</label>
                            <input
                              type="number"
                              id="ticketsSold"
                              name="ticketsSold"
                              value={exhibitFormData.ticketsSold}
                              onChange={handleExhibitFormChange}
                              min="0"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="ticketPrice">
                              Ticket Price ($)
                            </label>
                            <input
                              type="number"
                              id="ticketPrice"
                              name="ticketPrice"
                              value={exhibitFormData.ticketPrice}
                              onChange={handleExhibitFormChange}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="revenue">Revenue ($)</label>
                            <input
                              type="number"
                              id="revenue"
                              name="revenue"
                              value={exhibitFormData.revenue}
                              onChange={handleExhibitFormChange}
                              min="0"
                            />
                          </div>
                        </>
                      )}
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="cancel-button"
                      onClick={() => setShowExhibitForm(false)}
                    >
                      Cancel
                    </button>
                    <button className="save-button" onClick={handleSaveExhibit}>
                      {editingExhibit ? "Save Changes" : "Add Exhibit"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="reports-content">
            <div className="content-header">
              <h2>Administrative Reports</h2>
            </div>

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
                                ex.status !== "upcoming" || ex.ticketsSold > 0,
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
                                ex.status !== "upcoming" || ex.ticketsSold > 0,
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
                      {exhibits.sort((a, b) => b.ticketsSold - a.ticketsSold)[0]
                        ?.title || "No data"}
                    </p>
                  </div>
                  <div className="summary-item">
                    <h4>Highest Revenue</h4>
                    <p>
                      {exhibits.sort((a, b) => b.revenue - a.revenue)[0]
                        ?.title || "No data"}
                      ($
                      {exhibits
                        .sort((a, b) => b.revenue - a.revenue)[0]
                        ?.revenue.toLocaleString() || "0"}
                      )
                    </p>
                  </div>
                  <div className="summary-item">
                    <h4>Total Tickets</h4>
                    <p>
                      {exhibits
                        .reduce((sum, ex) => sum + ex.ticketsSold, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="data-summary" style={{ marginTop: "1rem" }}>
                  <h4>Detailed Exhibit Metrics</h4>
                  <div
                    className="data-table-container"
                    style={{ maxHeight: "250px", overflow: "auto" }}
                  >
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Exhibit Title</th>
                          <th>Status</th>
                          <th>Location</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Visitors</th>
                          <th>Tickets Sold</th>
                          <th>Ticket Price</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exhibits.map((exhibit, index) => (
                          <tr key={index}>
                            <td>{exhibit.title}</td>
                            <td>
                              <span
                                className={`status-badge ${exhibit.status}`}
                              >
                                {exhibit.status}
                              </span>
                            </td>
                            <td>{exhibit.location}</td>
                            <td>{exhibit.startDate}</td>
                            <td>{exhibit.endDate}</td>
                            <td>{exhibit.visitorCount.toLocaleString()}</td>
                            <td>{exhibit.ticketsSold.toLocaleString()}</td>
                            <td>${exhibit.ticketPrice.toFixed(2)}</td>
                            <td>${exhibit.revenue.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td
                            colSpan="5"
                            style={{ textAlign: "right", fontWeight: "bold" }}
                          >
                            Totals:
                          </td>
                          <td style={{ fontWeight: "bold" }}>
                            {exhibits
                              .reduce((sum, ex) => sum + ex.visitorCount, 0)
                              .toLocaleString()}
                          </td>
                          <td style={{ fontWeight: "bold" }}>
                            {exhibits
                              .reduce((sum, ex) => sum + ex.ticketsSold, 0)
                              .toLocaleString()}
                          </td>
                          <td></td>
                          <td style={{ fontWeight: "bold" }}>
                            $
                            {exhibits
                              .reduce((sum, ex) => sum + ex.revenue, 0)
                              .toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
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
                      labels: [
                        "Curator",
                        "Guide",
                        "Conservator",
                        "Manager",
                        "Educator",
                      ],
                      datasets: [
                        {
                          label: "Number of Employees",
                          data: [
                            employees.filter((emp) => emp.role === "Curator")
                              .length,
                            employees.filter((emp) => emp.role === "Guide")
                              .length,
                            employees.filter(
                              (emp) => emp.role === "Conservator",
                            ).length,
                            employees.filter((emp) => emp.role === "Manager")
                              .length,
                            employees.filter((emp) => emp.role === "Educator")
                              .length,
                          ],
                          backgroundColor: [
                            "rgba(59, 130, 246, 0.7)", // Blue
                            "rgba(220, 38, 38, 0.7)", // Red
                            "rgba(16, 185, 129, 0.7)", // Green
                            "rgba(245, 158, 11, 0.7)", // Amber
                            "rgba(139, 92, 246, 0.7)", // Purple
                          ],
                          borderColor: [
                            "rgba(59, 130, 246, 1)",
                            "rgba(220, 38, 38, 1)",
                            "rgba(16, 185, 129, 1)",
                            "rgba(245, 158, 11, 1)",
                            "rgba(139, 92, 246, 1)",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false, // Hide legend since role is on x-axis
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
                      {
                        [
                          "Curator",
                          "Guide",
                          "Conservator",
                          "Manager",
                          "Educator",
                        ].sort(
                          (a, b) =>
                            employees.filter((emp) => emp.role === b).length -
                            employees.filter((emp) => emp.role === a).length,
                        )[0]
                      }
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

                <div className="data-summary" style={{ marginTop: "1rem" }}>
                  <h4>Role Distribution Data</h4>
                  <div
                    className="data-table-container"
                    style={{ maxHeight: "200px", overflow: "auto" }}
                  >
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Role</th>
                          <th>Number of Employees</th>
                          <th>Percentage</th>
                          <th>Avg. Hourly Rate</th>
                          <th>Avg. Attendance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          "Curator",
                          "Guide",
                          "Conservator",
                          "Manager",
                          "Educator",
                        ].map((role) => {
                          const roleEmployees = employees.filter(
                            (emp) => emp.role === role,
                          );
                          const count = roleEmployees.length;
                          const percentage = (
                            (count / employees.length) *
                            100
                          ).toFixed(1);
                          const avgHourlyRate = roleEmployees.length
                            ? (
                                roleEmployees.reduce(
                                  (sum, emp) => sum + emp.hourlyRate,
                                  0,
                                ) / count
                              ).toFixed(2)
                            : "0.00";
                          const avgAttendance = roleEmployees.length
                            ? (
                                roleEmployees.reduce(
                                  (sum, emp) =>
                                    sum + emp.performance.attendance,
                                  0,
                                ) / count
                              ).toFixed(1)
                            : "0.0";

                          return (
                            <tr key={role}>
                              <td>{role}</td>
                              <td>{count}</td>
                              <td>{percentage}%</td>
                              <td>${avgHourlyRate}</td>
                              <td>{avgAttendance}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
