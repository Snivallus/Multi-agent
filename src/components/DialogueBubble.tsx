import { cn } from '@/lib/utils';
import { DialogueRole } from '@/data/medicalCases';
import React, {useEffect, useRef} from 'react';
import { Language, getText, MultilingualText, createMultilingualText } from '@/types/language';
import { translations } from '@/data/translations';
import ReactMarkdown from 'react-markdown';
import { Clipboard } from 'lucide-react';

interface DialogueBubbleProps {
  role: DialogueRole;
  text: MultilingualText;
  isActive: boolean;
  language: Language;
  isStreaming?: boolean; // optional
  turn_id?: number; // optional
}

/*
 * Component for displaying individual dialogue messages in the conversation
 * Styles differ based on the speaker role (doctor/patient/reporter/monitor/summary_doctor)
 * and optionally shows the turn number if provided as a non-negative integer.
 */
const StreamingCursor = () => (
  <span className="ml-1 inline-block h-4 w-[1px] bg-gray-600 align-middle animate-blink">
    {/* Cursor element */}
  </span>
);

/**
 * 返回给定非负整数的序数后缀 (1st, 2nd, 3rd, 4th, ...)
 */
const getOrdinal = (n: number): MultilingualText => {
  const absN = Math.abs(n);
  const mod100 = absN % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return createMultilingualText(`第 ${n} 轮`,`${n}th turn`);
  }
  switch (absN % 10) {
    case 1:
      return createMultilingualText(`第 ${n} 轮`,`${n}st turn`);
    case 2:
      return createMultilingualText(`第 ${n} 轮`,`${n}nd turn`);
    case 3:
      return createMultilingualText(`第 ${n} 轮`,`${n}rd turn`);
    default:
      return createMultilingualText(`第 ${n} 轮`,`${n}th turn`);
  }
};

const DialogueBubble: React.FC<DialogueBubbleProps> = ({ 
  role, 
  text, 
  isActive, 
  language,
  isStreaming,
  turn_id
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

  // Auto-scroll when streaming
  useEffect(() => {
    if (bubbleRef.current && isStreaming) {
      bubbleRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [textContent, isStreaming]);

  // Streaming update optimization
  useEffect(() => {
    if (isStreaming && textContent.length > prevTextLength.current) {
      prevTextLength.current = textContent.length;
    }
  }, [textContent, isStreaming]);

  // Role text
  const roleText = getText(translations[role], language);

  // Calculate turnLabel (if turn_id is a non-negative integer)
  let labelText = roleText;
  if (typeof turn_id === 'number' && Number.isInteger(turn_id) && turn_id >= 0) {
    const ordinal = getText(getOrdinal(turn_id), language);
    labelText = `${roleText} (${ordinal})`;
  }

  // Determine alignment class
  const alignmentClass =
    role === 'doctor' || role === 'summary_doctor'
      ? 'ml-auto ml-4'
      : role === 'patient'
      ? 'mr-auto mr-4'
      : 'mx-auto'; // reporter or monitor

  // Determine bubble style class
  const bubbleStyleClass =
    role === 'doctor' || role === 'summary_doctor'
      ? 'doctor-bubble'
      : role === 'patient'
      ? 'patient-bubble'
      : 'reporter-bubble'; // reporter or monitor

  // Determine avatar background class
  const avatarBgClass =
    role === 'doctor' || role === 'summary_doctor'
      ? 'bg-medical-blue'
      : role === 'patient'
      ? 'bg-medical-gray'
      : 'bg-medical-green'; // reporter or monitor

  // Determine avatar letter
  const avatarLetter =
    role === 'doctor'
      ? 'D'
      : role === 'summary_doctor'
      ? 'S'
      : role === 'patient'
      ? 'P'
      : role === 'monitor'
      ? 'M'
      : 'R'; // 'R' for reporter by default

  // Determine label text color class
  const labelColorClass =
    role === 'doctor' || role === 'summary_doctor'
      ? 'text-medical-blue'
      : role === 'patient'
      ? 'text-medical-dark-blue'
      : 'text-medical-green'; // reporter or monitor

  return (
    <div
      className={cn(
        'max-w-2xl mx-auto my-4 transition-all duration-500 ease-in-out',
        isActive ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8',
        alignmentClass,
        bubbleStyleClass,
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
            avatarBgClass
          )}
        >
          {avatarLetter}
        </div>
        
        <div 
          className="flex items-center gap-2"
        >
          {/* Speaker label (Doctor/Patient/Reporter/Monitor/Summary Doctor) */}
          <div
            className={cn('text-m font-medium relative right-1.5', labelColorClass)}
          >
            {labelText}
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
            'text-gray-800 max-w-xs text-left border border-gray-300 p-2 rounded-lg',
            isStreaming && 'pr-8' // reserve space for cursor
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

          {/* Streaming curso */}
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