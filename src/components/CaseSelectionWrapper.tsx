import React from 'react';
import { useNavigate, useLocation, Location } from 'react-router-dom';
import CaseSelection from '@/components/CaseSelection';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

interface LocationState {
  language?: Language;
}

interface CaseSelectionWrapperProps {
  language: Language;
  toggleLanguage: () => void;
}

const CaseSelectionWrapper: React.FC<CaseSelectionWrapperProps> = ({
  language,
  toggleLanguage,
}) => {
  const navigate = useNavigate();
  const location = useLocation() as Location & { state: LocationState };

  // onBack 直接回到 Index (因为 "选择案例" 是从 Index 进来的)
  const handleBack = () => {
    navigate(-1);
  };

  // 如果 location.state 中没有 language, 就用传进来的 language
  const langToUse = location.state?.language ?? language;

  return (
    <>
      {/* 右上角语言切换按钮 */}
      <div className="sticky top-20 right-4 z-10 flex justify-end">
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-white shadow-md rounded-full 
                    hover:bg-gray-50 transition-colors duration-200 
                    font-medium text-medical-blue border border-medical-light-blue
                    mr-4"
        >
          {getText(translations.toggleLanguage, language)}
        </button>
      </div>

      <CaseSelection
        onBack={handleBack}
        language={langToUse}
      />
    </>
  );
};

export default CaseSelectionWrapper;
