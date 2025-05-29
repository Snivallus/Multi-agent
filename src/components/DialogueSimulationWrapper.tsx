import React from 'react';
import { useParams, useNavigate, useLocation, Location } from 'react-router-dom';
import DialogueSimulation from './DialogueSimulation';
import { Language } from '@/types/language';

// location.state 包含的字段
interface LocationState {
  language?: Language;
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

  return (
    <DialogueSimulation
      patientId={patientId}
      onBack={() => navigate(-1)}
      language={language}
    />
  );
};

export default DialogueSimulationWrapper;