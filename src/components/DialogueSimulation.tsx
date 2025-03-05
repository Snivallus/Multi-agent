
import React, { useState, useEffect, useRef } from 'react';
import { MedicalCase } from '@/data/medicalCases';
import DialogueBubble from './DialogueBubble';
import { ArrowLeft, Play, Pause, FastForward, RotateCcw } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

interface DialogueSimulationProps {
  caseData: MedicalCase;
  onBack: () => void;
  language: Language;
}

/**
 * Component for displaying the interactive dialogue simulation
 * Handles auto-advancing dialogue, controls, and displaying dialogue bubbles
 */
const DialogueSimulation: React.FC<DialogueSimulationProps> = ({ caseData, onBack, language }) => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastBubbleRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  /**
   * Advance to the next dialogue line
   */
  const advanceDialogue = () => {
    if (currentDialogueIndex < caseData.dialogue.length - 1) {
      setCurrentDialogueIndex((prev) => prev + 1);
    } else {
      // Stop the timer when dialogue ends
      setIsPlaying(false);
    }
  };

  /**
   * Reset dialogue to beginning
   */
  const resetDialogue = () => {
    setCurrentDialogueIndex(0);
    setIsPlaying(true);
  };

  /**
   * Jump to a specific dialogue index based on progress bar click
   * @param e Click event on the progress bar
   */
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      // Calculate click position relative to progress bar width
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickPositionX = e.clientX - rect.left;
      const clickPercentage = clickPositionX / rect.width;
      
      // Calculate and set the new dialogue index based on click position
      const newIndex = Math.min(
        Math.max(0, Math.floor(clickPercentage * caseData.dialogue.length)),
        caseData.dialogue.length - 1
      );
      
      setCurrentDialogueIndex(newIndex);
    }
  };

  // Auto-scroll to the latest dialogue bubble when it appears
  useEffect(() => {
    if (lastBubbleRef.current) {
      lastBubbleRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [currentDialogueIndex]);

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
              <h2 className="text-xl font-semibold text-gray-800">{getText(caseData.title, language)}</h2>
              <p className="text-sm text-gray-500">{getText(caseData.category, language)}</p>
            </div>
          </div>
          
          {/* Playback controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={resetDialogue}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label={getText(translations.resetDialogue, language)}
              title={getText(translations.resetDialogue, language)}
            >
              <RotateCcw className="h-5 w-5 text-gray-600" />
            </button>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label={isPlaying ? getText(translations.pause, language) : getText(translations.play, language)}
              title={isPlaying ? getText(translations.pause, language) : getText(translations.play, language)}
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
              aria-label={getText(translations.nextDialogue, language)}
              title={getText(translations.nextDialogue, language)}
            >
              <FastForward className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Dialogue content area with auto-scroll */}
      <div 
        ref={containerRef}
        className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-3xl mx-auto space-y-2 pb-20">
          {caseData.dialogue.map((line, index) => (
            <div 
              key={index}
              ref={index === currentDialogueIndex ? lastBubbleRef : null}
            >
              <DialogueBubble
                role={line.role}
                text={line.text}
                isActive={index <= currentDialogueIndex}
                language={language}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Interactive progress indicator */}
      <div className="bg-white border-t p-4">
        <div className="max-w-7xl mx-auto">
          <div 
            ref={progressBarRef}
            onClick={handleProgressBarClick}
            className="h-3 bg-gray-200 rounded-full overflow-hidden cursor-pointer relative"
            title={getText(translations.clickToJump, language)}
          >
            <div 
              className="h-full bg-medical-blue transition-all duration-500 ease-out"
              style={{ 
                width: `${(currentDialogueIndex + 1) / caseData.dialogue.length * 100}%` 
              }}
            />
            {/* Render clickable dialogue markers */}
            <div className="absolute inset-0 flex items-center">
              {caseData.dialogue.map((_, index) => (
                <div 
                  key={index}
                  className={`w-1 h-3 ${index <= currentDialogueIndex ? 'bg-white opacity-50' : 'bg-transparent'}`}
                  style={{ 
                    marginLeft: `${index === 0 ? 0 : (100 / caseData.dialogue.length)}%`,
                    transform: 'translateX(-50%)'
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{getText(translations.progress, language)}</span>
            <span>{`${currentDialogueIndex + 1} ${getText(translations.of, language)} ${caseData.dialogue.length}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogueSimulation;
