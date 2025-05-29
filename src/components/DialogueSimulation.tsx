import React, { useState, useEffect, useRef } from 'react';
import DialogueBubble from './DialogueBubble';
import { ArrowLeft, Play, Pause, FastForward, RotateCcw, Rewind, Menu, X, ChevronDown, ChevronUp, Languages } from 'lucide-react';
import { Language, getText, MultilingualText } from '@/types/language';
import { translations } from '@/data/translations';
import ReactMarkdown from 'react-markdown';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import config from '@/config'; // API base URL

interface DialogueLine {
  line_id: number;
  turn_id: number;
  role: string; // "doctor" | "patient" | "reporter" | "monitor" | "summary_doctor"
  text: MultilingualText;
}

interface OptionsMap {
  A: { en: string; zh: string };
  B: { en: string; zh: string };
  C: { en: string; zh: string };
  D: { en: string; zh: string };
  E: { en: string; zh: string };
}

interface CaseDataFromBackend {
  patient_id: string;
  title: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  body_system: {
    en: string;
    zh: string;
  };
  tags: {
    en: string[];
    zh: string[];
  };
  original_question: {
    en: string;
    zh: string;
  };
  question_background: {
    en: string;
    zh: string;
  };
  patient_profile: {
    en: string;
    zh: string;
  };
  examination: {
    en: string;
    zh: string;
  };
  images_description: {
    en: string;
    zh: string;
  };
  options: OptionsMap;
  ground_truth: 'A' | 'B' | 'C' | 'D' | 'E';
  images: string[]; // 后端返回的 Base64 图片数组
}

interface VersionData {
  version_id: number;
  predicted: 'A' | 'B' | 'C' | 'D' | 'E';
  accuracy: boolean;
  reason: {
    en: string;
    zh: string;
  };
  dialogue: DialogueLine[];
}

interface FetchedCaseData {
  case: CaseDataFromBackend;
  versions: VersionData[];
}

interface DialogueSimulationProps {
  patientId: string;
  onBack: () => void;
  initialLanguage: Language;
}

/**
 * Component for displaying the interactive dialogue simulation.
 * Fetches multiple versions from backend, shows a collapsible sidebar
 * to choose version, and sequentially plays back the selected version's dialogue.
 */
