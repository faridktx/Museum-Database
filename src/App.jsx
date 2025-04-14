import { Switch, Route, useLocation } from "wouter";
import { useUser } from "@clerk/clerk-react";
import { Home } from "./pages/home";
import { Header } from "./components/home/header";
import { Footer } from "./components/home/footer";
import { Dashboard } from "./pages/dashboard";
import { DashboardHeader } from "./components/dashboard/header";
import { DashboardFooter } from "./components/dashboard/footer";
import { NotFound } from "./pages/not-found";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Tickets } from "./pages/tickets";
import {
  AddArtifact,
  ModifyArtifact,
  DeleteArtifact,
} from "./components/artifact-ops";
import { ArtifactOperations } from "./pages/artifact";
import { ArtistOperations } from "./pages/artist";
import { EmployeeOperations } from "./pages/employees";
import { AddArtist, ModifyArtist, DeleteArtist } from "./components/artist-ops";
import { Memberships } from "./pages/memberships";
import { GiftShop } from "./pages/giftshop";
import {
  AddEmployee,
  ModifyEmployee,
  DeleteEmployee,
} from "./components/employee-ops";
import { useEffect } from "react";

const routes = [
  { route: "/tickets", component: Tickets },
  { route: "/gift-shop", component: GiftShop },
  { route: "/memberships", component: Memberships },
  { route: "/dashboard", component: Dashboard },
  { route: "/dashboard/artifact", component: ArtifactOperations },
  { route: "/dashboard/artist", component: ArtistOperations },
  { route: "/dashboard/employee", component: EmployeeOperations },
  { route: "/dashboard/artifact/add", component: AddArtifact },
  { route: "/dashboard/artifact/modify", component: ModifyArtifact },
  { route: "/dashboard/artifact/remove", component: DeleteArtifact },
  { route: "/dashboard/artist/add", component: AddArtist },
  { route: "/dashboard/artist/modify", component: ModifyArtist },
  { route: "/dashboard/artist/remove", component: DeleteArtist },
  { route: "/dashboard/employee/add", component: AddEmployee },
  { route: "/dashboard/employee/modify", component: ModifyEmployee },
  { route: "/dashboard/employee/remove", component: DeleteEmployee },
];

export function App() {
  const { user } = useUser();
  const isLoggedIn = !!user;
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {isLoggedIn ? <DashboardHeader /> : <Header />}
      <Switch>
        <Route path="/" component={Home} />
        {routes.map(({ route, component: Component }) => (
          <Route key={route} path={route}>
            <SignedIn>
              <Component />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </Route>
        ))}
        <Route>
          <NotFound />
        </Route>
      </Switch>
      {isLoggedIn ? <DashboardFooter /> : <Footer />}
    </>
  );
}
