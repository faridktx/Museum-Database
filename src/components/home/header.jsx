import { Link } from "wouter";
import "../components.css";

function NavigationTab({ isInLogin }) {
  const navigationLinks = [
    { name: "Features", href: "#features" },
    { name: "Overview", href: "#overview" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="nav-links">
      {isInLogin ? (
        <></>
      ) : (
        navigationLinks.map((link, index) => (
          <a key={index} href={link.href}>
            {link.name}
          </a>
        ))
      )}
      <Link href="/login">
        <button className="button login-button">Login</button>
      </Link>
    </nav>
  );
}

export function Header({ isInLogin }) {
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
        <NavigationTab isInLogin={isInLogin} />
      </div>
    </header>
  );
}
