import { Link } from 'wouter';
import '../components.css';

export function DashboardHeader() {
  const handleClick = function () {
    window.location.href = '/';
  }

  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">
          <h1 onClick={handleClick} style={{cursor: 'pointer'}}>MuseoCore</h1>
        </div>
        <nav className="nav-links">
            <button className="button login-button" onClick={handleClick}>Logout</button>
        </nav>
      </div>
    </header>
  );
}
