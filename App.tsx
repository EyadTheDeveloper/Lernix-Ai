import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatBubble } from './components/ChatBubble';
import { HomeView } from './components/HomeView';
import { QuizConfigView } from './components/QuizConfigView';
import { QuizActiveView } from './components/QuizActiveView';
import { QuizResultView } from './components/QuizResultView';
import { SummaryView } from './components/SummaryView';
import { ScheduleConfigView } from './components/ScheduleConfigView';
import { ScheduleResultView } from './components/ScheduleResultView';
import { WalletModal } from './components/WalletModal';
import { Message, FileData, AppView, ToolType, QuizConfig, QuizData, TelegramUser, ScheduleConfig } from './types';
import { sendMessageToGemini, resetChat, generateQuiz, generateStudySummary, generateStudySchedule } from './services/geminiService';

const DAILY_POINTS = 5;
const COST_QUIZ = 2;
const COST_SUMMARY = 1;
const COST_PLAN = 1;

const App: React.FC = () => {
  // State
  const [points, setPoints] = useState<number>(0);
  const [view, setView] = useState<AppView>('home');
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  
  // Telegram User State
  const [user, setUser] = useState<TelegramUser | null>(null);

  // Quiz State
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizResult, setQuizResult] = useState<{score: number; total: number; userAnswers: number[]} | null>(null);

  // Summary State
  const [summaryContent, setSummaryContent] = useState<string>('');
  
  // Schedule State
  const [scheduleContent, setScheduleContent] = useState<string>('');

  // Daily Reward & Wallet State
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [canClaimDaily, setCanClaimDaily] = useState(false);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); 
  const [fileSent, setFileSent] = useState(false);

  // Initialize Telegram & App
  useEffect(() => {
    // 1. Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand(); // Full screen
        
        // Disable vertical swiping to close (better for mini apps)
        try { tg.enableClosingConfirmation(); } catch (e) {}
        try { tg.disableClosingConfirmation(); } catch (e) {}

        const tgUser = tg.initDataUnsafe?.user;
        if (tgUser) {
            setUser(tgUser);
        }
    }

    // 2. Load Points & Daily
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('lastLoginDate');
    const storedPoints = localStorage.getItem('userPoints');

    setPoints(storedPoints ? parseInt(storedPoints) : 10); // Start with 10 points for new users

    if (lastLogin !== today) {
        setCanClaimDaily(true);
    } else {
        setCanClaimDaily(false);
    }
  }, []);

  // Save Points Sync
  useEffect(() => {
    localStorage.setItem('userPoints', points.toString());
  }, [points]);

  const handleClaimDaily = () => {
      if (canClaimDaily) {
          const today = new Date().toDateString();
          setPoints(prev => prev + DAILY_POINTS);
          setCanClaimDaily(false);
          localStorage.setItem('lastLoginDate', today);
      }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (view === 'chat') {
        scrollToBottom();
    }
  }, [messages, view, isLoading]);

  // File Handling
  const handleFileSelected = (file: FileData) => {
    setCurrentFile(file);
    resetChat();
    setFileSent(false);
  };

  const handleClearFile = () => {
    setCurrentFile(null);
    resetChat();
    setFileSent(false);
  };

  const handleChatFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.includes('pdf') && !file.type.includes('image')) {
        alert('يرجى رفع ملف PDF أو صورة 🥞');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        const fileData: FileData = {
            name: file.name,
            mimeType: file.type,
            data: base64String
        };
        handleFileSelected(fileData);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const triggerGemini = async (text: string) => {
      setIsLoading(true);
      try {
        const fileToSend = (!fileSent && currentFile) ? currentFile : null;
        if (fileToSend) setFileSent(true);

        const response = await sendMessageToGemini(text, fileToSend);
        
        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: response
        }]);
      } catch (e) {
        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: 'حدث خطأ، حاول مرة أخرى 🥞',
            isError: true
        }]);
      } finally {
        setIsLoading(false);
      }
  };

  // Summary Generation Handler
  const handleStartSummary = async () => {
      if (points < COST_SUMMARY) {
        alert(`لا يوجد نقاط كافية! تحتاج ${COST_SUMMARY} فطيرة 🥞`);
        return;
      }
      if (!currentFile) return;

      setPoints(prev => prev - COST_SUMMARY);
      setIsLoading(true);
      setLoadingMessage('جاري إعداد الملخص والمشروبات... ☕🥞');

      try {
          const summaryText = await generateStudySummary(currentFile);
          setSummaryContent(summaryText);
          setView('summary-view');
      } catch (e) {
          alert("فشل التلخيص، حاول مرة أخرى.");
          setPoints(prev => prev + COST_SUMMARY); // Refund
      } finally {
          setIsLoading(false);
          setLoadingMessage('');
      }
  };

  // Schedule Generation Handler
  const handleGenerateSchedule = async (config: ScheduleConfig) => {
      if (points < COST_PLAN) {
          alert(`لا يوجد نقاط كافية! تحتاج ${COST_PLAN} فطيرة 🥞`);
          return;
      }

      setPoints(prev => prev - COST_PLAN);
      setIsLoading(true);
      setLoadingMessage('جاري تنظيم جدولك الذكي... 📅🥞');

      try {
          const scheduleText = await generateStudySchedule(currentFile, config);
          setScheduleContent(scheduleText);
          setView('schedule-view');
      } catch (e) {
          console.error(e);
          alert("حدث خطأ أثناء إعداد الجدول.");
          setPoints(prev => prev + COST_PLAN); // Refund
      } finally {
          setIsLoading(false);
          setLoadingMessage('');
      }
  };

    // Quiz Handlers
  const handleQuizConfigStart = async (config: QuizConfig) => {
    if (!currentFile) {
        alert("يرجى رفع ملف أولاً للكويز 🥞");
        return;
    }
    
    if (points < COST_QUIZ) {
        alert(`لا يوجد نقاط كافية! تحتاج ${COST_QUIZ} فطيرة 🥞`);
        return;
    }

    setPoints(prev => prev - COST_QUIZ);
    setIsLoading(true);
    setLoadingMessage('جاري خبز الكويز... 🥞🔥');

    try {
        const data = await generateQuiz(currentFile, config);
        setQuizData(data);
        setView('quiz-active');
    } catch (e) {
        console.error(e);
        alert("فشل إعداد الكويز، حاول مرة أخرى.");
        setPoints(prev => prev + COST_QUIZ); // Refund
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  };

  const handleQuizFinish = (score: number, total: number, userAnswers: number[]) => {
      setQuizResult({ score, total, userAnswers });
      
      // Reward for good score
      if (score / total >= 0.8) {
          setPoints(prev => prev + 1); // Bonus pancake
      }
      
      setView('quiz-result');
  };

  // Navigation Logic
  const handleToolSelect = (toolId: string | ToolType) => {
      if (toolId === ToolType.CHAT) {
          setView('chat');
      } else if (toolId === ToolType.SUMMARIZE) {
          if (!currentFile) {
              alert("يرجى رفع ملف أولاً للتلخيص 🥞");
              return;
          }
          handleStartSummary();
      } else if (toolId === ToolType.QUIZ) {
          if (!currentFile) {
            alert("يرجى رفع ملف أولاً للكويز 🥞");
            return;
          }
          setView('quiz-config');
      } else if (toolId === 'schedule') {
          setView('schedule-config');
      } else if (toolId === 'youtube') {
          alert("ميزة تلخيص اليوتيوب قادمة قريباً! 🎥🥞");
      }
  };

  const handleBack = () => {
      if (view === 'quiz-active') {
          if (window.confirm("هل أنت متأكد من الخروج من الكويز؟ ستخسر تقدمك.")) {
              setView('home');
          }
      } else if (view === 'quiz-result' || view === 'summary-view' || view === 'schedule-view') {
          setView('home');
      } else {
          setView('home');
      }
  };

  // Chat Input Handler
  const handleSendMessage = () => {
      if (!inputText.trim()) return;
      const text = inputText;
      setInputText('');
      
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text }]);
      triggerGemini(text);
  };

  // Render Content
  const renderContent = () => {
      if (isLoading) {
          return (
              <div className="flex flex-col items-center justify-center h-full animate-fade-in pb-20">
                  <div className="text-6xl animate-bounce mb-4">🥞</div>
                  <p className="text-gray-600 font-bold text-lg">{loadingMessage}</p>
                  <p className="text-gray-400 text-sm mt-2">Lernix يفكر...</p>
              </div>
          );
      }

      switch (view) {
          case 'home':
              return (
                  <HomeView 
                      onFileSelected={handleFileSelected}
                      currentFile={currentFile}
                      onClearFile={handleClearFile}
                      onToolSelect={handleToolSelect}
                      onGenerateSchedule={handleGenerateSchedule}
                      points={points}
                      scheduleCost={COST_PLAN}
                  />
              );
          case 'quiz-config':
              return (
                  <QuizConfigView 
                    onStartQuiz={handleQuizConfigStart}
                    points={points}
                    cost={COST_QUIZ}
                  />
              );
          case 'quiz-active':
              return quizData ? (
                  <QuizActiveView 
                    quizData={quizData}
                    onFinish={handleQuizFinish}
                    onCancel={() => setView('home')}
                  />
              ) : null;
          case 'quiz-result':
              return quizData && quizResult ? (
                  <QuizResultView 
                    score={quizResult.score}
                    total={quizResult.total}
                    userAnswers={quizResult.userAnswers}
                    quizData={quizData}
                    onHome={() => setView('home')}
                  />
              ) : null;
          case 'summary-view':
              return (
                  <SummaryView 
                    content={summaryContent} 
                    fileName={currentFile?.name || 'document.pdf'}
                    onBack={() => setView('home')} 
                  />
              );
          case 'schedule-config':
              // Fallback if needed, but HomeView now handles this
              return (
                  <ScheduleConfigView 
                    onGenerate={handleGenerateSchedule}
                    onBack={() => setView('home')}
                    points={points}
                    cost={COST_PLAN}
                  />
              );
          case 'schedule-view':
              return (
                  <ScheduleResultView 
                    content={scheduleContent}
                    onBack={() => setView('home')}
                  />
              );
          case 'chat':
              return (
                <div className="flex flex-col h-full bg-gray-50">
                    <div className="flex-1 overflow-y-auto p-4 pb-24">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 mt-10">
                                <p className="text-4xl mb-2">🥞</p>
                                <p>كيف يمكنني مساعدتك في دراستك اليوم؟</p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <ChatBubble key={msg.id} message={msg} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-200 flex items-center gap-2">
                         <button 
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-3 rounded-full transition-colors ${currentFile ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                         </button>
                         <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleChatFileUpload} 
                            className="hidden" 
                            accept="application/pdf,image/*"
                         />

                         <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="اكتب رسالتك..."
                            className="flex-1 bg-gray-100 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                         />

                         <button 
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                         </button>
                    </div>
                </div>
              );
          default:
              return null;
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header 
        points={points} 
        currentView={view} 
        onBack={handleBack} 
        onOpenWallet={() => setIsWalletOpen(true)}
        user={user}
      />

      {/* Main Container - Changed to allow scrolling */}
      <main className="h-[calc(100vh-64px)] overflow-y-auto">
        {renderContent()}
      </main>

      <WalletModal 
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        points={points}
        canClaimDaily={canClaimDaily}
        onClaimDaily={handleClaimDaily}
      />
    </div>
  );
};

export default App;