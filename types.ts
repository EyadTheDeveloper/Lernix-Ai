export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface FileData {
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

export type AppView = 'home' | 'chat' | 'quiz-config' | 'quiz-active' | 'quiz-result' | 'summary-view' | 'schedule-config' | 'schedule-view';

export interface QuizConfig {
  questionCount: number;
  includeMultipleChoice: boolean;
  includeTrueFalse: boolean;
  instructions: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number; // 0-based index
  explanation?: string;
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export interface ScheduleConfig {
  subjects: string;
  focusArea: string;
  weakPoints: string;
  duration: string; // '3 days', '1 week', etc.
  dailyHours: string; // '2 hours', '4 hours', etc.
  restTime: string; // Sleeping time or breaks
  additionalInstructions: string;
}

export enum ToolType {
  CHAT = 'chat',
  SUMMARIZE = 'summarize',
  QUIZ = 'quiz',
  MAP = 'map',
  PLAN = 'plan'
}

export enum QuickAction {
  SUMMARIZE = 'لخص الملف',
  EXPLAIN = 'اشرح لي',
  QUIZ = 'اختبرني',
  KEY_POINTS = 'أهم النقاط'
}

// Telegram Specific Types
export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
}

export interface WebApp {
    initData: string;
    initDataUnsafe: {
        query_id?: string;
        user?: TelegramUser;
        auth_date?: string;
        hash?: string;
    };
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: any;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    BackButton: {
        isVisible: boolean;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
        show: () => void;
        hide: () => void;
    };
    MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isActive: boolean;
        show: () => void;
        hide: () => void;
        enable: () => void;
        disable: () => void;
        onClick: (callback: () => void) => void;
    };
    ready: () => void;
    expand: () => void;
    close: () => void;
    enableClosingConfirmation: () => void;
    disableClosingConfirmation: () => void;
}

declare global {
    interface Window {
        Telegram: {
            WebApp: WebApp;
        };
    }
}