import { createMultilingualText } from '@/types/language';

// UI translations for the entire application
export const translations = {
  // Common UI elements
  toggleLanguage: createMultilingualText('中文', 'English'),
  
  // Landing page
  appTitle: createMultilingualText('AI 医院', 'AI Hospital'),
  appDescription: createMultilingualText(
    '多模态医学诊断大模型',
    'Multi-modality Large Model for Medical Diagnosis'
  ),
  selectCaseButton: createMultilingualText('选择案例', 'Select a Case Study'),
  directInteractionButton: createMultilingualText('直接交互', 'Direct Interaction'),
  login: createMultilingualText('登录', 'Login'),

  // Authentication
  userLogin: createMultilingualText('用户登录', 'User Login'),
  userRegister: createMultilingualText('用户注册', 'User Register'),
  loginToAccount: createMultilingualText('登录您的 AI Hospital 账户', 'Login to your AI Hospital account'),
  createAccount: createMultilingualText('创建您的 AI Hospital 账户', 'Create your AI Hospital account'),
  username: createMultilingualText('用户名', 'Username'),
  password: createMultilingualText('密码', 'Password'),
  confirmPassword: createMultilingualText('确认密码', 'Confirm Password'),
  usernamePlaceholder: createMultilingualText('请输入用户名', 'Please enter username'),
  passwordPlaceholder: createMultilingualText('请输入密码', 'Please enter password'),
  confirmPasswordPlaceholder: createMultilingualText('请再次输入密码', 'Please enter password again'),
  usernameRequired: createMultilingualText('请输入用户名', 'Please enter username'),
  passwordRequired: createMultilingualText('请输入密码', 'Please enter password'),
  confirmPasswordRequired: createMultilingualText('请确认密码', 'Please confirm password'),
  usernameMinLength: createMultilingualText('用户名至少需要3个字符', 'Username must be at least 3 characters'),
  passwordMinLength: createMultilingualText('密码至少需要6个字符', 'Password must be at least 6 characters'),
  usernamePattern: createMultilingualText('用户名只能包含字母、数字和下划线', 'Username can only contain letters, numbers and underscores'),
  passwordMismatch: createMultilingualText('两次输入的密码不一致!', 'Passwords do not match'),
  loggingIn: createMultilingualText('登录中...', 'Logging in...'),
  registering: createMultilingualText('注册中...', 'Registering...'),
  registerAccount: createMultilingualText('注册账户', 'Register Account'),
  noAccount: createMultilingualText('还没有账户?', "Don't have an account?"),
  haveAccount: createMultilingualText('已有账户?', 'Already have an account?'),
  registerNow: createMultilingualText('立即注册', 'Register now'),
  loginNow: createMultilingualText('立即登录', 'Login now'),
  loginSuccess: createMultilingualText('登录成功', 'Login successful'),
  welcomeBack: createMultilingualText('欢迎回来!', 'Welcome back!'),
  loginFailed: createMultilingualText('登录失败', 'Login failed'),
  loginFailedDescription: createMultilingualText('用户名或密码错误, 请重试.', 'Incorrect username or password, please try again.'),
  registerSuccess: createMultilingualText('注册成功', 'Registration successful'),
  registerSuccessDescription: createMultilingualText('账户创建成功, 欢迎使用 AI Hospital!', 'Account created successfully, welcome to AI Hospital!'),
  registerFailed: createMultilingualText('注册失败', 'Registration failed'),
  registerFailedDescription: createMultilingualText('用户名可能已被使用, 请尝试其他用户名.', 'Username may already be taken, please try another username.'),

  // User Menu
  administer: createMultilingualText('管理员', 'Admin'),
  regularUser: createMultilingualText('普通用户', 'Regular User'),
  settings: createMultilingualText('设置', 'Settings'),
  logout: createMultilingualText('退出登录', 'Logout'),
  usernamePassword: createMultilingualText('用户名和密码', 'Username & Password'),
  usernamePasswordUpdate: createMultilingualText('更新用户名和密码', 'Update Username & Password'),
  usernamePasswordUpdateSuccess: createMultilingualText(
    '用户名和密码更新成功, 请重新登录!', 
    'Username and password updated successfully, please log in again!'
  ),
  usernamePasswordUpdateFailure: createMultilingualText(
    '更新失败, 请重试!', 
    'Update failed, please try again!'
  ),
  currentUsername: createMultilingualText('当前用户名', 'Current Username'),
  newUsername: createMultilingualText('新用户名', 'New Username'),
  newPassword: createMultilingualText('新密码', 'New Password'),
  confirmNewPassword: createMultilingualText('确认新密码', 'Confirm New Password'),
  personalProfile: createMultilingualText('个人信息', 'Personal Profile'),
  personalProfileUpdate: createMultilingualText('更新个人信息', 'Update Personal Profile'),
  personalProfileUpdateSuccess: createMultilingualText(
    '个人信息更新成功!',
    'Personal profile updated successfully!'
  ),
  personalProfileUpdateFailure: createMultilingualText(
    '更新失败, 请重试!', 
    'Update failed, please try again!'
  ),
  gender: createMultilingualText('性别', 'Gender'),
  male: createMultilingualText('男', 'Male'),
  female: createMultilingualText('女', 'Female'),
  birthDate: createMultilingualText('出生日期', 'Birth Date'),
  currentAge: createMultilingualText('当前年龄: ', 'Current Age: '),
  updating: createMultilingualText('更新中...', 'Updating...'),
  
  // Case selection
  selectCase: createMultilingualText('选择案例', 'Select a Case Study'),
  clickToStartHint: createMultilingualText('点击案例开始模拟', 'Click on a case to start the simulation'),
  searchCasesPlaceholder: createMultilingualText(
    '按标题、描述和原始文本搜索案例...',
    'Search cases by title, description and original text...'
  ),
  noCasesFound: createMultilingualText(
    '未找到匹配您搜索条件的案例',
    'No case found matching your search criteria'
  ),
  accuracyHead: createMultilingualText(
    '准确率: ',
    'Accuracy: '
  ),
  loadingCases: createMultilingualText(
    '正在加载病例...',
    'Loading cases...'
  ),
  prevPage: createMultilingualText(
    '上一页',
    'Previous'
  ),
  nextPage: createMultilingualText(
    '下一页',
    'Next'
  ),
  editablePagePrefix: createMultilingualText(
    '第',
    'Page'
  ),
  editablePageMidwords: createMultilingualText(
    '页, 共 ',
    'of '
  ),
  editablePageSuffix: createMultilingualText(
    ' 页',
    ' '
  ),

  // Question Type Mapping
  questionType: createMultilingualText(
    '问题类型',
    'Question Type'
  ),
  allOptions: createMultilingualText(
    '全部',
    'All'
  ),
  questionTypeReasoning: createMultilingualText(
    '推理',
    'Reasoning'
  ),
  questionTypeUnderstanding: createMultilingualText(
    '理解',
    'Understanding'
  ),

  // Medical Task Mapping
  medicalTask: createMultilingualText(
    '医学任务',
    'Medical Task'
  ),
  medicalTaskTreating: createMultilingualText(
    '治疗',
    'Treating'
  ),
  medicalTaskBasicScience: createMultilingualText(
    '基础科学',
    'Basic Science'
  ),
  medicalTaskDiagnosis: createMultilingualText(
    '诊断',
    'Diagnosis'
  ),

  // Body System Mapping
  bodySystem: createMultilingualText(
    '身体系统',
    'Body System'
  ),
  bodySystemSkeletal: createMultilingualText(
    '骨骼',
    'Skeletal'
  ),
  bodySystemReproductive: createMultilingualText(
    '生殖',
    'Reproductive'
  ),
  bodySystemCardiovascular: createMultilingualText(
    '心血管',
    'Cardiovascular'
  ),
  bodySystemMuscular: createMultilingualText(
    '肌肉',
    'Muscular'
  ),
  bodySystemLymphatic: createMultilingualText(
    '淋巴',
    'Lymphatic'
  ),
  bodySystemNervous: createMultilingualText(
    '神经',
    'Nervous'
  ),
  bodySystemOtherNA: createMultilingualText(
    '其他/缺失',
    'Other/NA'
  ),
  bodySystemDigestive: createMultilingualText(
    '消化',
    'Digestive'
  ),
  bodySystemUrinary: createMultilingualText(
    '泌尿',
    'Urinary'
  ),
  bodySystemRespiratory: createMultilingualText(
    '呼吸',
    'Respiratory'
  ),
  bodySystemEndocrine: createMultilingualText(
    '内分泌',
    'Endocrine'
  ),
  bodySystemIntegumentary: createMultilingualText(
    '皮肤',
    'Integumentary'
  ),

  // Dialogue simulation
  resetDialogue: createMultilingualText('重置对话', 'Reset dialogue'),
  pause: createMultilingualText('暂停', 'Pause'),
  play: createMultilingualText('播放', 'Play'),
  nextDialogue: createMultilingualText('下一段对话', 'Next dialogue'),
  previousDialogue: createMultilingualText('上一段对话', 'Previous dialogue'),
  progress: createMultilingualText('进度', 'Progress'),
  of: createMultilingualText('共', 'of'),
  playPause: createMultilingualText('空格键: 播放/暂停', 'Space: Play/Pause'),
  previousLine: createMultilingualText('&larr;: 上一句', '&larr;: Previous'),
  nextLine: createMultilingualText('&rarr;: 下一句', '&rarr;: Next'),
  copybutton: createMultilingualText('复制', 'Copy'),
  versionList: createMultilingualText('版本列表', 'Version List'),
  closeSidebar: createMultilingualText('折叠侧栏', 'Close Sidebar'),
  version: createMultilingualText('版本', 'Version'),
  correct: createMultilingualText('正确', 'Correct'),
  incorrect: createMultilingualText('错误', 'Incorrect'),
  predicted: createMultilingualText('预测选项', 'Predicted Option'),
  showQuestionDetails: createMultilingualText('显示问题详情', 'Show Question Details'),
  collapseQuestionDetails: createMultilingualText('折叠问题详情', 'Collapse Question Details'),
  originalQuestion: createMultilingualText('原始问题', 'Original Question'),
  questionBackground: createMultilingualText('问题背景', 'Question Background'),
  patientProfile: createMultilingualText('患者信息', 'Patient Profile'),
  examination: createMultilingualText('检查结果', 'Examination'),
  images: createMultilingualText('图片', 'Images'),
  image_name: createMultilingualText('图', 'Fig.'),
  imagesDescription: createMultilingualText('图片描述', 'Images Description'),
  options: createMultilingualText('选项', 'Options'),
  answer: createMultilingualText('正确答案', 'Ground Truth'),
  tags: createMultilingualText('标签', 'Tags'),
  save: createMultilingualText('保存', 'Save'),
  edit: createMultilingualText('编辑', 'Edit'),
  EN: createMultilingualText('英文', 'EN'),
  ZH: createMultilingualText('中文', 'ZH'),
  title: createMultilingualText('标题', 'Title'),
  description: createMultilingualText('描述', 'Description'),
  noPermission: createMultilingualText('无权限', 'No Permisson'),

  // Direct Interaction
  directInteractionTitle: createMultilingualText('直接交互', 'Direct Interaction'),
  typeMessage: createMultilingualText('在此输入您的消息...', 'Type your message here...'),
  sendMessage: createMultilingualText('发送消息', 'Send Message'),
  waitingForResponse: createMultilingualText('等待回应 ', 'Waiting for response '),
  jumpToPosition: createMultilingualText('点击跳转到该位置', 'Click to jump to this position'),
  conversationHint: createMultilingualText('输入消息开始对话', 'Start a conversation by typing a message below.'),
  doctorPlaceHolder: createMultilingualText('(无响应)', '(No response)'),
  resetMomery: createMultilingualText('重置记忆', 'Reset Momery'),
  generateDiagnosis: createMultilingualText('生成诊断', 'Generate Diagnosis'),
  uploadFile: createMultilingualText('上传文件', 'Upload File'),
  featureNotImplemented: createMultilingualText('功能尚未实现，敬请期待', 'This Feature is not yet implemented, stay tuned'),
  
  // Doctor Selection
  selectDoctor: createMultilingualText('医生模型', 'Doctor Model'),
  QwenMax: createMultilingualText('Qwen2.5-Max', 'Qwen2.5-Max'),
  DeepSeekV3: createMultilingualText('DeepSeek-V3', 'DeepSeek-V3'),
  DeepSeekR1: createMultilingualText('DeepSeek-R1', 'DeepSeek-R1'),

  // Speech to text 
  startRecording: createMultilingualText('开始录音', 'Start recording'),
  stopRecording: createMultilingualText('停止录音', 'Stop recording'),
  recordingInProgress: createMultilingualText('录音中...', 'Recording...'),
  recordingDuration: createMultilingualText('录音时长: ', 'Recording duration: '),
  seconds: createMultilingualText('秒', 'seconds'),
  microphonePermissionDenied: createMultilingualText('需要麦克风权限', 'Microphone permission needed'),
  browserNotSupported: createMultilingualText('您的浏览器不支持语音识别, 请使用 Chrome 浏览器', 'Your browser does not support speech recognition. Please use the Chrome browser.'),
  webSpeechAPIError: createMultilingualText('Web Speech API 通讯错误, 请更换 VPN 或使用 Chrome 浏览器', 'Web Speech API communication error, please change VPN or use the Chrome brower.'),
  genericError: createMultilingualText('发生未知错误, 请稍后再试', 'An unknown error occurred, please try again later'),
  
  // Roles
  doctor: createMultilingualText('医生', 'Doctor'),
  patient: createMultilingualText('患者', 'Patient'),
  reporter: createMultilingualText('检查员', 'Reporter'),
  monitor: createMultilingualText('监督员', 'Monitor'),
  summary_doctor: createMultilingualText('总结医生', 'Summary Doctor'),

  // Error messages
  errorTitle: createMultilingualText('错误', 'Error'),
  networkError: createMultilingualText('网络错误，请稍后再试或使用 VPN', 'Network error, please try again later or use a VPN'),
  apiError: createMultilingualText('服务器错误，请稍后再试', 'Server error, please try again later'),

  // Upload files
  selectFile: createMultilingualText('选择文件', 'Select File'),
  fileDescription: createMultilingualText('文件描述', 'File Description'),
  confirm: createMultilingualText('确认', 'Confirm'),
  cancel: createMultilingualText('取消', 'Cancel'),
  unsupportedFileType: createMultilingualText('不支持的文件类型', 'Unsupported file type'),
  noFileSelected: createMultilingualText('请选择文件', 'Please select a file first'),
  uploadFailed: createMultilingualText('文件上传失败', 'File upload failed'),
  uploading: createMultilingualText('上传中...', 'Uploading...'),
  noDescription: createMultilingualText('(无描述)', '(No description)'),
  inspectionResult: createMultilingualText('检查结果', 'Inspection Result'), 
  scanResult: createMultilingualText('检查结果', 'Scan Result'),
  medicalVolumeData: createMultilingualText('三维医学体数据', '3D Medical Volume Data'),

  sessionHistory: createMultilingualText("Session History", "会话历史"),
  saveSession: createMultilingualText("Save Session", "保存会话"),
} as const;
