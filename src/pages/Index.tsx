import React, { useState } from 'react';
import CaseSelection from '@/components/CaseSelection';
import DirectInteraction from '@/components/DirectInteraction';
import { ArrowRight } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

enum Step {
  LANDING,
  CASE_SELECTION,
  DIRECT_INTERACTION,
}

/**
 * Main application component that manages app state and language selection
 * Controls navigation between landing page, case selection, and dialogue simulation
 */
const Index: React.FC = () => {
  // 当前是哪个“步骤”：落地页、案例选择页，还是直接交互页
  const [step, setStep] = useState<Step>(Step.LANDING);
  // 统一维护语言状态
  const [language, setLanguage] = useState<Language>('zh');

  // Toggle between Chinese and English
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  // Landing 页面里的两个按钮: 开始选择案例／直接交互
  const LandingPage: React.FC = () => (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-20 text-center animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-5xl md:text-6xl font-bold mb-6 
                     bg-clip-text text-transparent bg-gradient-to-r 
                     from-medical-blue to-medical-dark-blue animate-fade-in"
          style={{ animationDelay: '100ms', lineHeight: '1.25' }}
        >
          {/* language == 'zh' ? 'AI 医院' : 'AI Hospital' */}
          {getText(translations.appTitle, language)}
        </h1>
        <p
          className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          {/* 
            language == 'zh'
            ? '多模态医学诊断大模型'
            : 'Multi-modality Large Model for Medical Diagnosis'
          */}
          {getText(translations.appDescription, language)}
        </p>
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* 点击“选择案例”，切换到 CASE_SELECTION 步骤 */}
            <button
              onClick={() => setStep(Step.CASE_SELECTION)}
              className="btn-primary group inline-flex items-center"
            >
              {/* language == 'zh' ? '选择案例' : 'Select a Case Study' */}
              {getText(translations.selectCaseButton, language)}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setStep(Step.DIRECT_INTERACTION)}
              className="btn-primary group inline-flex items-center"
            >
              {/* language == 'zh' ? '直接交互' : 'Direct Interaction' */}
              {getText(translations.directInteractionButton, language)}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // 如果处于 CASE_SELECTION，渲染 CaseSelection
  if (step === Step.CASE_SELECTION) {
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
          onBack={() => setStep(Step.LANDING)}
          language={language}
        />
      </>
    );
  }

  // 如果是“直接交互”步骤
  if (step === Step.DIRECT_INTERACTION) {
    return (
      <>
        {/* 右上角语言切换按钮 */}
        <div className="absolute top-20 right-4 z-10">
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-white shadow-md rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium text-medical-blue border border-medical-light-blue"
          >
            {getText(translations.toggleLanguage, language)}
          </button>
        </div>
        
        <DirectInteraction
          onBack={() => setStep(Step.LANDING)}
          language={language}
        />
      </>
    );
  }

  // 默认渲染 Landing 页面，并显示右上角的语言切换按钮
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
      <LandingPage />
    </>
  );
};

export default Index;
