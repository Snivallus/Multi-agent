
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CaseSelectionWrapper from "@/components/CaseSelectionWrapper";
import DialogueSimulationWrapper from "@/components/DialogueSimulationWrapper";
import DirectInteractionWrapper from "@/components/DirectInteractionWrapper";
import { Language } from '@/types/language';
import { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

/**
 * 使用 BrowserRouter 定义整个 App 的路由
 */
const App: React.FC = () => {
  // 维护全局语言状态
  const [language, setLanguage] = useState<Language>('zh');
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Index Page */}
          <Route 
            path="/" 
            element={<Index language={language} toggleLanguage={toggleLanguage}/>} 
          />

          {/* Case Selection */}
          <Route
            path="/database/case_selection"
            element={<CaseSelectionWrapper language={language} toggleLanguage={toggleLanguage} />}
          />

          {/* Dialogue Simulation */}
          <Route 
            path="/database/dialogue_simulation/:patientId" 
            element={<DialogueSimulationWrapper language={language} toggleLanguage={toggleLanguage}/>} 
          />

          {/* Direct Interaction */}
          <Route 
            path="/direct_interaction" 
            element={<DirectInteractionWrapper language={language} toggleLanguage={toggleLanguage}/>}
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route 
            path="*" 
            element={<NotFound />} 
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
