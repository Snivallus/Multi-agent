import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CaseSelection from '@/components/CaseSelection';
import DialogueSimulationWrapper from "@/components/DialogueSimulationWrapper";
import DirectInteractionWrapper from "@/components/DirectInteractionWrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          {/* Index Page */}
          <Route 
            path="/" 
            element={<Index />} 
          />

          {/* Case Selection */}
          <Route
            path="/database/case_selection"
            element={<CaseSelection onBack={() => window.history.back()} language="zh" />}
          />

          {/* Dialogue Simulation */}
          <Route 
            path="/database/dialogue_simulation/:patientId" 
            element={<DialogueSimulationWrapper />} 
          />
          
          {/* Direct Interaction */}
          <Route 
            path="/direct_interaction" 
            element={<DirectInteractionWrapper />}
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route 
            path="*" 
            element={<NotFound />} 
          />
          {/* 测试时只需访问 http://localhost:8080/#/non-existent-path 即可看到效果*/}
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
