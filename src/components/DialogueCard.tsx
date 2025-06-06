
import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

interface DialogueCardProps {
  dialogueId: number;
  totalLines: number;
  editTime: string;
  language: Language;
  isActive?: boolean;
  onClick: () => void;
}

const DialogueCard: React.FC<DialogueCardProps> = ({
  dialogueId,
  totalLines,
  editTime,
  language,
  isActive = false,
  onClick
}) => {
  // Parse edit time to display time only
  const timeOnly = editTime.split(' ')[1] || editTime;

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
        isActive 
          ? 'bg-medical-blue text-white border-medical-blue shadow-md' 
          : 'bg-white border-gray-200 hover:border-medical-light-blue'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-800'}`}>
          {getText(translations.session, language)} {dialogueId}
        </h4>
        <MessageSquare className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <span className={`${isActive ? 'text-white/80' : 'text-gray-500'}`}>
          {totalLines} {getText(translations.messages, language)}
        </span>
        <div className={`flex items-center gap-1 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
          <Clock className="h-3 w-3" />
          <span>{timeOnly}</span>
        </div>
      </div>
    </div>
  );
};

export default DialogueCard;
