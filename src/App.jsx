import { Switch, Route, useLocation } from "wouter";
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Home } from "./pages/home";
import { Dashboard } from "./pages/dashboard";
import { Header } from "./components/home/header";
import { Footer } from "./components/home/footer";
import { DashboardHeader } from "./components/dashboard/dashboard-header";
import { DashboardFooter } from "./components/dashboard/dashboard-footer";

export function App() {
  const [location] = useLocation();
  const notInDashboard = ["/", "/login"].includes(location);

  return (
    <>
      {notInDashboard ? <Header /> : <DashboardHeader />}
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
      {notInDashboard ? <Footer /> : <DashboardFooter />}
    </>
  );
}