
import { cn } from '@/lib/utils';
import { DialogueRole } from '@/data/medicalCases';
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

interface DialogueBubbleProps {
  role: DialogueRole;
  text: string;
  isActive: boolean;
}

const DialogueBubble: React.FC<DialogueBubbleProps> = ({ role, text, isActive }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <div
      className={cn(
        'max-w-3xl mx-auto my-4 transition-all duration-500 ease-in-out',
        isActive ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8',
        role === 'doctor' ? 'ml-auto mr-4' : 'mr-auto ml-4',
        role === 'doctor' ? 'doctor-bubble' : 'patient-bubble',
        'w-fit max-w-[80%]'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white',
            role === 'doctor' ? 'bg-medical-blue' : 'bg-medical-gray'
          )}
        >
          {role === 'doctor' ? 'D' : 'P'}
        </div>
        <div>
          <div
            className={cn(
              'text-sm font-medium mb-1',
              role === 'doctor' ? 'text-medical-blue' : 'text-medical-dark-blue'
            )}
          >
            {role === 'doctor' ? (language === 'en' ? 'Doctor' : '医生') : (language === 'en' ? 'Patient' : '患者')}
          </div>
          <p className="text-gray-800">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default DialogueBubble;
