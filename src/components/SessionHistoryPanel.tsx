
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import DialogueCard from './DialogueCard';
import config from '@/config';

interface Dialogue {
  dialogue_id: number;
  dialogue_name: string;
  total_lines: number;
  edit_time: string;
}

interface SessionHistoryPanelProps {
  language: Language;
  isOpen: boolean;
  onToggle: () => void;
  onNewSession: () => void;
  onSelectSession: (dialogueId: number) => void;
  currentSessionId?: number;
  userId: number;
}

const SessionHistoryPanel: React.FC<SessionHistoryPanelProps> = ({
  language,
  isOpen,
  onToggle,
  onNewSession,
  onSelectSession,
  currentSessionId,
  userId
}) => {
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDialogues = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl_1}/interaction/list_all_dialogues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDialogues(data.dialogues);
        }
      }
    } catch (error) {
      console.error('Error fetching dialogues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchDialogues();
    }
  }, [isOpen, userId]);

  // Refresh dialogues when needed
  const refreshDialogues = () => {
    if (userId) {
      fetchDialogues();
    }
  };

  // Expose refresh function to parent
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    refreshDialogues
  }));

  return (
    <div className={`
      fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-lg
      transition-all duration-300 ease-in-out z-30
      ${isOpen ? 'w-80' : 'w-12'}
    `}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-4 w-6 h-6 bg-white border border-gray-300 rounded-full
          flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {/* Panel Content */}
      {isOpen && (
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex flex-col gap-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {getText(translations.sessionHistory, language)}
            </h3>
            
            {/* New Session Button */}
            <button
              onClick={onNewSession}
              className="flex items-center gap-2 px-3 py-2 bg-medical-blue text-white rounded-lg
                hover:bg-medical-dark-blue transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              {getText(translations.newSession, language)}
            </button>
          </div>

          {/* Dialogues List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                {getText(translations.loadingHistory, language)}
              </div>
            ) : dialogues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {getText(translations.noSessionsFound, language)}
              </div>
            ) : (
              dialogues.map((dialogue) => (
                <DialogueCard
                  key={dialogue.dialogue_id}
                  dialogue={dialogue}
                  language={language}
                  onSelect={onSelectSession}
                  isSelected={currentSessionId === dialogue.dialogue_id}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionHistoryPanel;
