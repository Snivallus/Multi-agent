
// Define language options supported by the application
export type Language = 'zh' | 'en';

// Define structure for multilingual text elements
export interface MultilingualText {
  zh: string;
  en: string;
}

// Function to get text based on current language
export const getText = (text: MultilingualText, language: Language): string => {
  return text[language];
};

// Create multilingual text object helper
export const createMultilingualText = (zh: string, en: string): MultilingualText => {
  return { zh, en };
};
