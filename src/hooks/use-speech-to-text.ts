
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
  // const existingTextRef = useRef('');

  // Check if SpeechRecognition is supported
  useEffect(() => {
    console.debug('[SpeechToText] 检查浏览器支持情况...');
    if (!('webkitSpeechRecognition' in window) && 
        !('SpeechRecognition' in window)) {
      console.warn('[SpeechToText] 浏览器不支持语音识别 API');
      setIsSupported(false);
    }
    
    return () => {
      console.debug('[SpeechToText] 执行清理操作...');
      isMountedRef.current = false;
      stopListening();
    };
  }, []);

  // Handle recording timer
  useEffect(() => {
    console.debug(`[SpeechToText] 监听状态变更: ${isListening ? '开始' : '停止'}`);
    if (isListening) {
      console.debug('[SpeechToText] 启动录音计时器');
      // Reset timer when starting
      setRecordingDuration(0);
      
      // Start timer to update duration every second
      timerRef.current = setInterval(() => {
        console.debug(`[SpeechToText] 录音时长: ${recordingDuration + 1}秒`);
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      // Clear timer when stopped
      if (timerRef.current) {
        console.debug('[SpeechToText] 清除录音计时器');
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    // Cleanup on unmount or when isListening changes
    return () => {
      if (timerRef.current) {
        console.debug('[SpeechToText] 清理旧计时器'); 
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isListening]);

  const stopListening = useCallback(() => {
    console.debug('[SpeechToText] 执行停止监听操作');
    if (recognitionRef.current) {
      console.debug('[SpeechToText] 调用 recognition.stop()');
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (isMountedRef.current) {
      setIsListening(false);
    }
    
    // Clear timer when stopped
    if (timerRef.current) {
      console.debug('[SpeechToText] 清除停止后的计时器'); 
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    console.debug('[SpeechToText] 尝试启动语音识别...'); 
    if (!isSupported) {
      console.warn('[SpeechToText] 在不支持的浏览器中尝试启动');
      return;
    }
    try {
      stopListening();
      
      // // Store the current input text before starting a new recognition session
      // if (onResult) {
      //   // Capture the text that is currently in the input field via a callback
      //   const currentTextCallback = (currentText: string) => {
      //     existingTextRef.current = currentText;
      //   };
      //   // Call onResult with a null transcript to request the current text
      //   onResult('__GET_CURRENT_TEXT__');
      // }
      if (onResult){
        console.debug('[SpeechToText] 请求获取当前文本');
        onResult('__GET_CURRENT_TEXT__');
      }
      
      // Initialize SpeechRecognition using the global constructor
      const SpeechRecognitionConstructor = 
          window.SpeechRecognition || 
          window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionConstructor) {
        console.error('[SpeechToText] 找不到语音识别构造函数');
        setIsSupported(false);
        if (onError) onError(new Error("Speech recognition not supported in this browser"));
        return;
      }

      console.debug('[SpeechToText] 创建语音识别实例', {
        language,
        continuous,
        interimResults
      });
      
      const recognition = new SpeechRecognitionConstructor();
      
      // Configure
      recognition.lang = language;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      
      // Set up event handlers
      recognition.onstart = () => {
        console.log('[SpeechToText] 语音识别开始');
        if (isMountedRef.current) {
          setIsListening(true);
          setTranscript('');
          setRecordingDuration(0);
          // existingTextRef.current = ''; // Reset existing text
        }
      };
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptText = result[0].transcript;

        console.debug('[SpeechToText] 收到识别结果', {
          isFinal: result.isFinal,
          transcript: transcriptText
        });        

        if (isMountedRef.current) {
          setTranscript(transcriptText);

          // Only handle final results to avoid intermediate results interfering
          if (result.isFinal && onResult) {
            // Append the new transcription to existing text
            console.debug('[SpeechToText] 转写文本:', transcriptText);
            onResult(transcriptText);
          }
        }
      };
      
      recognition.onerror = (event) => {
        console.error('[SpeechToText] 语音识别错误:', event);
        if (onError) onError(event);
        stopListening();
      };
      
      recognition.onend = () => {
        console.log('[SpeechToText] 语音识别结束');
        if (isMountedRef.current) {
          setIsListening(false);
        }
      };
      
      // Start listening
      console.debug('[SpeechToText] 调用 recognition.start()');
      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      console.error('[SpeechToText] 启动语音识别异常:', error);
      if (onError) onError(error);
      if (isMountedRef.current) {
        setIsListening(false);
        setIsSupported(false);
      }
    }
  }, [language, continuous, interimResults, isSupported, onResult, onError, stopListening]);

  // Toggle listening state
  const toggleListening = useCallback(() => {
    console.debug('[SpeechToText] 切换监听状态', {
      currentState: isListening ? '监听中' : '已停止'
    })
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
