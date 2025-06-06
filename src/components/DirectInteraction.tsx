
import React, { useState, useRef, useEffect } from 'react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import { DialogueRole } from '@/data/medicalCases';
import config from '@/config';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import DirectInteractionHeader from './DirectInteractionHeader';
import MessageRenderer from './MessageRenderer';
import MessageInput from './MessageInput';
import UploadModal from './UploadModal';
import SessionHistory from './SessionHistory';

interface DirectInteractionProps {
  onBack: () => void;
  language: Language;
  isStreaming?: boolean;
}

interface MessageType {
  role: DialogueRole;
  content?: string;
  reasoning_content?: string;
  id?: string;
  isStreaming?: boolean;
  rawText?: string;
  file?: {
    url: string;
    name: string;
  };
  images?: string[];
}

/**
 * Component for direct interaction with the AI system
 * Allows users to send messages and receive responses
 */
const DirectInteraction: React.FC<DirectInteractionProps> = ({ onBack, language }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("Qwen2.5-Max");
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const [currentDialogueId, setCurrentDialogueId] = useState<number | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  // Mock user ID - in a real app, this would come from authentication
  const userId = 1;

  // Define doctorMapping
  const doctorMapping: { [key: string]: string } = {
    "Qwen2.5-Max": "qwen-max",
    "DeepSeek-V3": "deepseek-chat",
    "DeepSeek-R1": "deepseek-reasoner"
  };

  // Monitor language value
  const languageRef = useRef(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

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
        const parsedData = tryParseJSON(rawText);
        let newReasoning = message.reasoning_content || ''
        let newContent = message.content || '';
        let images = message.images || [];

        if (parsedData?.reasoning_content) {
          newReasoning += parsedData.reasoning_content;
        }

        if (parsedData?.content !== undefined) {
          newContent = parsedData.content;
        }

        if (parsedData?.images) {
          images = [...images, ...parsedData.images];
        }
        
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

  // Track request state
  const requestStateRef = useRef({
    hasReceivedFirstChunk: false,
    isAborted: false
  });

  // Function to send request to the backend
  const sendRequest = async (
    message: string, 
    shouldDisplayMessage: boolean = true,
    timeoutDuration: number = 30
  ) => {
    if (isWaiting) return;

    requestStateRef.current = {
      hasReceivedFirstChunk: false,
      isAborted: false
    };

    if (shouldDisplayMessage) {
      const userMessage: MessageType = {
        role: 'patient',
        content: message,
        id: uuidv4()
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
    }
    
    setInputText('');
    setIsWaiting(true);
    setCountdown(timeoutDuration);

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
    }, timeoutDuration * 1000);

    try {
      console.log("Sending request to:", `${config.apiBaseUrl_2}/chat`);
      console.log("Request payload:", { message, language: languageRef.current });
      
      const response = await fetch(`${config.apiBaseUrl_2}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message, 
          language: languageRef.current,
          doctor: doctorMapping[selectedDoctor]
        }),
        signal
      });

      clearTimeout(timeoutId);

      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }

      if (!response.body) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const currentMessageId = uuidv4();

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

        if (!requestStateRef.current.hasReceivedFirstChunk) {
          requestStateRef.current.hasReceivedFirstChunk = true;
          setCountdown((prevCountdown) => {
            if (prevCountdown !== null) {
              if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
              }
              return null;
            }
            return prevCountdown;
          });
        }

        const chunk = decoder.decode(value);
        processStreamingContent(chunk, currentMessageId);
      }

      setMessages(prevMessages => prevMessages.map(message => 
        message.id === currentMessageId
          ? { ...message, isStreaming: false }
          : message
      ));

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
      abortControllerRef.current = null;
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '' || isWaiting) return;
    sendRequest(inputText);
  };

  const handleGenerateDiagnosis = () => {
    sendRequest("<生成诊断>", false, 30);
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
        setMessages([]);
        setCurrentDialogueId(undefined);
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
    setIsUploadModalOpen(true);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      toast({
        title: getText(translations.errorTitle, language),
        description: getText(translations.noFileSelected, language),
        variant: 'destructive',
      });
      return;
    }

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

      const messageId = uuidv4();
      setMessages(prev => [...prev, {
        role: 'reporter',
        content: '',
        reasoning_content: '',
        isStreaming: true,
        id: messageId,
        rawText: ''
      }]);
      
      setIsUploadModalOpen(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        processStreamingContent(chunk, messageId);
      }

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

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Function to save the current session
  const handleSaveSession = async () => {
    if (messages.length === 0) {
      toast({
        title: getText(translations.errorTitle, language),
        description: "No messages to save",
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Prepare the data structure for saving
      const userMessages: any[] = [];
      const userFiles: any[] = [];
      const agentMessages: any[] = [];
      const reporterFiles: any[] = [];
      
      let lineId = 1;

      for (const message of messages) {
        if (message.role === 'patient') {
          userMessages.push({
            line_id: lineId,
            upload_file: !!message.file,
            content: message.content || ''
          });

          // Handle file if present
          if (message.file && message.file.url.startsWith('blob:')) {
            try {
              const response = await fetch(message.file.url);
              const blob = await response.blob();
              const file = new File([blob], message.file.name);
              const base64Content = await fileToBase64(file);
              
              let fileType: 'PNG' | 'JPEG' | 'WebP' | 'NifTI' = 'PNG';
              const extension = message.file.name.split('.').pop()?.toLowerCase();
              
              if (extension === 'jpg' || extension === 'jpeg') fileType = 'JPEG';
              else if (extension === 'webp') fileType = 'WebP';
              else if (extension === 'nii' || extension === 'gz') fileType = 'NifTI';

              userFiles.push({
                line_id: lineId,
                file_type: fileType,
                file_name: message.file.name,
                file_content: base64Content
              });
            } catch (error) {
              console.error('Error processing file:', error);
            }
          }
        } else if (message.role === 'doctor' || message.role === 'reporter') {
          agentMessages.push({
            line_id: lineId,
            role_type: message.role,
            reasoning: message.reasoning_content || '',
            content: message.content || ''
          });

          // Handle reporter images
          if (message.role === 'reporter' && message.images && message.images.length > 0) {
            const jpegFiles: string[] = [];
            const webpFiles: string[] = [];

            for (const imgData of message.images) {
              const base64Data = imgData.split(',')[1];
              if (imgData.startsWith('data:image/jpeg')) {
                jpegFiles.push(base64Data);
              } else if (imgData.startsWith('data:image/webp')) {
                webpFiles.push(base64Data);
              }
            }

            if (jpegFiles.length > 0 || webpFiles.length > 0) {
              reporterFiles.push({
                line_id: lineId,
                JPEG_files: jpegFiles,
                WebP_files: webpFiles
              });
            }
          }
        }
        lineId++;
      }

      const saveData = {
        user_id: userId,
        new_dialogue: !currentDialogueId,
        dialogue_id: currentDialogueId || 0,
        dialogue_name: currentDialogueId ? '' : `Dialogue ${Date.now()}`,
        user_messages: userMessages,
        user_files: userFiles,
        agent_messages: agentMessages,
        reporter_files: reporterFiles
      };

      const response = await fetch(`${config.apiBaseUrl_2}/interaction/save_dialogue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCurrentDialogueId(result.dialogue_id);
          toast({
            title: "Session Saved",
            description: "Your session has been saved successfully",
            variant: "default"
          });
        } else {
          throw new Error('Save failed');
        }
      } else {
        throw new Error('Network error');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: getText(translations.errorTitle, language),
        description: "Failed to save session",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectDialogue = (dialogueId: number) => {
    setCurrentDialogueId(dialogueId);
    // TODO: Load the selected dialogue's messages
    console.log('Selected dialogue:', dialogueId);
  };

  return (
    <div className="flex h-screen animate-fade-in">
      {/* Session History Sidebar */}
      <SessionHistory
        language={language}
        userId={userId}
        isCollapsed={isHistoryCollapsed}
        onToggleCollapse={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
        onSelectDialogue={handleSelectDialogue}
        selectedDialogueId={currentDialogueId}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DirectInteractionHeader
          onBack={onBack}
          onGenerateDiagnosis={handleGenerateDiagnosis}
          onUploadFile={handleUploadFile}
          onResetDialogue={handleResetDialogue}
          onSaveSession={handleSaveSession}
          isWaiting={isWaiting}
          isSaving={isSaving}
          language={language}
        />

        {/* Messages area */}
        <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-3xl mx-auto space-y-2 pb-20">
            {messages.length === 0 && (
              <div className="text-center my-20 text-gray-500">
                <p>{getText(translations.conversationHint, language)}</p>
              </div>
            )}

            {messages.map((message, index) => (
               <div key={message.id || index}>
                 <MessageRenderer message={message} language={language} />
               </div>
             ))}

            {isWaiting && !requestStateRef.current.hasReceivedFirstChunk && (
              <div className="text-center py-4 text-gray-500">
                <p>
                  {getText(translations.waitingForResponse, language)}
                  {countdown !== null && <span>({countdown} s) ...</span>}
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <MessageInput
          inputText={inputText}
          setInputText={setInputText}
          isWaiting={isWaiting}
          onSendMessage={handleSendMessage}
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
          showDoctorDropdown={showDoctorDropdown}
          setShowDoctorDropdown={setShowDoctorDropdown}
          doctorMapping={doctorMapping}
          language={language}
        />
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        fileDescription={fileDescription}
        setFileDescription={setFileDescription}
        onConfirmUpload={handleConfirmUpload}
        isUploading={isUploading}
        language={language}
      />
    </div>
  );
};

export default DirectInteraction;
