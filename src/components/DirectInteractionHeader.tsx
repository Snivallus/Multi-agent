
import React from 'react';
import { ArrowLeft, CheckSquare, Upload, Cpu, Save } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

interface DirectInteractionHeaderProps {
  onBack: () => void;
  onGenerateDiagnosis: () => void;
  onUploadFile: () => void;
  onResetDialogue: () => void;
  onSaveSession: () => void;
  isWaiting: boolean;
  isSaving: boolean;
  language: Language;
}

const DirectInteractionHeader: React.FC<DirectInteractionHeaderProps> = ({
  onBack,
  onGenerateDiagnosis,
  onUploadFile,
  onResetDialogue,
  onSaveSession,
  isWaiting,
  isSaving,
  language
}) => {
  return (
    <div className="bg-white shadow-sm border-b p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {getText(translations.directInteractionTitle, language)}
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Save Session button */}
          <button
            onClick={onSaveSession}
            className="p-2 px-4 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            aria-label="Save Session"
            disabled={isWaiting || isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>{getText(translations.saveSession, language)}</span>
              </>
            )}
          </button>
          
          {/* End Consultation button */}
          <button
            onClick={onGenerateDiagnosis}
            className="p-2 px-4 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            aria-label="End Consultation"
            disabled={isWaiting}
          >
            <CheckSquare className="h-5 w-5" />
            <span>{getText(translations.generateDiagnosis, language)}</span>
          </button>
          
          {/* Upload File button */}
          <button
            onClick={onUploadFile}
            className="p-2 px-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            aria-label="Upload File"
            disabled={isWaiting}
          >
            <Upload className="h-5 w-5" />
            <span>{getText(translations.uploadFile, language)}</span>
          </button>
          
          {/* Reset dialogue button */}
          <button
            onClick={onResetDialogue}
            className="p-2 px-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            aria-label="Reset Dialogue"
            disabled={isWaiting}
          >
            <Cpu className="h-5 w-5" />
            <span>{getText(translations.resetMomery, language)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectInteractionHeader;
