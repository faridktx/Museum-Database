import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
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
              Welcome, {user?.fullName || user?.username || user?.emailAddresses[0]?.emailAddress}
            </span>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
// import { useEffect, useState } from "react";
// import { Link } from "wouter";
// import "../components.css";

// export function Header() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleClick = () => {
//     window.location.href = "/";
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     window.location.href = "/login";
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
//           <a href="#features">Features</a>
//           <a href="#overview">Overview</a>
//           <a href="#contact">Contact</a>

//           {user ? (
//             <>
//               <span style={{ marginRight: "1rem" }}>
//                 Welcome, {user.name} ({user.role})
//               </span>
//               <button className="button login-button" onClick={handleLogout}>
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link href="/login">
//               <button className="button login-button">Login</button>
//             </Link>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// }