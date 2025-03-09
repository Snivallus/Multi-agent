
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
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isMountedRef = useRef(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if SpeechRecognition is supported
  useEffect(() => {
    // Explicitly check for the constructors in the window object
    const speechRecognitionSupported = 
      'SpeechRecognition' in window || 
      'webkitSpeechRecognition' in window;
    
    setIsSupported(speechRecognitionSupported);
    
    // Log this to help with debugging - fixed syntax errors here
    console.log('Speech recognition support check:', {
      speechRecognitionInWindow: 'SpeechRecognition' in window,
      webkitSpeechRecognitionInWindow: 'webkitSpeechRecognition' in window,
      supported: speechRecognitionSupported
    });
    
    return () => {
      isMountedRef.current = false;
      stopListening();
    };
  }, []);

  // Handle recording timer
  useEffect(() => {
    if (isListening) {
      // Reset timer when starting
      setRecordingDuration(0);
      
      // Start timer to update duration every second
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      // Clear timer when stopped
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    // Cleanup on unmount or when isListening changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (isMountedRef.current) {
      setIsListening(false);
    }
    
    // Clear timer when stopped
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      console.error('Speech recognition is not supported in this browser');
      if (onError) onError(new Error("Speech recognition not supported in this browser"));
      return;
    }
    
    try {
      stopListening();
      
      // Get the correct speech recognition constructor
      const SpeechRecognitionConstructor = 
        // @ts-ignore - We know this exists because we checked isSupported
        window.SpeechRecognition || 
        // @ts-ignore - We know this exists because we checked isSupported
        window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionConstructor) {
        console.error('Failed to get SpeechRecognition constructor');
        setIsSupported(false);
        if (onError) onError(new Error("Speech recognition not supported in this browser"));
        return;
      }
      
      const recognition = new SpeechRecognitionConstructor();
      
      // Configure
      recognition.lang = language;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      
      // Set up event handlers
      recognition.onstart = () => {
        if (isMountedRef.current) {
          setIsListening(true);
          setTranscript('');
          setRecordingDuration(0);
        }
      };
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptText = result[0].transcript;
        
        if (isMountedRef.current) {
          setTranscript(transcriptText);

          // Only handle final results to avoid intermediate results interfering
          if (result.isFinal && onResult) {
            // Append the new transcription to existing text
            onResult(transcriptText);
          }
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

  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    isSupported,
    recordingDuration
  };
}

// Define SpeechRecognition types
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
    SpeechRecognition?: {
      new(): SpeechRecognition;
      prototype: SpeechRecognition;
    };
    webkitSpeechRecognition?: {
      new(): SpeechRecognition;
      prototype: SpeechRecognition;
    };
  }
}
