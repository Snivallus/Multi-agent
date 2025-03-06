
import { MedicalCase } from '@/data/medicalCases';
import { cn } from '@/lib/utils';
import React from 'react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

interface CaseCardProps {
  caseData: MedicalCase;
  onClick: () => void;
  language: Language;
}

/**
 * Component for displaying individual medical case cards
 * Provides a visual representation of a medical case with difficulty, title, description and tags
 */
const CaseCard: React.FC<CaseCardProps> = ({ caseData, onClick, language }) => {
  // Map difficulty to appropriate badge color
  const difficultyColor = {
    easy: 'badge-green',
    medium: 'badge-blue',
    hard: 'badge-red',
  }[caseData.difficulty];

  // Get translated difficulty level
  const difficultyText = translations[caseData.difficulty as keyof typeof translations];

  return (
    <div
      className="case-card group hover-scale animate-fade-in cursor-pointer"
      onClick={onClick}
    >
      {/* Card header with difficulty and category badges */}
      <div className="flex justify-between items-start mb-3">
        <span className={cn('badge', difficultyColor)}>
          {getText(difficultyText, language)}
        </span>
        <span className="badge bg-gray-100 text-gray-800">
          {getText(caseData.category, language)}
        </span>
      </div>
      
      {/* Case title with hover effect */}
      <h3 className="text-xl font-semibold mb-2 text-medical-dark-blue group-hover:text-medical-blue transition-colors duration-300">
        {getText(caseData.title, language)}
      </h3>
      
      {/* Case description */}
      <p className="text-gray-600 mb-4 text-sm">
        {getText(caseData.description, language)}
      </p>
      
      {/* Tags section */}
      <div className="flex flex-wrap gap-2">
        {caseData.tags[language].map((tag, index) => (
          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      
      {/* Click to select indicator */}
      <div className="mt-4 text-sm text-gray-500 flex items-center justify-end">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {getText(translations.clickToStartHint, language)}
        </span>
      </div>
    </div>
  );
};

export default CaseCard;
