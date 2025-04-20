import { useEffect, useState } from "react";
import { AdminDashboard } from "./dashboards/admin-dashboard";
import { CuratorDashboard } from "./dashboards/curator-dashboard";
import { GiftShopDashboard } from "./dashboards/giftshop-dashboard";
import { CustomerDashboard } from "./dashboards/customer-dashboard";

// In-memory cache for user roles
const roleCache = new Map();

export function DashboardRouter({ userId }) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!userId) return;

    // Check if we already have the role cached
    if (roleCache.has(userId)) {
      setRole(roleCache.get(userId));
      return;
    }

    async function fetchRole() {
      try {
        const response = await fetch(`/api/user-role?userId=${userId}`);
        const data = await response.json();
        roleCache.set(userId, data.role); // Cache the role
        setRole(data.role);
      } catch (err) {
        console.error("Failed to fetch role", err);
      }
    }

    fetchRole();
  }, [userId]);

  if (!role) return <div>Loading dashboard...</div>;

  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "curator":
      return <CuratorDashboard />;
    case "giftshop":
      return <GiftShopDashboard />;
    case "customer":
      return <CustomerDashboard />;
    default:
      return <div>Unauthorized or unknown role</div>;
  }
}