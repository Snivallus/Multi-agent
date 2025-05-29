import React from 'react';
import { useParams, useNavigate, useLocation, Location } from 'react-router-dom';
import DialogueSimulation from './DialogueSimulation';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

// 从 CaseSelection 传过来的 location.state 会包含这些字段
interface LocationState {
  // CaseSelection 里传来的“语言” 、以及所有筛选/分页等状态
  language?: Language;
  searchQuery?: string;
  page?: number;
  selectedQuestionTypes?: number[];
  selectedMedicalTasks?: number[];
  selectedBodySystems?: number[];
}

interface DialogueSimulationWrapperProps {
  language: Language;           // 父组件当前的语言状态
  toggleLanguage: () => void;   // 父组件用于切换语言的方法
}

const DialogueSimulationWrapper: React.FC<DialogueSimulationWrapperProps> = ({
  language,
  toggleLanguage,
}) => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  // 强制把 useLocation 标记成可能带 LocationState
  const location = useLocation() as Location & { state: LocationState };

  // 如果 URL 里没有 patientId，则直接退回上一页
  if (!patientId) {
    navigate(-1);
    return null;
  }

  // 先决定：到底当前应该用哪个 language？
  // a) 如果 location.state 里已经带了 language，就优先用它。
  // b) 否则就使用从父组件传进来的 language
  const langToUse: Language = location.state?.language ?? language;

  // “返回”就调用 navigate(-1)。React Router 会沿用之前的 CaseSelection 实例，
  // 也会带回 location.state 里之前的筛选/分页/语言等字段。
  const onBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* 渲染 DialogueSimulation 组件 */}
      <DialogueSimulation
        patientId={patientId}
        onBack={onBack}
        language={langToUse}
        toggleLanguage={toggleLanguage}
      />
    </>
  );
};

export default DialogueSimulationWrapper;