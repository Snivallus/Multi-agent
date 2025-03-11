import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, MicOff, Timer, CheckSquare, Upload, Brain } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import DialogueBubble from './DialogueBubble';
import { createMultilingualText } from '@/types/language';
import { DialogueRole } from '@/data/medicalCases';
import config from '@/config'; // API base URL
import { useToast } from '@/hooks/use-toast';
import { useSpeechToText } from '@/hooks/use-speech-to-text';

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

  const speechLanguage = language === 'zh' ? 'zh-CN' : 'en-US';
  
  const { 
    isListening,         // 是否正在监听语音
    transcript,          // 语音转换的文本
    toggleListening,     // 开启或关闭语音识别的函数
    isSupported,         // 设备/浏览器是否支持语音识别
    recordingDuration    // 录音的持续时间
  } = useSpeechToText({
    language: speechLanguage,
    continuous: true,
    interimResults: true,
    onResult: (result) => {
      if (result === '__GET_CURRENT_TEXT__') {
        return;
      }
      setInputText((prevText) => prevText ? `${prevText} ${result}` : result);
    },
    onError: (error) => {
      console.error('Speech recognition error:', error);
      
      let errorKey;
      switch (error.type) {
        case 'browserNotSupported':
          errorKey = translations.browserNotSupported;
          break;
        case 'network':
          errorKey = translations.webSpeechAPIError;
          break;
        case 'microphonePermissionDenied':
          errorKey = translations.microphonePermissionDenied;
          break;
        default:
          errorKey = translations.genericError;
      }

      toast({
        title: getText(translations.errorTitle, language),
        description: getText(errorKey, language),
        variant: "destructive"
      });
    }
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins}:` : ''}${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

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

  const languageRef = useRef(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const sendRequest = async (message: string, shouldDisplayMessage: boolean = true) => {
    if (isWaiting) return;

    if (shouldDisplayMessage) {
      const userMessage = {
        role: 'patient' as DialogueRole,
        text: message
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
    }
    
    setInputText('');
    setIsWaiting(true);
    setCountdown(60);

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

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

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

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
    }, 60000);

    try {
      console.log("Sending request to:", `${config.apiBaseUrl}/chat`);
      console.log("Request payload:", { message, language: languageRef.current });
      
      const response = await fetch(`${config.apiBaseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message, 
          language: languageRef.current 
        }),
        signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from server:", data);
      
      const responseText = data.response_text || data;
      
      const aiResponse = {
        role: 'doctor' as DialogueRole,
        text: responseText
      };

      setMessages(prevMessages => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
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

  const handleSendMessage = () => {
    if (inputText.trim() === '' || isWaiting) return;
    sendRequest(inputText);
  };

  const handleEndConsultation = () => {
    sendRequest("<结束>", false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetDialogue = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Memory Reset",
          description: data.message || "Memory reset successfully",
          variant: "default"
        });
        setMessages([]);
      } else {
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

  const handleUploadFile = () => {
    toast({
      title: getText(translations.uploadFile, language),
      description: getText(translations.featureNotImplemented, language),
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col h-screen animate-fade-in">
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
          <div className="flex items-center gap-4">
            <button
              onClick={handleEndConsultation}
              className="p-2 px-4 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-label="End Consultation"
              disabled={isWaiting}
            >
              <CheckSquare className="h-5 w-5" />
              <span>{getText(translations.endConsultation, language)}</span>
            </button>
            <button
              onClick={handleUploadFile}
              className="p-2 px-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-label="Upload File"
              disabled={isWaiting}
            >
              <Upload className="h-5 w-5" />
              <span>{getText(translations.uploadFile, language)}</span>
            </button>
            <button
              onClick={handleResetDialogue}
              className="p-2 px-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-label="Reset Dialogue"
              disabled={isWaiting}
            >
              <Brain className="h-5 w-5" />
              <span>{getText(translations.resetMomery, language)}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto space-y-2 pb-20">
          {messages.length === 0 && (
            <div className="text-center my-20 text-gray-500">
              <p>{getText(translations.conversationHint, language)}</p>
            </div>
          )}

          {messages.map((message, index) => {
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

          {isWaiting && (
            <div className="text-center py-4 text-gray-500">
              <p>{getText(translations.waitingForResponse, language)}
              {countdown !== null && <span>({countdown} s) ...</span>}
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

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
                maxLength={3000}
                style={{ minHeight: '48px', maxHeight: '200px' }}
              />
              <div className="absolute bottom-2 right-5 text-xs text-gray-300">
                {inputText.length}/3000
              </div>
            </div>
            
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
