import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import "../components.css";
import { Link } from "wouter";
import { OnSignUp } from "../on-sign-up";

export function Header() {
  const { user } = useUser();

  const handleClick = () => {
    window.location.href = "/";
  };

  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">
          <h1 onClick={handleClick} style={{ cursor: "pointer" }}>
            The Curio Collection
          </h1>
        </div>
        <nav className="nav-links">
          <Link href="/tickets">Tickets</Link>
          <Link href="/memberships">Memberships</Link>
          <Link href="/gift-shop">Gift Shop</Link>

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
