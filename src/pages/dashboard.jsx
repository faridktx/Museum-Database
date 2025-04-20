import { useEffect, useState } from "react";
import { AdminDashboard } from "./dashboards/admin-dashboard";
import { CuratorDashboard } from "./dashboards/curator-dashboard";
import { GiftShopDashboard } from "./dashboards/giftshop-dashboard";
import { CustomerDashboard } from "./dashboards/customer-dashboard";
import { useUser } from "@clerk/clerk-react";
import { Unauthorized } from "./unauthorized";

// In-memory cache for user roles and employee IDs
const roleCache = new Map();

export function DashboardRouter() {
  const [userData, setUserData] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    if (roleCache.has(user.id)) {
      setUserData(roleCache.get(user.id));
      return;
    }

    async function fetchUserData() {
      const url = new URL("/api/getrole/", process.env.REACT_APP_BACKEND_URL);
      url.searchParams.append("id", user.id);
      try {
        const response = await fetch(url.toString(), { method: "GET" });
        const data = await response.json();

        // Ensure role and employeeId are present
        const { role, employeeId } = data;
        roleCache.set(user.id, { role, employeeId });
        setUserData({ role, employeeId });
      } catch (err) {
        console.error(err);
      }
    }

    fetchUserData();
  }, [user?.id]);

  if (!userData) return <div>Loading dashboard...</div>;

  const { role, employeeId } = userData;
  switch (role) {
    case "admin":
      return employeeId ? <AdminDashboard /> : <Unauthorized />;
    case "curator":
      return employeeId ? <CuratorDashboard /> : <Unauthorized />;
    case "giftshop":
      return employeeId ? <GiftShopDashboard /> : <Unauthorized />;
    case "guest":
      return <CustomerDashboard />;
    default:
      return <Unauthorized />;
  }
}
