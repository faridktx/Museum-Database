import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import "../components.css";
import { OnSignUp } from "../on-sign-up";
import { Bell } from "lucide-react";

export function DashboardHeader() {
  const { user } = useUser();
  const [scrollDir, setScrollDir] = useState("up");
  const [lastY, setLastY] = useState(0);
  const [unresolvedCount, setUnresolvedCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const direction = currentY > lastY ? "down" : "up";
      setScrollDir(direction);
      setLastY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

  useEffect(() => {
    fetch("/api/fraud-alerts/unresolved-count")
      .then((res) => res.json())
      .then((data) => setUnresolvedCount(data.count || 0))
      .catch((err) => console.error("Failed to fetch alerts", err));
  }, []);

  return (
    <header
      className="header"
      style={{
        position: "fixed",
        top: scrollDir === "down" ? "-100px" : "0",
        width: "100%",
        zIndex: 1000,
        background: "#fff",
        transition: "top 0.3s ease",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div className="container header-content">
        <div className="logo">
          <Link href="/" style={{ textDecoration: "none" }}>
            <h1 style={{ cursor: "pointer", margin: 0 }}>
              The Curio Collection
            </h1>
          </Link>
        </div>

        <nav className="nav-links">
          <Link href="/tickets-memberships">Tickets & Memberships</Link>
          <Link href="/gift-shop">Gift Shop</Link>
          <Link href="/dashboard">Dashboard Home</Link>

          <SignedOut>
            <SignInButton>
              <button className="button login-button">Login</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <OnSignUp />
            <span style={{ marginRight: "1rem" }}>
              Welcome,{" "}
              {user?.fullName ||
                user?.username ||
                user?.emailAddresses[0]?.emailAddress}
            </span>
            <div className="notification-icon">
              <Link href="/dashboard/notifications" aria-label="Notifications">
                <Bell size={20} />
                {unresolvedCount > 0 && (
                  <span className="notification-badge">{unresolvedCount}</span>
                )}
              </Link>
            </div>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
