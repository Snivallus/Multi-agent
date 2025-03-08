
import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechToTextOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: any) => void;
}

export function useSpeechToText({
  language = 'zh-CN',
  continuous = true,
  interimResults = true,
  onResult,
  onError
}: SpeechToTextOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isMountedRef = useRef(true);

  // Check if SpeechRecognition is supported
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && 
        !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
    
    return () => {
      isMountedRef.current = false;
      stopListening();
    };
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (isMountedRef.current) {
      setIsListening(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;
    
    try {
      stopListening();
      
      // Initialize SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Configure
      recognition.lang = language;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      
      // Set up event handlers
      recognition.onstart = () => {
        if (isMountedRef.current) {
          setIsListening(true);
          setTranscript('');
        }
      };
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptText = result[0].transcript;
        
        if (isMountedRef.current) {
          setTranscript(transcriptText);
          if (onResult) onResult(transcriptText);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
        if (onError) onError(event);
        stopListening();
      };
      
      recognition.onend = () => {
        if (isMountedRef.current) {
          setIsListening(false);
        }
      };
      
      // Start listening
      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (onError) onError(error);
      if (isMountedRef.current) {
        setIsListening(false);
        setIsSupported(false);
      }
    }
  }, [language, continuous, interimResults, isSupported, onResult, onError, stopListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported
  };
}

// Add TypeScript interface for SpeechRecognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Add global interfaces
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
