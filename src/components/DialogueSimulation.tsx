
import React, { useState, useEffect, useRef } from 'react';
import { MedicalCase } from '@/data/medicalCases';
import DialogueBubble from './DialogueBubble';
import { ArrowLeft, Play, Pause, FastForward, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

interface DialogueSimulationProps {
  caseData: MedicalCase;
  onBack: () => void;
}

const DialogueSimulation: React.FC<DialogueSimulationProps> = ({ caseData, onBack }) => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dialogueRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { language } = useLanguage();
  const t = translations[language];

  const advanceDialogue = () => {
    if (currentDialogueIndex < caseData.dialogue.length - 1) {
      setCurrentDialogueIndex((prev) => prev + 1);
    } else {
      // Stop the timer when dialogue ends
      setIsPlaying(false);
    }
  };

  const resetDialogue = () => {
    setCurrentDialogueIndex(0);
    setIsPlaying(true);
  };

  // Auto-scroll when a new dialogue appears
  useEffect(() => {
    const currentDialogueElement = dialogueRefs.current[currentDialogueIndex];
    if (currentDialogueElement) {
      currentDialogueElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [currentDialogueIndex]);

  // Handle auto-advance timer
  useEffect(() => {
    // Set up or clear the timer based on isPlaying state
    if (isPlaying) {
      timerRef.current = window.setTimeout(advanceDialogue, 5000);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentDialogueIndex, isPlaying, caseData.dialogue.length]);

  return (
    <div className="flex flex-col h-screen animate-fade-in">
      {/* Header with case info */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{caseData.title[language]}</h2>
              <p className="text-sm text-gray-500">{caseData.category[language]}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={resetDialogue}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Reset dialogue"
              title={t.resetDialogue}
            >
              <RotateCcw className="h-5 w-5 text-gray-600" />
            </button>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label={isPlaying ? t.pause : t.play}
              title={isPlaying ? t.pause : t.play}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-gray-600" />
              ) : (
                <Play className="h-5 w-5 text-gray-600" />
              )}
            </button>
            
            <button
              onClick={advanceDialogue}
              disabled={currentDialogueIndex >= caseData.dialogue.length - 1}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={t.nextDialogue}
              title={t.nextDialogue}
            >
              <FastForward className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Dialogue content area */}
      <div 
        ref={containerRef}
        className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-3xl mx-auto space-y-2 pb-20">
          {caseData.dialogue.map((line, index) => (
            <div 
              key={index}
              ref={el => (dialogueRefs.current[index] = el)}
            >
              <DialogueBubble
                role={line.role}
                text={line.text[language]}
                isActive={index <= currentDialogueIndex}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="bg-white border-t p-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-medical-blue transition-all duration-500 ease-out"
              style={{ 
                width: `${(currentDialogueIndex + 1) / caseData.dialogue.length * 100}%` 
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{t.progress}</span>
            <span>{`${currentDialogueIndex + 1} ${t.of} ${caseData.dialogue.length}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogueSimulation;
