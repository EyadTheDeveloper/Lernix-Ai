import React, { useState } from 'react';
import { ScheduleConfig } from '../types';

interface ScheduleConfigViewProps {
  onGenerate: (config: ScheduleConfig) => void;
  onBack: () => void;
  points: number;
  cost: number;
}

export const ScheduleConfigView: React.FC<ScheduleConfigViewProps> = ({ onGenerate, onBack, points, cost }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ScheduleConfig>({
    subjects: '',
    focusArea: '',
    weakPoints: '',
    duration: 'أسبوع',
    dailyHours: '4 ساعات',
    restTime: '',
    additionalInstructions: ''
  });

  const durationOptions = [
    { label: '3 أيام', value: '3 أيام' },
    { label: 'أسبوع', value: 'أسبوع' },
    { label: 'أسبوعين', value: 'أسبوعين' },
    { label: 'شهر', value: 'شهر' },
  ];

  const hoursOptions = [
    '2 ساعات', '3 ساعات', '4 ساعات', '5 ساعات', '6 ساعات', '8 ساعات'
  ];

  const handleGenerate = () => {
    onGenerate(config);
  };

  return (
    <div className="flex flex-col h-full bg-[#1E1B39] text-white overflow-y-auto animate-fade-in pb-20">
       
       {/* Header with Back */}
       <div className="sticky top-0 z-10 bg-[#1E1B39]/90 backdrop-blur-sm p-4 border-b border-white/10 flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /> 
              </svg>
          </button>
          <div>
            <h2 className="text-xl font-bold">أنشئ جدولك الدراسي 📅</h2>
            <p className="text-xs text-gray-400">أخبرني عن موادك وسأنظم لك دراستك</p>
          </div>
       </div>

       <div className="p-5 flex flex-col gap-6">

          {/* Section 1: Subjects */}
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-purple-300 font-bold mb-1">
                <span>📖</span>
                <h3>ما هي المواد التي تدرسها؟</h3>
             </div>
             <textarea 
                value={config.subjects}
                onChange={(e) => setConfig({...config, subjects: e.target.value})}
                placeholder="مثال: رياضيات، فيزياء، كيمياء، إنجليزي..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[80px]"
             />
          </div>

          {/* Section 2: Focus */}
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-purple-300 font-bold mb-1">
                <span>🎯</span>
                <h3>ما الذي تريد التركيز عليه؟</h3>
             </div>
             <textarea 
                value={config.focusArea}
                onChange={(e) => setConfig({...config, focusArea: e.target.value})}
                placeholder="مثال: عندي امتحان رياضيات بعد أسبوع، أحتاج مراجعة..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[80px]"
             />
          </div>

          {/* Section 3: Weaknesses */}
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-purple-300 font-bold mb-1">
                <span>⚠️</span>
                <h3>ما نقاط ضعفك؟</h3>
             </div>
             <textarea 
                value={config.weakPoints}
                onChange={(e) => setConfig({...config, weakPoints: e.target.value})}
                placeholder="مثال: صعوبة في التكامل، نسيان القوانين..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[80px]"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 4: Duration */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold mb-1">
                    <span>⏳</span>
                    <h3>مدة الجدول</h3>
                </div>
                <div className="flex flex-col gap-2">
                    {durationOptions.map((opt) => (
                        <label key={opt.value} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                            <span className="text-sm font-medium">{opt.label}</span>
                            <div className="relative flex items-center">
                                <input 
                                    type="radio" 
                                    name="duration" 
                                    className="peer h-5 w-5 appearance-none rounded-full border border-gray-400 checked:border-purple-500"
                                    checked={config.duration === opt.value}
                                    onChange={() => setConfig({...config, duration: opt.value})}
                                />
                                <div className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Section 5: Daily Hours */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold mb-1">
                    <span>⏰</span>
                    <h3>ساعات الدراسة اليومية</h3>
                </div>
                <div className="flex flex-col gap-2">
                    {hoursOptions.map((opt) => (
                        <label key={opt} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                            <span className="text-sm font-medium">{opt}</span>
                            <div className="relative flex items-center">
                                <input 
                                    type="radio" 
                                    name="hours" 
                                    className="peer h-5 w-5 appearance-none rounded-full border border-gray-400 checked:border-purple-500"
                                    checked={config.dailyHours === opt}
                                    onChange={() => setConfig({...config, dailyHours: opt})}
                                />
                                <div className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
          </div>

          {/* Section 6: Rest Times */}
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-purple-300 font-bold mb-1">
                <span>🌙</span>
                <h3>أوقات الراحة والنوم</h3>
             </div>
             <input 
                type="text"
                value={config.restTime}
                onChange={(e) => setConfig({...config, restTime: e.target.value})}
                placeholder="مثال: أنام 11 مساءً، راحة الجمعة..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
             />
          </div>

          {/* Section 7: Extra Instructions */}
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-purple-300 font-bold mb-1">
                <span>💬</span>
                <h3>تعليمات إضافية (اختياري)</h3>
             </div>
             <textarea 
                value={config.additionalInstructions}
                onChange={(e) => setConfig({...config, additionalInstructions: e.target.value})}
                placeholder="مثال: ركز على الأفعال، لخص النقاط الرئيسية..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none min-h-[80px]"
             />
          </div>
       </div>

       {/* Action Button */}
       <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#1E1B39]/90 backdrop-blur-md z-20">
            <button
                onClick={handleGenerate}
                disabled={points < cost}
                className={`w-full max-w-md mx-auto py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95
                ${points >= cost 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
            >
                <span>ابدأ بصنع الجدول</span>
                <span className="text-xl">✨</span>
                <span className="text-xs bg-black/20 px-2 py-0.5 rounded ml-2">-{cost} فطيرة</span>
            </button>
       </div>
    </div>
  );
};