
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import DialogueCard from './DialogueCard';
import config from '@/config';
import { useToast } from '@/hooks/use-toast';

interface Dialogue {
  dialogue_id: number;
  total_lines: number;
  edit_time: string;
}

interface SessionHistoryPanelProps {
  language: Language;
  isCollapsed: boolean;
  onToggle: () => void;
  currentDialogueId?: number;
  onDialogueSelect: (dialogueId: number) => void;
}

const SessionHistoryPanel: React.FC<SessionHistoryPanelProps> = ({
  language,
  isCollapsed,
  onToggle,
  currentDialogueId,
  onDialogueSelect
}) => {
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Group dialogues by date
  const groupDialoguesByDate = (dialogues: Dialogue[]) => {
    const groups: { [key: string]: Dialogue[] } = {};
    
    dialogues.forEach(dialogue => {
      const date = dialogue.edit_time.split(' ')[0]; // Get YYYY-MM-DD part
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(dialogue);
    });
    
    return groups;
  };

  // Format date for display
  const formatDateForDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if (language === 'zh') {
      return `${year} 年 ${month} 月 ${day} 日`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  // Load dialogue history
  const loadDialogueHistory = async () => {
    setIsLoading(true);
    try {
      // Get user_id from localStorage (assuming it's stored there)
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('User not found');
      }
      
      const user = JSON.parse(userStr);
      const response = await fetch(`${config.apiBaseUrl_1}/interaction/list_all_dialogues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });

      if (!response.ok) {
        throw new Error('Failed to load dialogue history');
      }

      const data = await response.json();
      if (data.success) {
        setDialogues(data.dialogues || []);
      } else {
        throw new Error('Failed to load dialogue history');
      }
    } catch (error) {
      console.error('Error loading dialogue history:', error);
      toast({
        title: getText(translations.errorTitle, language),
        description: getText(translations.networkError, language),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load dialogues on component mount
  useEffect(() => {
    loadDialogueHistory();
  }, []);

  const groupedDialogues = groupDialoguesByDate(dialogues);
  const sortedDates = Object.keys(groupedDialogues).sort((a, b) => b.localeCompare(a)); // Latest first

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Expand session history"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          {getText(translations.sessionHistory, language)}
        </h3>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Collapse session history"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">
              {getText(translations.loading, language)}
            </span>
          </div>
        ) : sortedDates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{getText(translations.noDialogueHistory, language)}</p>
          </div>
        ) : (
          sortedDates.map(date => (
            <div key={date} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600 px-2">
                {formatDateForDisplay(date)}
              </h4>
              <div className="space-y-2">
                {groupedDialogues[date].map(dialogue => (
                  <DialogueCard
                    key={dialogue.dialogue_id}
                    dialogueId={dialogue.dialogue_id}
                    totalLines={dialogue.total_lines}
                    editTime={dialogue.edit_time}
                    language={language}
                    isActive={currentDialogueId === dialogue.dialogue_id}
                    onClick={() => onDialogueSelect(dialogue.dialogue_id)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionHistoryPanel;
