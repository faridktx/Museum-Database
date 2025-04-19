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

export function DashboardHeader() {
  const { user } = useUser();
  const [scrollDir, setScrollDir] = useState("up");
  const [lastY, setLastY] = useState(0);

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
          <Link href="/dashboard/notifications">Notifications</Link>

          <SignedOut>
            <SignInButton>
              <button className="button login-button">Login</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <OnSignUp />
            <span style={{ marginRight: "1rem" }}>
              Welcome, {" "}
              {user?.fullName ||
                user?.username ||
                user?.emailAddresses[0]?.emailAddress}
            </span>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
