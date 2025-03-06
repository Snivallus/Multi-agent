
import { cn } from '@/lib/utils';
import { DialogueRole } from '@/data/medicalCases';
import React from 'react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

interface DialogueBubbleProps {
  role: DialogueRole;
  text: string;
  isActive: boolean;
  language: Language;
}

/**
 * Component for displaying individual dialogue messages in the conversation
 * Styles differ based on the speaker role (doctor/patient)
 */
const DialogueBubble: React.FC<DialogueBubbleProps> = ({ role, text, isActive, language }) => {
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
        {/* Avatar for the speaker */}
        <div
          className={cn(
            'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white',
            role === 'doctor' ? 'bg-medical-blue' : 'bg-medical-gray'
          )}
        >
          {role === 'doctor' ? 'D' : 'P'}
        </div>
        <div>
          {/* Speaker label (Doctor/Patient) */}
          <div
            className={cn(
              'text-sm font-medium mb-1',
              role === 'doctor' ? 'text-medical-blue' : 'text-medical-dark-blue'
            )}
          >
            {getText(translations[role], language)}
          </div>
          {/* Dialogue text */}
          <p className="text-gray-800">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default DialogueBubble;
