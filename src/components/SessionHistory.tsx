
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MessageSquare } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import config from '@/config';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Dialogue {
  dialogue_id: number;
  dialogue_name: string;
  total_lines: number;
  edit_time: string;
}

interface SessionHistoryProps {
  language: Language;
  userId?: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectDialogue: (dialogueId: number) => void;
  selectedDialogueId?: number;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({
  language,
  userId,
  isCollapsed,
  onToggleCollapse,
  onSelectDialogue,
  selectedDialogueId
}) => {
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchDialogues = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl_2}/interaction/list_all_dialogues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDialogues(data.dialogues || []);
        }
      }
    } catch (error) {
      console.error('Error fetching dialogues:', error);
      toast({
        title: getText(translations.errorTitle, language),
        description: getText(translations.networkError, language),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDialogues();
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
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
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          {getText(translations.sessionHistory, language)}
        </h3>
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Collapse session history"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin h-6 w-6 border-2 border-medical-blue border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-sm">Loading sessions...</p>
              </div>
            ) : dialogues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No sessions yet</p>
              </div>
            ) : (
              dialogues.map((dialogue) => (
                <div
                  key={dialogue.dialogue_id}
                  onClick={() => onSelectDialogue(dialogue.dialogue_id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                    selectedDialogueId === dialogue.dialogue_id
                      ? 'border-medical-blue bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800 text-sm line-clamp-2">
                      {dialogue.dialogue_name}
                    </h4>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{dialogue.total_lines} messages</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(dialogue.edit_time)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SessionHistory;
