
import { MultilingualText, createMultilingualText } from '@/types/language';
import { generateCategoricalChart } from 'recharts/types/chart/generateCategoricalChart';

// UI translations for the entire application
export const translations = {
  // Common UI elements
  toggleLanguage: createMultilingualText('中文', 'English'),
  
  // Landing page
  appTitle: createMultilingualText('AI 医院', 'AI Hospital'),
  appDescription: createMultilingualText(
    '多模态医学诊断大模型',
    'Multi-modality Large Model for Medical Diagnosis'
  ),
  selectCaseButton: createMultilingualText('选择案例', 'Select a Case Study'),
  directInteractionButton: createMultilingualText('直接交互', 'Direct Interaction'),
  clickToStartHint: createMultilingualText('点击案例开始模拟', 'Click on a case to start the simulation'),
  
  // Direct Interaction
  directInteractionTitle: createMultilingualText('直接交互', 'Direct Interaction'),
  typeMessage: createMultilingualText('在此输入您的消息...', 'Type your message here...'),
  sendMessage: createMultilingualText('发送消息', 'Send Message'),
  waitingForResponse: createMultilingualText('等待回应 ', 'Waiting for response '),
  jumpToPosition: createMultilingualText('点击跳转到该位置', 'Click to jump to this position'),
  conversationHint: createMultilingualText('输入消息开始对话', 'Start a conversation by typing a message below.'),
  doctorPlaceHolder: createMultilingualText('(无响应)', '(No response)'),
  resetMomery: createMultilingualText('重置记忆', 'Reset Momery'),
  generateDiagnosis: createMultilingualText('生成诊断', 'Generate Diagnosis'),
  uploadFile: createMultilingualText('上传文件', 'Upload File'),
  featureNotImplemented: createMultilingualText('功能尚未实现，敬请期待', 'This Feature is not yet implemented, stay tuned'),
  
  // Doctor Selection
  selectDoctor: createMultilingualText('医生模型', 'Doctor Model'),
  QwenMax: createMultilingualText('Qwen2.5-Max', 'Qwen2.5-Max'),
  DeepSeekV3: createMultilingualText('DeepSeek-V3', 'DeepSeek-V3'),
  DeepSeekR1: createMultilingualText('DeepSeek-R1', 'DeepSeek-R1'),

  // Speech to text 
  startRecording: createMultilingualText('开始录音', 'Start recording'),
  stopRecording: createMultilingualText('停止录音', 'Stop recording'),
  recordingInProgress: createMultilingualText('录音中...', 'Recording...'),
  recordingDuration: createMultilingualText('录音时长: ', 'Recording duration: '),
  seconds: createMultilingualText('秒', 'seconds'),
  microphonePermissionDenied: createMultilingualText('需要麦克风权限', 'Microphone permission needed'),
  browserNotSupported: createMultilingualText('您的浏览器不支持语音识别, 请使用 Chrome 浏览器', 'Your browser does not support speech recognition. Please use the Chrome browser.'),
  webSpeechAPIError: createMultilingualText('Web Speech API 通讯错误, 请更换 VPN 或使用 Chrome 浏览器', 'Web Speech API communication error, please change VPN or use the Chrome brower.'),
  genericError: createMultilingualText('发生未知错误, 请稍后再试', 'An unknown error occurred, please try again later'),

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
  networkError: createMultilingualText('网络错误，请稍后再试或使用 VPN', 'Network error, please try again later or use a VPN'),
  apiError: createMultilingualText('服务器错误，请稍后再试', 'Server error, please try again later'),

  // Upload files
  selectFile: createMultilingualText('选择文件', 'Select File'),
  fileDescription: createMultilingualText('文件描述', 'File Description'),
  confirm: createMultilingualText('确认', 'Confirm'),
  cancel: createMultilingualText('取消', 'Cancel'),
  unsupportedFileType: createMultilingualText('不支持的文件类型', 'Unsupported file type'),
  noFileSelected: createMultilingualText('请选择文件', 'Please select a file first'),
  uploadFailed: createMultilingualText('文件上传失败', 'File upload failed'),
  uploading: createMultilingualText('上传中...', 'Uploading...'),
  noDescription: createMultilingualText('(无描述)', '(No description)'),
  inspectionResult: createMultilingualText('检查结果', 'Inspection Result'), 
  scanResult: createMultilingualText('检查结果', 'Scan Result'),
  medicalVolumeData: createMultilingualText('三维医学体数据', '3D Medical Volume Data'),
};
