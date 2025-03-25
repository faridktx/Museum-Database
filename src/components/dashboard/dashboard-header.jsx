import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import "../components.css";

export function DashboardHeader() {
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
          <SignedOut>
            <SignInButton>
              <button className="button login-button">Login</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <span style={{ marginRight: "1rem" }}>
              Welcome, {user?.fullName || user?.username || user?.emailAddresses[0]?.emailAddress}
            </span>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
// import { Link } from "wouter";
// import "../components.css";

// export function DashboardHeader() {
//   const handleClick = function () {
//     window.location.href = "/";
//   };

//   return (
//     <header className="header">
//       <div className="container header-content">
//         <div className="logo">
//           <h1 onClick={handleClick} style={{ cursor: "pointer" }}>
//             MuseoCore
//           </h1>
//         </div>
//         <nav className="nav-links">
//           <button className="button login-button" onClick={handleClick}>
//             Logout
//           </button>
//         </nav>
//       </div>
//     </header>
//   );
// }
