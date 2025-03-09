
import { useState, useEffect, useCallback, useRef } from 'react';

// Define error types for better error handling
export enum SpeechRecognitionErrorType {
  NOT_SUPPORTED = 'not-supported',
  NO_SPEECH = 'no-speech',
  AUDIO_CAPTURE = 'audio-capture',
  NETWORK = 'network',
  ABORTED = 'aborted',
  NOT_ALLOWED = 'not-allowed',
  SERVICE_NOT_ALLOWED = 'service-not-allowed',
  BAD_GRAMMAR = 'bad-grammar',
  LANGUAGE_NOT_SUPPORTED = 'language-not-supported',
  UNKNOWN = 'unknown'
}

export interface SpeechRecognitionError {
  type: SpeechRecognitionErrorType;
  message: string;
  error?: any; // Original error object
}

interface SpeechToTextOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: SpeechRecognitionError) => void;
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
    const browserSupportsSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    console.log('Speech recognition support check:', {
      speechRecognitionInWindow: 'SpeechRecognition' in window,
      webkitSpeechRecognitionInWindow: 'webkitSpeechRecognition' in window,
      supported: browserSupportsSpeechRecognition
    });
    
    setIsSupported(browserSupportsSpeechRecognition);
    
    if (!browserSupportsSpeechRecognition && onError) {
      onError({
        type: SpeechRecognitionErrorType.NOT_SUPPORTED,
        message: 'Speech Recognition API is not supported in this browser'
      });
    }
    
    return () => {
      isMountedRef.current = false;
      stopListening();
    };
  }, [onError]);

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
    console.log('Stopping speech recognition');
    if (recognitionRef.current) {
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        if (isMountedRef.current) {
          setIsListening(false);
        }
        recognitionRef.current = null;
      };
      recognitionRef.current.stop();
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
      console.error('Speech recognition not supported');
      if (onError) {
        onError({
          type: SpeechRecognitionErrorType.NOT_SUPPORTED,
          message: 'Speech Recognition API is not supported in this browser'
        });
      }
      return;
    }
    
    try {
      stopListening();
      
      // Initialize SpeechRecognition using the global constructor
      const SpeechRecognitionConstructor = 
          window.SpeechRecognition || 
          window.webkitSpeechRecognition;
      
      console.log('SpeechRecognition constructor:', SpeechRecognitionConstructor);

      if (!SpeechRecognitionConstructor) {
        console.error('SpeechRecognition constructor not found');
        if (isMountedRef.current) {
          setIsSupported(false);
        }
        if (onError) {
          onError({
            type: SpeechRecognitionErrorType.NOT_SUPPORTED,
            message: 'Speech recognition not supported in this browser'
          });
        }
        return;
      }

      const recognition = new SpeechRecognitionConstructor();
      console.log('Speech recognition instance created');
      
      // Configure
      recognition.lang = language;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      
      // Set up event handlers
      recognition.onstart = () => {
        console.log('Speech recognition started');
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
        
        console.log('Speech recognition result:', {
          current,
          isFinal: result.isFinal,
          transcript: transcriptText,
          confidence: result[0].confidence
        });
        
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
        console.error('Speech recognition error:', event);
        
        // Map the error to our error types
        let errorType = SpeechRecognitionErrorType.UNKNOWN;
        let errorMessage = 'Unknown speech recognition error';
        
        if (event.error) {
          switch (event.error) {
            case 'no-speech':
              errorType = SpeechRecognitionErrorType.NO_SPEECH;
              errorMessage = 'No speech was detected';
              break;
            case 'audio-capture':
              errorType = SpeechRecognitionErrorType.AUDIO_CAPTURE;
              errorMessage = 'Audio capture failed';
              break;
            case 'not-allowed':
              errorType = SpeechRecognitionErrorType.NOT_ALLOWED;
              errorMessage = 'Microphone permission denied';
              break;
            case 'aborted':
              errorType = SpeechRecognitionErrorType.ABORTED;
              errorMessage = 'Speech recognition aborted';
              break;
            case 'network':
              errorType = SpeechRecognitionErrorType.NETWORK;
              errorMessage = 'Network error occurred';
              break;
            case 'service-not-allowed':
              errorType = SpeechRecognitionErrorType.SERVICE_NOT_ALLOWED;
              errorMessage = 'Service not allowed, quota exceeded';
              break;
            case 'bad-grammar':
              errorType = SpeechRecognitionErrorType.BAD_GRAMMAR;
              errorMessage = 'Bad grammar configuration';
              break;
            case 'language-not-supported':
              errorType = SpeechRecognitionErrorType.LANGUAGE_NOT_SUPPORTED;
              errorMessage = `Language '${language}' not supported`;
              break;
            default:
              errorType = SpeechRecognitionErrorType.UNKNOWN;
              errorMessage = `Unknown error: ${event.error}`;
          }
        }
        
        if (onError) {
          onError({
            type: errorType,
            message: errorMessage,
            error: event
          });
        }
        
        // Always stop listening and reset state on error
        stopListening();
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended by browser');
        if (isMountedRef.current) {
          setIsListening(false);
        }
      };
      
      // Start listening
      console.log('Starting speech recognition with language:', language);
      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (onError) {
        onError({
          type: SpeechRecognitionErrorType.UNKNOWN,
          message: 'Error starting speech recognition',
          error
        });
      }
      if (isMountedRef.current) {
        setIsListening(false);
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
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
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
    SpeechRecognition: {
      new(): SpeechRecognition;
      prototype: SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
      prototype: SpeechRecognition;
    };
  }
}
