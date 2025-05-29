import React, { useEffect, useState, useRef } from 'react';
import { MultilingualText } from '@/types/language';
import { MedicalCase } from '@/data/medicalCases';
import CaseCard from './CaseCard';
import { ArrowLeft } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import { cn } from '@/lib/utils';
import config from '@/config'; // API base URL
// Navigate to dialogue simulation by clicking a case card
import { useNavigate, useLocation } from 'react-router-dom';

// Mapping
const QUESTION_TYPE_MAP: Record<number, MultilingualText> = {
  1: translations.questionTypeReasoning,
  2: translations.questionTypeUnderstanding,
};

const MEDICAL_TASK_MAP: Record<number, MultilingualText> = {
  1: translations.medicalTaskTreating,
  2: translations.medicalTaskBasicScience,
  3: translations.medicalTaskDiagnosis,
};

const BODY_SYSTEM_MAP: Record<number, MultilingualText> = {
  1:  translations.bodySystemSkeletal,
  2:  translations.bodySystemReproductive,
  3:  translations.bodySystemCardiovascular,
  4:  translations.bodySystemMuscular,
  5:  translations.bodySystemLymphatic,
  6:  translations.bodySystemNervous,
  7:  translations.bodySystemOtherNA,
  8:  translations.bodySystemDigestive,
  9:  translations.bodySystemUrinary,
  10: translations.bodySystemRespiratory,
  11: translations.bodySystemEndocrine,
  12: translations.bodySystemIntegumentary,
};

interface CaseSelectionLocationState {
  // 这些字段会从上一次的 location.state 中恢复
  searchQuery?: string;
  page?: number;
  selectedQuestionTypes?: number[];
  selectedMedicalTasks?: number[];
  selectedBodySystems?: number[];
}

interface CaseSelectionProps {
  onBack: () => void;
  language: Language;
}

/**
 * Component for displaying and selecting from available medical cases
 * Includes search functionality and displays cases in a grid.
 * Click a card will navigate to DialogueSimulation page.
 * 此时会把搜索框文字、页码、筛选条件、language 也一并放到 location.state 里.
 * 当用户在 DialogueSimulation 点击 “Go back” 并 navigate(-1) 返回时,
 * CaseSelection 会读一次 location.state 来还原 previous state,
 * 从而实现“返回”后保留各项输入.
 */
