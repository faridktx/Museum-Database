import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Link } from "wouter";
import "../components.css";
import { OnSignUp } from "../on-sign-up";

export function DashboardHeader() {
  const { user } = useUser();
  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">
          <Link href="/" style={{ textDecoration: "none" }}>
            <h1 style={{ cursor: "pointer" }}>The Curio Collection</h1>
          </Link>
        </div>

        <nav className="nav-links">
          <Link href="/tickets">Tickets</Link>
          <Link href="/memberships">Memberships</Link>
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
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
