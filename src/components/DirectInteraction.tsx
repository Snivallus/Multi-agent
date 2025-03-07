import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import DialogueBubble from './DialogueBubble';
import { createMultilingualText } from '@/types/language';
import { DialogueRole } from '@/data/medicalCases';
import config from '@/config';
import { useToast } from '@/hooks/use-toast';

interface DirectInteractionProps {
  onBack: () => void;
  language: Language;
}

/**
 * Component for direct interaction with the AI system
 * Allows users to send messages and receive responses
 */
const DirectInteraction: React.FC<DirectInteractionProps> = ({ onBack, language }) => {
  const [messages, setMessages] = useState<{ role: DialogueRole, text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null); // countdown when waiting for response
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-resize textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  // Cleanup intervals and controllers on component unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Monitor language value
  const languageRef = useRef(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const handleSendMessage = async () => {
    if (inputText.trim() === '' || isWaiting) return;

    // Add user message to the conversation
    const userMessage = {
      role: 'patient' as DialogueRole,
      text: inputText
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsWaiting(true);
    setCountdown(3); // Set countdown to 3 seconds

    // Start countdown interval to update the countdown every second
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown === null) return null;
        if (prevCountdown <= 1) {
          // When countdown reaches 1, clear the interval
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return null;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    // Create abort controller for the fetch request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      console.log("Sending message to API:", config.apiBaseUrl + "/chat");
      const response = await fetch(`${config.apiBaseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
          language: languageRef.current
        }),
        signal
      });

      // Clear the countdown interval
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.text();
      
      // Add AI response to the conversation
      const aiResponse = {
        role: 'doctor' as DialogueRole,
        text: data
      };

      setMessages(prevMessages => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Only show error toast if the request wasn't aborted by the user
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        toast({
          title: getText(translations.errorTitle, language),
          description: getText(translations.networkError, language),
          variant: "destructive"
        });
      }
    } finally {
      setIsWaiting(false);
      setCountdown(null);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen animate-fade-in">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {getText(translations.directInteractionTitle, language)}
            </h2>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto space-y-2 pb-20">
          {messages.length === 0 && (
            <div className="text-center my-20 text-gray-500">
              <p>{getText(translations.conversationHint, language)}</p>
            </div>
          )}

          {messages.map((message, index) => {
            // 根据文本长度来决定 bubble 显示的文本是什么
            const bubbleText = message.text.length > 0 
              ? createMultilingualText(message.text, message.text)
              : translations.doctorPlaceHolder;
            return (
              <div key={index}>
                <DialogueBubble
                  role={message.role}
                  text={bubbleText}
                  isActive={true}
                  language={language}
                />
              </div>
            );
          })}

          {/* Show waiting message if waiting for response */}
          {isWaiting && (
            <div className="text-center py-4 text-gray-500">
              <p>{getText(translations.waitingForResponse, language)}
              {countdown !== null && <span>({countdown} s) ...</span>}
              </p>
            </div>
          )}

          {/* This empty div helps us scroll to the bottom */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="bg-white border-t p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-grow relative">
              <textarea
                ref={textareaRef}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-medical-light-blue resize-none"
                placeholder={getText(translations.typeMessage, language)}
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={3000} // Character limit
                style={{ minHeight: '48px', maxHeight: '200px' }}
              />
              <div className="absolute bottom-2 right-5 text-xs text-gray-300">
                {inputText.length}/3000 {/* Character counter */}
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={inputText.trim() === '' || isWaiting}
              className="bg-medical-blue text-white px-4 py-3 rounded-lg hover:bg-medical-dark-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="h-5 w-5" />
              <span className="hidden sm:inline">
                {getText(translations.sendMessage, language)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectInteraction;