const DialogueSimulation: React.FC<DialogueSimulationProps> = ({ 
  patientId, 
  onBack, 
  initialLanguage 
}) => {
  // fetched data from backend
  const [fetchedCase, setFetchedCase] = useState<FetchedCaseData | null>(null);
  // list of versions
  const [versions, setVersions] = useState<VersionData[]>([]);
  // selected version index in versions array
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number>(0);
  // playback controls
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<number | null>(null);
  // Auto scroll
  const containerRef = useRef<HTMLDivElement>(null);
  const lastBubbleRef = useRef<HTMLDivElement>(null);
  // 记录当前"放大"的图片索引 (null 代表没有放大任何图片)
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);

  // 维护语言状态
  const [language, setLanguage] = useState<Language>(initialLanguage);

  // Toggle between Chinese and English
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  // Fetch case + versions from backend on mount or when patient_id changes
  useEffect(() => {
    const fetchCase = async () => {
      try {
        const resp = await fetch(`${config.apiBaseUrl}/database/dialogue_simulation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patient_id: patientId }),
        });
        if (!resp.ok) {
          console.error('Fetch failed:', resp.statusText);
          return;
        }
        const data: FetchedCaseData = await resp.json();
        setFetchedCase(data);

        // 对 versions 按 version_id 排序
        const sorted = data.versions.slice().sort((a, b) => a.version_id - b.version_id);
        setVersions(sorted);

        // 默认选最小 version_id 对应的版本
        setSelectedVersionIndex(0);
        setCurrentDialogueIndex(0);
        setIsPlaying(true);
      } catch (err) {
        console.error('Error fetching case:', err);
      }
    };
    fetchCase();
  }, [patientId]);

  // Reference to currently selected version's dialogue
  const selectedVersion = versions[selectedVersionIndex] || null;
  const dialogueLines = selectedVersion?.dialogue || [];

  // Advance to the next dialogue line
  const advanceDialogue = () => {
    if (currentDialogueIndex < dialogueLines.length - 1) {
      setCurrentDialogueIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  // Go back to the previous dialogue line
  const previousDialogue = () => {
    if (currentDialogueIndex > 0) {
      setCurrentDialogueIndex((prev) => prev - 1);
    }
  };

  // Reset dialogue to beginning
  const resetDialogue = () => {
    setCurrentDialogueIndex(0);
    setIsPlaying(true);
  };

  // Toggle play/pause state
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // Handle click on progress bar to jump to a specific dialogue line
  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newProgress = clickX / rect.width;
    const newIndex = Math.floor(newProgress * dialogueLines.length);
    setCurrentDialogueIndex(newIndex);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for these keys
      if (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
      
      switch (e.key) {
        case ' ': // Space bar
          togglePlayPause();
          break;
        case 'ArrowRight':
          advanceDialogue();
          break;
        case 'ArrowLeft':
          previousDialogue();
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentDialogueIndex, isPlaying, dialogueLines.length]); // Re-attach when these state values change

  // Auto-scroll to the latest dialogue bubble when it appears
  useEffect(() => {
    if (lastBubbleRef.current) {
      lastBubbleRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [currentDialogueIndex]);

  // Set up or clear the timer based on isPlaying state
  useEffect(() => {
    if (isPlaying) { // Auto advance every 5 seconds
      timerRef.current = window.setTimeout(advanceDialogue, 5000);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentDialogueIndex, isPlaying, dialogueLines.length]);

  // When switching version, reset playback to beginning
  useEffect(() => {
    setCurrentDialogueIndex(0);
    setIsPlaying(true);
  }, [selectedVersionIndex]);

  // 折叠控制
  const [detailsCollapsed, setDetailsCollapsed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ———— 页面顶部要展示后端返回的各个字段 ————
  const caseInfo = fetchedCase?.case;
  // 防止 fetchedCase 还没回来时访问为 undefined
  const titleText = caseInfo?.title || { en: '', zh: '' };
  const descriptionText = caseInfo?.description || { en: '', zh: '' };
  const bodySystemText = caseInfo?.body_system || { en: '', zh: '' };
  const tagsText = caseInfo?.tags || { en: [], zh: [] };
  const originalQuestionText = caseInfo?.original_question || { en: '', zh: '' };
  const questionBackgroundText = caseInfo?.question_background || { en: '', zh: '' };
  const patientProfileText = caseInfo?.patient_profile || { en: '', zh: '' };
  const examinationText = caseInfo?.examination || { en: '', zh: '' };
  const imagesDescriptionText = caseInfo?.images_description || { en: '', zh: '' };
  const optionsMap = caseInfo?.options || {
    A: { en: '', zh: '' },
    B: { en: '', zh: '' },
    C: { en: '', zh: '' },
    D: { en: '', zh: '' },
    E: { en: '', zh: '' }
  };
  const groundTruth = caseInfo?.ground_truth || '';
  const imagesBase64: string[] = caseInfo?.images || []; // 从后端拿到的 base64 数组

  return (
    <div className="flex h-screen">
      {/* 左侧版本列表侧边栏 */}
      <div className={`
        ${sidebarCollapsed ? 'w-0' : 'w-64'} 
        transition-all duration-300 ease-in-out 
        bg-white border-r shadow-lg 
        flex flex-col
        relative z-30
      `}>
        {!sidebarCollapsed && (
          <>
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                {getText(translations.versionList, language)}
              </h3>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                aria-label={getText(translations.closeSidebar, language)}
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {versions.map((ver, idx) => (
                <button
                  key={ver.version_id}
                  onClick={() => setSelectedVersionIndex(idx)}
                  className={`
                    w-full text-left p-4 border-b hover:bg-gray-50 transition-colors 
                    ${idx === selectedVersionIndex ? 'bg-medical-blue/10 border-l-4 border-l-medical-blue' : 'bg-white'}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">
                      {getText(translations.version, language)} {ver.version_id}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        ver.accuracy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {ver.accuracy
                        ? getText(translations.correct, language)
                        : getText(translations.incorrect, language)}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {getText(translations.predicted, language)}: {ver.predicted}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 左侧折叠按钮 - 固定在屏幕左侧 */}
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 
                     bg-white border border-l-0 rounded-r-md p-2 shadow-lg
                     hover:bg-gray-50 transition-colors"
          aria-label="Open versions sidebar"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* 主内容区域 */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* 固定标题区域 */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          {/* 顶部标题栏 - 重新设计布局 */}
          <div className="p-4 border-b">
            <div className="flex items-start justify-between gap-4">
              {/* 左侧：返回按钮和案例信息 */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <button
                  onClick={onBack}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 flex-shrink-0 mt-1"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="min-w-0 flex-1">
                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {getText(titleText, language)}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {getText(descriptionText, language)}
                  </p>
                  
                  {/* Body System and Tags */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="inline-flex items-center">
                      <span className="font-medium mr-1">{getText(translations.bodySystem, language)}:</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {getText(bodySystemText, language)}
                      </span>
                    </span>
                    <span className="inline-flex items-center">
                      <span className="font-medium mr-1">{getText(translations.tags, language)}:</span>
                      <div className="flex gap-1">
                        {tagsText[language].map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 右侧：语言切换按钮 */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={toggleLanguage}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-md rounded-lg 
                            hover:bg-gray-50 transition-colors duration-200 
                            font-medium text-medical-blue border border-medical-light-blue"
                >
                  <Languages className="h-4 w-4" />
                  {getText(translations.toggleLanguage, language)}
                </button>
              </div>
            </div>
          </div>
          
          {/* 问题详情折叠控制区域 - 美化布局 */}
          <div className="bg-gray-50/50 border-b">
            <Collapsible open={!detailsCollapsed} onOpenChange={() => setDetailsCollapsed(!detailsCollapsed)}>
              <CollapsibleTrigger className="w-full flex items-center justify-center py-3 hover:bg-gray-100/50 transition-colors group">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span>
                    {detailsCollapsed 
                      ? getText(translations.showQuestionDetails, language)
                      : getText(translations.collapseQuestionDetails, language)}
                  </span>
                  {detailsCollapsed ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  )}
                </div>
              </CollapsibleTrigger>
            </Collapsible>
          </div>

          {/* 可折叠的问题详情区域 */}
          <Collapsible open={!detailsCollapsed}>
            <CollapsibleContent>
              <div className="bg-gray-50 p-4 border-b max-h-96 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-4">
                  {/* ... keep existing code (question details content) the same ... */}
                  
                  {/* Original Question */}
                  <div>
                    <h3 className="font-bold uppercase text-gray-700 text-sm mb-2">
                      {getText(translations.originalQuestion, language)}
                    </h3>
                    <p className="text-gray-800 whitespace-pre-wrap text-sm">
                      {getText(originalQuestionText, language)}
                    </p>
                  </div>
                  
                  {/* Question Background */}
                  <div>
                    <h3 className="font-bold uppercase text-gray-700 text-sm mb-2">
                      {getText(translations.questionBackground, language)}
                    </h3>
                    <p className="text-gray-800 whitespace-pre-wrap text-sm">
                      {getText(questionBackgroundText, language)}
                    </p>
                  </div>
                  
                  {/* Patient Profile */}
                  <div>
                    <h3 className="font-bold uppercase text-gray-700 text-sm mb-2">
                      {getText(translations.patientProfile, language)}
                    </h3>
                    <p className="text-gray-800 whitespace-pre-wrap text-sm">
                      {getText(patientProfileText, language)}
                    </p>
                  </div>
                  
                  {/* Examination */}
                  <div>
                    <h3 className="font-bold uppercase text-gray-700 text-sm mb-2">
                      {getText(translations.examination, language)}
                    </h3>
                    <p className="text-gray-800 whitespace-pre-wrap text-sm">
                      {getText(examinationText, language)}
                    </p>
                  </div>
                  
                  {/* 渲染 Base64 图片 (点击放大/恢复) */}
                  {imagesBase64.length > 0 && (
                    <div>
                      <h3 className="font-bold uppercase text-gray-700 text-sm mb-2">
                        {getText(translations.images, language)}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {imagesBase64.map((b64, idx) => {
                          // 计算"A"、"B"等字母
                          const letter = String.fromCharCode(65 + idx);
                          // const prefix = language === 'zh' ? '图' : 'Fig.';
                          const prefix = getText(translations.image_name, language);
                          const caption = `${prefix} ${letter}`;

                          return (
                            <figure key={idx} className="space-y-1">
                              <img
                                // 点击图片时, 如果当前就是这个索引, 就收起 (置 null), 否则放大 (设为 idx)
                                onClick={() => setZoomedIndex(idx === zoomedIndex ? null : idx)}
                                src={`data:image/jpeg;base64,${b64}`}
                                alt={`Image ${idx + 1}`}
                                className="w-full h-auto rounded-md shadow-sm object-cover cursor-pointer hover:opacity-80 transition-opacity"
                              />
                              <figcaption className="text-xs text-gray-600 text-center">
                                {caption}
                              </figcaption>
                            </figure>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Images Description */}
                  <div>
                    <h3 className="font-bold uppercase text-gray-700 text-sm mb-2">
                      {getText(translations.imagesDescription, language)}
                    </h3>
                    <p className="text-gray-800 whitespace-pre-wrap text-sm">
                      {getText(imagesDescriptionText, language)}
                    </p>
                  </div>
                  
                  {/* Options & Ground Truth */}
                  <div>
                    <h3 className="font-bold uppercase text-gray-700 text-sm mb-2">选项 / Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(['A','B','C','D','E'] as const).map((optKey) => (
                        <div key={optKey} className="bg-white p-3 rounded-lg shadow-sm border">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">{optKey}. </span>
                            {getText(optionsMap[optKey], language)}
                            {groundTruth === optKey && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800">
                                {getText(translations.answer, language)}
                              </span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* 对话内容区域 */}
        <div
          ref={containerRef}
          className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="max-w-3xl mx-auto space-y-2 pb-20">
            {dialogueLines.map((line, index) => (
              <div
                key={index}
                ref={index === currentDialogueIndex ? lastBubbleRef : null}
              >
                <DialogueBubble
                  role={line.role as any}
                  text={line.text}
                  isActive={index <= currentDialogueIndex}
                  language={language}
                  turn_id={line.turn_id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 播放控制区域 - 固定在底部 */}
        <div className="bg-white border-t p-4 sticky bottom-0 z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Playback buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={resetDialogue}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label={getText(translations.resetDialogue, language)}
                title={getText(translations.resetDialogue, language)}
              >
                <RotateCcw className="h-5 w-5 text-gray-600" />
              </button>

              <button
                onClick={previousDialogue}
                disabled={currentDialogueIndex <= 0}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={getText(translations.previousDialogue, language)}
                title={getText(translations.previousDialogue, language)}
              >
                <Rewind className="h-5 w-5 text-gray-600" />
              </button>

              <button
                onClick={togglePlayPause}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label={
                  isPlaying ? getText(translations.pause, language) : getText(translations.play, language)
                }
                title={
                  isPlaying ? getText(translations.pause, language) : getText(translations.play, language)
                }
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 text-gray-600" />
                ) : (
                  <Play className="h-5 w-5 text-gray-600" />
                )}
              </button>

              <button
                onClick={advanceDialogue}
                disabled={currentDialogueIndex >= dialogueLines.length - 1}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={getText(translations.nextDialogue, language)}
                title={getText(translations.nextDialogue, language)}
              >
                <FastForward className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex-1">
              <div
                className="h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
                onClick={handleProgressClick}
                title={getText(translations.jumpToPosition, language)}
              >
                <div
                  className="h-full bg-medical-blue transition-all duration-500 ease-out"
                  style={{
                    width: `${(currentDialogueIndex + 1) / Math.max(dialogueLines.length, 1) * 100}%`
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{getText(translations.progress, language)}</span>
                <span>
                  {dialogueLines.length > 0
                    ? `${currentDialogueIndex + 1} ${getText(translations.of, language)} ${dialogueLines.length}`
                    : `0 ${getText(translations.of, language)} 0`}
                </span>
              </div>
            </div>
          </div>

          {/* Keyboard shortcuts help */}
          <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-4 justify-center">
            <div className="flex gap-3">
              <span>{getText(translations.playPause, language)}</span>
              <span>|</span>
              <ReactMarkdown>{getText(translations.previousLine, language)}</ReactMarkdown>
              <span>|</span>
              <ReactMarkdown>{getText(translations.nextLine, language)}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* 图片放大遮罩层 */}
      {zoomedIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setZoomedIndex(null)} // 点击遮罩任意处都恢复
        >
          <img
            src={`data:image/jpeg;base64,${imagesBase64[zoomedIndex]}`}
            alt={`Zoomed Image ${zoomedIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] rounded-md shadow-lg object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default DialogueSimulation;
