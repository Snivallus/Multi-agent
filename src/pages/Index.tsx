
import React, { useState } from 'react';
import { MedicalCase } from '@/data/medicalCases';
import CaseSelection from '@/components/CaseSelection';
import DialogueSimulation from '@/components/DialogueSimulation';
import { ArrowRight } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

// Application state enum
enum AppState {
  LANDING,
  CASE_SELECTION,
  DIALOGUE_SIMULATION,
}

/**
 * Main application component that manages app state and language selection
 * Controls navigation between landing page, case selection, and dialogue simulation
 */
const Index: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [selectedCase, setSelectedCase] = useState<MedicalCase | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  // Navigation handlers
  const handleStartClick = () => {
    setAppState(AppState.CASE_SELECTION);
  };

  const handleCaseSelect = (caseData: MedicalCase) => {
    setSelectedCase(caseData);
    setAppState(AppState.DIALOGUE_SIMULATION);
  };

  const handleBackToLanding = () => {
    setAppState(AppState.LANDING);
  };

  const handleBackToSelection = () => {
    setAppState(AppState.CASE_SELECTION);
  };

  // Toggle between English and Chinese
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Language toggle - appears on all screens */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-white shadow-md rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium text-medical-blue border border-medical-light-blue"
        >
          {getText(translations.toggleLanguage, language)}
        </button>
      </div>

      {appState === AppState.LANDING && (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-20 text-center animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block mb-4 px-4 py-1 bg-medical-light-blue text-medical-blue rounded-full text-sm font-medium animate-fade-in">
              {getText(translations.interactiveMedicalLearning, language)}
            </span>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-medical-blue to-medical-dark-blue animate-fade-in" style={{ animationDelay: '100ms' }}>
              {getText(translations.appTitle, language)}
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              {getText(translations.appDescription, language)}
            </p>
            
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <button 
                onClick={handleStartClick}
                className="btn-primary group inline-flex items-center"
              >
                {getText(translations.selectCaseButton, language)}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                {getText(translations.clickToStartHint, language)}
              </p>
            </div>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
            <FeatureCard 
              icon="🔍"
              title={getText(translations.featureClinicalCasesTitle, language)}
              description={getText(translations.featureClinicalCasesDesc, language)}
            />
            
            <FeatureCard 
              icon="💬"
              title={getText(translations.featureInteractiveTitle, language)}
              description={getText(translations.featureInteractiveDesc, language)}
            />
            
            <FeatureCard 
              icon="📊"
              title={getText(translations.featureLearningTitle, language)}
              description={getText(translations.featureLearningDesc, language)}
            />
          </div>
        </div>
      )}

      {appState === AppState.CASE_SELECTION && (
        <CaseSelection 
          onSelect={handleCaseSelect}
          onBack={handleBackToLanding}
          language={language}
        />
      )}

      {appState === AppState.DIALOGUE_SIMULATION && selectedCase && (
        <DialogueSimulation 
          caseData={selectedCase}
          onBack={handleBackToSelection}
          language={language}
        />
      )}
    </div>
  );
};

/**
 * Component for displaying feature cards on the landing page
 */
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Index;
