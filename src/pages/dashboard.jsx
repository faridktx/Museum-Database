import { useEffect, useState } from "react";
import { AdminDashboard } from "./dashboards/admin-dashboard";
import { CuratorDashboard } from "./dashboards/curator-dashboard";
import { GiftShopDashboard } from "./dashboards/giftshop-dashboard";
import { CustomerDashboard } from "./dashboards/customer-dashboard";
import { useUser } from "@clerk/clerk-react";

// In-memory cache for user roles
const roleCache = new Map();

export function DashboardRouter({ userId }) {
  const [role, setRole] = useState({});
  const { user } = useUser();

  useEffect(() => {
    if (!userId) return;

    // Check if we already have the role cached
    if (roleCache.has(userId)) {
      setRole(roleCache.get(userId));
      return;
    }

    async function fetchRole() {
      const url = new URL("/api/getrole/", process.env.REACT_APP_BACKEND_URL);
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), {
          method: "GET",
        });
        const data = await response.json();
        roleCache.set(userId, data.data);
        setRole(data.role);
      } catch (err) {
        console.log(err);
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
