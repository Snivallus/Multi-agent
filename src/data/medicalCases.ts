
import { MultilingualText, createMultilingualText } from '@/types/language';

// Define the structure of a dialogue line
export interface DialogueLine {
  role: DialogueRole;
  text: string;
}

// Types of speakers in the dialogue
export type DialogueRole = 'doctor' | 'patient';

// Difficulty levels for cases
export type CaseDifficulty = 'easy' | 'medium' | 'hard';

// Structure of a medical case
export interface MedicalCase {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  category: MultilingualText;
  difficulty: CaseDifficulty;
  tags: {
    en: string[];
    zh: string[];
  };
  dialogue: DialogueLine[];
}

// Collection of medical cases
export const medicalCases: MedicalCase[] = [
  {
    id: 'case-1',
    title: createMultilingualText(
      'Chest Pain Evaluation',
      '胸痛评估'
    ),
    description: createMultilingualText(
      'A 55-year-old male presents with acute chest pain radiating to the left arm.',
      '一名55岁男性患者出现急性胸痛，疼痛向左臂放射。'
    ),
    category: createMultilingualText('Cardiology', '心脏病学'),
    difficulty: 'medium',
    tags: {
      en: ['Chest Pain', 'Cardiology', 'Emergency'],
      zh: ['胸痛', '心脏病学', '急诊']
    },
    dialogue: [
      {
        role: 'doctor',
        text: 'Good morning, I\'m Dr. Johnson. What brings you in today?'
      },
      {
        role: 'patient',
        text: 'I\'ve been having this chest pain for about 2 hours now. It\'s pretty bad.'
      },
      {
        role: 'doctor',
        text: 'I\'m sorry to hear that. Can you describe the pain for me? Is it sharp, dull, crushing, or burning?'
      },
      {
        role: 'patient',
        text: 'It\'s like a heavy pressure, kind of squeezing. And it goes down my left arm too.'
      },
      {
        role: 'doctor',
        text: 'And when did this start? Were you doing anything in particular?'
      },
      {
        role: 'patient',
        text: 'It started when I was climbing the stairs to my apartment. I was carrying groceries and suddenly felt this pressure in my chest.'
      },
      {
        role: 'doctor',
        text: 'Have you had any shortness of breath, sweating, nausea, or lightheadedness with this pain?'
      },
      {
        role: 'patient',
        text: 'Yes, I\'ve been sweating a lot, and I do feel a bit short of breath. No nausea though.'
      },
      {
        role: 'doctor',
        text: 'Do you have any history of heart problems? Or does anyone in your family have heart disease?'
      },
      {
        role: 'patient',
        text: 'My father had a heart attack when he was 60. I\'ve had high blood pressure for about 10 years now.'
      }
    ]
  },
  {
    id: 'case-2',
    title: createMultilingualText(
      'Persistent Headache',
      '持续性头痛'
    ),
    description: createMultilingualText(
      'A 35-year-old female with recurring headaches for the past three weeks.',
      '一名35岁女性患者在过去三周内反复出现头痛。'
    ),
    category: createMultilingualText('Neurology', '神经病学'),
    difficulty: 'easy',
    tags: {
      en: ['Headache', 'Neurology', 'Chronic Pain'],
      zh: ['头痛', '神经病学', '慢性疼痛']
    },
    dialogue: [
      {
        role: 'doctor',
        text: 'Hello, I\'m Dr. Chen. What seems to be the problem today?'
      },
      {
        role: 'patient',
        text: 'I\'ve been having these headaches almost every day for about three weeks now.'
      },
      {
        role: 'doctor',
        text: 'I\'m sorry to hear that. Can you describe the headaches? Where is the pain located?'
      },
      {
        role: 'patient',
        text: 'It\'s usually on both sides of my head, like a tight band. Sometimes it\'s worse on the right.'
      },
      {
        role: 'doctor',
        text: 'On a scale of 1 to 10, with 10 being the worst pain imaginable, how would you rate these headaches?'
      },
      {
        role: 'patient',
        text: 'Usually around a 6, but sometimes they get up to an 8, especially by the end of the workday.'
      },
      {
        role: 'doctor',
        text: 'Do you notice anything that triggers the headaches or makes them worse?'
      },
      {
        role: 'patient',
        text: 'They\'re definitely worse when I\'m stressed or when I\'ve been staring at my computer for a long time. They\'re also bad if I don\'t get enough sleep.'
      },
      {
        role: 'doctor',
        text: 'Have you experienced any other symptoms with the headaches, like visual changes, nausea, or sensitivity to light or sound?'
      },
      {
        role: 'patient',
        text: 'Bright lights do bother me when I have a headache. And sometimes I feel a little nauseous, but I haven\'t thrown up or anything.'
      },
      {
        role: 'doctor',
        text: 'Have you tried any medications or treatments for the headaches?'
      },
      {
        role: 'patient',
        text: 'I\'ve been taking over-the-counter painkillers like ibuprofen. They help a little, but the headaches still come back.'
      }
    ]
  },
  {
    id: 'case-3',
    title: createMultilingualText(
      'Diabetic Foot Ulcer',
      '糖尿病足溃疡'
    ),
    description: createMultilingualText(
      'A 68-year-old with type 2 diabetes presents with a non-healing wound on the foot.',
      '一名68岁的2型糖尿病患者出现足部不愈合的伤口。'
    ),
    category: createMultilingualText('Endocrinology', '内分泌学'),
    difficulty: 'hard',
    tags: {
      en: ['Diabetes', 'Wound Care', 'Chronic Disease Management'],
      zh: ['糖尿病', '伤口护理', '慢性疾病管理']
    },
    dialogue: [
      {
        role: 'doctor',
        text: 'Good afternoon, Mr. Garcia. I understand you\'re here about a wound on your foot?'
      },
      {
        role: 'patient',
        text: 'Yes, doctor. I have this sore on the bottom of my right foot that just won\'t heal. It\'s been there for almost a month now.'
      },
      {
        role: 'doctor',
        text: 'Let me take a look. How did you first notice it?'
      },
      {
        role: 'patient',
        text: 'My daughter noticed I was limping a bit. When she checked my feet, she found the sore. I couldn\'t feel it myself.'
      },
      {
        role: 'doctor',
        text: 'You couldn\'t feel it? Do you often have numbness or tingling in your feet?'
      },
      {
        role: 'patient',
        text: 'Yes, for a few years now. My doctor told me it\'s because of my diabetes.'
      },
      {
        role: 'doctor',
        text: 'That\'s correct. It\'s a condition called diabetic neuropathy. Have you been checking your feet regularly as part of your diabetes care?'
      },
      {
        role: 'patient',
        text: 'I try to, but it\'s hard for me to see the bottoms of my feet, and I live alone most of the time.'
      },
      {
        role: 'doctor',
        text: 'I understand. How well controlled has your diabetes been recently? Do you know what your last HbA1c level was?'
      },
      {
        role: 'patient',
        text: 'It was 9.2% at my last check-up. My doctor wasn\'t happy about it.'
      },
      {
        role: 'doctor',
        text: 'Have you noticed any drainage, increased warmth, or redness around the wound?'
      },
      {
        role: 'patient',
        text: 'There\'s been some yellowish fluid coming from it the last few days, and the area around it looks a bit red.'
      },
      {
        role: 'doctor',
        text: 'Any fever or chills?'
      },
      {
        role: 'patient',
        text: 'I did feel feverish last night, and I\'ve been more tired than usual.'
      }
    ]
  }
];
