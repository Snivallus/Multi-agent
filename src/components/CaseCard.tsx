
import { MedicalCase } from '@/data/medicalCases';
import { cn } from '@/lib/utils';
import React from 'react';

interface CaseCardProps {
  caseData: MedicalCase;
  onClick: () => void;
}

const CaseCard: React.FC<CaseCardProps> = ({ caseData, onClick }) => {
  // Map difficulty to appropriate badge color
  const difficultyColor = {
    easy: 'badge-green',
    medium: 'badge-blue',
    hard: 'badge-red',
  }[caseData.difficulty];

  return (
    <div
      className="case-card group hover-scale animate-fade-in"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={cn('badge', difficultyColor)}>
          {caseData.difficulty.charAt(0).toUpperCase() + caseData.difficulty.slice(1)}
        </span>
        <span className="badge bg-gray-100 text-gray-800">{caseData.category}</span>
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-medical-dark-blue group-hover:text-medical-blue transition-colors duration-300">
        {caseData.title}
      </h3>
      
      <p className="text-gray-600 mb-4 text-sm">{caseData.description}</p>
      
      <div className="flex flex-wrap gap-2">
        {caseData.tags.map((tag, index) => (
          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-500 flex items-center justify-end">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Click to view case
        </span>
      </div>
    </div>
  );
};

export default CaseCard;
