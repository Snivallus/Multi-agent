
import { MultilingualText, createMultilingualText } from '@/types/language';

// UI translations for the entire application
export const translations = {
  // Common UI elements
  toggleLanguage: createMultilingualText('中文', 'English'),
  
  // Landing page
  appTitle: createMultilingualText('医学多智能体系统', 'Medical Multi-Agent Systems'),
  appDescription: createMultilingualText(
    '一个用于多模态医学诊断的多智能体框架',
    'A multi-agent framework for multi-modality medical diagnosis'
  ),
  selectCaseButton: createMultilingualText('选择案例', 'Select a Case Study'),
  directInteractionButton: createMultilingualText('直接交互', 'Direct Interaction'),
  clickToStartHint: createMultilingualText('点击案例开始模拟', 'Click on a case to start the simulation'),
  
  // Direct Interaction
  directInteractionTitle: createMultilingualText('直接交互', 'Direct Interaction'),
  typeMessage: createMultilingualText('在此输入您的消息...', 'Type your message here...'),
  sendMessage: createMultilingualText('发送消息', 'Send Message'),
  waitingForResponse: createMultilingualText('等待回应 ', 'Waiting for response '),
  // interactiveMedicalLearning: createMultilingualText('交互式医学学习', 'Interactive Medical Learning'),
  jumpToPosition: createMultilingualText('点击跳转到该位置', 'Click to jump to this position'),
  conversationHint: createMultilingualText('输入消息开始对话', 'Start a conversation by typing a message below.'),
  doctorPlaceHolder: createMultilingualText('(无响应)', '(No response)'),
  resetMomery: createMultilingualText('清除记忆', 'Reset momery'),
  
  // Speech to text 
  holdToSpeak: createMultilingualText('按住说话', 'Hold to speak'),
  releaseToCancelRecording: createMultilingualText('松开取消录音', 'Release to cancel recording'),
  listeningToSpeech: createMultilingualText('正在聆听...', 'Listening...'),
  microphonePermission: createMultilingualText('需要麦克风权限', 'Microphone permission needed'),
  browserNotSupported: createMultilingualText('您的浏览器不支持语音识别', 'Your browser does not support speech recognition'),
  
  // Case selection
  selectCase: createMultilingualText('选择案例', 'Select a Case Study'),
  searchCasesPlaceholder: createMultilingualText(
    '按标题、描述、类别或标签搜索案例...',
    'Search cases by title, description, category, or tags...'
  ),
  noCasesFound: createMultilingualText(
    '未找到匹配您搜索条件的案例',
    'No cases found matching your search criteria'
  ),
  
  // Dialogue simulation
  resetDialogue: createMultilingualText('重置对话', 'Reset dialogue'),
  pause: createMultilingualText('暂停', 'Pause'),
  play: createMultilingualText('播放', 'Play'),
  nextDialogue: createMultilingualText('下一段对话', 'Next dialogue'),
  previousDialogue: createMultilingualText('上一段对话', 'Previous dialogue'),
  progress: createMultilingualText('进度', 'Progress'),
  of: createMultilingualText('共', 'of'),
  playPause: createMultilingualText('空格键: 播放/暂停', 'Space: Play/Pause'),
  previousLine: createMultilingualText('&larr;: 上一句', '&larr;: Previous'),
  nextLine: createMultilingualText('&rarr;: 下一句', '&rarr;: Next'),
  copybutton: createMultilingualText('复制', 'Copy'),
  
  // Difficulty levels
  easy: createMultilingualText('简单', 'Easy'),
  medium: createMultilingualText('中等', 'Medium'),
  hard: createMultilingualText('困难', 'Hard'),
  
  // Roles
  doctor: createMultilingualText('医生', 'Doctor'),
  patient: createMultilingualText('患者', 'Patient'),
  reporter: createMultilingualText('检查员', 'Reporter'),

  // Error messages
  errorTitle: createMultilingualText('错误', 'Error'),
  networkError: createMultilingualText('网络错误，请稍后再试', 'Network error, please try again later'),
  apiError: createMultilingualText('服务器错误，请稍后再试', 'Server error, please try again later'),
};
