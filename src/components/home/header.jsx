import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import "../components.css";

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
            MuseoCore
          </h1>
        </div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#overview">Overview</a>
          <a href="#contact">Contact</a>

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
