import React, { useState, useEffect } from "react";
import {
  User,
  ShoppingBag,
  Ticket,
  Calendar,
  Settings as SettingsIcon,
  X,
} from "lucide-react";
import "../../components/components.css";
import { useUser } from "@clerk/clerk-react";

export function CustomerDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  // State for showing/hiding settings form
  const [showSettings, setShowSettings] = useState(false);

  // Profile form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    membershipType: "",
  });

  useEffect(() => {
    const getCustomerInfo = async () => {
      const url = new URL(
        "/api/getcustomer/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setCustomerData(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getCustomerInfo();
  }, []);

  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    membershipType: "",
    joinDate: "",
    membershipExpires: "",
  });

  useEffect(() => {
    const getTransactionInfo = async () => {
      const url = new URL(
        "/api/gettransactions/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setTransactions(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getTransactionInfo();
  }, []);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const getTicketInfo = async () => {
      const url = new URL(
        "/api/gettickets/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setMuseumTickets(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getTicketInfo();
  }, []);
  const [museumTickets, setMuseumTickets] = useState([]);

  useEffect(() => {
    const getExhibitTicketInfo = async () => {
      const url = new URL(
        "/api/getexhibittickets/",
        process.env.REACT_APP_BACKEND_URL,
      );
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        setExhibitTickets(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getExhibitTicketInfo();
  }, []);
  const [exhibitTickets, setExhibitTickets] = useState([]);

  function countTotalTickets(museumTickets, exhibitTickets) {
    const museumCount = museumTickets.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0,
    );
    const exhibitCount = exhibitTickets.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0,
    );
    return museumCount + exhibitCount;
  }

  // Handle edit profile form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle saving profile settings
  const handleSaveSettings = async () => {
    // Update customer data with form data
    setCustomerData(formData);
    setShowSettings(false);
    const url = new URL(
      "/api/setcustomerinfo/",
      process.env.REACT_APP_BACKEND_URL,
    );
    url.searchParams.append("id", user.id);
    try {
      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Initialize form data when showing settings
  useEffect(() => {
    if (showSettings) {
      setFormData({
        firstName: customerData.firstName,
        lastName: customerData.lastName,
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
        style={{ marginBottom: "3rem", minWidth: "100px" }}
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

          <div className="tab-content" style={{ minWidth: "30px" }}>
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <>
                <div className="profile-summary-card">
                  <div className="profile-info-container">
                    <div className="profile-avatar">
                      <div className="profile-initials">
                        {[customerData.firstName, customerData.lastName]
                          .filter(Boolean)
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>
                    <div className="profile-summary-details">
                      <h2>
                        {[customerData.firstName, customerData.lastName]
                          .filter(Boolean)
                          .join(" ")}
                      </h2>
                      {customerData.joinDate && (
                        <>
                          <p className="curator-title">
                            {customerData.membershipType} Member
                          </p>
                          <div className="curator-department">
                            Member Since: <i>{customerData.joinDate}</i>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="profile-stats">
                    <div className="profile-stat-item">
                      <span className="stat-number">{transactions.length}</span>
                      <span className="stat-label">Shop Purchases</span>
                    </div>
                    <div className="profile-stat-item">
                      <span className="stat-number">
                        {countTotalTickets(museumTickets, exhibitTickets)}
                      </span>
                      <span className="stat-label">Tickets Purchased</span>
                    </div>
                    <div className="profile-stat-item">
                      <span className="stat-number">
                        {customerData.membershipExpires
                          ? customerData.membershipExpires
                          : "Not officially joined"}
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
                          <label htmlFor="firstName">First Name</label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleFormChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="lastName">Last Name</label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
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
                          <p>
                            <i>
                              {customerData.membershipType
                                ? customerData.membershipType
                                : "Not officially joined"}
                            </i>
                          </p>
                        </div>
                        <div className="detail-section">
                          <h3>Member Since</h3>
                          <p>
                            <i>
                              {customerData.joinDate
                                ? customerData.joinDate
                                : "Not officially joined"}
                            </i>
                          </p>
                        </div>
                        <div className="detail-section">
                          <h3>Expires On</h3>
                          <p>
                            <i>
                              {customerData.membershipExpires
                                ? customerData.membershipExpires
                                : "Not officially joined"}
                            </i>
                          </p>
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
                          <td>${parseFloat(transaction.total).toFixed(2)}</td>
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
                  {transactions.length === 0 && (
                    <div className="empty-state">
                      <p>No gift shop transactions found.</p>
                    </div>
                  )}
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
                          <td>${parseFloat(ticket.total).toFixed(2)}</td>
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
                  {museumTickets.length === 0 && (
                    <div className="empty-state">
                      <p>No museum ticket purchases found.</p>
                    </div>
                  )}
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
                          <td>${parseFloat(ticket.total).toFixed(2)}</td>
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
                  {exhibitTickets.length === 0 && (
                    <div className="empty-state">
                      <p>No exhibit ticket purchases found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
