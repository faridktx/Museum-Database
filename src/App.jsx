import { Switch, Route } from "wouter";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { Home } from "./pages/home";
import { Dashboard } from "./pages/dashboard";
import { Header } from "./components/home/header";
import { Footer } from "./components/home/footer";

export function App() {
  return (
    <>
      <Header />

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />

        <Route path="/dashboard">
          <SignedIn>
            <Dashboard />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </Route>
      </Switch>

      <Footer />
    </>
  );
}
// import { Switch, Route } from "wouter";
// import { Home } from "./pages/home";
// import { Dashboard } from "./pages/dashboard";
// import { Login } from "./pages/Login";
// import { Header } from "./components/home/header";
// import { Footer } from "./components/home/footer";
// import {
//   AddArtifact,
//   ModifyArtifact,
//   DeleteArtifact,
// } from "./components/artifact-ops";
// import {
//   AddArtist,
//   ModifyArtist,
//   DeleteArtist,
// } from "./components/artist-ops";
// import {
//   AddEmployee,
//   ModifyEmployee,
//   DeleteEmployee,
// } from "./components/employee-ops";
// import { DashboardHeader } from "./components/dashboard/dashboard-header";
// import { DashboardFooter } from "./components/dashboard/dashboard-footer";
// import { ArtifactOperations } from "./pages/artifact";
// import { ArtistOperations } from "./pages/artist";
// import { EmployeeOperations } from "./pages/employees";

// export function App() {
//   const currentPath = window.location.pathname;
//   const inDashboard = currentPath.startsWith("/dashboard") || currentPath.includes("artifact") || currentPath.includes("employee") || currentPath.includes("artist");

//   return (
//     <>
//       {inDashboard ? <DashboardHeader /> : <Header />}

//       <Switch>
//         <Route path="/" component={Home} />
//         <Route path="/login" component={Login} />
//         <Route path="/dashboard" component={Dashboard} />
//         <Route path="/login/artifact" component={ArtifactOperations} />
//         <Route path="/login/artist" component={ArtistOperations} />
//         <Route path="/login/employee" component={EmployeeOperations} />
//         <Route path="/login/artifact/add" component={AddArtifact} />
//         <Route path="/login/artifact/modify" component={ModifyArtifact} />
//         <Route path="/login/artifact/remove" component={DeleteArtifact} />
//         <Route path="/login/artist/add" component={AddArtist} />
//         <Route path="/login/artist/modify" component={ModifyArtist} />
//         <Route path="/login/artist/remove" component={DeleteArtist} />
//         <Route path="/login/employee/add" component={AddEmployee} />
//         <Route path="/login/employee/modify" component={ModifyEmployee} />
//         <Route path="/login/employee/remove" component={DeleteEmployee} />
//       </Switch>

//       {inDashboard ? <DashboardFooter /> : <Footer />}
//     </>
//   );
// }