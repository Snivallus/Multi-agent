
type Language = 'en' | 'zh';

interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}

export const translations: Translations = {
  // App general
  interactiveMedicalLearning: {
    en: "Interactive Medical Learning",
    zh: "互动医学学习"
  },
  appTitle: {
    en: "Medical Dialogue Diagnostics",
    zh: "医疗对话诊断"
  },
  appDescription: {
    en: "Experience realistic doctor-patient interactions through simulated clinical cases. Learn diagnostic approaches and improve clinical reasoning skills.",
    zh: "通过模拟临床案例体验真实的医患互动。学习诊断方法，提高临床推理能力。"
  },
  selectCaseButton: {
    en: "Select a Case Study",
    zh: "选择案例学习"
  },
  clickToStartHint: {
    en: "Click on a case to start the simulation",
    zh: "点击案例开始模拟"
  },
  toggleLanguage: {
    en: "Switch language",
    zh: "切换语言"
  },

  // Feature cards
  featureClinicalCasesTitle: {
    en: "Clinical Cases",
    zh: "临床案例"
  },
  featureClinicalCasesDesc: {
    en: "Explore a variety of medical scenarios across different specialties, from common presentations to complex diagnoses.",
    zh: "探索各种专业领域的医疗情境，从常见病例到复杂诊断。"
  },
  featureInteractiveTitle: {
    en: "Interactive Dialogue",
    zh: "互动对话"
  },
  featureInteractiveDesc: {
    en: "Experience the natural flow of doctor-patient conversations with realistic clinical discussions.",
    zh: "体验真实临床讨论中医患对话的自然流程。"
  },
  featureLearningTitle: {
    en: "Learning Experience",
    zh: "学习体验"
  },
  featureLearningDesc: {
    en: "Observe diagnostic reasoning and medical decision-making in action through detailed clinical conversations.",
    zh: "通过详细的临床对话观察诊断推理和医疗决策过程。"
  },

  // Case Selection
  selectCase: {
    en: "Select a Case Study",
    zh: "选择案例学习"
  },
  searchCasesPlaceholder: {
    en: "Search cases by title, description, category, or tags...",
    zh: "按标题、描述、类别或标签搜索案例..."
  },
  noCasesFound: {
    en: "No cases found matching your search criteria",
    zh: "未找到符合搜索条件的案例"
  },

  // Dialogue Simulation
  resetDialogue: {
    en: "Reset dialogue",
    zh: "重置对话"
  },
  play: {
    en: "Play",
    zh: "播放"
  },
  pause: {
    en: "Pause",
    zh: "暂停"
  },
  nextDialogue: {
    en: "Next dialogue",
    zh: "下一对话"
  },
  progress: {
    en: "Progress",
    zh: "进度"
  },
  of: {
    en: "of",
    zh: "/"
  }
};
