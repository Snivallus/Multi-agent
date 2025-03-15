import { cn } from '@/lib/utils';
import { DialogueRole } from '@/data/medicalCases';
import React, {useRef} from 'react';
import { Language, getText, MultilingualText } from '@/types/language';
import { translations } from '@/data/translations';
import ReactMarkdown from 'react-markdown';
import { Clipboard } from 'lucide-react';

interface DialogueBubbleProps {
  role: DialogueRole;
  text: MultilingualText;
  isActive: boolean;
  language: Language;
}

/**
 * Component for displaying individual dialogue messages in the conversation
 * Styles differ based on the speaker role (doctor/patient/reporter)
 */
  const DialogueBubble: React.FC<DialogueBubbleProps> = ({ role, text, isActive, language }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(getText(text, language));
  };

  const bubbleRef = useRef<HTMLDivElement>(null);
  const handleClick = () => {
    if (bubbleRef.current) {
      bubbleRef.current.focus();
    }
  };

  return (
    <div
      className={cn(
        'max-w-2xl mx-auto my-4 transition-all duration-500 ease-in-out',
        isActive ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8',
        role === 'doctor' ? 'ml-auto ml-4' : role === 'patient' ? 'mr-auto mr-4' : 'mx-auto',
        role === 'doctor' ? 'doctor-bubble' : role === 'patient' ? 'patient-bubble' : 'reporter-bubble',
        'w-fit max-w-[80%]'
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        {/* Avatar for the speaker */}
        <div
          className={cn(
            'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white',
            role === 'doctor' ? 'bg-medical-blue' : role === 'patient' ? 'bg-medical-gray' : 'bg-medical-green'
          )}
        >
          {role === 'doctor' ? 'D' : role === 'patient' ? 'P' : 'R'}
        </div>
        <div className="flex">
          {/* Speaker label (Doctor/Patient/Reporter) */}
          <div
            className={cn(
              'text-m font-medium relative right-1.5',
              role === 'doctor' ? 'text-medical-blue' : role === 'patient' ? 'text-medical-dark-blue' : 'text-medical-green'
            )}
          >
            {getText(translations[role], language)}
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-1">
        {/* Dialogue text */}
        <div
          ref={bubbleRef} 
          className="text-gray-800 max-w-xs text-left border border-gray-300 p-2 rounded-lg"
          contentEditable
          suppressContentEditableWarning
        >
          <ReactMarkdown>
            {getText(text, language)}
          </ReactMarkdown>
        </div>
        {/* Copy button */}
        {getText(text, language).length > 10 && (
          <button
            onClick={handleCopy}
            className={cn(
              'mt-2 mr-2 text-gray-200 hover:text-gray-500 flex items-center',
              getText(text, language).length <= 10 ? 'relative' : 'absolute bottom-2 right-0'
            )}
            aria-label="Copy text"
          >
            <Clipboard className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DialogueBubble;
