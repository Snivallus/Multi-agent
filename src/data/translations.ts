
import { MultilingualText, createMultilingualText } from '@/types/language';

// UI translations for the entire application
export const translations = {
  // Common UI elements
  toggleLanguage: createMultilingualText('English', '中文'),
  
  // Landing page
  appTitle: createMultilingualText('Medical Multi-Agent Systems', '医学多智能体系统'),
  appDescription: createMultilingualText(
    'A multi-agent framework for integrated multi-modality medical diagnosis',
    '一个用于集成多模态医学诊断的多智能体框架'
  ),
  selectCaseButton: createMultilingualText('Select a Case Study', '选择案例'),
  directInteractionButton: createMultilingualText('Direct Interaction', '直接交互'),
  clickToStartHint: createMultilingualText('Click on a case to start the simulation', '点击案例开始模拟'),
  
  // Direct Interaction
  directInteractionTitle: createMultilingualText('Direct Interaction', '直接交互'),
  typeMessage: createMultilingualText('Type your message here...', '在此输入您的消息...'),
  sendMessage: createMultilingualText('Send Message', '发送消息'),
  waitingForResponse: createMultilingualText('Waiting for response...', '等待回应...'),
  interactiveMedicalLearning: createMultilingualText('Interactive Medical Learning', '交互式医学学习'),
  jumpToPosition: createMultilingualText('Click to jump to this position', '点击跳转到该位置'),
  
  // Case selection
  selectCase: createMultilingualText('Select a Case Study', '选择案例'),
  searchCasesPlaceholder: createMultilingualText(
    'Search cases by title, description, category, or tags...',
    '按标题、描述、类别或标签搜索案例...'
  ),
  noCasesFound: createMultilingualText(
    'No cases found matching your search criteria',
    '未找到匹配您搜索条件的案例'
  ),
  
  // Dialogue simulation
  resetDialogue: createMultilingualText('Reset dialogue', '重置对话'),
  pause: createMultilingualText('Pause', '暂停'),
  play: createMultilingualText('Play', '播放'),
  nextDialogue: createMultilingualText('Next dialogue', '下一段对话'),
  progress: createMultilingualText('Progress', '进度'),
  of: createMultilingualText('of', '共'),
  
  // Difficulty levels
  easy: createMultilingualText('Easy', '简单'),
  medium: createMultilingualText('Medium', '中等'),
  hard: createMultilingualText('Hard', '困难'),
  
  // Roles
  doctor: createMultilingualText('Doctor', '医生'),
  patient: createMultilingualText('Patient', '患者'),
  reporter: createMultilingualText('Reporter', '检查员'),
};
