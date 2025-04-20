import { Switch, Route, useLocation } from "wouter";
import { useUser } from "@clerk/clerk-react";
import { Home } from "./pages/home";
import { Header } from "./components/home/header";
import { Footer } from "./components/home/footer";
import { DashboardHeader } from "./components/dashboard/header";
import { NotFound } from "./pages/not-found";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { SupportDocumentation } from "./pages/support/support-documentation";
import { SupportCenter } from "./pages/support/support-center";
import { SupportAccount } from "./pages/support/support-account";
import { SupportTutorials } from "./pages/support/support-tutorials";
import { SupportApi } from "./pages/support/support-api";
import { SupportFaq } from "./pages/support/support-faq";
import { SupportContact } from "./pages/support/support-contact";
import { SupportKnowledge } from "./pages/support/support-knowledge";
import { SupportReport } from "./pages/support/support-report";
import { TicketMembership } from "./pages/ticket-memberships";
import { Cart } from "./pages/cart";
import { AdminNotifications } from "./pages/admin-notifications";
import { useEffect } from "react";
import { PlanVisit } from "./pages/plan-visit";
import { GiftShop } from "./pages/giftshop";
import { DashboardRouter } from "./pages/dashboard";

const routes = [
  { route: "/dashboard", component: DashboardRouter },
  { route: "/gift-shop", component: GiftShop },
  { route: "/plan-your-visit", component: PlanVisit },
  { route: "/support-docs", component: SupportDocumentation },
  { route: "/support-center", component: SupportCenter },
  { route: "/support-account", component: SupportAccount },
  { route: "/support-tutorials", component: SupportTutorials },
  { route: "/support-api", component: SupportApi },
  { route: "/support-faq", component: SupportFaq },
  { route: "/support-contact", component: SupportContact },
  { route: "/support-knowledge", component: SupportKnowledge },
  { route: "/support-report", component: SupportReport },
  { route: "/tickets-memberships", component: TicketMembership },
  { route: "/dashboard/cart", component: Cart },
  { route: "/dashboard/notifications", component: AdminNotifications },
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
