import React from 'react';
import { useParams, useNavigate, useLocation, Location } from 'react-router-dom';
import DialogueSimulation from './DialogueSimulation';
import { Language } from '@/types/language';

// 从 CaseSelection 传过来的 location.state 包含的字段:
interface LocationState {
  language?: Language;
  searchQuery?: string;
  page?: number;
  selectedQuestionTypes?: number[];
  selectedMedicalTasks?: number[];
  selectedBodySystems?: number[];
}

const DialogueSimulationWrapper: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const location = useLocation() as Location & { state: LocationState };

  // 如果 URL 里没有 patientId, 就返回上一页
  if (!patientId) {
    navigate(-1);
    return null;
  }

  // 尝试从 location.state 里读取 language
  // 如果没有传递, 就用默认值 'zh'
  const language: Language = location.state?.language ?? 'zh';

  // Go back 时只需调用 navigate(-1), 这样会回到 CaseSelection,
  // React Router 会重用当初的 CaseSelection 组件实例并且它的 state 会保持不变.
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <DialogueSimulation
      patientId={patientId}
      onBack={handleBack}
      initialLanguage={language}
    />
  );
};

export default DialogueSimulationWrapper;