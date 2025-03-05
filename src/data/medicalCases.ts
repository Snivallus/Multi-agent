
export type DialogueRole = 'doctor' | 'patient';

export interface DialogueLine {
  role: DialogueRole;
  text: string;
}

export interface MedicalCase {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  dialogue: DialogueLine[];
}

export const medicalCases: MedicalCase[] = [
  {
    id: "case-001",
    title: "Chest Pain Evaluation",
    description: "A 55-year-old male with sudden onset chest pain and shortness of breath",
    category: "Cardiology",
    difficulty: "medium",
    tags: ["Acute", "Emergency", "Cardiac"],
    dialogue: [
      {
        role: "doctor",
        text: "Good morning, I'm Dr. Chen. What brings you in today?"
      },
      {
        role: "patient",
        text: "I've been having this chest pain since yesterday. It's really uncomfortable."
      },
      {
        role: "doctor",
        text: "I'm sorry to hear that. Can you describe the pain? Is it sharp, dull, or pressure-like?"
      },
      {
        role: "patient",
        text: "It feels like pressure, like someone is sitting on my chest. It started when I was climbing stairs yesterday."
      },
      {
        role: "doctor",
        text: "Does the pain radiate anywhere, like to your arm, jaw, or back?"
      },
      {
        role: "patient",
        text: "Yes, sometimes it goes to my left arm and up to my jaw."
      },
      {
        role: "doctor",
        text: "Have you experienced any shortness of breath, nausea, or sweating with this pain?"
      },
      {
        role: "patient",
        text: "I've been a bit short of breath, especially when the pain is bad. And yes, I've felt clammy at times."
      },
      {
        role: "doctor",
        text: "Do you have any history of heart problems or high blood pressure?"
      },
      {
        role: "patient",
        text: "My doctor told me my blood pressure was a bit high at my last check-up. And my father had a heart attack at 60."
      },
      {
        role: "doctor",
        text: "Given your symptoms and risk factors, I'm concerned about a potential cardiac issue. I'd like to perform an ECG and some blood tests right away."
      },
      {
        role: "patient",
        text: "Do you think it's serious? Should I be worried?"
      },
      {
        role: "doctor",
        text: "We need to rule out a heart attack, which is why I want to run these tests immediately. It's good that you came in today. We'll start treatment right away if needed."
      }
    ]
  },
  {
    id: "case-002",
    title: "Type 2 Diabetes Initial Diagnosis",
    description: "A 45-year-old female with fatigue, increased thirst, and frequent urination",
    category: "Endocrinology",
    difficulty: "easy",
    tags: ["Chronic", "Metabolic", "Diagnostic"],
    dialogue: [
      {
        role: "doctor",
        text: "Hello Ms. Johnson, I'm Dr. Park. What seems to be bothering you today?"
      },
      {
        role: "patient",
        text: "I've been feeling really tired lately, and I'm drinking water constantly but still feel thirsty."
      },
      {
        role: "doctor",
        text: "How long has this been going on?"
      },
      {
        role: "patient",
        text: "It's been getting worse over the past few months. I'm also using the bathroom all the time, which is disrupting my sleep."
      },
      {
        role: "doctor",
        text: "Have you noticed any weight changes recently?"
      },
      {
        role: "patient",
        text: "Now that you mention it, I've lost about 10 pounds without trying."
      },
      {
        role: "doctor",
        text: "Have you experienced any blurred vision or wounds that are slow to heal?"
      },
      {
        role: "patient",
        text: "Yes, my vision seems a bit blurry sometimes. I thought I just needed new glasses."
      },
      {
        role: "doctor",
        text: "Do you have any family history of diabetes?"
      },
      {
        role: "patient",
        text: "Yes, my mother has diabetes and takes pills for it."
      },
      {
        role: "doctor",
        text: "Based on your symptoms, I suspect you might have diabetes. I'd like to check your blood sugar now and order some additional lab tests."
      },
      {
        role: "patient",
        text: "Diabetes? I was afraid of that. What does that mean for me going forward?"
      },
      {
        role: "doctor",
        text: "Let's confirm the diagnosis first. If it is diabetes, we have many effective treatments available. It's a condition we can manage together with medication, lifestyle changes, and regular monitoring."
      }
    ]
  },
  {
    id: "case-003",
    title: "Migraine Assessment",
    description: "A 32-year-old female with recurrent severe headaches and visual disturbances",
    category: "Neurology",
    difficulty: "medium",
    tags: ["Chronic", "Pain", "Neurological"],
    dialogue: [
      {
        role: "doctor",
        text: "Good afternoon, I'm Dr. Lopez. How can I help you today?"
      },
      {
        role: "patient",
        text: "I've been having these terrible headaches. They're really affecting my work and life."
      },
      {
        role: "doctor",
        text: "I'm sorry to hear that. Can you tell me more about these headaches? Where is the pain located?"
      },
      {
        role: "patient",
        text: "It's usually on one side of my head and feels like throbbing. It can be so bad that I have to lie down in a dark room."
      },
      {
        role: "doctor",
        text: "Do you notice anything before the headache starts, like visual changes or other sensations?"
      },
      {
        role: "patient",
        text: "Sometimes I see zigzag lines or flashing lights about 20 minutes before the pain starts. And certain smells seem very strong."
      },
      {
        role: "doctor",
        text: "What makes the headache better or worse?"
      },
      {
        role: "patient",
        text: "Light and noise definitely make it worse. Lying in a dark, quiet room helps. Sometimes I feel nauseated during the headaches."
      },
      {
        role: "doctor",
        text: "How long do these headaches typically last?"
      },
      {
        role: "patient",
        text: "They can last from a few hours to a full day. I've had to miss work several times."
      },
      {
        role: "doctor",
        text: "Based on what you've described, you appear to be experiencing migraines with aura. The visual symptoms before the headache are quite characteristic."
      },
      {
        role: "patient",
        text: "Is there a cure for migraines? Or am I just going to have to live with these?"
      },
      {
        role: "doctor",
        text: "While there's no cure, we have effective strategies to both prevent migraines and treat them when they occur. Let's discuss triggers you might avoid and some medication options."
      }
    ]
  }
];
