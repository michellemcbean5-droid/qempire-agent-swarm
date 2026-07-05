import { Switch, Route } from "wouter";
import { Toaster } from "sonner";
import OceanBackground from "./components/OceanBackground";
import Home from "./pages/Home";
import IdeaBuilder from "./pages/IdeaBuilder";
import Simulator from "./pages/Simulator";
import Formula from "./pages/Formula";
import Command from "./pages/Command";
import Connectors from "./pages/Connectors";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import Onboard from "./pages/Onboard";
import ClientPortal from "./pages/ClientPortal";

function App() {
  return (
    <div className="relative min-h-screen font-body text-ink">
      <OceanBackground />
      <Toaster theme="dark" richColors position="top-right" />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/idea" component={IdeaBuilder} />
        <Route path="/simulator" component={Simulator} />
        <Route path="/formula" component={Formula} />
        <Route path="/command" component={Command} />
        <Route path="/connectors" component={Connectors} />
        <Route path="/account" component={Account} />
        <Route path="/checkout/:packageId" component={Checkout} />
        <Route path="/onboard" component={Onboard} />
        <Route path="/client-portal" component={ClientPortal} />
        <Route>
          <div className="flex min-h-screen items-center justify-center px-4 text-center">
            <div>
              <div className="font-display text-6xl text-gradient-gold">404</div>
              <p className="mt-3 text-mist">This current has pulled you off the map.</p>
              <a href="/" className="mt-6 inline-block rounded-full btn-brand px-6 py-2.5 font-semibold text-white">
                Back to the surface
              </a>
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
