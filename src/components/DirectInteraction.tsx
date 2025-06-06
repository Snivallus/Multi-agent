
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, MicOff, Timer, CheckSquare, Upload, Cpu, X, Brain, Save } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import DialogueBubble from './DialogueBubble';
import SessionHistoryPanel from './SessionHistoryPanel';
import { createMultilingualText } from '@/types/language';
import { DialogueRole } from '@/data/medicalCases';
import config from '@/config'; // API base URL
import { useToast } from '@/hooks/use-toast';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { v4 as uuidv4 } from 'uuid';  // Generate unique IDs
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DirectInteractionProps {
  onBack: () => void;
  language: Language;
  isStreaming?: boolean;
}

interface MessageType {
  role: DialogueRole;
  content?: string;
  reasoning_content?: string;
  id?: string;  // 唯一标识
  isStreaming?: boolean;  // 流式状态
  rawText?: string; // 原始文本，用于存储流式传输的中间状态
  file?: {         // 新增文件信息
    url: string;   // 预览URL
    name: string;  // 文件名
  };
  images?: string[]; // 图片数组字段
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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Session history states
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const sessionHistoryRef = useRef<any>(null);
  const { toast } = useToast();
  const [selectedDoctor, setSelectedDoctor] = useState("Qwen2.5-Max");
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  // Mock user ID - in real app, this would come from auth context
  const userId = 1; // This should come from your auth context

  // Set speech recognition language based on app language
  const speechLanguage = language === 'zh' ? 'zh-CN' : 'en-US';

  // 定义 doctorMapping，将显示名称映射为后端识别的 doctor 参数
  const doctorMapping: { [key: string]: string } = {
    "Qwen2.5-Max": "qwen-max",
    "DeepSeek-V3": "deepseek-chat",
    "DeepSeek-R1": "deepseek-reasoner"
  };  

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
        let images = message.images || [];

        // 处理 reasoning_content 累加
        if (parsedData?.reasoning_content) {
          newReasoning += parsedData.reasoning_content;
        }

        // 处理 content 直接替换（只在有更新时替换）
        if (parsedData?.content !== undefined) {
          newContent = parsedData.content;
        }

        if (parsedData?.images) {
          images = [...images, ...parsedData.images]; // 合并历史图片和新图片
        }
        
