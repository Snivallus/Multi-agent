
import React, { useState } from 'react';
import { MedicalCase } from '@/data/medicalCases';
import CaseSelection from '@/components/CaseSelection';
import DialogueSimulation from '@/components/DialogueSimulation';
import { ArrowRight, Globe } from 'lucide-react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

enum AppState {
  LANDING,
  CASE_SELECTION,
  DIALOGUE_SIMULATION,
}

const IndexContent: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [selectedCase, setSelectedCase] = useState<MedicalCase | null>(null);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Language toggle button - shown on all pages */}
      <button 
        onClick={toggleLanguage}
        className="fixed top-4 right-4 p-2 bg-white rounded-full shadow-md z-50 hover:bg-gray-50 transition-colors"
        aria-label={t.toggleLanguage}
        title={t.toggleLanguage}
      >
        <Globe className="h-5 w-5 text-gray-600" />
        <span className="sr-only">{t.toggleLanguage}</span>
      </button>

      {appState === AppState.LANDING && (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-20 text-center animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block mb-4 px-4 py-1 bg-medical-light-blue text-medical-blue rounded-full text-sm font-medium animate-fade-in">
              {t.interactiveMedicalLearning}
            </span>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-medical-blue to-medical-dark-blue animate-fade-in" style={{ animationDelay: '100ms' }}>
              {t.appTitle}
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              {t.appDescription}
            </p>
            
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <button 
                onClick={handleStartClick}
                className="btn-primary group inline-flex items-center"
              >
                {t.selectCaseButton}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                {t.clickToStartHint}
              </p>
            </div>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
            <FeatureCard 
              icon="🔍"
              title={t.featureClinicalCasesTitle}
              description={t.featureClinicalCasesDesc}
            />
            
            <FeatureCard 
              icon="💬"
              title={t.featureInteractiveTitle}
              description={t.featureInteractiveDesc}
            />
            
            <FeatureCard 
              icon="📊"
              title={t.featureLearningTitle}
              description={t.featureLearningDesc}
            />
          </div>
        </div>
      )}

      {appState === AppState.CASE_SELECTION && (
        <CaseSelection 
          onSelect={handleCaseSelect}
          onBack={handleBackToLanding}
        />
      )}

      {appState === AppState.DIALOGUE_SIMULATION && selectedCase && (
        <DialogueSimulation 
          caseData={selectedCase}
          onBack={handleBackToSelection}
        />
      )}
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <LanguageProvider>
      <IndexContent />
    </LanguageProvider>
  );
};

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
