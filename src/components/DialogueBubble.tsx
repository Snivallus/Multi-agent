import { cn } from '@/lib/utils';
import { DialogueRole } from '@/data/medicalCases';
import React, {useEffect, useRef} from 'react';
import { Language, getText, MultilingualText } from '@/types/language';
import { translations } from '@/data/translations';
import ReactMarkdown from 'react-markdown';
import { Clipboard } from 'lucide-react';

interface DialogueBubbleProps {
  role: DialogueRole;
  text: MultilingualText;
  isActive: boolean;
  language: Language;
  isStreaming?: boolean;
}

/**
 * Component for displaying individual dialogue messages in the conversation
 * Styles differ based on the speaker role (doctor/patient/reporter)
 */
const StreamingCursor = () => (
  <span className="ml-1 inline-block h-4 w-[1px] bg-gray-600 align-middle animate-blink">
    {/* 光标元素 */}
  </span>
);

const DialogueBubble: React.FC<DialogueBubbleProps> = ({ 
  role, 
  text, 
  isActive, 
  language,
  isStreaming
}) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const handleClick = () => {
    if (bubbleRef.current) {
      bubbleRef.current.focus();
    }
  };

  const textContent = getText(text, language);
  const prevTextLength = useRef(textContent.length);
  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
  };

  // 自动滚动到底部
  useEffect(() => {
    if (bubbleRef.current && isStreaming) {
      bubbleRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [textContent, isStreaming]);

  // 流式更新优化
  useEffect(() => {
    if (isStreaming && textContent.length > prevTextLength.current) {
      prevTextLength.current = textContent.length;
    }
  }, [textContent, isStreaming]);

  return (
    <div
      className={cn(
        'max-w-2xl mx-auto my-4 transition-all duration-500 ease-in-out',
        isActive ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8',
        role === 'doctor' 
          ? 'ml-auto ml-4' 
          : role === 'patient' 
            ? 'mr-auto mr-4' 
            : 'mx-auto',
        role === 'doctor' 
          ? 'doctor-bubble' 
          : role === 'patient' 
            ? 'patient-bubble' 
            : 'reporter-bubble',
        'w-fit max-w-[80%]'
      )}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        {/* Avatar for the speaker */}
        <div
          className={cn(
            'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white',
            role === 'doctor' 
              ? 'bg-medical-blue' 
              : role === 'patient' 
                ? 'bg-medical-gray' 
                : 'bg-medical-green'
          )}
        >
          {role === 'doctor' 
            ? 'D' 
            : role === 'patient' 
              ? 'P' 
              : 'R'}
        </div>
        <div className="flex items-center gap-2">
          {/* Speaker label (Doctor/Patient/Reporter) */}
          <div
            className={cn(
              'text-m font-medium relative right-1.5',
              role === 'doctor' 
                ? 'text-medical-blue' 
                : role === 'patient' 
                  ? 'text-medical-dark-blue' 
                  : 'text-medical-green'
            )}
          >
            {getText(translations[role], language)}
          </div>
          {isStreaming && (
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" />
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-150" />
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-300" />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col mt-1">
        
        {/* Dialogue text */}
        <div
          ref={bubbleRef} 
          className={cn(
            "text-gray-800 max-w-xs text-left border border-gray-300 p-2 rounded-lg", 
            isStreaming && 'pr-8' // 为光标留出空间
          )}
        >
        
        <div className="prose prose-medical max-w-none">
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => (
                <p 
                  className="leading-relaxed whitespace-pre-wrap" 
                  {...props} 
                />
              )
            }}
          >
            {textContent}
          </ReactMarkdown>
        </div>

          {/* 流式光标 */}
          {isStreaming && <StreamingCursor />}
        </div>
        
        {/* Copy button */}
        {textContent.length > 10 && (
          <button
            onClick={handleCopy}
            className={cn(
              'mt-2 mr-2 text-gray-200 hover:text-gray-500 flex items-center',
              textContent.length <= 10 ? 'relative' : 'absolute bottom-2 right-0'
            )}
            aria-label="Copy text"
          >
            <Clipboard className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DialogueBubble;