        // JSON format with reasoning_content, content and images
        return {
          ...message,
          reasoning_content: newReasoning,
          content: newContent,
          rawText: rawText,
          images: images,
        };
      }  
      return message;
    }));
  };

  // 跟踪请求状态
  const requestStateRef = useRef({
    hasReceivedFirstChunk: false, // 收到第一个chunk时停止倒计时
    isAborted: false
  });

  // Function to send request to the backend
  const sendRequest = async (
    message: string, 
    shouldDisplayMessage: boolean = true,
    timeoutDuration: number = 30 // 默认 30 秒倒计时
  ) => {
    if (isWaiting) return;

    // 重置请求状态
    requestStateRef.current = {
      hasReceivedFirstChunk: false,
      isAborted: false
    };

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
    setCountdown(timeoutDuration); // Set countdown to `timeoutDuration` seconds

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
      if (!requestStateRef.current.hasReceivedFirstChunk 
          && !requestStateRef.current.isAborted) {
        abortControllerRef.current.abort();
        setIsWaiting(false);
        setCountdown(null);
        toast({
          title: getText(translations.errorTitle, language),
          description: '请求超时',
          variant: 'destructive'
        });
        requestStateRef.current.isAborted = true;
      }
    }, timeoutDuration * 1000); // `timeoutDuration` seconds timeout

    try {
      console.log("Sending request to:", `${config.apiBaseUrl_2}/chat`);
      console.log("Request payload:", { message, language: languageRef.current });
      
      const response = await fetch(`${config.apiBaseUrl_2}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message, 
          language: languageRef.current,
          doctor: doctorMapping[selectedDoctor] // selected doctor
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

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        // 首次收到数据时停止倒计时
        if (!requestStateRef.current.hasReceivedFirstChunk) {
          requestStateRef.current.hasReceivedFirstChunk = true;
          // 使用函数式更新确保获取最新状态
          setCountdown((prevCountdown) => {
            if (prevCountdown !== null) {
              if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
              }
              return null;
            }
            return prevCountdown; // 已经是null则保持
          });
        }

        // 更新流式消息
        const chunk = decoder.decode(value);
        processStreamingContent(chunk, currentMessageId);
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
      abortControllerRef.current = null;
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '' || isWaiting) return;
    sendRequest(inputText);
  };

  const handleGenerateDiagnosis = () => {
    // Send special message "<生成诊断>" to backend without displaying it in the UI
    sendRequest("<生成诊断>", false, 30); // 此时倒计时设为 30 s
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle new session
  const handleNewSession = () => {
    setMessages([]);
    setCurrentSessionId(null);
    // Reset memory on backend
    handleResetDialogue();
  };

  // Handle session selection
  const handleSelectSession = async (dialogueId: number) => {
    // TODO: Load session messages from backend
    setCurrentSessionId(dialogueId);
    // For now, just clear the current messages
    setMessages([]);
  };

  // Save current session
  const handleSaveSession = async () => {
    if (messages.length === 0) {
      toast({
        title: getText(translations.errorTitle, language),
        description: "No messages to save",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      // Prepare data for API call
      const userMessages = messages
        .filter(msg => msg.role === 'patient')
        .map((msg, index) => ({
          line_id: index + 1,
          upload_file: !!msg.file,
          content: msg.content || ''
        }));

      const userFiles = messages
        .filter(msg => msg.role === 'patient' && msg.file)
        .map((msg, index) => {
          const fileExtension = msg.file?.name.split('.').pop()?.toLowerCase();
          let fileType: 'PNG' | 'JPEG' | 'WebP' | 'NifTI' = 'PNG';
          
          if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
            fileType = 'JPEG';
          } else if (fileExtension === 'webp') {
            fileType = 'WebP';
          } else if (fileExtension === 'nii' || fileExtension === 'gz') {
            fileType = 'NifTI';
          }

          return {
            line_id: index + 1,
            file_type: fileType,
            file_name: msg.file?.name || '',
            file_content: '' // Would need to convert file to base64
          };
        });

      const agentMessages = messages
        .filter(msg => msg.role === 'doctor' || msg.role === 'reporter')
        .map((msg, index) => ({
          line_id: index + 1,
          role_type: msg.role as 'doctor' | 'reporter',
          reasoning: msg.reasoning_content || '',
          content: msg.content || ''
        }));

      const reporterFiles = messages
        .filter(msg => msg.role === 'reporter' && msg.images && msg.images.length > 0)
        .map((msg, index) => ({
          line_id: index + 1,
          JPEG_files: msg.images?.filter(img => img.includes('jpeg')) || [],
          WebP_files: msg.images?.filter(img => img.includes('webp')) || []
        }));

      const requestData = {
        user_id: userId,
        new_dialogue: currentSessionId === null,
        dialogue_id: currentSessionId || 0,
        dialogue_name: currentSessionId ? '' : `Dialogue ${Date.now()}`,
        user_messages: userMessages,
        user_files: userFiles,
        agent_messages: agentMessages,
        reporter_files: reporterFiles
      };

      const response = await fetch(`${config.apiBaseUrl_1}/interaction/save_dialogue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCurrentSessionId(data.dialogue_id);
          toast({
            title: getText(translations.sessionSaved, language),
            description: `Session ${data.dialogue_id} saved successfully`,
            variant: "default"
          });

          // Refresh the session history
          if (sessionHistoryRef.current?.refreshDialogues) {
            sessionHistoryRef.current.refreshDialogues();
          }
        }
      } else {
        throw new Error('Failed to save session');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: getText(translations.errorTitle, language),
        description: getText(translations.apiError, language),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset the dialogue memory
  const handleResetDialogue = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl_2}/reset`, {
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
    setIsUploadModalOpen(true);
  };

  // 添加文件选择处理函数
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'npz', 'nii', 'gz'];
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        toast({
          title: getText(translations.errorTitle, language),
          description: getText(translations.unsupportedFileType, language),
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  // 添加确认上传处理函数
  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      toast({
        title: getText(translations.errorTitle, language),
        description: getText(translations.noFileSelected, language),
        variant: 'destructive',
      });
      return;
    }

    // 先添加用户消息
    const userMessage: MessageType = {
      role: 'patient',
      content: fileDescription || getText(translations.noDescription, language),
      id: uuidv4(),
      file: {
        url: URL.createObjectURL(selectedFile),
        name: selectedFile.name
      }
    };
    setMessages(prev => [...prev, userMessage]);

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('description', fileDescription);
    formData.append('language', language);
    formData.append('doctor', doctorMapping[selectedDoctor]);

    try {
      const response = await fetch(`${config.apiBaseUrl_2}/exam`, {
        method: 'POST',
        body: formData,
      });

      if (!response.body) throw new Error('No response body');

      // 添加医生消息并立即关闭弹窗
      const messageId = uuidv4();
      setMessages(prev => [...prev, {
        role: 'reporter',
        content: '',
        reasoning_content: '',
        isStreaming: true,
        id: messageId,
        rawText: ''
      }]);
      
      // 关键修改：立即关闭弹窗
      setIsUploadModalOpen(false);

      // 流式处理逻辑
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        processStreamingContent(chunk, messageId);
      }

      // 更新消息状态
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isStreaming: false } : msg
      ));

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: getText(translations.errorTitle, language),
        description: getText(translations.uploadFailed, language),
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setFileDescription('');
    }
  };

  // Render a message (user or AI response)
  const renderMessage = (message: MessageType) => {
    if (message.role === 'patient') {
      // User message
      return (
        <div className="mb-4 flex flex-col items-end"> {/* 改为右对齐容器 */}
          {/* 主内容容器 */}
          <div className="max-w-[85%] w-fit min-w-[20%]"> {/* 新增 min-w 和 w-fit */}
            <DialogueBubble
              role={message.role}
              text={createMultilingualText(message.content, message.content)}
              isActive={true}
              language={language}
              isStreaming={message.isStreaming}
            />
            
            {/* 文件展示区域 */}
            {message.file && (
              <div className="mt-2">
                <div className="relative group">
                  {['.nii', '.nii.gz'].some(ext => message.file?.name.endsWith(ext)) ? (
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-medical-blue/30">
                      <div className="flex items-center gap-2">
                        <Brain className="h-6 w-6 text-medical-blue"/>
                        <span className="text-sm font-medium text-medical-blue">
                          {getText(translations.medicalVolumeData, language)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-gray-600">
                        {message.file.name}
                      </p>
                    </div>
                  ) : (
                    <img
                      src={message.file.url}
                      alt={message.file.name}
                      className="rounded-lg border-2 border-medical-blue/20 object-contain bg-white shadow-sm transition-all hover:border-medical-blue/30 hover:shadow-md"
                      style={{ maxWidth: 'min(100%, 400px)', maxHeight: '400px' }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Doctor message with reasoning and content
      return (
        <div className="mb-8">
          {/* Doctor/Reporter Avatar and Name */}
          <div className="flex items-center mb-2">
            {message.role === 'reporter' 
              ? (
                <div className="h-8 w-8 rounded-full bg-medical-green 
                  text-white flex items-center justify-center mr-2">
                  R
                </div>
                ) 
              : (
                <div className="h-8 w-8 rounded-full bg-medical-blue text-white flex items-center justify-center mr-2">
                  D
                </div>
            )}

            {message.role === 'reporter' 
              ? (
                <div className="text-medical-green font-medium">
                  {getText(translations.reporter, language)}
                </div>
                ) 
              : (
                <div className="text-medical-blue font-medium">
                  {getText(translations.doctor, language)}
                </div>
            )}
            
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
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}  // 添加 GFM 支持
                  components={{
                    h2: ({ node, ...props }) => (
                      <h2 className="text-xl font-bold mt-6 mb-3 border-b pb-1" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />
                    ),
                    hr: () => <hr className="border-t border-gray-300 my-4" />,
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-6 my-2" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-6 my-2" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1" {...props} />
                    ),
                  }}
                >
                  {message.reasoning_content}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* 图片渲染逻辑 */}
          {message.images && message.images.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {message.images.map((imgData, index) => {
                // 自动识别图片类型
                const isJPEG = imgData.startsWith("data:image/jpeg")
                const isWEBP = imgData.startsWith("data:image/webp")
                
                return (
                  <div 
                    key={index}
                    className="relative group aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={imgData}
                      alt={getText(translations.scanResult, language) + (index + 1)}
                      className={`w-full h-full object-cover ${
                        isJPEG ? 'bg-gray-100' : 'bg-white'
                      }`}
                      loading="lazy"
                    />
                    
                    {/* 图片类型标识 */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded-md text-xs">
                      {isJPEG ? '3D' : isWEBP ? '2D' : 'IMG'}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Main Content */}
          {message.content && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}  // 添加 GFM 支持
                  components={{
                    h2: ({ node, ...props }) => (
                      <h2 className="text-xl font-bold mt-6 mb-3 border-b pb-1" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />
                    ),
                    hr: () => <hr className="border-t border-gray-300 my-4" />,
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-6 my-2" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-6 my-2" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1" {...props} />
                    ),
                  }}
                >
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
    <div className="flex h-screen animate-fade-in">
      {/* Session History Sidebar */}
      <SessionHistoryPanel
        ref={sessionHistoryRef}
        language={language}
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        onNewSession={handleNewSession}
        onSelectSession={handleSelectSession}
        currentSessionId={currentSessionId}
        userId={userId}
      />

      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isHistoryOpen ? 'ml-80' : 'ml-12'}`}>
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
              {/* Save Session button */}
              <button
                onClick={handleSaveSession}
                className="p-2 px-4 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                aria-label="Save Session"
                disabled={isSaving || messages.length === 0}
              >
                <Save className="h-5 w-5" />
                <span>{getText(translations.saveSession, language)}</span>
              </button>
              {/* End Consultation button */}
              <button
                onClick={handleGenerateDiagnosis}
                className="p-2 px-4 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                aria-label="End Consultation"
                disabled={isWaiting}
              >
                <CheckSquare className="h-5 w-5" />
                <span>{getText(translations.generateDiagnosis, language)}</span>
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
            {isWaiting && !requestStateRef.current.hasReceivedFirstChunk && (
              <div className="text-center py-4 text-gray-500">
                <p>
                  {getText(translations.waitingForResponse, language)}
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
            {/* 使用伪元素保持圆角效果 */}
            <div className="relative [&_:where(.dropdown-menu)]:overflow-visible
              before:content-[''] before:absolute before:inset-0 before:rounded-lg before:shadow-sm
              before:border before:border-gray-300 before:hover:shadow-md before:transition-shadow"
            >
              {/* 真实容器（需要保持透明背景） */}
              <div className="relative bg-transparent">
                {/* Doctor selection dropdown */}
                <div className="absolute left-3 bottom-3 z-20">
                  <div className="relative">
                    <button
                      onClick={() => setShowDoctorDropdown(!showDoctorDropdown)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors"
                      style={{ fontSize: '0.875rem'}}
                    >
                      <span className="text-medical-blue">{selectedDoctor}</span>
                      <svg className={`w-4 h-4 transition-transform ${showDoctorDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  
                    {showDoctorDropdown && (
                      <div className="absolute left-0 bottom-full mb-2 w-40 bg-white shadow-lg border rounded-lg z-50 overflow-hidden text-sm">
                        {Object.keys(doctorMapping).map((doctor) => (
                          <div 
                            key={doctor}
                            className={`p-2 hover:bg-gray-100 transition-colors cursor-pointer ${selectedDoctor === doctor ? 'bg-blue-50 text-medical-blue' : ''}`}
                            onClick={() => { 
                              setSelectedDoctor(doctor); 
                              setShowDoctorDropdown(false); 
                            }}
                          >
                            {doctor === "Qwen2.5-Max" 
                              ? getText(translations.QwenMax, language)
                              : doctor === "DeepSeek-V3" 
                                ? getText(translations.DeepSeekV3, language)
                                : getText(translations.DeepSeekR1, language)
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              
                {/* Textarea with proper spacing for doctor dropdown */}
                <textarea
                  ref={textareaRef}
                  className="w-full px-4 py-2 resize-none focus:outline-none bg-transparent"
                  placeholder={getText(translations.typeMessage, language)}
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={3000}
                  style={{ 
                    minHeight: '48px', 
                    maxHeight: '128px',
                    paddingBottom: '1rem'
                  }}
                />
              
                {/* Character counter - moved to bottom-right inside the textarea area */}
                <div className="absolute bottom-16 right-4 text-xs text-gray-400">
                  {inputText.length}/3000
                </div>
              
                {/* Action buttons */}
                <div className="flex justify-end border-t border-gray-200 p-2 bg-gray-50">
                  {/* Speech to text button */}
                  <button
                    onClick={toggleListening}
                    disabled={isWaiting || !isSupported}
                    className={`mr-2 p-2 rounded-lg transition-colors ${
                      isListening 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={isListening 
                      ? getText(translations.stopRecording, language)
                      : getText(translations.startRecording, language)
                    }
                  >
                    {isListening 
                      ? <MicOff className="h-5 w-5" /> 
                      : <Mic className="h-5 w-5" />}
                  </button>
                  
                  {/* Send button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={inputText.trim() === '' || isWaiting}
                    className="bg-medical-blue text-white px-4 py-2 rounded-lg hover:bg-medical-dark-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>{getText(translations.sendMessage, language)}</span>
                  </button>
                </div>
              </div>
            </div>
              
            {/* Display recording information */}
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

        {/* 弹窗结构 */}
        {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold mb-4">
                {getText(translations.uploadFile, language)}
              </h3>
              {/* 关闭按钮 */}
              <button 
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFile(null);
                  setFileDescription('');
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".jpg,.jpeg,.png,.webp,.npz,.nii,.gz"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full mb-4 p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
            >
              {selectedFile ? (
                <span className="text-blue-600">{selectedFile.name}</span>
              ) : (
                getText(translations.selectFile, language)
              )}
            </button>

            <input
              type="text"
              placeholder={getText(translations.fileDescription, language)}
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              className="w-full mb-4 p-2 border rounded-lg"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setSelectedFile(null);
                  setFileDescription('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {getText(translations.cancel, language)}
              </button>
              <button
                onClick={handleConfirmUpload}
                disabled={isUploading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    {getText(translations.uploading, language)}
                  </span>
                ) : (
                  getText(translations.confirm, language)
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default DirectInteraction;
