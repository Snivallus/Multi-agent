import { MedicalCase } from '@/data/medicalCases';
import React from 'react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

const BODY_SYSTEM_COLORS: Record<string, string> = {
  'Skeletal'      : 'bg-purple-100 text-purple-800',
  'Reproductive'  : 'bg-pink-100 text-pink-800',
  'Cardiovascular': 'bg-red-100 text-red-800',
  'Muscular'      : 'bg-yellow-100 text-yellow-800',
  'Lymphatic'     : 'bg-green-100 text-green-800',
  'Nervous'       : 'bg-blue-100 text-blue-800',
  'Other/NA'      : 'bg-gray-200 text-gray-800',
  'Digestive'     : 'bg-orange-100 text-orange-800',
  'Urinary'       : 'bg-teal-100 text-teal-800',
  'Respiratory'   : 'bg-cyan-100 text-cyan-800',
  'Endocrine'     : 'bg-indigo-100 text-indigo-800',
  'Integumentary' : 'bg-lime-100 text-lime-800'
};

const QUESTION_TYPE_COLORS: Record<string, string> = {
  'Reasoning'     : 'bg-blue-100 text-blue-800',
  'Understanding' : 'bg-orange-100 text-orange-800'
};

const MEDICAL_TASK_COLORS: Record<string, string> = {
  'Treatment'    : 'bg-green-100 text-green-800',
  'Basic Science': 'bg-yellow-100 text-yellow-800',
  'Diagnosis'    : 'bg-red-100 text-red-800'
};

interface CaseCardProps {
  caseData: MedicalCase;
  onClick: () => void;
  language: Language;
}

/**
 * Component for displaying individual medical case cards
 * Displays patient_id, body system, title, description, tags, and accuracy
 */
const CaseCard: React.FC<CaseCardProps> = ({ caseData, onClick, language }) => {
  // Body System Tag
  const bodySystemText = getText(caseData.body_system, language);
  
  // Tag Color Mapping
  const bodySystemColor = BODY_SYSTEM_COLORS[getText(caseData.body_system, 'en')] ?? 'bg-gray-100 text-gray-800';
  const questionTypeColor = QUESTION_TYPE_COLORS[caseData.tags['en'][0]] ?? 'bg-gray-100 text-gray-800';
  const medicalTaskColor = MEDICAL_TASK_COLORS[caseData.tags['en'][1]] ?? 'bg-gray-100 text-gray-800';
  
  // Calculate accuracy
  const [correctCount, totalCount] = caseData.accuracy;
  const accuracy = totalCount > 0 ? correctCount / totalCount : 0;
  const accuracyText = `${correctCount}/${totalCount}`;

  let accuracyColor = '';
  if (accuracy > 0.5) {
    accuracyColor = 'bg-green-100 text-green-800';
  } else if (accuracy < 0.25) {
    accuracyColor = 'bg-red-100 text-red-800';
  } else {
    accuracyColor = 'bg-yellow-100 text-yellow-800';
  }

  return (
    <div
      className="case-card group hover-scale animate-fade-in cursor-pointer"
      onClick={onClick}
    >
      {/* Card header with patient_id and body_system badges */}
      <div className="flex justify-between items-center mb-2">
        <span className="badge bg-gray-100 text-gray-800">
          {caseData.patient_id}
        </span>
        <span className={`badge ${bodySystemColor}`}>
          {bodySystemText}
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

      {/* Tags section: question type + medical task + extra tags (if they exist) */}
      <div className="flex flex-wrap gap-2">
        {/* Question type */}
          <span className={`text-xs px-2 py-1 rounded-full ${questionTypeColor}`}>
            {caseData.tags[language][0]}
          </span>
        {/* Medical task */}
          <span className={`text-xs px-2 py-1 rounded-full ${medicalTaskColor}`}>
            {caseData.tags[language][1]}
          </span>
        {/* Extra tags beyond the first two (if they exist)*/}
        {caseData.tags[language].slice(2).map((tag, index) => (
          <span 
            key={index} 
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
        {/* Accuracy */}
          <span className={`text-xs px-2 py-1 rounded-full ${accuracyColor}`}>
            {/* 
              language === 'zh'
              ? `准确率: ${accuracyText}`
              : `Accuracy: ${accuracyText}`
            */}
            {getText(translations.accuracyHead, language) + accuracyText}
          </span>
      </div>
      
      {/* Click to select indicator */}
      <div className="mt-4 text-sm text-gray-500 flex items-center justify-end">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* 
            language === 'zh'
            ? `点击案例开始模拟`
            : `Click on a case to start the simulation`
          */}
          {getText(translations.clickToStartHint, language)}
        </span>
      </div>
    </div>
  );
};

export default CaseCard;
