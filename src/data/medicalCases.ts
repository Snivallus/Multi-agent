
export type DialogueRole = 'doctor' | 'patient';

interface MultilingualText {
  en: string;
  zh: string;
}

export interface DialogueLine {
  role: DialogueRole;
  text: MultilingualText;
}

export interface MedicalCase {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  category: MultilingualText;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: {
    en: string[];
    zh: string[];
  };
  dialogue: DialogueLine[];
}

export const medicalCases: MedicalCase[] = [
  {
    id: "case-001",
    title: {
      en: "Chest Pain Evaluation",
      zh: "胸痛评估"
    },
    description: {
      en: "A 55-year-old male with sudden onset chest pain and shortness of breath",
      zh: "一位55岁男性突发胸痛和呼吸急促"
    },
    category: {
      en: "Cardiology",
      zh: "心脏病学"
    },
    difficulty: "medium",
    tags: {
      en: ["Acute", "Emergency", "Cardiac"],
      zh: ["急性", "急诊", "心脏"]
    },
    dialogue: [
      {
        role: "doctor",
        text: {
          en: "Good morning, I'm Dr. Chen. What brings you in today?",
          zh: "早上好，我是陈医生。今天有什么可以帮到您的？"
        }
      },
      {
        role: "patient",
        text: {
          en: "I've been having this chest pain since yesterday. It's really uncomfortable.",
          zh: "我从昨天开始有胸痛。真的很不舒服。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "I'm sorry to hear that. Can you describe the pain? Is it sharp, dull, or pressure-like?",
          zh: "很遗憾听到这个。能描述一下疼痛感吗？是尖锐的、钝痛的还是压迫感？"
        }
      },
      {
        role: "patient",
        text: {
          en: "It feels like pressure, like someone is sitting on my chest. It started when I was climbing stairs yesterday.",
          zh: "感觉像是压迫感，就像有人坐在我的胸口上。昨天爬楼梯时开始的。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "Does the pain radiate anywhere, like to your arm, jaw, or back?",
          zh: "疼痛会向其他地方扩散吗，比如手臂、下巴或背部？"
        }
      },
      {
        role: "patient",
        text: {
          en: "Yes, sometimes it goes to my left arm and up to my jaw.",
          zh: "是的，有时会扩散到我的左臂和下巴。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "Have you experienced any shortness of breath, nausea, or sweating with this pain?",
          zh: "在疼痛的同时，您有感到呼吸急促、恶心或出汗吗？"
        }
      },
      {
        role: "patient",
        text: {
          en: "I've been a bit short of breath, especially when the pain is bad. And yes, I've felt clammy at times.",
          zh: "我有点呼吸急促，尤其是在疼痛严重时。是的，有时我也感到出冷汗。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "Do you have any history of heart problems or high blood pressure?",
          zh: "您有心脏问题或高血压病史吗？"
        }
      },
      {
        role: "patient",
        text: {
          en: "My doctor told me my blood pressure was a bit high at my last check-up. And my father had a heart attack at 60.",
          zh: "我的医生在上次体检时告诉我血压有点高。我父亲60岁时曾心脏病发作。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "Given your symptoms and risk factors, I'm concerned about a potential cardiac issue. I'd like to perform an ECG and some blood tests right away.",
          zh: "考虑到您的症状和风险因素，我担心可能有心脏问题。我想立即进行心电图检查和一些血液测试。"
        }
      },
      {
        role: "patient",
        text: {
          en: "Do you think it's serious? Should I be worried?",
          zh: "您认为严重吗？我应该担心吗？"
        }
      },
      {
        role: "doctor",
        text: {
          en: "We need to rule out a heart attack, which is why I want to run these tests immediately. It's good that you came in today. We'll start treatment right away if needed.",
          zh: "我们需要排除心脏病发作的可能性，这就是为什么我想立即进行这些检查。您今天来就诊是正确的。如果需要，我们会立即开始治疗。"
        }
      }
    ]
  },
  {
    id: "case-002",
    title: {
      en: "Type 2 Diabetes Initial Diagnosis",
      zh: "2型糖尿病初步诊断"
    },
    description: {
      en: "A 45-year-old female with fatigue, increased thirst, and frequent urination",
      zh: "一位45岁女性出现疲劳、口渴增加和频繁排尿"
    },
    category: {
      en: "Endocrinology",
      zh: "内分泌学"
    },
    difficulty: "easy",
    tags: {
      en: ["Chronic", "Metabolic", "Diagnostic"],
      zh: ["慢性", "代谢", "诊断"]
    },
    dialogue: [
      {
        role: "doctor",
        text: {
          en: "Hello Ms. Johnson, I'm Dr. Park. What seems to be bothering you today?",
          zh: "您好，约翰逊女士，我是朴医生。今天您有什么不舒服的地方？"
        }
      },
      {
        role: "patient",
        text: {
          en: "I've been feeling really tired lately, and I'm drinking water constantly but still feel thirsty.",
          zh: "我最近感到非常疲劳，一直在喝水但仍然感到口渴。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "How long has this been going on?",
          zh: "这种情况持续多久了？"
        }
      },
      {
        role: "patient",
        text: {
          en: "It's been getting worse over the past few months. I'm also using the bathroom all the time, which is disrupting my sleep.",
          zh: "在过去几个月中越来越严重。我也一直上厕所，这扰乱了我的睡眠。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "Have you noticed any weight changes recently?",
          zh: "您最近有注意到体重变化吗？"
        }
      },
      {
        role: "patient",
        text: {
          en: "Now that you mention it, I've lost about 10 pounds without trying.",
          zh: "既然您提到了，我不知不觉地减轻了大约10磅体重。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "Have you experienced any blurred vision or wounds that are slow to heal?",
          zh: "您有经历过视力模糊或伤口愈合缓慢的情况吗？"
        }
      },
      {
        role: "patient",
        text: {
          en: "Yes, my vision seems a bit blurry sometimes. I thought I just needed new glasses.",
          zh: "是的，我的视力有时似乎有点模糊。我以为只是需要换新眼镜。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "Do you have any family history of diabetes?",
          zh: "您家族中有糖尿病病史吗？"
        }
      },
      {
        role: "patient",
        text: {
          en: "Yes, my mother has diabetes and takes pills for it.",
          zh: "是的，我母亲有糖尿病，需要服药治疗。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "Based on your symptoms, I suspect you might have diabetes. I'd like to check your blood sugar now and order some additional lab tests.",
          zh: "根据您的症状，我怀疑您可能患有糖尿病。我想现在检查您的血糖并安排一些额外的实验室检查。"
        }
      },
      {
        role: "patient",
        text: {
          en: "Diabetes? I was afraid of that. What does that mean for me going forward?",
          zh: "糖尿病？我就担心这个。这对我今后意味着什么？"
        }
      },
      {
        role: "doctor",
        text: {
          en: "Let's confirm the diagnosis first. If it is diabetes, we have many effective treatments available. It's a condition we can manage together with medication, lifestyle changes, and regular monitoring.",
          zh: "让我们先确认诊断。如果确实是糖尿病，我们有许多有效的治疗方法。这是一种我们可以通过药物、生活方式改变和定期监测共同管理的疾病。"
        }
      }
    ]
  },
  {
    id: "case-003",
    title: {
      en: "Migraine Assessment",
      zh: "偏头痛评估"
    },
    description: {
      en: "A 32-year-old female with recurrent severe headaches and visual disturbances",
      zh: "一位32岁女性反复出现严重头痛和视觉障碍"
    },
    category: {
      en: "Neurology",
      zh: "神经病学"
    },
    difficulty: "medium",
    tags: {
      en: ["Chronic", "Pain", "Neurological"],
      zh: ["慢性", "疼痛", "神经系统"]
    },
    dialogue: [
      {
        role: "doctor",
        text: {
          en: "Good afternoon, I'm Dr. Lopez. How can I help you today?",
          zh: "下午好，我是洛佩兹医生。今天我能帮您什么？"
        }
      },
      {
        role: "patient",
        text: {
          en: "I've been having these terrible headaches. They're really affecting my work and life.",
          zh: "我一直有这些可怕的头痛。它们真的影响了我的工作和生活。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "I'm sorry to hear that. Can you tell me more about these headaches? Where is the pain located?",
          zh: "很遗憾听到这个。您能告诉我更多关于这些头痛的情况吗？疼痛在哪个位置？"
        }
      },
      {
        role: "patient",
        text: {
          en: "It's usually on one side of my head and feels like throbbing. It can be so bad that I have to lie down in a dark room.",
          zh: "通常在我头部的一侧，感觉像是跳动的疼痛。有时严重到我必须躺在黑暗的房间里。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "Do you notice anything before the headache starts, like visual changes or other sensations?",
          zh: "在头痛开始前，您会注意到任何前兆吗，比如视觉变化或其他感觉？"
        }
      },
      {
        role: "patient",
        text: {
          en: "Sometimes I see zigzag lines or flashing lights about 20 minutes before the pain starts. And certain smells seem very strong.",
          zh: "有时在疼痛开始前约20分钟，我会看到之字形线条或闪光。某些气味似乎变得非常强烈。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "What makes the headache better or worse?",
          zh: "什么会使头痛好转或恶化？"
        }
      },
      {
        role: "patient",
        text: {
          en: "Light and noise definitely make it worse. Lying in a dark, quiet room helps. Sometimes I feel nauseated during the headaches.",
          zh: "光线和噪音肯定会使情况恶化。躺在黑暗、安静的房间里会有所帮助。有时我在头痛期间会感到恶心。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "How long do these headaches typically last?",
          zh: "这些头痛通常持续多长时间？"
        }
      },
      {
        role: "patient",
        text: {
          en: "They can last from a few hours to a full day. I've had to miss work several times.",
          zh: "它们可能持续几个小时到一整天。我已经因此多次请假缺勤。"
        }
      },
      {
        role: "doctor",
        text: {
          en: "Based on what you've described, you appear to be experiencing migraines with aura. The visual symptoms before the headache are quite characteristic.",
          zh: "根据您描述的情况，您似乎正在经历伴有先兆的偏头痛。头痛前的视觉症状相当具有特征性。"
        }
      },
      {
        role: "patient",
        text: {
          en: "Is there a cure for migraines? Or am I just going to have to live with these?",
          zh: "偏头痛有治愈的方法吗？还是我只能忍受这些？"
        }
      },
      {
        role: "doctor",
        text: {
          en: "While there's no cure, we have effective strategies to both prevent migraines and treat them when they occur. Let's discuss triggers you might avoid and some medication options.",
          zh: "虽然没有彻底的治愈方法，但我们有有效的策略来预防偏头痛并在发生时进行治疗。让我们讨论一下您可能需要避免的触发因素和一些药物选择。"
        }
      }
    ]
  }
];
