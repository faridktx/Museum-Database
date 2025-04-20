import { useEffect, useState } from "react";
import "../pages/sheets/Style.AdminNotifications.css";
import { useUser } from "@clerk/clerk-react";

export function AdminNotifications() {
  const { user } = useUser();

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmMessage, setConfirmMessage] = useState("");

  const [alerts, setAlerts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [alertTypes, setAlertTypes] = useState(["All"]);
  const [selectedType, setSelectedType] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [showResolved, setShowResolved] = useState(false);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`/api/fraud-alerts`);
      const data = await res.json();
      if (data.success) {
        setAlerts(data.alerts);
        const types = [...new Set(data.alerts.map((a) => a.alert_type).filter(Boolean))];
        setAlertTypes(["All", ...types]);
      }
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    }
  };

  const fetchResolvedAlerts = async () => {
    try {
      const res = await fetch(`/api/fraud-alerts/resolved`);
      const data = await res.json();
      if (data.success) setResolvedAlerts(data.alerts);
    } catch (err) {
      console.error("Failed to fetch resolved alerts:", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchResolvedAlerts();
  }, []);

  useEffect(() => {
    let filteredList = [...alerts];
    if (selectedType !== "All") {
      filteredList = filteredList.filter((a) => (a.alert_type || "").trim() === selectedType);
    }
    if (sortOrder === "Newest") {
      filteredList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      filteredList.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    setFiltered(filteredList);
  }, [alerts, selectedType, sortOrder]);

  const handleResolve = async (alert_id) => {
    try {
      const res = await fetch("/api/fraud-alerts/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_id }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAlerts();
        await fetchResolvedAlerts();
      } else {
        alert("Failed to resolve alert.");
      }
    } catch (err) {
      console.error("Error resolving alert:", err);
    }
  };

  const handleDelete = async (alert_id) => {
    setConfirmMessage("Are you sure you want to permanently delete this alert?");
    setShowConfirm(true);
    setConfirmAction(() => async () => {
      try {
        const res = await fetch("/api/fraud-alerts/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alert_id }),
        });
        const data = await res.json();
        if (data.success) {
          setResolvedAlerts((prev) => prev.filter((a) => a.alert_id !== alert_id));
        } else {
          alert("Failed to delete alert.");
        }
      } catch (err) {
        console.error("Error deleting alert:", err);
      }
      setShowConfirm(false);
    });
  };

  function ConfirmModal({ show, message, onConfirm, onCancel }) {
    if (!show) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h3>Are you sure?</h3>
          <p>{message}</p>
          <div className="modal-actions">
            <button className="modal-confirm" onClick={onConfirm}>Delete</button>
            <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {!user && (
        <p style={{ fontStyle: "italic", color: "#64748b", marginBottom: "1rem" }}>
          You're viewing alerts in guest mode.
        </p>
      )}

      <div className="filter-bar">
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          {alertTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
        </select>
      </div>

      <div className="alert-table">
        <div className="alert-header">
          <span>Type</span>
          <span>Message</span>
          <span>Time</span>
          <span>Action</span>
        </div>
        {filtered.length === 0 ? (
          <p style={{ padding: "1rem", fontStyle: "italic", color: "#6b7280" }}>
            No unresolved fraud alerts.
          </p>
        ) : (
          filtered.map((alert) => (
            <div key={alert.alert_id} className="alert-row">
              <span>
                <span className={`alert-badge ${alert.alert_type?.replace(/\s+/g, '').toLowerCase() || 'unknown'}`}>
                  {alert.alert_type || "Unknown"}
                </span>
              </span>
              <span className="alert-message">{alert.message}</span>
              <span className="alert-time">{new Date(alert.created_at).toLocaleString()}</span>
              <span className="alert-action">
                <button onClick={() => handleResolve(alert.alert_id)}>Resolve</button>
              </span>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => setShowResolved(!showResolved)} className="toggle-resolved-btn">
          {showResolved ? "Hide" : "Show"} Resolved Alerts
        </button>

        {showResolved && (
          <div className="alert-table">
            <div className="alert-header">
              <span>Type</span>
              <span>Message</span>
              <span>Time</span>
              <span>Status</span>
            </div>
            {resolvedAlerts.map((alert) => (
              <div key={alert.alert_id} className="alert-row">
                <span>
                  <span className={`alert-badge ${alert.alert_type?.replace(/\s+/g, '').toLowerCase() || 'unknown'}`}>
                    {alert.alert_type}
                  </span>
                </span>
                <span className="alert-message">{alert.message}</span>
                <span className="alert-time">{new Date(alert.created_at).toLocaleString()}</span>
                <span className="alert-action">
                  <button onClick={() => handleDelete(alert.alert_id)} className="delete-button">Delete</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        show={showConfirm}
        message={confirmMessage}
        onConfirm={confirmAction}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}