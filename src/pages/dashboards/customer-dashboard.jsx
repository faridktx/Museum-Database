import React, { useState, useEffect } from "react";
import {
  User,
  ShoppingBag,
  Ticket,
  Calendar,
  Settings as SettingsIcon,
  X,
  Lock,
} from "lucide-react";
import "../../components/components.css";

export function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  // State for showing/hiding settings form
  const [showSettings, setShowSettings] = useState(false);

  // State for showing/hiding password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password form error/success messages
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Profile form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    membershipType: "",
  });

  // Mock customer data
  const [customerData, setCustomerData] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "(555) 234-5678",
    address: "123 Maple Street, Springfield, IL 62701",
    membershipType: "Annual Pass",
    joinDate: "March 8, 2022",
    membershipExpires: "March 8, 2023",
  });

  // Mock transaction history
  const [transactions, setTransactions] = useState([
    {
      id: 1001,
      date: "2022-12-15",
      type: "Gift Shop",
      items: ["Art Book - Modern Masters", "Ceramic Mug"],
      total: 47.95,
      status: "Completed",
    },
    {
      id: 1002,
      date: "2022-11-30",
      type: "Gift Shop",
      items: ["Poster - Impressionist Collection", "T-shirt - Museum Logo"],
      total: 35.5,
      status: "Completed",
    },
    {
      id: 1003,
      date: "2022-10-22",
      type: "Gift Shop",
      items: ["Art Supplies Set", "Tote Bag"],
      total: 42.75,
      status: "Completed",
    },
  ]);

  // Mock museum tickets
  const [museumTickets, setMuseumTickets] = useState([
    {
      id: 5001,
      date: "2022-12-20",
      type: "General Admission",
      quantity: 2,
      total: 30.0,
      status: "Used",
    },
    {
      id: 5002,
      date: "2022-11-05",
      type: "General Admission",
      quantity: 4,
      total: 60.0,
      status: "Used",
    },
    {
      id: 5003,
      date: "2022-09-18",
      type: "General Admission",
      quantity: 1,
      total: 15.0,
      status: "Used",
    },
  ]);

  // Mock exhibit tickets
  const [exhibitTickets, setExhibitTickets] = useState([
    {
      id: 7001,
      date: "2022-12-20",
      name: "Renaissance Masterpieces",
      quantity: 2,
      total: 50.0,
      status: "Used",
    },
    {
      id: 7002,
      date: "2022-10-10",
      name: "Modern Art Showcase",
      quantity: 1,
      total: 22.5,
      status: "Used",
    },
    {
      id: 7003,
      date: "2022-08-05",
      name: "Ancient Civilizations",
      quantity: 2,
      total: 45.0,
      status: "Used",
    },
  ]);

  // Handle password change form submission
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

  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle edit profile form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle saving profile settings
  const handleSaveSettings = () => {
    // Update customer data with form data
    setCustomerData((prev) => ({
      ...prev,
      name: formData.name || prev.name,
      email: formData.email || prev.email,
      phone: formData.phone || prev.phone,
      address: formData.address || prev.address,
    }));

    // Close settings form
    setShowSettings(false);
  };

  // Initialize form data when showing settings
  useEffect(() => {
    if (showSettings) {
      setFormData({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        membershipType: customerData.membershipType,
      });
    }
  }, [showSettings, customerData]);

  return (
    <div className="dashboard">
      <div
        className="container dashboard-content"
        style={{ marginBottom: "3rem" }}
      >
        <h1>Customer Dashboard</h1>

        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={16} />
              <span>Profile</span>
            </button>
            <button
              className={`tab-button ${activeTab === "transactions" ? "active" : ""}`}
              onClick={() => setActiveTab("transactions")}
            >
              <ShoppingBag size={16} />
              <span>Gift Shop Transactions</span>
            </button>
            <button
              className={`tab-button ${activeTab === "museum-tickets" ? "active" : ""}`}
              onClick={() => setActiveTab("museum-tickets")}
            >
              <Ticket size={16} />
              <span>Museum Tickets</span>
            </button>
            <button
              className={`tab-button ${activeTab === "exhibit-tickets" ? "active" : ""}`}
              onClick={() => setActiveTab("exhibit-tickets")}
            >
              <Calendar size={16} />
              <span>Exhibit Tickets</span>
            </button>
          </div>

          <div className="tab-content">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <>
                <div className="profile-summary-card">
                  <div className="profile-info-container">
                    <div className="profile-avatar">
                      <div className="profile-initials">
                        {customerData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>
                    <div className="profile-summary-details">
                      <h2>{customerData.name}</h2>
                      <p className="curator-title">
                        {customerData.membershipType} Member
                      </p>
                      <div className="curator-department">
                        Member since {customerData.joinDate}
                      </div>
                    </div>
                  </div>
                  <div className="profile-stats">
                    <div className="profile-stat-item">
                      <span className="stat-number">{transactions.length}</span>
                      <span className="stat-label">Shop Purchases</span>
                    </div>
                    <div className="profile-stat-item">
                      <span className="stat-number">
                        {museumTickets.length + exhibitTickets.length}
                      </span>
                      <span className="stat-label">Tickets Purchased</span>
                    </div>
                    <div className="profile-stat-item">
                      <span className="stat-number">
                        {customerData.membershipExpires}
                      </span>
                      <span className="stat-label">Membership Expires</span>
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
                        <div className="form-error-message">
                          {passwordError}
                        </div>
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
                          <label htmlFor="address">Address</label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleFormChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="membershipType">
                            Membership Type
                          </label>
                          <input
                            type="text"
                            id="membershipType"
                            name="membershipType"
                            value={formData.membershipType}
                            onChange={handleFormChange}
                            disabled
                          />
                          <small className="field-note">
                            To change your membership type, please contact
                            customer service.
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
                          <h3>Membership</h3>
                          <p>{customerData.membershipType}</p>
                        </div>
                        <div className="detail-section">
                          <h3>Member Since</h3>
                          <p>{customerData.joinDate}</p>
                        </div>
                        <div className="detail-section">
                          <h3>Expires On</h3>
                          <p>{customerData.membershipExpires}</p>
                        </div>
                      </div>

                      <div className="profile-contact-info">
                        <h3>Contact Information</h3>
                        <p>
                          <strong>Email:</strong> {customerData.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {customerData.phone}
                        </p>
                        <p>
                          <strong>Address:</strong>{" "}
                          <span style={{ wordBreak: "break-word" }}>
                            {customerData.address}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Gift Shop Transactions Tab */}
            {activeTab === "transactions" && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Gift Shop Transactions</h2>
                </div>
                <p className="section-description">
                  View your purchase history from our museum gift shop. You can
                  track all your art-related purchases and souvenirs.
                </p>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>#{transaction.id}</td>
                          <td>
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td>
                            <ul className="item-list">
                              {transaction.items.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </td>
                          <td>${transaction.total.toFixed(2)}</td>
                          <td>
                            <span
                              className={`status-badge status-${transaction.status.toLowerCase()}`}
                            >
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Museum Tickets Tab */}
            {activeTab === "museum-tickets" && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Museum Admission Tickets</h2>
                </div>
                <p className="section-description">
                  View your museum general admission tickets history. These
                  tickets provide access to the permanent collection.
                </p>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {museumTickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td>#{ticket.id}</td>
                          <td>{new Date(ticket.date).toLocaleDateString()}</td>
                          <td>{ticket.type}</td>
                          <td>{ticket.quantity}</td>
                          <td>${ticket.total.toFixed(2)}</td>
                          <td>
                            <span
                              className={`status-badge status-${ticket.status.toLowerCase()}`}
                            >
                              {ticket.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Exhibit Tickets Tab */}
            {activeTab === "exhibit-tickets" && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Special Exhibition Tickets</h2>
                </div>
                <p className="section-description">
                  View your tickets for special exhibitions and limited-time
                  displays at our museum.
                </p>

                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Date</th>
                        <th>Exhibition</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exhibitTickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td>#{ticket.id}</td>
                          <td>{new Date(ticket.date).toLocaleDateString()}</td>
                          <td>{ticket.name}</td>
                          <td>{ticket.quantity}</td>
                          <td>${ticket.total.toFixed(2)}</td>
                          <td>
                            <span
                              className={`status-badge status-${ticket.status.toLowerCase()}`}
                            >
                              {ticket.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
