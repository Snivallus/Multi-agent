import { MultilingualText, createMultilingualText, Language } from '@/types/language';

// Define the structure of a dialogue line
export interface DialogueLine {
  role: DialogueRole;
  text: MultilingualText;
}

// Types of speakers in the dialogue
export type DialogueRole = 'doctor' | 'patient' | 'reporter';

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
      'Right Knee Injury',
      '右膝盖受伤'
    ),
    description: createMultilingualText(
      'A patient presents with a swollen and painful right knee after a fall.',
      '患者摔倒后右膝盖肿胀和疼痛。'
    ),
    category: createMultilingualText('Orthopedics', '骨科'),
    difficulty: 'easy',
    tags: {
      en: ['Knee Injury', 'Orthopedics', 'Fall'],
      zh: ['膝盖受伤', '骨科', '摔倒']
    },
    dialogueLanguage: 'zh',
    dialogue: [
      {
        role: 'doctor',
        text: createMultilingualText(
          'Hello, what seems to be the problem?',
          '您好，有哪里不舒服？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'Hello, I fell at home a few days ago. Since then, my right knee has been swollen, extremely painful, and I can’t move my leg properly.',
          '您好，我前几天在家里摔了一跤，从那以后我的右膝盖就肿起来了，疼得厉害，腿也不好使了。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Can you describe how you fell? For example, how did it happen? Did you feel immediate knee pain or difficulty moving it afterward?',
          '您能描述一下摔倒的情况吗？比如是怎么摔的，当时有没有立即感觉到膝盖疼痛或者不能活动？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'I was working in the yard when I accidentally stepped on a stone and lost my balance. I landed directly on my knee, and the pain was unbearable right away. I then noticed the swelling and inability to move my leg.',
          '就是那天我在院子里干活，不小心踩到了块石头，整个人就摔倒了。当时膝盖着地，立马就疼得不行，然后我就发现膝盖肿了，腿也动不了了。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'How many days have passed since the fall? Has the swelling or pain changed—has it worsened or improved?',
          '从摔倒到现在已经过去了几天？期间膝盖的肿胀和疼痛有没有变化？比如是更严重了还是有所缓解？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'It has been three days since the fall. The swelling has persisted, and the pain is getting worse, especially at night—I can’t sleep well. My leg is still immobile, and even the slightest touch is excruciating.',
          '从摔倒到现在已经三天了。这三天膝盖一直很肿，疼得也越来越厉害，特别是晚上疼得我睡不好觉。腿还是动不了，一碰就疼得钻心。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Have you ever had an injury or similar symptoms in your knee before? Do you have any long-term health conditions such as diabetes or hypertension?\n\nIn the meantime, please rest and avoid putting weight on the injured leg as much as possible. If the pain is unbearable, you can use an ice pack temporarily to reduce swelling and pain, but do not apply it for more than 20 minutes at a time and wait at least an hour before the next application. However, this is just a temporary measure; we still need to assess your condition further.',
          '之前您的膝盖有没有受过伤或者有过类似的症状？您是否有其他长期的健康问题，比如糖尿病、高血压等？\n\n同时，请注意保持休息，尽量避免用受伤的腿承重。如果疼痛难以忍受，可以暂时使用冰敷减轻肿胀和疼痛，但每次不要超过20分钟，并且要间隔至少一小时以上再进行下一次冰敷。不过这只是临时措施，我们还需要进一步了解情况。'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'I had issues with my right knee before. In 2014, I had a joint replacement surgery due to osteoarthritis. After the surgery, it has been fine. Other than that, my overall health is good—I don’t have diabetes or hypertension.\n\nAlright, I understand. I will avoid using the injured leg and try icing it. Thank you for the reminder, doctor.',
          '之前我的右膝盖有过问题，2014年的时候因为骨性关节炎做过关节置换手术，手术之后一直挺好的。除了这个，我身体一向挺好的，没有糖尿病、高血压这些病。\n\n好的，我记住了，会尽量不用受伤的腿，也会试试冰敷。谢谢医生提醒。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'I see, so you had a right knee joint replacement surgery in 2014. How was your recovery from that surgery? Did you fully recover without any complications?\n\nAlso, please continue to monitor your knee and seek medical attention as soon as possible for a professional evaluation and treatment. If the pain worsens or if you develop other symptoms like fever, please go to the hospital immediately.',
          '了解了，您2014年进行过右膝关节置换手术。那么请问那次手术后恢复情况如何？是否完全康复并且没有出现过并发症？\n\n另外，请继续关注膝盖的情况，并尽快就医以便得到专业的评估和治疗。如果疼痛加剧或出现其他异常症状（如发热），请立即前往医院就诊。'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
            'After that surgery, my recovery went well. The doctor said I was recovering nicely, and I never had any issues afterward. My knee had always been fine until this fall.\n\nAlright, I will be careful. If things get worse, I will go to the hospital immediately. Thank you, doctor.',
            '那次手术后恢复得挺好的，医生说我恢复得不错，之后一直没出过什么问题，膝盖也一直挺正常的，直到这次摔倒。\n\n好的，我会注意的。如果情况变坏了，我会马上来医院的。谢谢医生。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
            'After understanding your situation, I recommend you go to the hospital as soon as possible for the following tests:\n1. **X-ray examination**: To assess whether there is a fracture or issues with the joint replacement.\n2. **MRI scan**: A more detailed examination of soft tissues (such as ligaments and tendons) to rule out new injuries.\n\nPlease bring the results back to me after completing these tests, and I will provide a specific diagnosis and treatment plan accordingly. In the meantime, please continue resting, avoid bearing weight, and apply ice packs to relieve pain and swelling. If the pain is unbearable, you may take over-the-counter painkillers like ibuprofen, but please follow the instructions or consult a pharmacist.',
            '了解了您的情况后，我建议您尽快去医院进行以下检查：\n1. **X光检查**：以评估是否有骨折或关节置换部位的问题。\n2. **MRI检查**：进一步详细查看软组织（如韧带、肌腱）的情况，排除是否有新的损伤。\n\n请您完成这些检查后，带着结果再来找我，我会根据检查结果给出具体的诊断和治疗方案。在此期间，请继续保持休息，避免负重，并可以继续使用冰敷缓解疼痛和肿胀。如果疼痛难以忍受，可以适量服用非处方止痛药，如布洛芬，但请按照说明书或药师的建议使用。'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
            'Hello, I need to get an X-ray and an MRI scan. Could you tell me the results?\n\nDoctor, I just had my X-ray and MRI scan done. The examiner said the X-ray showed a supracondylar fracture of the right femur, and the MRI confirmed the fracture and found some swelling and damage to the surrounding soft tissue. I have brought the results here for you to see.',
            '您好，我需要做X光检查和MRI检查，能否告诉我这些检查结果？\n\n医生，我刚才去做了X光和MRI检查。检查员说X光显示右股骨髁上骨折，MRI也确认了骨折，并且发现关节周围软组织有些肿胀和损伤。我现在把结果带来了，您看看。'
        )
      },
      {
        role: 'reporter',
        text: createMultilingualText(
            '#Examinations#\n- X-ray: No abnormalities\n- MRI: No abnormalities\n\n#Imaging Findings#\n- DR: Post right knee joint replacement, supracondylar fracture of the right femur, malalignment.',
            '#检查项目#\n- X光检查: 无异常\n- MRI检查: 无异常\n\n#影像学检查#\n- DR: 右膝关节置换术后，右股骨髁上骨折，对位不良。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
            'Based on your examination results, both the X-ray and MRI did not show any significant abnormalities, but the DR (digital radiography) indicates a supracondylar fracture of the right femur with malalignment.\n\n### Diagnosis\n- **Supracondylar fracture of the right femur**: Malalignment\n\n### Diagnostic Basis\n- Your chief complaint: Swollen, painful right knee with restricted movement after a fall.\n- Medical history: Right knee joint replacement surgery in 2014.\n- Imaging findings: DR shows a supracondylar fracture of the right femur with malalignment.\n\n### Treatment Plan\n1. **Fracture Reduction**: Since the fracture is misaligned, surgical reduction is recommended as soon as possible to ensure proper healing. The specific surgical method, such as internal fixation, will be determined by the orthopedic specialist.\n2. **Postoperative Rehabilitation**:\n   - **Immobilization and Rest**: Post-surgery, a cast or brace may be needed for a certain period, as determined by the doctor.\n   - **Physical Therapy**: Under medical supervision, appropriate physical therapy can aid in restoring joint function and muscle strength.\n   - **Medication**: Pain relievers and anti-inflammatory drugs can be used as needed to manage pain and inflammation.\n3. **Regular Follow-ups**: Postoperative check-ups will be necessary to monitor fracture healing and adjust the treatment plan accordingly.\n\nPlease contact an orthopedic doctor as soon as possible to arrange surgery and follow the prescribed treatment and rehabilitation plan. If you have any questions or notice any changes in your symptoms, consult a doctor immediately. Wishing you a speedy recovery!',
            '根据您的检查结果，X光和MRI检查均未发现明显的异常，但DR（数字X线摄影）显示右股骨髁上骨折，并且对位不良。\n\n### 诊断结果\n- **右股骨髁上骨折**：对位不良\n\n### 诊断依据\n- 您的主诉：摔倒后右膝盖肿胀、疼痛，活动受限。\n- 既往史：2014年右膝关节置换手术史。\n- 影像学检查：DR显示右股骨髁上骨折，对位不良。\n\n### 治疗方案\n1. **复位治疗**：由于骨折对位不良，建议尽快进行手术复位，以确保骨折部位正确愈合。手术方式可能包括内固定术，具体由骨科医生根据实际情况决定。\n2. **术后康复**：\n   - **固定与休息**：术后需要使用石膏或支具固定一段时间，具体时间由医生决定。\n   - **物理治疗**：在医生指导下进行适当的物理治疗，帮助恢复关节功能和肌肉力量。\n   - **药物治疗**：根据需要使用止痛药和抗炎药，减轻疼痛和炎症。\n3. **定期复查**：术后定期复查，监测骨折愈合情况，及时调整治疗方案。\n\n请您尽快联系骨科医生安排手术，并按照医生的指导进行后续治疗和康复。如果有任何疑问或症状变化，请随时就医咨询。祝您早日康复！'
        )
      }
    ]
  },
  {
    id: 'case-2',
    title: createMultilingualText(
      'Acute Liver Injury',
      '急性肝损伤'
    ),
    description: createMultilingualText(
      'A patient presents with fatigue, dark urine, and reduced urine output over the past five days.',
      '患者过去五天出现疲劳、尿色变深和尿量减少。'
    ),
    category: createMultilingualText('Hepatology', '肝病学'),
    difficulty: 'medium',
    tags: {
      en: ['Liver Injury', 'Hepatology', 'Fatigue'],
      zh: ['肝损伤', '肝病学', '疲劳']
    },
    dialogueLanguage: 'zh',
    dialogue: 
    [
      {
        role: 'doctor',
        text: createMultilingualText(
          'Hello, what seems to be the problem?',
          '您好，有哪里不舒服？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'Doctor, I have been feeling very tired for the past five days. My urine has turned very yellow, and I urinate less frequently. I feel weak when doing things, but my appetite is fine. I went to the hospital a few days ago, and the doctor said it might be a liver problem.',
          '医生，我这五天感觉特别累，尿的颜色也变得很黄，尿的次数也少了。做点事就觉得没劲，但是吃饭还行。前两天去医院，医生说可能是肝出了问题。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'You mentioned that the symptoms started five days ago. Besides fatigue, dark urine, and reduced urine output, do you have any other discomforts, such as abdominal pain, nausea, or yellowing of the skin and eyes?',
          '你提到的症状是从五天前开始出现的吗？除了疲劳、尿色变黄以及尿量减少外，还有其他不适吗，比如腹痛、恶心或皮肤眼睛发黄等？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'Yes, the symptoms started five days ago. Besides feeling tired, having dark urine, and urinating less, I don’t have abdominal pain, nausea, or yellowing of the skin and eyes.',
          '是的，症状是从五天前开始的。除了累、尿黄和尿少，我没有腹痛、恶心，皮肤和眼睛好像也没有发黄。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Before the symptoms appeared, did you have any unclean food, alcohol, or take any medication? Also, do you have a lot of work or life stress?',
          '在症状出现之前，你是否有过不洁饮食、饮酒或者服用过什么药物？还有，你的工作或生活压力大不大？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'Before the symptoms appeared, I didn’t eat anything unclean or drink alcohol. Sometimes I take "painkillers" to relieve headaches. Recently, I haven’t been working, and my life has been a bit irregular, with little attention to health.',
          '症状出现前，我没有吃不干净的东西，也没喝酒。我有时候会吃“去痛片”来缓解头痛。最近没有工作，生活上有些不规律，对健康关注不多。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'You mentioned "painkillers." Can you tell me the specific name of the medication? Also, do you take this medication regularly or occasionally? Have you ever had hepatitis, cholecystitis, or other liver-related diseases?',
          '你提到的“去痛片”，能告诉我具体的药品名称吗？还有，这种药物你是长期服用还是偶尔使用呢？以前有过肝炎、胆囊炎或其他肝脏相关疾病的历史吗？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'The "painkiller" is compound paracetamol tablets, and I take it occasionally for headaches. I have never had hepatitis, cholecystitis, or other liver-related diseases.',
          '“去痛片”是复方对乙酰氨基酚片，我头痛时偶尔会用。以前没有得过肝炎、胆囊炎或者其他肝脏相关的疾病。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Besides the symptoms mentioned, do you have any other system discomforts, such as difficulty breathing, coughing (respiratory system), palpitations, or chest tightness (cardiovascular system)? How are your lifestyle habits? Do you smoke or drink alcohol? How is your sleep quality?',
          '除了上述提到的症状外，你是否还有其他系统的不适？比如呼吸困难、咳嗽（呼吸系统），心慌、胸闷（心血管系统）等？平时你的生活习惯如何？是否有吸烟、饮酒的习惯？睡眠质量怎么样？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'I don’t have difficulty breathing, coughing, palpitations, or chest tightness. I don’t smoke, occasionally drink alcohol, and my sleep quality is not good—I often don’t sleep deeply.',
          '没有呼吸困难、咳嗽，也没有心慌、胸闷。我不吸烟，偶尔喝点酒，睡眠质量不太好，经常睡不深。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Do any of your immediate family members have liver disease or other chronic diseases? Based on the information provided, considering your symptoms of fatigue, dark urine, and reduced urine output, and the previous doctor’s suspicion of a liver problem, we need to further understand if there is a family genetic background affecting liver health. I recommend the following tests: 1. Liver function test; 2. Urinalysis; 3. Complete blood count; 4. Abdominal ultrasound. Please complete these tests and provide the results for a more accurate assessment of your condition.',
          '你的直系亲属中有人患有肝病或者其他慢性疾病吗？根据目前提供的信息，考虑到你出现的疲劳、尿色深以及尿量减少的症状，并且之前医生怀疑可能是肝脏问题，我们需要进一步了解是否有家族遗传背景对肝脏健康的影响。建议您进行以下几项检查：1. 肝功能检测；2. 尿常规；3. 血常规；4. 腹部B超。请完成这些检查后将结果反馈给我，以便于更准确地判断您的情况。'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'No one in my family has had liver disease or other chronic diseases. Hello, I need to do liver function tests, urinalysis, complete blood count, and abdominal ultrasound. Can you tell me the results? Doctor, the test results are out. The liver function test shows elevated ALT and AST, the urinalysis shows positive urine bilirubin, the complete blood count shows normal white blood cell count, and the abdominal ultrasound shows slightly enlarged liver with enhanced echo.',
          '我家里没有人得过肝病或者其他慢性疾病。您好，我需要做肝功能检测、尿常规、血常规和腹部B超，能否告诉我这些检查结果？医生，检查结果出来了。肝功能检测显示ALT和AST升高，尿常规显示尿胆红素阳性，血常规中白细胞计数正常，腹部B超显示肝脏体积稍大，回声增强。'
        )
      },
      {
        role: 'reporter',
        text: createMultilingualText(
          '#Examinations#\n- Liver function test:\n  - Serum alanine aminotransferase (ALT): 297U/L\n  - Serum aspartate aminotransferase (AST): 83U/L\n  - Total bilirubin (TBIL): 34.4μmol/L\n  - Serum gamma-glutamyl transferase (GGT): 243.00IU/L\n  - Serum direct bilirubin (DBIL): 7.24μmol/L\n  - Serum total protein (TP): 68.20g/L\n  - Serum albumin (ALB): 40.10g/L\n- Urinalysis: No abnormalities\n- Complete blood count:\n  - White blood cells (WBC): 4.77×10^9/L\n  - Neutrophil count (NEU#): 3.04×10^9/L\n  - Hemoglobin (HGB): 112g/L\n- Abdominal ultrasound: No abnormalities',
          '#检查项目#\n- 肝功能检测:\n  - 血清丙氨酸氨基转移酶(ALT): 297U/L\n  - 血清天门冬氨酸氨基转移酶(AST): 83U/L\n  - 总胆红素(TBIL): 34.4μmol/L\n  - 血清γ-谷氨酰基转移酶(GGT): 243.00IU/L\n  - 血清直接胆红素(DBIL): 7.24μmol/L\n  - 血清总蛋白(TP): 68.20g/L\n  - 血清白蛋白(ALB): 40.10g/L\n- 尿常规: 无异常\n- 血常规:\n  - 白细胞(WBC): 4.77×10^9/L\n  - 中性粒细胞数(NEU#): 3.04×10^9/L\n  - 血红蛋白(HGB): 112g/L\n- 腹部B超: 无异常'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Based on your test results, your liver function test shows significantly elevated serum alanine aminotransferase (ALT), aspartate aminotransferase (AST), and gamma-glutamyl transferase (GGT) levels, indicating acute liver injury. Meanwhile, total bilirubin (TBIL) is slightly elevated, but direct bilirubin (DBIL) is within the normal range, possibly related to liver metabolism. The complete blood count shows slightly low hemoglobin, suggesting mild anemia. Diagnosis: Acute liver injury Diagnostic basis: 1. The patient presents with fatigue and dark urine; 2. Liver function test shows significantly elevated ALT, AST, and GGT levels. Treatment plan: 1. Stop all medications that may cause liver damage, including the compound paracetamol tablets you mentioned. 2. Ensure adequate rest, avoid alcohol and smoking. 3. Adopt a light diet, eat more fresh vegetables and fruits, and avoid greasy foods. 4. Consider using liver-protecting medications such as glycyrrhizin or silymarin capsules (specific medication should follow medical advice). 5. Regularly recheck liver function to monitor changes. 6. If symptoms persist or worsen, seek medical attention promptly and consider further tests to rule out other potential causes.',
          '根据您提供的检查结果，您的肝功能检测显示血清丙氨酸氨基转移酶(ALT)、天门冬氨酸氨基转移酶(AST)以及γ-谷氨酰基转移酶(GGT)水平均明显升高，这提示存在急性肝损伤。同时，总胆红素(TBIL)轻度升高但直接胆红素(DBIL)处于正常范围，可能与肝脏代谢有关。血常规中血红蛋白略低于正常范围，提示可能存在轻度贫血。\n\n诊断结果：急性肝损伤\n诊断依据：1. 病人出现疲劳、尿色加深等症状；2. 肝功能检测显示ALT、AST及GGT显著升高。\n治疗方案：\n1. 首先需要停用所有可能导致肝损害的药物，包括你提到的复方对乙酰氨基酚片。\n2. 保证充分休息，避免饮酒和吸烟等不良生活习惯。\n3. 建议采用清淡饮食，多吃新鲜蔬菜水果，少吃油腻食物。\n4. 可以考虑使用一些保肝药物如甘草酸制剂或水飞蓟宾胶囊（具体用药需遵医嘱）。\n5. 定期复查肝功能，监测病情变化。\n6. 如果症状持续恶化或者没有改善，请及时就医并考虑进一步检查以排除其他潜在病因。'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          '<End>',
          '<结束>'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          '#Symptoms#\n(1) Fatigue\n(2) Dark urine\n(3) Reduced urine output\n\n#Auxiliary Examinations#\n(1) Liver function test: Serum alanine aminotransferase (ALT) 297 U/L (significantly elevated), serum aspartate aminotransferase (AST) 83 U/L (slightly elevated), total bilirubin (TBIL) 34.4 μmol/L (slightly elevated), serum gamma-glutamyl transferase (GGT) 243.00 IU/L (significantly elevated), serum direct bilirubin (DBIL) 7.24 μmol/L (normal range), serum total protein (TP) 68.20 g/L (normal range), serum albumin (ALB) 40.10 g/L (normal range).\n(2) Urinalysis: No abnormalities.\n(3) Complete blood count: White blood cells (WBC) 4.77 × 10^9/L (normal range), neutrophil count (NEU#) 3.04 × 10^9/L (normal range), hemoglobin (HGB) 112 g/L (slightly low).\n(4) Abdominal ultrasound: No abnormalities.\n\n#Diagnosis#\nAcute liver injury\n\n#Diagnostic Basis#\n(1) The patient presents with fatigue, dark urine, and reduced urine output.\n(2) Liver function test shows significantly elevated ALT, AST, and GGT levels, indicating liver cell injury.\n\n#Treatment Plan#\n(1) Stop all medications that may cause liver damage, including compound paracetamol tablets.\n(2) Ensure adequate rest, avoid alcohol and smoking.\n(3) Adopt a light diet, eat more fresh vegetables and fruits, and avoid greasy foods.\n(4) Consider using liver-protecting medications such as glycyrrhizin or silymarin capsules (specific medication should follow medical advice).\n(5) Regularly recheck liver function to monitor changes.\n(6) If symptoms persist or worsen, seek medical attention promptly and consider further tests to rule out other potential causes.',
          '#症状#\n(1) 疲劳\n(2) 尿色变黄\n(3) 尿量减少\n\n#辅助检查#\n(1) 肝功能检测：血清丙氨酸氨基转移酶(ALT) 297 U/L（显著升高），血清天门冬氨酸氨基转移酶(AST) 83 U/L（轻度升高），总胆红素(TBIL) 34.4 μmol/L（轻度升高），血清γ-谷氨酰基转移酶(GGT) 243.00 IU/L（显著升高），血清直接胆红素(DBIL) 7.24 μmol/L（正常范围），血清总蛋白(TP) 68.20 g/L（正常范围），血清白蛋白(ALB) 40.10 g/L（正常范围）。\n(2) 尿常规：无异常。\n(3) 血常规：白细胞(WBC) 4.77 × 10^9/L（正常范围），中性粒细胞数(NEU#) 3.04 × 10^9/L（正常范围），血红蛋白(HGB) 112 g/L（轻度降低）。\n(4) 腹部B超：无异常。\n\n#诊断结果#\n急性肝损伤\n\n#诊断依据#\n(1) 患者出现疲劳、尿色变黄和尿量减少等症状。\n(2) 肝功能检测显示ALT、AST及GGT显著升高，提示肝细胞损伤。\n\n#治疗方案#\n(1) 停用所有可能导致肝损害的药物，包括复方对乙酰氨基酚片。\n(2) 保证充分休息，避免饮酒和吸烟等不良生活习惯。\n(3) 采用清淡饮食，多吃新鲜蔬菜水果，少吃油腻食物。\n(4) 可以考虑使用保肝药物如甘草酸制剂或水飞蓟宾胶囊（具体用药需遵医嘱）。\n(5) 定期复查肝功能，监测病情变化。\n(6) 如果症状持续恶化或者没有改善，请及时就医并考虑进一步检查以排除其他潜在病因。'
        )
      }
    ]
  },
  {
    id: 'case-3',
    title: createMultilingualText(
      'Multiple Lacunar Infarctions',
      '多发性腔隙性脑梗塞'
    ),
    description: createMultilingualText(
      'A patient presents with weakness in the left limbs, dry mouth, and constipation.',
      '患者出现左侧肢体无力、口干和便秘。'
    ),
    category: createMultilingualText('Neurology', '神经内科'),
    difficulty: 'hard',
    tags: {
      en: ['Stroke', 'Neurology', 'Weakness'],
      zh: ['中风', '神经内科', '无力']
    },
    dialogueLanguage: 'zh',
    dialogue: [
      {
        role: 'doctor',
        text: createMultilingualText(
          'Hello, what seems to be the problem?',
          '您好，有哪里不舒服？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'Doctor, since yesterday morning, I have felt weakness in my left hand and foot. Resting didn’t help. I don’t have a headache or fever, just a dry mouth and constipation.',
          '医生您好，我昨天上午开始觉得左边的手脚都没什么力气，休息了会儿也没见好。头不疼也不发烧，就是嘴巴干，大便不太顺畅。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Can you describe the weakness in your left hand and foot? For example, do you feel numbness or have difficulty moving?',
          '您能描述一下左边手脚无力的具体情况吗？比如有没有麻木感或者活动受限？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'It feels like my left hand and foot are weak, and it’s hard to lift them, but there’s no numbness. My left leg doesn’t cooperate well when walking.',
          '就是感觉左边的手脚没劲，抬起来有点费力，但是没有麻木的感觉。走路的时候左腿也不太听使唤。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Did this weakness come on suddenly or gradually? Was there any trigger, such as intense exercise or injury?',
          '这种无力感是突然出现的还是逐渐加重的？有没有什么诱因，比如剧烈运动或受伤等？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'The weakness came on suddenly. I was fine the day before while working. There was no intense exercise or injury.',
          '这无力感是突然出现的，前一天干活还好好的。没有剧烈运动也没有受伤。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Have you had similar issues before? Do you have a history of chronic diseases like hypertension or diabetes?',
          '您之前有过类似的情况吗？或者有高血压、糖尿病等慢性疾病的历史吗？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'I’ve never had this issue before. I have had hypertension for five years, with the highest reading being 180/110 mmHg. I take indapamide and nifedipine to control it. In November 2018, I was diagnosed with upper esophageal cancer and underwent radiotherapy. I eat normally now. I don’t have any other chronic diseases.',
          '以前没有过这样的情况。我有高血压，已经5年了，最高的时候血压到过180/110mmHg，一直在吃吲哒帕胺和硝苯地平片控制。还有2018年11月查出食管上段癌，后来做了放疗，现在吃饭都正常。其他的慢性病就没有了。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Besides indapamide and nifedipine, are you taking any other medications, including traditional Chinese medicine or supplements?',
          '除了吲哒帕胺和硝苯地平片外，您还在服用其他药物吗？包括中药、保健品等。'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'No other medications, just those two. I don’t take traditional Chinese medicine or supplements.',
          '没有其他药物了，就这两种药。我不吃中药和保健品的。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'What are your lifestyle habits like? Do you smoke or drink alcohol? What is your occupation and work environment?',
          '您平时的生活习惯怎么样？比如吸烟、饮酒等。还有您的职业是什么，工作环境如何？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'I am a farmer and usually work in the fields. I don’t smoke or drink alcohol. My life is quite simple.',
          '我是个农民，平时就在田里干活。我不抽烟也不喝酒，生活挺简单的。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Does anyone in your family have similar symptoms or a history of hypertension, diabetes, or heart disease?',
          '您的家族中有没有类似症状的患者？或者有高血压、糖尿病、心脏病等遗传性疾病的历史吗？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'No one in my family has had such symptoms. My father has hypertension, but no one has diabetes or heart disease.',
          '家里人没有得过这样的病，高血压倒是有的，我父亲也有高血压。其他像糖尿病、心脏病这些家里人都没得过。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Besides weakness in your limbs and dry mouth with constipation, do you have any other discomforts, such as blurred vision, chest tightness, palpitations, or difficulty swallowing?',
          '除了手脚无力和口干便秘外，您还有没有其他不适？比如视力模糊、胸闷心慌、吞咽困难等？'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'No blurred vision, chest tightness, or palpitations. I eat and drink normally. It’s just the weakness in my limbs, dry mouth, and constipation.',
          '没有视力模糊，胸也不闷，心不慌。吃饭喝水都正常，就是手脚没劲和嘴巴干、大便干燥。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Based on your description, we need to conduct some tests to determine the cause. I will arrange the following tests for you: Complete blood count, electrolytes, blood glucose, liver and kidney function tests, head CT or MRI to rule out cerebrovascular accidents, 12-lead ECG to assess heart condition, and neurological examination to evaluate nerve function. Please complete these tests and provide the results so we can proceed with the diagnosis and treatment.',
          '根据您的描述，我们需要进一步做一些检查来明确病因。接下来我将为您安排一些辅助检查。\n\n实验室检查：血常规、电解质、血糖、肝肾功能\n影像学检查：头颅CT或MRI，以排除脑血管意外\n心电图检查：12导联心电图，了解心脏情况\n功能性检查：神经系统检查，评估神经功能状态\n\n请您尽快完成这些检查，并将结果告诉我，以便我们进行下一步的诊断和治疗。'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'Hello, I need to do a complete blood count, electrolytes, blood glucose, liver and kidney function tests, head CT or MRI, 12-lead ECG, and neurological examination. Can you tell me the results? Doctor, the test results are out. The complete blood count, electrolytes, blood glucose, liver and kidney function tests are all normal. The head CT shows no bleeding but a small infarct. The ECG is normal. The neurological examination indicates reduced muscle strength in the left limbs, but other nerve functions are mostly normal.',
          '您好，我需要做血常规、电解质、血糖、肝肾功能的检查，还有头颅CT或MRI，12导联心电图和神经系统检查。能否告诉我这些检查的结果？医生，检查结果出来了。血常规、电解质、血糖、肝肾功能都正常。头颅CT显示没有出血，但是发现有小范围的梗死灶。心电图也正常。神经系统检查提示左侧肢体肌力减弱，其他神经功能基本正常。'
        )
      },
      {
        role: 'reporter',
        text: createMultilingualText(
          '#Examinations#\n- Complete blood count:\n  - Immediate blood glucose: 8.4 mmol/L\n- Liver and kidney function: No abnormalities\n- Electrolytes: No abnormalities\n\n#Imaging Examinations#\n- Head CT: Infarction near the right lateral ventricle\n- Head MRI: Demyelination in the white matter, lacunar infarctions in the right basal ganglia, bilateral periventricular areas, parietal and frontal lobes\n\n#ECG#\n- Sinus rhythm\n- Normal heart axis\n- T wave abnormalities\n\n#Physical Examination#\n- Muscle strength in the left limbs: Grade 4, reduced touch and pain sensation\n- Other neurological examination results: Clear consciousness, fluent speech, good memory, calculation, and comprehension. Normal vision and visual fields, normal eye movements, no diplopia or nystagmus. Symmetrical facial sensation, no jaw deviation, no drooping of the mouth corners, symmetrical palpebral fissures, shallow left nasolabial fold. No dizziness or nausea, no choking when drinking, tongue midline. Negative Babinski sign bilaterally. No meningeal irritation signs: no neck stiffness, negative Kernig’s and Brudzinski’s signs.',
          '#检查项目#\n- 血常规:\n  - 即刻血糖: 8.4mmol/L\n- 肝肾功能: 无异常\n- 电解质: 无异常\n\n#影像学检查#\n- 头颅CT: 右侧侧脑室旁脑梗死\n- 头颅MRI: 脑白质脱髓鞘改变，右侧基底节区、双侧侧脑室旁、顶叶及额叶腔隙性脑梗塞\n\n#心电图#\n- 窦性心律\n- 心电轴正常\n- T波异常\n\n#查体#\n- 左侧肢体肌力4级，触痛觉减退\n- 其他神经系统检查结果：神志清晰，言语流利，记忆力、计算力、理解力良好。视力视野正常，眼球运动正常，无复视或震颤。面部感觉对称，张口下颌无偏斜，无口角低垂，眼裂对称，左侧鼻唇沟浅。无眩晕、恶心，饮水无呛咳，伸舌居中。巴宾斯基征双侧阴性。脑膜刺激征：颈无抵抗，克氏征阴性，布氏征阴性。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Thank you for providing the detailed test results. Based on your results, we have the following findings:\n\n1. **Laboratory Tests**:\n   - Immediate blood glucose: 8.4 mmol/L (slightly high)\n   - Liver and kidney function and electrolytes: No abnormalities\n\n2. **Imaging Examinations**:\n   - Head CT: Infarction near the right lateral ventricle\n   - Head MRI: Demyelination in the white matter, lacunar infarctions in the right basal ganglia, bilateral periventricular areas, parietal and frontal lobes\n\n3. **ECG**:\n   - Sinus rhythm\n   - Normal heart axis\n   - T wave abnormalities\n\n4. **Physical Examination**:\n   - Muscle strength in the left limbs: Grade 4, reduced touch and pain sensation\n   - Other neurological examination results: Clear consciousness, fluent speech, good memory, calculation, and comprehension. Normal vision and visual fields, normal eye movements, no diplopia or nystagmus. Symmetrical facial sensation, no jaw deviation, no drooping of the mouth corners, symmetrical palpebral fissures, shallow left nasolabial fold. No dizziness or nausea, no choking when drinking, tongue midline. Negative Babinski sign bilaterally. No meningeal irritation signs: no neck stiffness, negative Kernig’s and Brudzinski’s signs.\n\nBased on these results, the preliminary diagnosis is **multiple lacunar infarctions**, which may be causing the weakness in your left limbs. Additionally, your blood glucose is slightly high, so it’s important to control your blood sugar levels.\n\nTo further clarify the cause and assess your condition, we need to conduct the following additional tests:\n\n- **Laboratory Tests**:\n  - Glycated hemoglobin (HbA1c): To assess long-term blood sugar control\n  - Full lipid profile: To understand your lipid levels\n  - Coagulation function: To assess blood clotting status\n\n- **Imaging Examinations**:\n  - Carotid ultrasound: To assess the condition of the neck vessels and rule out atherosclerosis\n\n- **Functional Examinations**:\n  - Detailed neurological assessment: Including nerve conduction velocity and electromyography to further evaluate nerve function\n\nPlease complete these additional tests as soon as possible and inform me of the results so we can develop a more detailed treatment plan.',
          '感谢您提供了详细的检查结果。根据您的检查结果，我们有以下发现：\n\n1. 实验室检查：\n   - 即刻血糖：8.4 mmol/L（略高）\n   - 肝肾功能和电解质：无异常\n\n2. 影像学检查：\n   - 头颅CT：右侧侧脑室旁脑梗死\n   - 头颅MRI：脑白质脱髓鞘改变，右侧基底节区、双侧侧脑室旁、顶叶及额叶腔隙性脑梗塞\n\n3. 心电图：\n   - 窦性心律\n   - 心电轴正常\n   - T波异常\n\n4. 查体：\n   - 左侧肢体肌力4级，触痛觉减退\n   - 其他神经系统检查结果：神志清晰，言语流利，记忆力、计算力、理解力良好。视力视野正常，眼球运动正常，无复视或震颤。面部感觉对称，张口下颌无偏斜，无口角低垂，眼裂对称，左侧鼻唇沟浅。无眩晕、恶心，饮水无呛咳，伸舌居中。巴宾斯基征双侧阴性。脑膜刺激征：颈无抵抗，克氏征阴性，布氏征阴性。\n\n根据这些检查结果，初步诊断考虑为多发性腔隙性脑梗塞，这可能是导致您左侧手脚无力的原因。此外，您的血糖略高，需要注意控制血糖水平。\n\n为了进一步明确病因和评估病情，我们需要进行以下追加检查：\n\n- 实验室检查：\n  - 糖化血红蛋白 (HbA1c)：评估长期血糖控制情况\n  - 血脂全套：了解血脂水平\n  - 凝血功能：评估血液凝固状态\n\n- 影像学检查：\n  - 颈动脉超声：评估颈部血管情况，排除动脉粥样硬化等病变\n\n- 功能性检查：\n  - 神经系统详细评估：包括神经传导速度和肌电图，以进一步评估神经功能\n\n请您尽快完成这些追加检查，并将结果告知我，以便我们制定更详细的治疗方案。'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'Hello, I need to do glycated hemoglobin (HbA1c), full lipid profile, coagulation function tests, carotid ultrasound, and detailed neurological assessment, including nerve conduction velocity and electromyography. Can you tell me the results?',
          '您好，我需要做糖化血红蛋白 (HbA1c)、血脂全套、凝血功能的检查，还有颈动脉超声和神经系统的详细评估，包括神经传导速度和肌电图。能否告诉我这些检查的结果？'
        )
      },
      {
        role: 'reporter',
        text: createMultilingualText(
          'Hello, based on the additional test results you provided, here is a summary:\n\n#Examinations#\n- Glycated hemoglobin (HbA1c): 6.8%\n- Full lipid profile:\n - Total cholesterol: Slightly high\n - Other indicators: Normal\n- Coagulation function: Within normal range\n- Carotid ultrasound: No significant stenosis or plaques\n- Nerve conduction velocity: Slightly slowed in the left limbs\n- Electromyography: Indicates slightly slowed nerve conduction in the left limbs\n\nFor the next steps in your treatment plan, please consult your primary doctor. They will create the most suitable treatment plan based on this information and other possible factors (such as medical history and symptoms). If you have any questions or need further assistance, please let us know.\n\nPlease note that my advice cannot replace professional medical opinions. Ensure you stay in communication with your medical team for the best care.',
          '您好，根据您提供的追加检查结果，这里为您整理如下：\n\n#检查项目#\n- 糖化血红蛋白 (HbA1c): 6.8%\n- 血脂全套:\n - 总胆固醇: 稍高\n - 其他指标: 正常\n- 凝血功能: 正常范围内\n- 颈动脉超声: 无明显狭窄或斑块\n- 神经传导速度: 左侧肢体神经传导稍有减慢\n- 肌电图: 提示左侧肢体神经传导稍有减慢\n\n对于接下来的治疗方案，请咨询您的主治医生。他们会基于上述信息以及其他可能的因素（如病史、症状等）来制定最适合您的治疗计划。如果有任何疑问或者需要进一步的帮助，请随时告知。\n\n请注意，我的建议不能替代专业医疗意见。确保与医疗团队保持沟通以获得最合适的护理。'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          'Thank you for providing the detailed additional test results. Based on these results, we can further clarify your condition and develop a treatment plan.\n\n### Summary of Additional Test Results:\n- Glycated hemoglobin (HbA1c): 6.8% (slightly high)\n- Full lipid profile:\n - Total cholesterol: Slightly high\n - Other indicators: Normal\n- Coagulation function: Within normal range\n- Carotid ultrasound: No significant stenosis or plaques\n- Nerve conduction velocity: Slightly slowed in the left limbs\n- Electromyography: Indicates slightly slowed nerve conduction in the left limbs\n\n### Diagnosis and Analysis:\nBased on your test results, the preliminary diagnosis is multiple lacunar infarctions, accompanied by mild prediabetes and high cholesterol. These factors may collectively contribute to your symptoms.\n\n### Treatment Recommendations:\n1. Medication:\n - Antiplatelet drugs: Such as aspirin, to prevent further thrombosis.\n - Antihypertensive drugs: Continue using indapamide and nifedipine to control blood pressure.\n - Lipid-lowering drugs: Such as statins, to lower total cholesterol levels.\n - Blood sugar control: Consider using oral hypoglycemic agents (such as metformin) or adjusting diet and lifestyle to control blood sugar.\n\n2. Lifestyle Adjustments:\n - Diet: Low-salt, low-fat, low-sugar diet, increase intake of vegetables and fruits.\n - Exercise: Moderate aerobic exercise, such as walking or swimming, at least 150 minutes per week.\n - Avoid smoking and alcohol: Although you do not smoke or drink, continue to maintain these good habits.\n\n3. Regular Check-ups:\n - Blood pressure monitoring: Regularly measure blood pressure to ensure it is within the normal range.\n - Blood sugar monitoring: Regularly check blood sugar, especially postprandial blood sugar.\n - Lipid monitoring: Recheck lipid levels every 3-6 months.\n - Neurological assessment: Regularly conduct neurological examinations to assess the recovery of nerve function.\n\n4. Rehabilitation Therapy:\n - Physical therapy: Conduct targeted physical therapy to help restore the function of the left limbs.\n - Occupational therapy: If needed, conduct occupational therapy to improve daily living skills.\n\n### Next Steps:\nPlease contact your primary doctor as soon as possible to discuss the above treatment recommendations and start treatment according to the doctor’s specific guidance. If you have any questions or discomfort, please seek medical attention promptly.\n\nIf you have any other questions or need further assistance, please let me know. Wishing you a speedy recovery!',
          '感谢您提供了详细的追加检查结果。根据这些结果，我们可以进一步明确您的病情和制定治疗方案。\n\n### 追加检查结果总结：\n- 糖化血红蛋白 (HbA1c): 6.8%（略高）\n- 血脂全套:\n - 总胆固醇: 稍高\n - 其他指标: 正常\n- 凝血功能: 正常范围内\n- 颈动脉超声: 无明显狭窄或斑块\n- 神经传导速度: 左侧肢体神经传导稍有减慢\n- 肌电图: 提示左侧肢体神经传导稍有减慢\n\n### 诊断与分析：\n根据您的检查结果，初步诊断为多发性腔隙性脑梗塞，伴有轻度的糖尿病前期和高胆固醇。这些因素可能共同导致了您的症状。\n\n### 治疗建议：\n1. 药物治疗：\n - 抗血小板药物：如阿司匹林，以预防进一步的血栓形成。\n - 降压药：继续使用吲哒帕胺和硝苯地平片控制血压。\n - 降脂药物：如他汀类药物，以降低总胆固醇水平。\n - 血糖控制：考虑使用口服降糖药物（如二甲双胍）或调整饮食和生活方式来控制血糖。\n\n2. 生活方式调整：\n - 饮食：低盐、低脂、低糖饮食，增加蔬菜和水果的摄入。\n - 运动：适量的有氧运动，如散步、游泳等，每周至少150分钟。\n - 戒烟限酒：虽然您不吸烟也不饮酒，但继续保持这种良好的生活习惯。\n\n3. 定期复查：\n - 血压监测：定期测量血压，确保控制在正常范围内。\n - 血糖监测：定期检测血糖，特别是餐后血糖。\n - 血脂监测：每3-6个月复查一次血脂水平。\n - 神经系统评估：定期进行神经系统检查，评估神经功能恢复情况。\n\n4. 康复治疗：\n - 物理治疗：进行针对性的物理治疗，帮助恢复左侧肢体的功能。\n - 职业治疗：如有需要，可以进行职业治疗，提高日常生活自理能力。\n\n### 下一步行动：\n请尽快与您的主治医生联系，讨论上述治疗建议，并根据医生的具体指导开始治疗。如果有任何疑问或不适，请及时就医。\n\n如果您还有其他问题或需要进一步的帮助，请随时告诉我。祝您早日康复！'
        )
      },
      {
        role: 'patient',
        text: createMultilingualText(
          'Doctor, thank you for your detailed explanation and treatment recommendations. I will follow your advice and contact my primary doctor to start treatment as soon as possible. If I have any questions, I will reach out to you. Thank you!\n\n<End>',
          '医生，谢谢您的详细解释和治疗建议。我会按照您的建议去做，尽快联系主治医生开始治疗。如果有问题我再找您。谢谢！\n\n<结束>'
        )
      },
      {
        role: 'doctor',
        text: createMultilingualText(
          '#Symptoms#\n(1) Weakness in the left hand and foot, difficulty lifting, left leg not cooperating when walking.\n(2) Dry mouth, constipation.\n\n#Auxiliary Examinations#\n(1) Laboratory Tests:\n - Immediate blood glucose: 8.4 mmol/L (slightly high)\n - Liver and kidney function and electrolytes: No abnormalities\n - Glycated hemoglobin (HbA1c): 6.8% (slightly high)\n - Full lipid profile: Total cholesterol slightly high, other indicators normal\n - Coagulation function: Within normal range\n\n(2) Imaging Examinations:\n - Head CT: Infarction near the right lateral ventricle\n - Head MRI: Demyelination in the white matter, lacunar infarctions in the right basal ganglia, bilateral periventricular areas, parietal and frontal lobes\n - Carotid ultrasound: No significant stenosis or plaques\n\n(3) ECG:\n - Sinus rhythm\n - Normal heart axis\n - T wave abnormalities\n\n(4) Neurological Examination:\n - Muscle strength in the left limbs: Grade 4, reduced touch and pain sensation\n - Other neurological examination results: Clear consciousness, fluent speech, good memory, calculation, and comprehension. Normal vision and visual fields, normal eye movements, no diplopia or nystagmus. Symmetrical facial sensation, no jaw deviation, no drooping of the mouth corners, symmetrical palpebral fissures, shallow left nasolabial fold. No dizziness or nausea, no choking when drinking, tongue midline. Negative Babinski sign bilaterally. No meningeal irritation signs: no neck stiffness, negative Kernig’s and Brudzinski’s signs.\n - Nerve conduction velocity: Slightly slowed in the left limbs\n - Electromyography: Indicates slightly slowed nerve conduction in the left limbs\n\n#Diagnosis#\nMultiple lacunar infarctions, accompanied by mild prediabetes and high cholesterol.\n\n#Diagnostic Basis#\n(1) Symptoms:\n - Weakness in the left hand and foot, consistent with cerebrovascular disease.\n - Dry mouth, constipation possibly related to poor blood sugar control.\n\n(2) Auxiliary Examinations:\n - Head CT and MRI: Show infarction near the right lateral ventricle and multiple lacunar infarctions, supporting the diagnosis of cerebrovascular disease.\n - Blood glucose and glycated hemoglobin: Immediate blood glucose 8.4 mmol/L, HbA1c 6.8%, indicating mild prediabetes.\n - Lipid profile: Total cholesterol slightly high, indicating high cholesterol.\n - Neurological examination: Muscle strength in the left limbs grade 4, reduced touch and pain sensation, nerve conduction velocity and electromyography indicate slightly slowed nerve conduction in the left limbs, supporting post-stroke nerve function impairment.\n\n#Treatment Plan#\n(1) Medication:\n - Antiplatelet drugs: Such as aspirin, once daily, 100 mg each time, to prevent further thrombosis.\n - Antihypertensive drugs: Continue using indapamide and nifedipine to control blood pressure, monitor blood pressure changes.\n - Lipid-lowering drugs: Such as statins (e.g., atorvastatin), once daily, 20 mg each time, to lower total cholesterol levels.\n - Hypoglycemic drugs: Consider using oral hypoglycemic agents (such as metformin), twice daily, 500 mg each time, adjust dosage based on blood sugar monitoring.\n\n(2) Lifestyle Adjustments:\n - Diet: Low-salt, low-fat, low-sugar diet, increase intake of vegetables and fruits.\n - Exercise: Moderate aerobic exercise, such as walking or swimming, at least 150 minutes per week.\n - Avoid smoking and alcohol: Continue to maintain good habits of not smoking and not drinking.\n\n(3) Regular Check-ups:\n - Blood pressure monitoring: Measure blood pressure daily to ensure it is within the normal range.\n - Blood sugar monitoring: Regularly check blood sugar, especially postprandial blood sugar, recheck HbA1c every 3 months.\n - Lipid monitoring: Recheck lipid levels every 3-6 months.\n - Neurological assessment: Regularly conduct neurological examinations to assess the recovery of nerve function.\n\n(4) Rehabilitation Therapy:\n - Physical therapy: Conduct targeted physical therapy to help restore the function of the left limbs.\n - Occupational therapy: If needed, conduct occupational therapy to improve daily living skills.\n\nPlease contact your primary doctor as soon as possible to discuss the above treatment recommendations and start treatment according to the doctor’s specific guidance. If you have any questions or discomfort, please seek medical attention promptly. Wishing you a speedy recovery!',
          '#症状#\n(1) 左侧手脚无力，抬起来有点费力，左腿走路不听使唤。\n(2) 口干、大便干燥。\n\n#辅助检查#\n(1) 实验室检查：\n - 即刻血糖：8.4 mmol/L（略高）\n - 肝肾功能和电解质：无异常\n - 糖化血红蛋白 (HbA1c)：6.8%（略高）\n - 血脂全套：总胆固醇稍高，其他指标正常\n - 凝血功能：正常范围内\n\n(2) 影像学检查：\n - 头颅CT：右侧侧脑室旁脑梗死\n - 头颅MRI：脑白质脱髓鞘改变，右侧基底节区、双侧侧脑室旁、顶叶及额叶腔隙性脑梗塞\n - 颈动脉超声：无明显狭窄或斑块\n\n(3) 心电图：\n - 窦性心律\n - 心电轴正常\n - T波异常\n\n(4) 神经系统检查：\n - 左侧肢体肌力4级，触痛觉减退\n - 其他神经系统检查结果：神志清晰，言语流利，记忆力、计算力、理解力良好。视力视野正常，眼球运动正常，无复视或震颤。面部感觉对称，张口下颌无偏斜，无口角低垂，眼裂对称，左侧鼻唇沟浅。无眩晕、恶心，饮水无呛咳，伸舌居中。巴宾斯基征双侧阴性。脑膜刺激征：颈无抵抗，克氏征阴性，布氏征阴性。\n - 神经传导速度：左侧肢体神经传导稍有减慢\n - 肌电图：提示左侧肢体神经传导稍有减慢\n\n#诊断结果#\n多发性腔隙性脑梗塞，伴有轻度糖尿病前期和高胆固醇血症。\n\n#诊断依据#\n(1) 症状：\n - 左侧手脚无力，符合脑血管病变的表现。\n - 口干、大便干燥可能与血糖控制不佳有关。\n\n(2) 辅助检查：\n - 头颅CT和MRI：显示右侧侧脑室旁脑梗死及多处腔隙性脑梗塞，支持脑血管病变的诊断。\n - 血糖和糖化血红蛋白：即刻血糖8.4 mmol/L，HbA1c 6.8%，提示轻度糖尿病前期。\n - 血脂检查：总胆固醇稍高，提示存在高胆固醇血症。\n - 神经系统检查：左侧肢体肌力4级，触痛觉减退，神经传导速度和肌电图均提示左侧肢体神经传导稍有减慢，支持脑梗塞后的神经功能受损。\n\n#治疗方案#\n(1) 药物治疗：\n - 抗血小板药物：如阿司匹林，每日一次，每次100 mg，以预防进一步的血栓形成。\n - 降压药：继续使用吲哒帕胺和硝苯地平片控制血压，监测血压变化。\n - 降脂药物：如他汀类药物（例如阿托伐他汀），每日一次，每次20 mg，以降低总胆固醇水平。\n - 降糖药物：考虑使用口服降糖药物（如二甲双胍），每日两次，每次500 mg，根据血糖监测调整剂量。\n\n(2) 生活方式调整：\n - 饮食：低盐、低脂、低糖饮食，增加蔬菜和水果的摄入。\n - 运动：适量的有氧运动，如散步、游泳等，每周至少150分钟。\n - 戒烟限酒：继续保持不吸烟、不饮酒的良好生活习惯。\n\n(3) 定期复查：\n - 血压监测：每日测量血压，确保控制在正常范围内。\n - 血糖监测：定期检测血糖，特别是餐后血糖，每3个月复查一次HbA1c。\n - 血脂监测：每3-6个月复查一次血脂水平。\n - 神经系统评估：定期进行神经系统检查，评估神经功能恢复情况。\n\n(4) 康复治疗：\n - 物理治疗：进行针对性的物理治疗，帮助恢复左侧肢体的功能。\n - 职业治疗：如有需要，可以进行职业治疗，提高日常生活自理能力。\n\n请尽快与您的主治医生联系，讨论上述治疗建议，并根据医生的具体指导开始治疗。如果有任何疑问或不适，请及时就医。祝您早日康复！'
        )
      }
    ]
  }
];