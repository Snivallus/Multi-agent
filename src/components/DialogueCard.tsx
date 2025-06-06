
import React from 'react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

interface DialogueCardProps {
  dialogue: {
    dialogue_id: number;
    dialogue_name: string;
    total_lines: number;
    edit_time: string;
  };
  language: Language;
  onSelect: (dialogueId: number) => void;
  isSelected?: boolean;
}

const DialogueCard: React.FC<DialogueCardProps> = ({ 
  dialogue, 
  language, 
  onSelect, 
  isSelected = false 
}) => {
  const handleClick = () => {
    onSelect(dialogue.dialogue_id);
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return getText(translations.today, language);
    } else if (diffDays === 2) {
      return getText(translations.yesterday, language);
    } else if (diffDays <= 7) {
      return `${diffDays - 1} ${getText(translations.daysAgo, language)}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected 
          ? 'bg-medical-blue text-white border-medical-blue' 
          : 'bg-white border-gray-200 hover:border-medical-blue/30'
        }
      `}
    >
      <div className="flex flex-col gap-2">
        <h4 className={`font-medium text-sm truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
          {dialogue.dialogue_name}
        </h4>
        
        <div className="flex justify-between items-center text-xs">
          <span className={isSelected ? 'text-white/80' : 'text-gray-500'}>
            {dialogue.total_lines} {getText(translations.lines, language)}
          </span>
          <span className={isSelected ? 'text-white/80' : 'text-gray-400'}>
            {formatTime(dialogue.edit_time)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DialogueCard;
