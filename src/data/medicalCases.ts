
import { MultilingualText, createMultilingualText, Language } from '@/types/language';

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
  dialogueLanguage?: Language; // Optional property to specify which language the dialogue is in
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
    dialogueLanguage: 'en',
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
    dialogueLanguage: 'en',
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
    dialogueLanguage: 'en',
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
  },
  // Add Chinese dialogue cases
  {
    id: 'case-1-zh',
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
    dialogueLanguage: 'zh',
    dialogue: [
      {
        role: 'doctor',
        text: '早上好，我是张医生。今天有什么可以帮您的？'
      },
      {
        role: 'patient',
        text: '我胸口疼了大约两个小时了，疼得很厉害。'
      },
      {
        role: 'doctor',
        text: '很抱歉听到这个。您能描述一下这种疼痛吗？是尖锐的、钝痛的、压迫性的还是灼烧感？'
      },
      {
        role: 'patient',
        text: '感觉像是有重压，有点像被挤压一样。而且疼痛还延伸到我的左臂。'
      },
      {
        role: 'doctor',
        text: '这种疼痛是什么时候开始的？当时您在做什么？'
      },
      {
        role: 'patient',
        text: '是在我爬楼梯回公寓的时候开始的。我当时提着杂货，突然感到胸口有压力。'
      },
      {
        role: 'doctor',
        text: '疼痛的同时，您有没有出现呼吸急促、出汗、恶心或头晕的症状？'
      },
      {
        role: 'patient',
        text: '是的，我出汗很多，也感觉有点呼吸困难。但没有恶心。'
      },
      {
        role: 'doctor',
        text: '您有心脏问题的病史吗？或者您的家族中有人患有心脏病吗？'
      },
      {
        role: 'patient',
        text: '我父亲在60岁时曾心脏病发作。我自己有高血压大约10年了。'
      }
    ]
  },
  {
    id: 'case-2-zh',
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
    dialogueLanguage: 'zh',
    dialogue: [
      {
        role: 'doctor',
        text: '您好，我是李医生。今天怎么了？'
      },
      {
        role: 'patient',
        text: '我这三周来几乎每天都有头痛。'
      },
      {
        role: 'doctor',
        text: '很遗憾听到这个。您能描述一下这些头痛吗？疼痛主要在哪个位置？'
      },
      {
        role: 'patient',
        text: '通常在头的两侧，像是一个紧箍。有时右侧更严重。'
      },
      {
        role: 'doctor',
        text: '如果以1到10分来评估，10分代表您能想象的最严重的疼痛，您会给这些头痛打几分？'
      },
      {
        role: 'patient',
        text: '通常大约6分，但有时会达到8分，尤其是工作日结束时。'
      },
      {
        role: 'doctor',
        text: '您注意到有什么会引发头痛或使头痛加重的因素吗？'
      },
      {
        role: 'patient',
        text: '当我压力大或长时间盯着电脑屏幕时肯定会更严重。如果睡眠不足也会很糟糕。'
      },
      {
        role: 'doctor',
        text: '您头痛时有没有其他症状，比如视觉变化、恶心或对光声敏感？'
      },
      {
        role: 'patient',
        text: '头痛时强光确实会让我不舒服。有时候我会感到轻微恶心，但没有呕吐。'
      },
      {
        role: 'doctor',
        text: '您尝试过任何药物或治疗方法吗？'
      },
      {
        role: 'patient',
        text: '我一直在服用非处方止痛药，如布洛芬。它们有一点帮助，但头痛仍然会反复发作。'
      }
    ]
  },
  {
    id: 'case-3-zh',
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
    dialogueLanguage: 'zh',
    dialogue: [
      {
        role: 'doctor',
        text: '下午好，王先生。我了解到您是因为足部伤口来就诊？'
      },
      {
        role: 'patient',
        text: '是的，医生。我右脚底有个溃疡，一直不愈合。已经有将近一个月了。'
      },
      {
        role: 'doctor',
        text: '让我看一下。您是怎么发现这个伤口的？'
      },
      {
        role: 'patient',
        text: '我女儿注意到我有点跛行。当她检查我的脚时，发现了这个溃疡。我自己感觉不到。'
      },
      {
        role: 'doctor',
        text: '您感觉不到吗？您的脚经常有麻木或刺痛感吗？'
      },
      {
        role: 'patient',
        text: '是的，已经有几年了。我的医生说这是因为我的糖尿病。'
      },
      {
        role: 'doctor',
        text: '没错，这是一种叫做糖尿病神经病变的症状。作为糖尿病护理的一部分，您有定期检查脚部吗？'
      },
      {
        role: 'patient',
        text: '我尽量做到，但我很难看到自己的脚底，而且我大部分时间是独自生活。'
      },
      {
        role: 'doctor',
        text: '我理解。最近您的糖尿病控制得如何？您知道最近一次的糖化血红蛋白水平是多少吗？'
      },
      {
        role: 'patient',
        text: '在上次检查时是9.2%。我的医生对此不太满意。'
      },
      {
        role: 'doctor',
        text: '您有没有注意到伤口有渗出液、周围温度升高或发红？'
      },
      {
        role: 'patient',
        text: '这几天有一些黄色的液体从伤口流出，周围区域看起来有点发红。'
      },
      {
        role: 'doctor',
        text: '有发烧或寒战吗？'
      },
      {
        role: 'patient',
        text: '昨晚我确实感到发热，而且比平时更疲倦。'
      }
    ]
  }
];
