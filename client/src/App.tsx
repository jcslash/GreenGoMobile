import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileContainer } from "@/components/mobile-container";
import { BottomNavigation } from "@/components/bottom-navigation";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import Rewards from "@/pages/rewards";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/rewards" component={Rewards} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MobileContainer>
          <div className="screen-content">
            <Router />
          </div>
          <BottomNavigation />
        </MobileContainer>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
