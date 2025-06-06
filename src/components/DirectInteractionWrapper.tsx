import React from 'react';
import { useNavigate, useLocation, Location } from 'react-router-dom';
import DirectInteraction from '@/components/DirectInteraction';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

interface LocationState {
  language?: Language;
}

interface DirectInteractionWrapperProps {
  language: Language;
  toggleLanguage: () => void;
}

const DirectInteractionWrapper: React.FC<DirectInteractionWrapperProps> = ({
  language,
  toggleLanguage,
}) => {
  const navigate = useNavigate();
  const location = useLocation() as Location & { state: LocationState };

  // onBack 直接回到 Index (因为 "直接交互" 是从 Index 进来的)
  const handleBack = () => {
    navigate(-1);
  };

  // 如果 location.state 中没有 language, 就用传进来的 language
  const langToUse = location.state?.language ?? language;

  return (
    <>
      {/* 右上角语言切换按钮 */}
      <div className="absolute top-20 right-4 z-10">
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-white shadow-md rounded-full 
                    hover:bg-gray-50 transition-colors duration-200 
                    font-medium text-medical-blue border border-medical-light-blue"
        >
          {getText(translations.toggleLanguage, language)}
        </button>
      </div>

      <DirectInteraction
        onBack={handleBack}
        language={langToUse}
      />
    </>
  );
};

export default DirectInteractionWrapper;