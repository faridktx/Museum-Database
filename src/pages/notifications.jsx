import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { apiFetch } from "../components/utils";
import { Link } from "wouter";

export function NotificationsPage() {
  const { user } = useUser();
  const [alerts, setAlerts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null); // null = loading

  useEffect(() => {
    const loadAlerts = async () => {
      if (!user?.id) return;

      const roleRes = await apiFetch("/api/role", "GET", user.id);
      const role = roleRes?.data?.role;

      if (role === "admin") {
        setIsAdmin(true);
        const alertRes = await apiFetch("/api/alerts", "GET", user.id);
        if (alertRes.success && Array.isArray(alertRes.data)) {
          setAlerts(alertRes.data);
        }
      } else {
        setIsAdmin(false);
      }
    };

    loadAlerts();
  }, [user]);

  const resolveAlert = async (id) => {
    await fetch("/api/resolve-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alert_id: id }),
    });
    setAlerts((prev) => prev.filter((a) => a.alert_id !== id));
  };

  if (isAdmin === null) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container">
        <h2>🚫 Unauthorized Access</h2>
        <p>This page is only available to admin users.</p>
        <Link href="/dashboard">
          <button className="button">Back to Dashboard</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>⚠️ Fraud Notifications</h1>
      {alerts.length === 0 ? (
        <p>No active fraud alerts.</p>
      ) : (
        <ul style={styles.list}>
          {alerts.map((alert) => (
            <li key={alert.alert_id} style={styles.item}>
              <div>
                <strong>{alert.alert_type || "Alert"}</strong><br />
                {alert.message}
              </div>
              <button onClick={() => resolveAlert(alert.alert_id)} style={styles.button}>
                Mark as Resolved
              </button>
            </li>
          ))}
        </ul>
      )}
      <Link href="/dashboard">
        <button className="button" style={{ marginTop: "2rem" }}>
          Back to Dashboard
        </button>
      </Link>
    </div>
  );
}

const styles = {
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "1.5rem",
  },
  item: {
    backgroundColor: "#fff4f4",
    border: "1px solid #ffcccc",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  button: {
    backgroundColor: "#a30000",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.85rem",
  },
};