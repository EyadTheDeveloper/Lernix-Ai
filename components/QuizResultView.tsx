import React from 'react';
import { QuizData } from '../types';

interface QuizResultViewProps {
  score: number;
  total: number;
  userAnswers: number[];
  quizData: QuizData;
  onHome: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({ score, total, userAnswers, quizData, onHome }) => {
  const percentage = Math.round((score / total) * 100);
  
  let message = "";
  let emoji = "";
  
  if (percentage >= 90) { message = "أداء أسطوري! 🥞🔥"; emoji = "👑"; }
  else if (percentage >= 75) { message = "ممتاز جداً! 🤓"; emoji = "🌟"; }
  else if (percentage >= 50) { message = "جيد، تحتاج شوية مراجعة 👍"; emoji = "📚"; }
  else { message = "لا تيأس، حاول مرة ثانية! 💪"; emoji = "💡"; }

  return (
    <div className="flex flex-col h-full bg-gray-50 max-w-md mx-auto animate-fade-in p-4 overflow-y-auto">
      
      {/* Score Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center mb-6 mt-4">
        <div className="text-6xl mb-2">{emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{message}</h2>
        <p className="text-gray-500 text-sm mb-6">لقد أجبت على {score} من {total} أسئلة بشكل صحيح</p>

        <div className="flex items-center justify-center mb-4">
             <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="transform -rotate-90 w-32 h-32">
                    <circle cx="64" cy="64" r="60" stroke="#f3f4f6" strokeWidth="10" fill="transparent" />
                    <circle 
                        cx="64" cy="64" r="60" 
                        stroke={percentage > 50 ? "#4f46e5" : "#f59e0b"} 
                        strokeWidth="10" 
                        fill="transparent" 
                        strokeDasharray={377} 
                        strokeDashoffset={377 - (377 * percentage) / 100} 
                        strokeLinecap="round"
                    />
                </svg>
                <span className="absolute text-3xl font-black text-gray-800">{percentage}%</span>
             </div>
        </div>
      </div>

      <h3 className="font-bold text-gray-700 mb-3 px-1">مراجعة الإجابات</h3>

      {/* Review List */}
      <div className="flex flex-col gap-4 pb-20">
        {quizData.questions.map((q, idx) => {
            const userAnswer = userAnswers[idx];
            const isCorrect = userAnswer === q.correctAnswerIndex;
            
            return (
                <div key={q.id} className={`bg-white p-4 rounded-2xl border ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                    <div className="flex items-start gap-2 mb-2">
                        <span className={`text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {idx + 1}
                        </span>
                        <p className="font-medium text-gray-800">{q.text}</p>
                    </div>

                    <div className="space-y-1 pr-8">
                        {q.options.map((opt, optIdx) => {
                            let itemClass = "text-sm p-2 rounded-lg border border-transparent";
                            
                            // User selected this and it's WRONG
                            if (userAnswer === optIdx && !isCorrect) {
                                itemClass = "text-sm p-2 rounded-lg bg-red-50 text-red-700 border-red-200 font-medium";
                            }
                            // This is the CORRECT answer
                            else if (optIdx === q.correctAnswerIndex) {
                                itemClass = "text-sm p-2 rounded-lg bg-green-50 text-green-700 border-green-200 font-medium";
                            }
                            // Default
                            else {
                                itemClass = "text-sm p-2 rounded-lg text-gray-500";
                            }

                            return (
                                <div key={optIdx} className={itemClass}>
                                    {opt}
                                    {optIdx === q.correctAnswerIndex && <span className="mr-2 text-xs">✅ إجابة صحيحة</span>}
                                    {userAnswer === optIdx && !isCorrect && <span className="mr-2 text-xs">❌ إجابتك</span>}
                                </div>
                            )
                        })}
                    </div>
                    
                    {q.explanation && !isCorrect && (
                        <div className="mt-3 mr-8 bg-blue-50 p-2 rounded-lg text-xs text-blue-800 leading-relaxed">
                            💡 <b>توضيح:</b> {q.explanation}
                        </div>
                    )}
                </div>
            )
        })}
      </div>

      {/* Home Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
            onClick={onHome}
            className="w-full max-w-md mx-auto py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-colors"
        >
            العودة للرئيسية 🏠
        </button>
      </div>
    </div>
  );
};