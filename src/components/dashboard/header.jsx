import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Link } from "wouter";
import "../components.css";

export function DashboardHeader() {
  const { user } = useUser();
  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">
          <Link href="/" style={{ textDecoration: "none" }}>
            <h1 style={{ cursor: "pointer" }}>MuseoCore</h1>
          </Link>
        </div>

        <nav className="nav-links">
          <Link href="/dashboard">Dashboard Home</Link>

          <SignedOut>
            <SignInButton>
              <button className="button login-button">Login</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
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
