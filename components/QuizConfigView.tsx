import React, { useState } from 'react';
import { QuizConfig } from '../types';

interface QuizConfigViewProps {
  onStartQuiz: (config: QuizConfig) => void;
  points: number;
  cost: number;
}

export const QuizConfigView: React.FC<QuizConfigViewProps> = ({ onStartQuiz, points, cost }) => {
  const [config, setConfig] = useState<QuizConfig>({
    questionCount: 5,
    includeMultipleChoice: true,
    includeTrueFalse: false,
    instructions: ''
  });

  const handleStart = () => {
    onStartQuiz(config);
  };

  return (
    <div className="p-4 max-w-md mx-auto w-full animate-fade-in text-gray-800">
      
      {/* Question Count */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-700">عدد الأسئلة</h3>
            <span className="text-indigo-600 font-bold">#</span>
        </div>
        <div className="flex gap-2">
            {[5, 10, 15].map(num => (
                <button
                    key={num}
                    onClick={() => setConfig({...config, questionCount: num})}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all
                    ${config.questionCount === num 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                    {num}
                </button>
            ))}
        </div>
      </div>

      {/* Question Types */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-700">أنواع الأسئلة</h3>
            <span className="text-indigo-600 font-bold">📚</span>
        </div>
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => setConfig({...config, includeMultipleChoice: !config.includeMultipleChoice})}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${config.includeMultipleChoice ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-gray-50 text-gray-400 border border-gray-200'}`}
            >
                {config.includeMultipleChoice && <span>✓</span>}
                متنوع / اختياري
            </button>
             <button
                onClick={() => setConfig({...config, includeTrueFalse: !config.includeTrueFalse})}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${config.includeTrueFalse ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-gray-50 text-gray-400 border border-gray-200'}`}
            >
                {config.includeTrueFalse && <span>✓</span>}
                صح/خطأ
            </button>
             <button disabled className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed">
                ترتيب (قريباً)
            </button>
        </div>
      </div>

      {/* Additional Instructions */}
      <div className="bg-[#2D2B4A] p-4 rounded-2xl shadow-sm mb-6 text-white">
        <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm">تعليمات إضافية (اختياري)</h3>
            <span className="text-gray-400">💬</span>
        </div>
        <textarea
            value={config.instructions}
            onChange={(e) => setConfig({...config, instructions: e.target.value})}
            placeholder="مثال: ركز على الأفعال، صعّب الأسئلة، لخص النقاط الرئيسية..."
            className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
        />
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        disabled={points < cost}
        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95
        ${points >= cost 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        <span>ابدأ الكويز</span>
        <span className="text-xl">✨</span>
        <span className="text-xs bg-black/20 px-2 py-0.5 rounded ml-2">-{cost} فطيرة</span>
      </button>
      {points < cost && (
        <p className="text-center text-red-500 text-xs mt-2 font-medium">عفواً، لا تملك نقاط كافية (تحتاج {cost})</p>
      )}
    </div>
  );
};