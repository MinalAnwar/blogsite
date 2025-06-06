import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import NotFound from "@/pages/not-found";
import FirebaseLanding from "@/pages/FirebaseLanding";
import Dashboard from "@/pages/Dashboard";
import FeedbackCollection from "@/pages/FeedbackCollection";
import ContentHub from "@/pages/ContentHub";
import Analytics from "@/pages/Analytics";
import Automation from "@/pages/Automation";

function Router() {
  const { isAuthenticated, isLoading } = useFirebaseAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={FirebaseLanding} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/feedback" component={FeedbackCollection} />
          <Route path="/content" component={ContentHub} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/automation" component={Automation} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
