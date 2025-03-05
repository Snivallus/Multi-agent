
import React, { useState } from 'react';
import { medicalCases, MedicalCase } from '@/data/medicalCases';
import CaseCard from './CaseCard';
import { ArrowLeft } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

interface CaseSelectionProps {
  onSelect: (caseData: MedicalCase) => void;
  onBack: () => void;
  language: Language;
}

/**
 * Component for displaying and selecting from available medical cases
 * Includes search functionality and displays cases in a grid
 */
const CaseSelection: React.FC<CaseSelectionProps> = ({ onSelect, onBack, language }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter cases based on search query matching title, description, category or tags
  const filteredCases = medicalCases.filter(
    (caseItem) =>
      getText(caseItem.title, language).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getText(caseItem.description, language).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getText(caseItem.category, language).toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.tags[language].some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle single click case selection
  const handleCaseClick = (caseData: MedicalCase) => {
    onSelect(caseData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h2 className="text-3xl font-semibold text-gray-800">
          {getText(translations.selectCase, language)}
        </h2>
      </div>

      {/* Search box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={getText(translations.searchCasesPlaceholder, language)}
          className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-medical-blue"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Cases grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            caseData={caseItem}
            onClick={() => handleCaseClick(caseItem)}
            language={language}
          />
        ))}
      </div>

      {/* No results message */}
      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {getText(translations.noCasesFound, language)}
          </p>
        </div>
      )}
    </div>
  );
};

export default CaseSelection;
