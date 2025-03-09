
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, MicOff, Timer, AlertTriangle } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import DialogueBubble from './DialogueBubble';
import { createMultilingualText } from '@/types/language';
import { DialogueRole } from '@/data/medicalCases';
import config from '@/config'; // API base URL
import { useToast } from '@/hooks/use-toast';
import { useSpeechToText, SpeechRecognitionErrorType, SpeechRecognitionError } from '@/hooks/use-speech-to-text';

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
  const [speechError, setSpeechError] = useState<SpeechRecognitionError | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  // Set speech recognition language based on app language
  const speechLanguage = language === 'zh' ? 'zh-CN' : 'en-US';
  
  // Map error types to user-friendly messages
  const getErrorMessage = (error: SpeechRecognitionError): string => {
    // Default messages in English
    const defaultMessages = {
      [SpeechRecognitionErrorType.NOT_SUPPORTED]: 'Your browser does not support speech recognition.',
      [SpeechRecognitionErrorType.NO_SPEECH]: 'No speech was detected. Please try again.',
      [SpeechRecognitionErrorType.AUDIO_CAPTURE]: 'Could not capture audio. Please check your microphone.',
      [SpeechRecognitionErrorType.NETWORK]: 'Network error occurred. Please check your connection.',
      [SpeechRecognitionErrorType.ABORTED]: 'Speech recognition was aborted.',
      [SpeechRecognitionErrorType.NOT_ALLOWED]: 'Microphone access denied. Please allow microphone permissions.',
      [SpeechRecognitionErrorType.SERVICE_NOT_ALLOWED]: 'Speech recognition service quota exceeded.',
      [SpeechRecognitionErrorType.BAD_GRAMMAR]: 'Bad grammar configuration.',
      [SpeechRecognitionErrorType.LANGUAGE_NOT_SUPPORTED]: 'The selected language is not supported.',
      [SpeechRecognitionErrorType.UNKNOWN]: 'An unknown error occurred with speech recognition.'
    };
    
    // Get message from translations if available, otherwise use default
    const translationKey = `speech${error.type.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')}Error`;
    return getText(translations[translationKey] || { en: error.message, zh: error.message }, language) || 
           defaultMessages[error.type] || 
           error.message;
  };
  
  // Initialize speech to text
  const { 
    isListening,
    transcript,
    toggleListening,
    isSupported,
    recordingDuration
  } = useSpeechToText({
    language: speechLanguage,
    continuous: true,
    interimResults: false,
    onResult: (result) => {
      console.log('Speech recognition result received:', result);
      // 追加文本到输入框
      setInputText((prevText) => prevText ? `${prevText} ${result}` : result);
    },
    onError: (error) => {
      console.error('Speech recognition error details:', error);
      setSpeechError(error);
      
      // Show toast with appropriate error message
      toast({
        title: getText(translations.errorTitle, language),
        description: getErrorMessage(error),
        variant: "destructive"
      });
    }
  });

  // Reset speech error when starting listening
  useEffect(() => {
    if (isListening) {
      setSpeechError(null);
    }
  }, [isListening]);

  // Format recording duration as minutes:seconds
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins}:` : ''}${secs.toString().padStart(2, '0')}`;
  };

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
    setCountdown(40); // Set countdown to 40 seconds

    // Clear any existing countdown interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Start countdown interval to update the countdown every second
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown === null || prevCountdown <= 1) {
          clearInterval(countdownIntervalRef.current!);
          countdownIntervalRef.current = null;
          return null;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    // Create abort controller for the fetch request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Set up timeout for the request
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setIsWaiting(false);
        setCountdown(null);
        toast({
          title: getText(translations.errorTitle, language),
          description: '请求超时',
          variant: 'destructive'
        });
      }
    }, 40000); // 40s timeout

    try {
      console.log("Sending request to:", `${config.apiBaseUrl}/chat`);
      console.log("Request payload:", { message: inputText, language: languageRef.current });
      
      const response = await fetch(`${config.apiBaseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputText, 
          language: languageRef.current 
        }),
        signal
      });

      clearTimeout(timeoutId); // Clear timeout if request completes

      // Clear the countdown interval
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }

      if (!response.ok) {
        console.error('API error response:', {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error(`API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Response from server:", data);
      
      // Extract response_text from the response if it exists
      const responseText = data.response_text || data;
      
      // Add AI response to the conversation
      const aiResponse = {
        role: 'doctor' as DialogueRole,
        text: responseText
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

  // Reset the dialogue memory
  const handleResetDialogue = async () => {
    try {
      console.log("Resetting dialogue memory at:", `${config.apiBaseUrl}/reset`);
      const response = await fetch(`${config.apiBaseUrl}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
  
      console.log("Reset response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Reset response data:", data);
        
        toast({
          title: "Memory Reset",
          description: data.message || "Memory reset successfully",
          variant: "default"
        });
        // Clear the conversation messages after resetting memory
        setMessages([]);
      } else {
        console.error("Reset response error:", {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error('Failed to reset memory');
      }
    } catch (error) {
      console.error('Error resetting dialogue:', error);
      toast({
        title: getText(translations.errorTitle, language),
        description: getText(translations.apiError, language),
        variant: "destructive"
      });
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
          {/* Reset dialogue button */}
          <button
            onClick={handleResetDialogue}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200 disabled:opacity-0 disabled:cursor-not-allowed"
            aria-label="Reset Dialogue"
          >
          {getText(translations.resetMomery, language)}
          </button>
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
          {/* Display speech recognition error information if there is an error */}
          {speechError && (
            <div className="mb-3 p-2 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-red-600 text-sm">
                {getErrorMessage(speechError)}
              </span>
            </div>
          )}
          
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
            
            {/* Speech to text button */}
            <button
              onClick={toggleListening}
              disabled={isWaiting || !isSupported}
              className={`px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                isListening 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={isListening 
                ? getText(translations.stopRecording, language)
                : getText(translations.startRecording, language)
              }
            >
              {isListening ? (
                <>
                  <MicOff className="h-5 w-5" />
                  <span className="hidden sm:inline">
                    {getText(translations.stopRecording, language)}
                  </span>
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  <span className="hidden sm:inline">
                    {getText(translations.startRecording, language)}
                  </span>
                </>
              )}
            </button>
            
            {/* Send button */}
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
          
          {/* Display recording information and duration */}
          {isListening && (
            <div className="mt-3 text-sm p-2 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
              <Timer className="h-4 w-4 text-red-500" />
              <span className="text-red-600">
                {getText(translations.recordingInProgress, language)} 
                <span className="font-medium ml-2">
                  {formatDuration(recordingDuration)} {getText(translations.seconds, language)}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectInteraction;
