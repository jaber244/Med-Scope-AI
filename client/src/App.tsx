import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import SymptomChecker from "@/pages/SymptomChecker";
import VisionAI from "@/pages/VisionAI";
import Result from "@/pages/Result";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Support from "@/pages/Support";
import NotFound from "@/pages/not-found";

import { ThemeProvider } from "@/components/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/symptoms" component={SymptomChecker} />
      <Route path="/vision" component={VisionAI} />
      <Route path="/result/:id" component={Result} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/support" component={Support} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="medscope-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
