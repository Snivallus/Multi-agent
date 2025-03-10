
import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechToTextOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: any) => void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: 'aborted' | 'network' | 'not-allowed' | 'service-not-allowed' | 'no-speech' | 'language-not-supported';
  message: string;
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
  const errorTypeRef = useRef<string>('');

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
    console.log('调试信息:', {
      browser: navigator.userAgent,
      protocol: window.location.protocol,
      online: navigator.onLine,
      speechSupport: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    });
    if (!isSupported) {
      console.warn('[SpeechToText] 在不支持的浏览器中尝试启动');
      if (onError) onError({
        type: 'browserNotSupported',
        message: '当前浏览器不支持语音功能'
      });
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
        if (onError) onError({
          type: 'browserNotSupported',
          message: "浏览器不支持语音识别"
        });
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
      
      // 在 recognition.onerror 处理部分增加详细错误解析
      recognition.onerror = (event) => {
        const errorMap: { [key: string]: string } = {
          'aborted': '用户中止识别',
          'network': '网络通信失败',
          'not-allowed': '麦克风权限被拒绝',
          'service-not-allowed': '服务不可用',
          'no-speech': '未检测到语音输入',
          'language-not-supported': '语言不支持'
        };

        const errorType = event.error;
        const mappedType = errorType === 'not-allowed' || 
                           errorType === 'service-not-allowed' 
                           ? 'microphonePermissionDenied' : errorType;
        errorTypeRef.current = mappedType;
        const errorMessage = `[SpeechToText] 识别错误: ${errorMap[errorType] || '未知错误'} (${errorType})`;
        
        console.error(errorMessage, {
          errorEvent: event,
          config: {
            language,
            continuous,
            interimResults
          },
          systemInfo: {
            online: navigator.onLine,
            protocol: window.location.protocol,
            userAgent: navigator.userAgent
          }
        });

        if (onError) {
          onError({
            type: mappedType,
            message: errorMap[errorType] || '未知错误',
            originalEvent: event
          });
        }

        // 特殊处理网络错误
        if (errorType === 'network') {
          console.warn('[SpeechToText] 网络问题建议：',
            '1. 检查互联网连接\n',
            '2. 确保使用HTTPS协议\n',
            '3. 验证语音服务是否可用');
        }

        stopListening();
      };
      
      recognition.onend = () => {
        console.log('[SpeechToText] 语音识别结束', {
          finalTranscript: transcript,
          duration: recordingDuration
        });
        if (isMountedRef.current) {
          setIsListening(false);
        }

        // 自动重连机制（针对网络错误）
        if (continuous && isMountedRef.current && errorTypeRef.current === 'network') {
          console.debug('[SpeechToText] 尝试网络错误自动重连...');
          setTimeout(startListening, 2000);
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
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
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

  interface SpeechRecognitionErrorEvent extends Event {
    error: 'aborted' | 'network' | 'not-allowed' | 'service-not-allowed' | 'no-speech' | 'language-not-supported';
    message: string;
  }
}
