import React, { useState, useEffect, useRef } from 'react';
import DialogueBubble from './DialogueBubble';
import { ArrowLeft, Play, Pause, FastForward, RotateCcw, Rewind, Menu, X} from 'lucide-react';
import { Language, getText, MultilingualText } from '@/types/language';
import { translations } from '@/data/translations';
import ReactMarkdown from 'react-markdown';
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
  language: Language;
}

/**
 * Component for displaying the interactive dialogue simulation.
 * Fetches multiple versions from backend, shows a collapsible sidebar
 * to choose version, and sequentially plays back the selected version's dialogue.
 */
const DialogueSimulation: React.FC<DialogueSimulationProps> = ({ 
  patientId, 
  onBack, 
  language 
}) => {
  // sidebar open/close state
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  // 记录当前“放大”的图片索引 (null 代表没有放大任何图片)
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);

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
    <div className="flex flex-col h-screen animate-fade-in">
      {/* Sidebar (collapsible) */}
      <div
        className={`
          bg-white border-r transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          w-64 flex-shrink-0 flex flex-col
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {getText(translations.versionList, language)}
          </h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded"
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
                ${idx === selectedVersionIndex ? 'bg-medical-blue/10' : 'bg-white'}
              `}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">
                  {getText(translations.version, language)} {ver.version_id}
                </span>
                <span
                  className={`text-xs font-medium ${
                    ver.accuracy ? 'text-green-600' : 'text-red-600'
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
      </div>      
      
      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header with case info and toggle sidebar button */}
        <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              {/* Title */}
              <h2 className="text-xl font-semibold text-gray-800">
                {getText(titleText, language)}
              </h2>
              {/* Description */}
              <p className="mt-1 text-sm text-gray-600 max-w-xl">
                {getText(descriptionText, language)}
              </p>
              {/* Body System */}
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-medium">{getText(translations.bodySystem, language)}: </span>
                {getText(bodySystemText, language)}
              </p>
              {/* Tags */}
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-medium">{getText(translations.tags, language)}: </span>
                {tagsText[language].join(' / ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Open versions sidebar"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* 在对话区域上方显示原题、病史、检查等 */}
        <div className="bg-gray-50 p-4 border-b">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Original Question */}
            <div>
              <h3 className="font-bold uppercase text-gray-700">
                {getText(translations.originalQuestion, language)}
              </h3>
              <p className="mt-1 text-gray-800 whitespace-pre-wrap">
                {getText(originalQuestionText, language)}
              </p>
            </div>
            {/* Question Background */}
            <div>
              <h3 className="font-bold uppercase text-gray-700">
                {getText(translations.questionBackground, language)}
              </h3>
              <p className="mt-1 text-gray-800 whitespace-pre-wrap">
                {getText(questionBackgroundText, language)}
              </p>
            </div>
            {/* Patient Profile */}
            <div>
              <h3 className="font-bold uppercase text-gray-700">
                {getText(translations.patientProfile, language)}
              </h3>
              <p className="mt-1 text-gray-800 whitespace-pre-wrap">
                {getText(patientProfileText, language)}
              </p>
            </div>
            {/* Examination */}
            <div>
              <h3 className="font-bold uppercase text-gray-700">
                {getText(translations.examination, language)}
              </h3>
              <p className="mt-1 text-gray-800 whitespace-pre-wrap">
                {getText(examinationText, language)}
              </p>
            </div>
            {/* 渲染 Base64 图片 (点击放大/恢复) */}
            {imagesBase64.length > 0 && (
              <div>
                <h3 className="font-bold uppercase text-gray-700">
                  {getText(translations.images, language)}
                </h3>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {imagesBase64.map((b64, idx) => {
                    // 计算“A”、“B”等字母
                    const letter = String.fromCharCode(65 + idx);
                    const prefix = language === 'zh' ? '图' : 'Fig.';
                    const caption = `${prefix} ${letter}`;

                    return (
                      <figure key={idx} className="space-y-1">
                        <img
                          // 点击图片时，如果当前就是这个索引，就收起 (置 null)，否则放大 (设为 idx)
                          onClick={() => setZoomedIndex(idx === zoomedIndex ? null : idx)}
                          src={`data:image/jpeg;base64,${b64}`}
                          alt={`Image ${idx + 1}`}
                          className="w-full h-auto rounded-md shadow-sm object-cover cursor-pointer"
                        />
                        <figcaption className="text-xs italic text-gray-600 text-center">
                          {caption}
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 如果 zoomedIndex !== null，就在最上层渲染一个“放大”层 */}
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

            {/* Images Description */}
            <div>
              <h3 className="font-bold uppercase text-gray-700">
                {getText(translations.imagesDescription, language)}
              </h3>
              <p className="mt-1 text-gray-800 whitespace-pre-wrap">
                {getText(imagesDescriptionText, language)}
              </p>
            </div>
            {/* Options & Ground Truth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['A','B','C','D','E'] as const).map((optKey) => (
                <div key={optKey} className="bg-white p-3 rounded-lg shadow-sm border">
                  <p className="text-sm font-medium text-gray-700">
                    {optKey}. {getText(optionsMap[optKey], language)}
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

        {/* Dialogue content area with auto-scroll */}
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

        {/* Playback controls & progress indicator */}
        <div className="bg-white border-t p-4">
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
    </div>
  );
};

export default DialogueSimulation;
