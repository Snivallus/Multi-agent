import { MultilingualText, createMultilingualText, Language } from '@/types/language';

// Types of speakers in the dialogue
export type DialogueRole = 'doctor' | 'patient' | 'reporter' | 'monitor' | 'summary_doctor';

// Define the structure of a dialogue line
export interface DialogueLine {
  role: DialogueRole;
  text: MultilingualText;
}

// Structure of a medical case
export interface MedicalCase {
  patient_id: string;
  title: MultilingualText;
  description: MultilingualText;
  body_system: MultilingualText;
  tags: {
    en: string[];
    zh: string[];
  };
  accuracy: [number, number]; // accuracy: [correctCount, totalCount]
}