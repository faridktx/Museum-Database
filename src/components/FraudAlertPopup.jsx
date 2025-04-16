// FraudAlertPopup.jsx
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

export function FraudAlertPopup() {
  const { user } = useUser();
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      const res = await fetch(`/api/alerts?userId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setAlerts(data.data);
      }
    };

    if (!dismissed) fetchAlerts();
  }, [dismissed, user]);

  const resolveAlert = async (id) => {
    await fetch("/api/resolve-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alert_id: id }),
    });
    setAlerts((prev) => prev.filter((a) => a.alert_id !== id));
  };

  if (dismissed || alerts.length === 0) return null;

  return (
    <div style={popupWrapperStyle}>
      <div style={popupStyle}>
        <h3 style={headerStyle}>⚠️ Fraud Alerts</h3>
        <ul style={listStyle}>
          {alerts.map((alert) => (
            <li key={alert.alert_id} style={itemStyle}>
              {alert.message}
              <button
                style={resolveButtonStyle}
                onClick={() => resolveAlert(alert.alert_id)}
              >
                Resolve
              </button>
            </li>
          ))}
        </ul>
        <button style={dismissButtonStyle} onClick={() => setDismissed(true)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

const popupWrapperStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.5)",
  zIndex: 9999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popupStyle = {
  background: "white",
  borderRadius: "12px",
  padding: "2rem",
  width: "400px",
  maxWidth: "90%",
  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
  textAlign: "center",
};

const headerStyle = {
  fontSize: "1.25rem",
  fontWeight: "bold",
  marginBottom: "1rem",
};

const listStyle = {
  listStyleType: "none",
  padding: 0,
  margin: "0 0 1.5rem 0",
  textAlign: "left",
};

const itemStyle = {
  marginBottom: "0.75rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "0.95rem",
};

const resolveButtonStyle = {
  marginLeft: "1rem",
  padding: "4px 10px",
  fontSize: "0.75rem",
  backgroundColor: "#222",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const dismissButtonStyle = {
  marginTop: "1rem",
  padding: "8px 16px",
  fontSize: "0.85rem",
  backgroundColor: "#111",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
