
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import DialogueBubble from './DialogueBubble';
import { createMultilingualText } from '@/types/language';
import { DialogueRole } from '@/data/medicalCases';

interface DirectInteractionProps {
  onBack: () => void;
  language: Language;
}

/**
 * Component for direct interaction with the AI system
 * Allows users to send messages and receive responses
 */
const DirectInteraction: React.FC<DirectInteractionProps> = ({ onBack, language }) => {
  const [messages, setMessages] = useState<{role: DialogueRole, text: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    try {
      // Simulate AI response (in a real app, this would make an API call)
      // Here we're just adding a delay to simulate waiting for a response
      setTimeout(() => {
        const aiResponse = {
          role: 'doctor' as DialogueRole,
          text: `This is a placeholder response. In a real application, this would be an actual AI response to: "${inputText}"`
        };
        
        setMessages(prevMessages => [...prevMessages, aiResponse]);
        setIsWaiting(false);
      }, 1000);
      
      // In a real implementation, you would make an API call to your backend here
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ message: inputText }),
      // });
      // const data = await response.json();
      // setMessages(prevMessages => [...prevMessages, { role: 'doctor', text: data.message }]);
      // setIsWaiting(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsWaiting(false);
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
              <h3 className="text-2xl font-medium mb-4">{getText(translations.interactiveMedicalLearning, language)}</h3>
              <p>{getText(translations.conversationHint, language)}</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index}>
              <DialogueBubble
                role={message.role}
                text={createMultilingualText(message.text, message.text)}
                isActive={true}
                language={language}
              />
            </div>
          ))}
          
          {isWaiting && (
            <div className="text-center py-4 text-gray-500">
              <p>{getText(translations.waitingForResponse, language)}</p>
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
                maxLength={1000}
                style={{ minHeight: '48px', maxHeight: '200px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={inputText.trim() === '' || isWaiting}
              className="bg-medical-blue text-white px-4 py-3 rounded-lg hover:bg-medical-dark-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="h-5 w-5" />
              <span className="hidden sm:inline">{getText(translations.sendMessage, language)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectInteraction;