const CaseSelection: React.FC<CaseSelectionProps> = ({ onBack, language }) => {
  const navigate = useNavigate(); // Navigate to dialogue simulation by clicking a case card
  const location = useLocation(); // Restore states when coming back from a dialogue simulation page 
  // 如果是从 DialogueSimulation 返回, 这里能拿回上一轮存的那几个字段
  const locState = (location.state || {}) as CaseSelectionLocationState;

  // 在 useState 初始化时, 优先从 locState 里恢复, 否则用默认值
  const [searchQuery, setSearchQuery] = useState<string>(locState.searchQuery ?? '');
  const [page, setPage] = useState<number>(locState.page ?? 1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCases, setTotalCases] = useState(0);
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // 用于可编辑页码的本地输入状态
  const [inputPage, setInputPage] = useState<string>(String(locState.page ?? 1));

  // 筛选条件状态
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<number[]>(locState.selectedQuestionTypes ?? []);
  const [selectedMedicalTasks, setSelectedMedicalTasks] = useState<number[]>(locState.selectedMedicalTasks ?? []);
  const [selectedBodySystems, setSelectedBodySystems] = useState<number[]>(locState.selectedBodySystems ?? []);

  // 控制下拉菜单展开/收起
  const [qtOpen, setQtOpen] = useState(false);
  const [mtOpen, setMtOpen] = useState(false);
  const [bsOpen, setBsOpen] = useState(false);

  const qtRef = useRef<HTMLDivElement>(null);
  const mtRef = useRef<HTMLDivElement>(null);
  const bsRef = useRef<HTMLDivElement>(null);

  // 点击页面空白处收起下拉菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (qtRef.current && !qtRef.current.contains(e.target as Node)) setQtOpen(false);
      if (mtRef.current && !mtRef.current.contains(e.target as Node)) setMtOpen(false);
      if (bsRef.current && !bsRef.current.contains(e.target as Node)) setBsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 计算 whereCondition
  const buildWhereCondition = (): string => {
    const clauses: string[] = [];

    // question_type
    if (
      selectedQuestionTypes.length > 0 &&
      selectedQuestionTypes.length < Object.keys(QUESTION_TYPE_MAP).length
    ) {
      const vals = selectedQuestionTypes.join(', ');
      clauses.push(`m.question_type IN (${vals})`);
    }

    // medical_task
    if (
      selectedMedicalTasks.length > 0 &&
      selectedMedicalTasks.length < Object.keys(MEDICAL_TASK_MAP).length
    ) {
      const vals = selectedMedicalTasks.join(', ');
      clauses.push(`m.medical_task IN (${vals})`);
    }

    // body_system
    if (
      selectedBodySystems.length > 0 &&
      selectedBodySystems.length < Object.keys(BODY_SYSTEM_MAP).length
    ) {
      const vals = selectedBodySystems.join(', ');
      clauses.push(`m.body_system IN (${vals})`);
    }

    return clauses.length > 0 ? clauses.join(' AND ') : '';
  };

  // Fetch medical cases from backend (refresh according to searchQuery and page)
  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setError(null);

      const whereCondition = buildWhereCondition(); // 筛选条件
      try {
        const resp = await fetch(`${config.apiBaseUrl}/database/case_selection`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            searchQuery,
            whereCondition,
            page,
          }),
        });

        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }

        const json = await resp.json();
        setCases(json.cases);
        setTotalCases(json.total_cases);
        setTotalPages(json.total_pages);
      } catch (err: any) {
        setError(err.message || 'Failed to load cases');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
    // 每次 page 改变时, 也把输入框的值同步
    setInputPage(String(page));
  }, [
    searchQuery, 
    page, 
    selectedQuestionTypes,
    selectedMedicalTasks,
    selectedBodySystems,
  ]);

  // 切换 question_type 选项
  const toggleQuestionType = (val: number | 'all') => {
    setPage(1); // 每次切换选项时重置页码

    if (val === 'all') {
      setSelectedQuestionTypes([]);
      return;
    }
    let arr = [...selectedQuestionTypes];
    if (arr.includes(val)) {
      arr = arr.filter((x) => x !== val);
    } else {
      arr.push(val);
    }
    // 如果已选择全部具体选项，则重置为 All
    if (arr.length === Object.keys(QUESTION_TYPE_MAP).length) {
      arr = [];
    }
    setSelectedQuestionTypes(arr);
  };

  // 切换 medical_task 选项
  const toggleMedicalTask = (val: number | 'all') => {
    setPage(1); // 每次切换选项时重置页码

    if (val === 'all') {
      setSelectedMedicalTasks([]);
      return;
    }
    let arr = [...selectedMedicalTasks];
    if (arr.includes(val)) {
      arr = arr.filter((x) => x !== val);
    } else {
      arr.push(val);
    }
    if (arr.length === Object.keys(MEDICAL_TASK_MAP).length) {
      arr = [];
    }
    setSelectedMedicalTasks(arr);
  };

  // 切换 body_system 选项
  const toggleBodySystem = (val: number | 'all') => {
    setPage(1); // 每次切换选项时重置页码
    
    if (val === 'all') {
      setSelectedBodySystems([]);
      return;
    }
    let arr = [...selectedBodySystems];
    if (arr.includes(val)) {
      arr = arr.filter((x) => x !== val);
    } else {
      arr.push(val);
    }
    if (arr.length === Object.keys(BODY_SYSTEM_MAP).length) {
      arr = [];
    }
    setSelectedBodySystems(arr);
  };

  // Handle dialogue selection
  // 点击卡片时, 调用 navigate 跳转到 dialogue_simulation 页面, 并把 patient_id 传到 URL.
  const handleCaseClick = (caseItem: MedicalCase) => {
    navigate(
      `/database/dialogue_simulation/${caseItem.patient_id}`,
      { 
        state: { 
          language,
          searchQuery,
          page,
          selectedQuestionTypes,
          selectedMedicalTasks,
          selectedBodySystems,
        }
      }
    );
  };
  
  // Handle prev page
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Handle next page
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // 当用户在输入框中敲回车或失去焦点时, 验证并跳转
  const commitInputPage = () => {
    const num = Number(inputPage.trim());
    if (!Number.isNaN(num)) {
      if (num < 1) { // 输入页码小于 1 时, 跳转至第一页
        setPage(1);
      } else if (num > totalPages) { // 输入页码大于 totalPages 时, 跳转至最后一页
        setPage(totalPages);
      } else {
        setPage(num);
      }
    }
    // 如果非数字，则保持当前 page, 不做改变
    setInputPage(String(page));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-4">
        {/* back button */}
        <button
          onClick={onBack}
          className="p-4 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        
        <h2 className="text-3xl font-semibold text-gray-800">
          {/*
            language === 'zh'
            ? '选择案例'
            : 'Select a Case Study'
          */}
          {getText(translations.selectCase, language)}
        </h2>
      </div>

      {/* Search + Filter Box */}
      <div className="mb-6 flex flex-col gap-4">
        {/* First Line: Search Box */}
        {/*
          language === 'zh'
          ? '按标题、描述和原始文本搜索案例...'
          : 'Search cases by title, description and original text...'
        */}
        <input
          type="text"
          placeholder={getText(translations.searchCasesPlaceholder, language)}
          className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-medical-blue"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // Reset page number to 1 when searching
          }}
        />

        {/* Second Line: Filter Buttons */}
        <div className="flex justify-center gap-8">
          {/* question_type 过滤 */}
          <div className="relative" ref={qtRef}>
            <button
              onClick={() => setQtOpen(!qtOpen)}
              className={cn(
                'px-4 py-2 rounded-lg border',
                selectedQuestionTypes.length === 0
                  ? 'bg-medical-blue text-white shadow'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              )}
            >
              {/* {language === 'zh' ? '问题类型' : 'Question Type'} */}
              {getText(translations.questionType, language)}
            </button>
            {qtOpen && (
              <div className="absolute mt-2 bg-white border rounded-md shadow-lg z-10 w-40">
                {/* “全部” 选项 */}
                <div
                  className={cn(
                    'px-3 py-1 hover:bg-gray-100 cursor-pointer',
                    selectedQuestionTypes.length === 0
                      ? 'bg-blue-100'
                      : ''
                  )}
                  onClick={() => toggleQuestionType('all')}
                >
                  {/* language === 'zh' ? '全部' : 'All' */}
                  {getText(translations.allOptions, language)}
                </div>
                {/* 具体选项 */}
                {Object.entries(QUESTION_TYPE_MAP).map(([key, label]) => {
                  const val = Number(key);
                  const isSelected = selectedQuestionTypes.includes(val);
                  return (
                    <div
                      key={key}
                      className={cn(
                        'px-3 py-1 hover:bg-gray-100 cursor-pointer',
                        isSelected 
                          ? 'bg-blue-100' 
                          : ''
                      )}
                      onClick={() => toggleQuestionType(val)}
                    >
                      {getText(label, language)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* medical_task 过滤 */}
          <div className="relative" ref={mtRef}>
            <button
              onClick={() => setMtOpen(!mtOpen)}
              className={cn(
                'px-4 py-2 rounded-lg border',
                selectedMedicalTasks.length === 0
                  ? 'bg-medical-blue text-white shadow'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              )}
            >
              {/* {language === 'zh' ? '医学任务' : 'Medical Task'} */}
              {getText(translations.medicalTask, language)}
            </button>
            {mtOpen && (
              <div className="absolute mt-2 bg-white border rounded-md shadow-lg z-10 w-44">
                <div
                  className={cn(
                    'px-3 py-1 hover:bg-gray-100 cursor-pointer',
                    selectedMedicalTasks.length === 0
                      ? 'bg-blue-100'
                      : ''
                  )}
                  onClick={() => toggleMedicalTask('all')}
                >
                  {/* language === 'zh' ? '全部' : 'All' */}
                  {getText(translations.allOptions, language)}
                </div>
                {Object.entries(MEDICAL_TASK_MAP).map(([key, label]) => {
                  const val = Number(key);
                  const isSelected = selectedMedicalTasks.includes(val);
                  return (
                    <div
                      key={key}
                      className={cn(
                        'px-3 py-1 hover:bg-gray-100 cursor-pointer',
                        isSelected 
                          ? 'bg-blue-100' 
                          : ''
                      )}
                      onClick={() => toggleMedicalTask(val)}
                    >
                      {/* language === 'zh' ? '标签' : 'Tags' */}
                      {getText(label, language)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* body_system 过滤 */}
          <div className="relative" ref={bsRef}>
            <button
              onClick={() => setBsOpen(!bsOpen)}
              className={cn(
                'px-4 py-2 rounded-lg border',
                selectedBodySystems.length === 0
                  ? 'bg-medical-blue text-white shadow'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              )}
            >
              {/* {language === 'zh' ? '躯体系统' : 'Body System'} */}
              {getText(translations.bodySystem, language)}
            </button>
            {bsOpen && (
              <div className="absolute mt-2 bg-white border rounded-md shadow-lg z-10 max-h-48 overflow-auto w-44">
                <div
                  className={cn(
                    'px-3 py-1 hover:bg-gray-100 cursor-pointer',
                    selectedBodySystems.length === 0
                      ? 'bg-blue-100'
                      : ''
                  )}
                  onClick={() => toggleBodySystem('all')}
                >
                  {/* language === 'zh' ? '全部' : 'All' */}
                  {getText(translations.allOptions, language)}
                </div>
                {Object.entries(BODY_SYSTEM_MAP).map(([key, label]) => {
                  const val = Number(key);
                  const isSelected = selectedBodySystems.includes(val);
                  return (
                    <div
                      key={key}
                      className={cn(
                        'px-3 py-1 hover:bg-gray-100 cursor-pointer',
                        isSelected 
                          ? 'bg-blue-100' 
                          : ''
                      )}
                      onClick={() => toggleBodySystem(val)}
                    >
                      {getText(label, language)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center text-gray-500 py-12">
          {/* language === 'zh' ? '正在加载病例...' : 'Loading cases...' */}
          {getText(translations.loadingCases, language)}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center text-red-500 py-12">
          {/* language === 'zh' ? `错误：${error}` : `Error: ${error}` */}
          {getText(translations.errorTitle, language) + `: ${error}`}
        </div>
      )}

      {/* Cases grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((caseItem) => (
              <CaseCard
                key={caseItem.patient_id}
                caseData={caseItem}
                onClick={() => handleCaseClick(caseItem)}
                language={language}
              />
            ))}
          </div>

          {/* No results */}
          {cases.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {/* 
                  language === 'zh' 
                  ? '未找到匹配您搜索条件的案例' 
                  : 'No case found matching your search criteria' 
                */}
                {getText(translations.noCasesFound, language)}
              </p>
            </div>
          )}

          {/* Page control */}
          {cases.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              {/* Button of previous page */}
              <button
                onClick={handlePrevPage}
                disabled={page <= 1}
                className={cn(
                  'px-4 py-2 rounded-md',
                  page <= 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-medical-blue text-white hover:bg-medical-dark-blue'
                )}
              >
                {/* language === 'zh' ? '上一页' : 'Previous' */}
                {getText(translations.prevPage, language)}
              </button>
              
              {/* Editable page number */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">
                  {/* language === 'zh' ? '第' : 'Page' */}
                  {getText(translations.editablePagePrefix, language)}
                </span>
                <input
                  type="text"
                  value={inputPage}
                  onChange={(e) => setInputPage(e.target.value)}
                  onBlur={commitInputPage}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      commitInputPage();
                    }
                  }}
                  className="w-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-blue"
                />
                <span className="text-gray-700">
                  {/* 
                    language === 'zh'
                    ? `页, 共 ${totalPages} 页`
                    : `of ${totalPages}`
                  */}
                  {getText(translations.editablePageMidwords, language)
                    +
                    `${totalPages}`
                    +
                   getText(translations.editablePageSuffix, language)}
                </span>
              </div>

              {/* Button of next page */}
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages}
                className={cn(
                  'px-4 py-2 rounded-md',
                  page >= totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-medical-blue text-white hover:bg-medical-dark-blue'
                )}
              >
                {/* language === 'zh' ? '下一页' : 'Next' */}
                {getText(translations.nextPage, language)}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CaseSelection;