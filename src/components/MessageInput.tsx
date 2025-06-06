
import React, { useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Timer } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  isWaiting: boolean;
  onSendMessage: () => void;
  selectedDoctor: string;
  setSelectedDoctor: (doctor: string) => void;
  showDoctorDropdown: boolean;
  setShowDoctorDropdown: (show: boolean) => void;
  doctorMapping: { [key: string]: string };
  language: Language;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputText,
  setInputText,
  isWaiting,
  onSendMessage,
  selectedDoctor,
  setSelectedDoctor,
  showDoctorDropdown,
  setShowDoctorDropdown,
  doctorMapping,
  language
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Set speech recognition language based on app language
  const speechLanguage = language === 'zh' ? 'zh-CN' : 'en-US';

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
    interimResults: true,
    onResult: (result) => {
      if (result === '__GET_CURRENT_TEXT__') {
        return;
      }
      const newText = inputText ? `${inputText} ${result}` : result;
      setInputText(newText);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="bg-white border-t p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative [&_:where(.dropdown-menu)]:overflow-visible
          before:content-[''] before:absolute before:inset-0 before:rounded-lg before:shadow-sm
          before:border before:border-gray-300 before:hover:shadow-md before:transition-shadow"
        >
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
          
            {/* Character counter */}
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
                onClick={onSendMessage}
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
  );
};

export default MessageInput;
