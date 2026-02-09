import React, { useState } from 'react';
import { FileUploader } from './FileUploader';
import { FileData, ToolType, ScheduleConfig } from '../types';

interface HomeViewProps {
  onFileSelected: (file: FileData) => void;
  currentFile: FileData | null;
  onClearFile: () => void;
  onToolSelect: (tool: ToolType | string) => void;
  onGenerateSchedule: (config: ScheduleConfig) => void;
  points: number;
  scheduleCost: number;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onFileSelected, 
  currentFile, 
  onClearFile, 
  onToolSelect,
  onGenerateSchedule,
  points,
  scheduleCost
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'schedule' | 'youtube'>('file');

  // Schedule Form State
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({
      subjects: '',
      focusArea: '',
      weakPoints: '',
      duration: 'أسبوع',
      dailyHours: '4 ساعات',
      restTime: '', // Used for Rest Days
      additionalInstructions: ''
  });

  const handleToolClick = (id: string) => {
    if (id === 'file') setActiveTab('file');
    else if (id === 'schedule') setActiveTab('schedule');
    else if (id === 'youtube') setActiveTab('youtube');
    else onToolSelect(id); // chat
  };

  // Helper for tabs
  const TabButton = ({ id, icon, label, isActive }: { id: string; icon: string; label: string; isActive: boolean }) => (
      <button
        onClick={() => handleToolClick(id)}
        className={`
            flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-bold text-sm
            ${isActive 
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-200 transform scale-105' 
                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}
        `}
      >
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </button>
  );

  return (
    <div className="flex flex-col gap-5 p-4 max-w-md mx-auto w-full animate-fade-in pb-12 font-sans">
      
      {/* Banner: Chat with AI */}
      <div 
        onClick={() => onToolSelect(ToolType.CHAT)}
        className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg cursor-pointer transform transition-all duration-200 bg-gradient-to-br from-indigo-900 to-purple-900 hover:scale-[1.01]"
      >
        <div className="relative z-10 flex flex-col items-start gap-1">
            <span className="bg-cyan-400 text-indigo-900 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">تجربة مجانية</span>
            <h2 className="text-xl font-bold">دردش مع الذكاء الاصطناعي</h2>
            <p className="text-indigo-200 text-xs mt-1">اسأل، ناقش، وأرسل صور وملفات</p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-2">
         <TabButton id="schedule" icon="📅" label="جدول" isActive={activeTab === 'schedule'} />
         <TabButton id="youtube" icon="▶️" label="يوتيوب" isActive={activeTab === 'youtube'} />
         <TabButton id="file" icon="📂" label="ملف" isActive={activeTab === 'file'} />
      </div>

      {/* Dynamic Content Area */}
      <div className="min-h-[200px] transition-all duration-300">
        
        {/* === FILE TAB === */}
        {activeTab === 'file' && (
            <div className="flex flex-col gap-4 animate-fade-in">
                {/* Uploader */}
                <div className="bg-[#1E1B39] rounded-3xl p-1 relative border-2 border-dashed border-indigo-500/30 overflow-hidden min-h-[160px] flex flex-col justify-center">
                    <FileUploader 
                        onFileSelected={onFileSelected} 
                        currentFileName={currentFile?.name || null}
                        onClearFile={onClearFile}
                    />
                </div>
                
                {/* Action Buttons (Visible only in File tab as per request) */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => onToolSelect(ToolType.QUIZ)}
                        className="bg-white border border-indigo-100 p-4 rounded-2xl flex flex-col items-center gap-2 hover:shadow-md transition-all active:scale-95 group"
                    >
                        <span className="text-3xl bg-indigo-50 p-2 rounded-xl group-hover:scale-110 transition-transform">❓</span>
                        <span className="font-bold text-gray-800">كويز</span>
                    </button>
                    <button
                        onClick={() => onToolSelect(ToolType.SUMMARIZE)}
                        className="bg-white border border-indigo-100 p-4 rounded-2xl flex flex-col items-center gap-2 hover:shadow-md transition-all active:scale-95 group"
                    >
                        <span className="text-3xl bg-indigo-50 p-2 rounded-xl group-hover:scale-110 transition-transform">📄</span>
                        <span className="font-bold text-gray-800">تلخيص</span>
                    </button>
                </div>
            </div>
        )}

        {/* === SCHEDULE TAB === */}
        {activeTab === 'schedule' && (
            <div className="flex flex-col gap-4 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📅</span>
                    <h3 className="font-bold text-lg text-gray-800">إعداد الجدول الدراسي</h3>
                </div>

                {/* Subject */}
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">المواد الدراسية</label>
                    <input 
                        type="text"
                        value={scheduleConfig.subjects}
                        onChange={(e) => setScheduleConfig({...scheduleConfig, subjects: e.target.value})}
                        placeholder="رياضيات، فيزياء..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Focus */}
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">الهدف / التركيز</label>
                    <input 
                        type="text"
                        value={scheduleConfig.focusArea}
                        onChange={(e) => setScheduleConfig({...scheduleConfig, focusArea: e.target.value})}
                        placeholder="امتحان نهائي، ختم المنهج..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Weak Points */}
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">نقاط الضعف (للتركيز عليها)</label>
                    <input 
                        type="text"
                        value={scheduleConfig.weakPoints}
                        onChange={(e) => setScheduleConfig({...scheduleConfig, weakPoints: e.target.value})}
                        placeholder="التكامل، القواعد، الحفظ..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Rest Days */}
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">أيام الراحة (الإجازة)</label>
                    <input 
                        type="text"
                        value={scheduleConfig.restTime}
                        onChange={(e) => setScheduleConfig({...scheduleConfig, restTime: e.target.value})}
                        placeholder="الجمعة، السبت..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">المدة الكاملة</label>
                        <select 
                            value={scheduleConfig.duration}
                            onChange={(e) => setScheduleConfig({...scheduleConfig, duration: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option>3 أيام</option>
                            <option>أسبوع</option>
                            <option>أسبوعين</option>
                            <option>شهر</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">الساعات اليومية</label>
                        <select 
                            value={scheduleConfig.dailyHours}
                            onChange={(e) => setScheduleConfig({...scheduleConfig, dailyHours: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option>ساعتين</option>
                            <option>4 ساعات</option>
                            <option>6 ساعات</option>
                            <option>8 ساعات</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={() => onGenerateSchedule(scheduleConfig)}
                    disabled={points < scheduleCost}
                    className={`
                        w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 mt-2 transition-all active:scale-95
                        ${points >= scheduleCost ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}
                    `}
                >
                    <span>إنشاء الجدول</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded">-{scheduleCost} 🥞</span>
                </button>
            </div>
        )}

        {/* === YOUTUBE TAB === */}
        {activeTab === 'youtube' && (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300 animate-fade-in">
                <span className="text-5xl mb-4 grayscale opacity-50">🥞</span>
                <h3 className="text-xl font-bold text-gray-400">قريباً...</h3>
                <p className="text-gray-400 text-sm mt-2">نطبخ ميزة تلخيص الفيديو على نار هادئة</p>
            </div>
        )}

      </div>
    </div>
  );
};