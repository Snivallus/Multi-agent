
import React, { useState } from 'react';
import { MedicalCase } from '@/data/medicalCases';
import CaseSelection from '@/components/CaseSelection';
import DialogueSimulation from '@/components/DialogueSimulation';
import { ArrowRight } from 'lucide-react';

enum AppState {
  LANDING,
  CASE_SELECTION,
  DIALOGUE_SIMULATION,
}

const Index: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [selectedCase, setSelectedCase] = useState<MedicalCase | null>(null);

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
      {appState === AppState.LANDING && (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-20 text-center animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block mb-4 px-4 py-1 bg-medical-light-blue text-medical-blue rounded-full text-sm font-medium animate-fade-in">
              Interactive Medical Learning
            </span>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-medical-blue to-medical-dark-blue animate-fade-in" style={{ animationDelay: '100ms' }}>
              Medical Dialogue Diagnostics
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              Experience realistic doctor-patient interactions through simulated clinical cases. Learn diagnostic approaches and improve clinical reasoning skills.
            </p>
            
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <button 
                onClick={handleStartClick}
                className="btn-primary group inline-flex items-center"
              >
                Select a Case Study
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                Double-click on a case to start the simulation
              </p>
            </div>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
            <FeatureCard 
              icon="🔍"
              title="Clinical Cases"
              description="Explore a variety of medical scenarios across different specialties, from common presentations to complex diagnoses."
            />
            
            <FeatureCard 
              icon="💬"
              title="Interactive Dialogue"
              description="Experience the natural flow of doctor-patient conversations with realistic clinical discussions."
            />
            
            <FeatureCard 
              icon="📊"
              title="Learning Experience"
              description="Observe diagnostic reasoning and medical decision-making in action through detailed clinical conversations."
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
