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
import { v4 as uuidv4 } from 'uuid';  // Generate unique IDs
import ReactMarkdown from 'react-markdown';

interface DirectInteractionProps {
  onBack: () => void;
  language: Language;
  isStreaming?: boolean;
}

interface MessageType {
  role: DialogueRole;
  content?: string;
  reasoning_content?: string;
  id?: string;         // 唯一标识
  isStreaming?: boolean; // 流式状态
  rawText?: string  // 原始文本，用于存储流式传输的中间状态
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

  // Function to try parsing JSON from text
  const tryParseJSON = (text: string) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  };

  // Function to process and update streaming content
  const processStreamingContent = (rawText: string, messageId: string) => {
    setMessages(prevMessages => prevMessages.map(message => {
      if (message.id === messageId) {
        // Try to parse JSON data
        const parsedData = tryParseJSON(rawText);
        let newReasoning = message.reasoning_content || ''
        let newContent = message.content || '';

        // 处理 reasoning_content 累加
        if (parsedData?.reasoning_content) {
          newReasoning += parsedData.reasoning_content;
        }

        // 处理 content 直接替换（只在有更新时替换）
        if (parsedData?.content !== undefined) {
          newContent = parsedData.content;
        }       
          // JSON format with reasoning_content and content
          return {
            ...message,
            reasoning_content: newReasoning,
            content: newContent,
            rawText: rawText
          };
      }  
      return message;
    }));
  };

  // // 滚动优化（使用 ref 存储消息ID）
  // const currentMessageId = useRef<string>();

  // useEffect(() => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ 
  //       behavior: "smooth",
  //       block: "nearest"
  //     });
  //   }
  // }, [messages]);

  // Function to send request to the backend
  const sendRequest = async (message: string, shouldDisplayMessage: boolean = true) => {
    if (isWaiting) return;

    // Add user message to the conversation if it should be displayed
    if (shouldDisplayMessage) {
      const userMessage: MessageType = {
        role: 'patient',
        content: message,  // 使用 content 字段
        id: uuidv4()       // 添加唯一ID
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
          content: '',
          reasoning_content: '',
          isStreaming: true,
          id: currentMessageId,
          rawText: ''
        }
      ]);

      let retries = 0; // 重试次数
      let lastUpdateTime = Date.now();
      while (true) {
        try {
          const { done, value } = await reader!.read();
          if (done) break;

          // 更新流式消息
          const chunk = decoder.decode(value);
          processStreamingContent(chunk, currentMessageId);

          // 添加滚动触发逻辑
          requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
          });
        } catch (error) {
          if (retries < 3) {
            retries++;
            console.log(`Retrying request (${retries})...`);
            await new Promise(res => setTimeout(res, 1000 * retries));
            continue;
          }
          break;
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

  // Render a message (user or AI response)
  const renderMessage = (message: MessageType) => {
    if (message.role === 'patient') {
      // User message
      return (
        <DialogueBubble
        role={message.role}
        text={createMultilingualText(message.content, message.content)}
        isActive={true}
        language={language}
        isStreaming={message.isStreaming}
        />
      );
    } else {
      // Doctor message with reasoning and content
      return (
        <div className="mb-8">
          {/* Doctor Avatar and Name */}
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 rounded-full bg-medical-blue text-white flex items-center justify-center mr-2">
              D
            </div>
            <div className="text-medical-blue font-medium">
              {getText(translations.doctor, language)}
            </div>
            {message.isStreaming && (
              <div className="flex space-x-1 ml-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" />
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-150" />
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-300" />
              </div>
            )}
          </div>

          {/* Reasoning Content (displayed as blockquote) */}
          {message.reasoning_content && (
            <div className="bg-gray-100 border-l-4 border-gray-300 rounded pl-4 pr-2 py-2 mb-4 overflow-auto">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>
                  {message.reasoning_content}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Main Content */}
          {message.content && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Only show raw text if we don't have parsed content yet */}
          {!message.reasoning_content && !message.content && message.rawText && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-gray-600">{message.rawText}</p>
            </div>
          )}
        </div>
      );
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

          {/* Render messages */}
          {messages.map((message, index) => (
             <div key={message.id || index}>
               {renderMessage(message)}
             </div>
           ))}

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