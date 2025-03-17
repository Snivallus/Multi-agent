import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, MicOff, Timer, CheckSquare, Upload, Cpu } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import DialogueBubble from './DialogueBubble';
import { createMultilingualText } from '@/types/language';
import { DialogueRole } from '@/data/medicalCases';
import config from '@/config'; // API base URL
import { useToast } from '@/hooks/use-toast';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { useDebounce } from 'use-debounce'; // Debounce input text
import { v4 as uuidv4 } from 'uuid';  // Generate unique IDs

interface DirectInteractionProps {
  onBack: () => void;
  language: Language;
  isStreaming?: boolean;
}

interface MessageType {
  role: DialogueRole;
  text: string;
  id?: string;         // 唯一标识
  isStreaming?: boolean; // 流式状态
}

/**
 * Component for direct interaction with the AI system
 * Allows users to send messages and receive responses
 */
const DirectInteraction: React.FC<DirectInteractionProps> = ({ onBack, language }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null); // countdown when waiting for response
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();
  const [streamBuffer, setStreamBuffer] = useState('');
  const [debouncedBuffer] = useDebounce(streamBuffer, 50); // Debounce stream buffer

  // Set speech recognition language based on app language
  const speechLanguage = language === 'zh' ? 'zh-CN' : 'en-US';
  
  // Initialize speech to text
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
      // Check if this is a request to get the current text
      if (result === '__GET_CURRENT_TEXT__') {
        return;
      }
      // 追加文本到输入框
      setInputText((prevText) => prevText ? `${prevText} ${result}` : result);
    },
    onError: (error) => {
      console.error('Speech recognition error:', error);
      
      // 根据错误类型选择翻译键
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

  // 滚动优化（使用 ref 存储消息ID）
  const currentMessageId = useRef<string>();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [messages]);

  // Function to send request to the backend
  const sendRequest = async (message: string, shouldDisplayMessage: boolean = true) => {
    if (isWaiting) return;

    // Add user message to the conversation if it should be displayed
    if (shouldDisplayMessage) {
      const userMessage = {
        role: 'patient' as DialogueRole,
        text: message
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
    }
    
    setInputText('');
    setIsWaiting(true);
    setCountdown(60); // Set countdown to 60 seconds

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
    }, 60000); // 60s timeout

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

      clearTimeout(timeoutId); // Clear timeout if request completes

      // Clear the countdown interval
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }

      // if (!response.ok) {
      //   throw new Error(`API error: ${response.status}`);
      // }

      // const data = await response.json();
      // console.log("Response from server:", data);
      
      // // Extract response_text from the response if it exists
      // const responseText = data.response_text || data;
      
      // // Add AI response to the conversation
      // const aiResponse = {
      //   role: 'doctor' as DialogueRole,
      //   text: responseText
      // };

      // 处理非流式响应
      if (!response.body) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      // 流式处理逻辑
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const currentMessageId = uuidv4(); // 可靠的唯一ID

      // 初始化流式消息
      setMessages(prevMessages => [
        ...prevMessages, 
        {
          role: 'doctor' as DialogueRole,
          text: '',
          isStreaming: true,
          id: currentMessageId
        }
      ]);

      let retries = 0; // 重试次数
      while (true) {
        try {
          const { done, value } = await reader!.read();
          if (done) break;

          const chunk = decoder.decode(value);
          setStreamBuffer(prev => prev + chunk); // 使用缓冲池

          // 更新流式消息
          setMessages(prevMessages => prevMessages.map(message => {
            if (message.id === currentMessageId) {
              // 添加滚动触发逻辑
              requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
              })
              return { ...message, text: chunk }
            }
            return message
          }));
        } catch (error) {
          if (retries < 3) {
            retries++;
            console.log(`Retrying request (${retries})...`);
            await new Promise(res => setTimeout(res, 1000 * retries));
            continue;
          }
        }
      }

      // 标记流式消息结束
      setMessages(prevMessages => prevMessages.map(message => 
        message.id === currentMessageId
          ? { ...message, isStreaming: false }
          : message
      ));

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

  const handleSendMessage = () => {
    if (inputText.trim() === '' || isWaiting) return;
    sendRequest(inputText);
  };

  const handleEndConsultation = () => {
    // Send special message "<结束>" to backend without displaying it in the UI
    sendRequest("<结束>", false);
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
        // Clear the conversation messages after resetting memory
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

  // Add handler for the new "Upload File" button
  const handleUploadFile = () => {
    toast({
      title: getText(translations.uploadFile, language),
      description: getText(translations.featureNotImplemented, language),
      duration: 3000,
    });
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
          <div className="flex items-center gap-4">
            {/* End Consultation button */}
            <button
              onClick={handleEndConsultation}
              className="p-2 px-4 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-label="End Consultation"
              disabled={isWaiting}
            >
              <CheckSquare className="h-5 w-5" />
              <span>{getText(translations.endConsultation, language)}</span>
            </button>
            {/* Upload File button */}
            <button
              onClick={handleUploadFile}
              className="p-2 px-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-label="Upload File"
              disabled={isWaiting}
            >
              <Upload className="h-5 w-5" />
              <span>{getText(translations.uploadFile, language)}</span>
            </button>
            {/* Reset dialogue button */}
            <button
              onClick={handleResetDialogue}
              className="p-2 px-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-label="Reset Dialogue"
              disabled={isWaiting}
            >
              <Cpu className="h-5 w-5" />
              <span>{getText(translations.resetMomery, language)}</span>
            </button>
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

          {/* {messages.map((message, index) => {
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
          })} */}

          {messages.map((message, index) => {
            // 添加加载状态指示器
            const showLoading = message.isStreaming && !message.text;
            
            return (
              <div key={message.id || index}>
                {showLoading && (
                  <div className="text-gray-400 pl-4">接收中...</div>
                )}
                
                <DialogueBubble
                  role={message.role}
                  text={createMultilingualText(message.text, message.text)}
                  isActive={true}
                  language={language}
                  isStreaming={message.isStreaming}
                />
                
                {message.isStreaming && (
                  <div className="text-right pr-4 text-xs text-gray-400">
                    正在输入...
                  </div>
                )}
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