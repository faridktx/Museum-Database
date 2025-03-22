import { Link } from "wouter";
import "../components.css";

export function Header() {
  const handleClick = function () {
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
          <Link href="/login">
            <button className="button login-button">Login</button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
