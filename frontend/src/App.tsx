import { Switch, Route } from "wouter";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import Onboard from "./pages/Onboard";
import ClientPortal from "./pages/ClientPortal";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0A0A1A] text-white font-body">
        <Toaster richColors position="top-right" />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/checkout/:packageId" component={Checkout} />
          <Route path="/onboard" component={Onboard} />
          <Route path="/client-portal" component={ClientPortal} />
          <Route path="/client-portal/:view" component={ClientPortal} />
          <Route>
            <div className="flex items-center justify-center min-h-screen">
              <h1 className="text-4xl font-display font-bold">404 — Page Not Found</h1>
            </div>
          </Route>
        </Switch>
      </div>
    </AuthProvider>
  );
}

export default App;
