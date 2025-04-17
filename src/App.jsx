import { Switch, Route, useLocation } from "wouter";
import { useUser } from "@clerk/clerk-react";
import { Home } from "./pages/home";
import { Header } from "./components/home/header";
import { Footer } from "./components/home/footer";
import { Dashboard } from "./pages/dashboard";
import { DashboardHeader } from "./components/dashboard/header";
import { NotFound } from "./pages/not-found";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Tickets } from "./pages/tickets";
import { SupportDocumentation } from "./pages/SupportDocumentation";
import { SupportCenter } from "./pages/SupportCenter";
import { SupportAccount } from "./pages/SupportAccount";
import { SupportTutorials } from "./pages/SupportTutorials";
import { SupportApi } from "./pages/SupportApi";
import { SupportFaq } from "./pages/SupportFaq";
import { SupportContact } from "./pages/SupportContact";
import { SupportKnowledge } from "./pages/SupportKnowledge";
import { SupportReport } from "./pages/SupportReport";
import { ModifyGuest, DeleteGuest } from "./components/guest-ops";
import { GuestOperations } from "./pages/guest";
import { ExhibitOperations } from "./pages/exhibits";
import { ArtifactReport } from "./pages/artifact-report";
import { DepartmentReport } from "./pages/department-report";
import { EmployeeReport } from "./pages/employee-report";
import {
  AddArtifact,
  ModifyArtifact,
  DeleteArtifact,
} from "./components/artifact-ops";
import {
  DeleteExhibit,
  AddExhibit,
  ModifyExhibit,
} from "./components/exhibit-ops";
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
import { InventoryOperations } from "./pages/inventory";
import {
  AddInventory,
  ModifyInventory,
  DeleteInventory,
} from "./components/inventory-ops";
import { SalesOperations } from "./pages/sales";
import { AddSale, ModifySale, DeleteSale } from "./components/sales-ops";

const routes = [
  { route: "/tickets", component: Tickets },
  { route: "/gift-shop", component: GiftShop },
  { route: "/memberships", component: Memberships },
  { route: "/dashboard", component: Dashboard },
  { route: "/dashboard/sales", component: SalesOperations },
  { route: "/dashboard/inventory", component: InventoryOperations },
  { route: "/dashboard/exhibit", component: ExhibitOperations },
  { route: "/dashboard/artifact", component: ArtifactOperations },
  { route: "/dashboard/guest", component: GuestOperations },
  { route: "/dashboard/guest/modify", component: ModifyGuest },
  { route: "/dashboard/guest/remove", component: DeleteGuest },
  { route: "/dashboard/artist", component: ArtistOperations },
  { route: "/dashboard/employee", component: EmployeeOperations },
  { route: "/dashboard/artifact/add", component: AddArtifact },
  { route: "/dashboard/artifact/modify", component: ModifyArtifact },
  { route: "/dashboard/artifact/remove", component: DeleteArtifact },
  { route: "/dashboard/exhibit/add", component: AddExhibit },
  { route: "/dashboard/exhibit/modify", component: ModifyExhibit },
  { route: "/dashboard/exhibit/remove", component: DeleteExhibit },
  { route: "/dashboard/artist/add", component: AddArtist },
  { route: "/dashboard/artist/modify", component: ModifyArtist },
  { route: "/dashboard/artist/remove", component: DeleteArtist },
  { route: "/dashboard/employee/add", component: AddEmployee },
  { route: "/dashboard/employee/modify", component: ModifyEmployee },
  { route: "/dashboard/employee/remove", component: DeleteEmployee },
  { route: "/dashboard/inventory/add", component: AddInventory },
  { route: "/dashboard/inventory/modify", component: ModifyInventory },
  { route: "/dashboard/inventory/remove", component: DeleteInventory },
  { route: "/dashboard/sales/add", component: AddSale },
  { route: "/dashboard/sales/modify", component: ModifySale },
  { route: "/dashboard/sales/remove", component: DeleteSale },
  { route: "/support-docs", component: SupportDocumentation },
  { route: "/support-center", component: SupportCenter },
  { route: "/support-account", component: SupportAccount },
  { route: "/support-tutorials", component: SupportTutorials },
  { route: "/support-api", component: SupportApi },
  { route: "/support-faq", component: SupportFaq },
  { route: "/support-contact", component: SupportContact },
  { route: "/support-knowledge", component: SupportKnowledge },
  { route: "/support-report", component: SupportReport },
  { route: "/dashboard/artifact-report", component: ArtifactReport },
  { route: "/dashboard/department-report", component: DepartmentReport },
  { route: "/dashboard/employee-report", component: EmployeeReport },
];

export function App() {
  const { user } = useUser();
  const isLoggedIn = !!user;
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {isLoggedIn ? <DashboardHeader /> : <Header />}

      <main style={{ flex: 1 }}>
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
      </main>

      <Footer />
    </div>
  );
}
