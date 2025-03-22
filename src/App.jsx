import { Switch, Route } from "wouter";
import { Home } from "./pages/home";
import { Header } from "./components/home/header";
import { Footer } from "./components/home/footer";
import { Dashboard } from "./pages/dashboard";
import {
  AddArtifact,
  ModifyArtifact,
  DeleteArtifact,
} from "./components/artifact-ops";
import { ArtifactOperations } from "./pages/artifact";
import { ArtistOperations } from "./pages/artist";
import { EmployeeOperations } from "./pages/employees";
import { AddArtist, ModifyArtist, DeleteArtist } from "./components/artist-ops";
import {
  AddEmployee,
  ModifyEmployee,
  DeleteEmployee,
} from "./components/employee-ops";
import { DashboardFooter } from "./components/dashboard/dashboard-footer";
import { DashboardHeader } from "./components/dashboard/dashboard-header";

export function App() {
  const currentPath = window.location.pathname;
  const inDashboard = function () {
    return (
      currentPath.endsWith("artifact") ||
      currentPath.endsWith("employee") ||
      currentPath.endsWith("artist")
    );
  };

  return (
    <>
      {inDashboard() ? <DashboardHeader /> : <Header />}
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Dashboard} />
        <Route path="/login/artifact" component={ArtifactOperations} />
        <Route path="/login/artist" component={ArtistOperations} />
        <Route path="/login/employee" component={EmployeeOperations} />
        <Route path="/login/artifact/add" component={AddArtifact} />
        <Route path="/login/artifact/modify" component={ModifyArtifact} />
        <Route path="/login/artifact/remove" component={DeleteArtifact} />
        <Route path="/login/artist/add" component={AddArtist} />
        <Route path="/login/artist/modify" component={ModifyArtist} />
        <Route path="/login/artist/remove" component={DeleteArtist} />
        <Route path="/login/employee/add" component={AddEmployee} />
        <Route path="/login/employee/modify" component={ModifyEmployee} />
        <Route path="/login/employee/remove" component={DeleteEmployee} />
      </Switch>
      {inDashboard() ? <DashboardFooter /> : <Footer />}
    </>
  );
}
