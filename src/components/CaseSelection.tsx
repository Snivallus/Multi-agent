
import React, { useState } from 'react';
import { medicalCases, MedicalCase } from '@/data/medicalCases';
import CaseCard from './CaseCard';
import { ArrowLeft } from 'lucide-react';

interface CaseSelectionProps {
  onSelect: (caseData: MedicalCase) => void;
  onBack: () => void;
}

const CaseSelection: React.FC<CaseSelectionProps> = ({ onSelect, onBack }) => {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = medicalCases.filter(
    (caseItem) =>
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCaseClick = (caseId: string) => {
    setSelectedCase(caseId);
  };

  const handleCaseDoubleClick = (caseData: MedicalCase) => {
    onSelect(caseData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h2 className="text-3xl font-semibold text-gray-800">Select a Case Study</h2>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search cases by title, description, category, or tags..."
          className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-medical-blue"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            caseData={caseItem}
            onClick={() => handleCaseClick(caseItem.id)}
            onDoubleClick={() => handleCaseDoubleClick(caseItem)}
          />
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No cases found matching your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default CaseSelection;
