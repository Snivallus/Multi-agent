import React from 'react';
import { useNavigate, useLocation, Location } from 'react-router-dom';
import DirectInteraction from './DirectInteraction';
import { Language } from '@/types/language';

// 定义 location.state 里可能携带的字段
interface LocationState {
  language?: Language;
}

const DirectInteractionWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as Location & { state: LocationState };

  // 从 location.state 中读取 language；如果没有传递，则使用默认 'zh'
  const language: Language = location.state?.language ?? 'zh';

  // 渲染 DirectInteraction，并把 onBack 与 language 传给它
  return (
    <DirectInteraction
      onBack={() => navigate(-1)}
      language={language}
    />
  );
};

export default DirectInteractionWrapper;