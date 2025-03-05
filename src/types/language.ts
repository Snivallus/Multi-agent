
// Define language options supported by the application
export type Language = 'en' | 'zh';

// Define structure for multilingual text elements
export interface MultilingualText {
  en: string;
  zh: string;
}

// Function to get text based on current language
export const getText = (text: MultilingualText, language: Language): string => {
  return text[language];
};

// Create multilingual text object helper
export const createMultilingualText = (en: string, zh: string): MultilingualText => {
  return { en, zh };
};
