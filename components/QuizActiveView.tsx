import React, { useState } from 'react';
import { QuizData } from '../types';

interface QuizActiveViewProps {
  quizData: QuizData;
  onFinish: (score: number, total: number, userAnswers: number[]) => void;
  onCancel: () => void;
}

export const QuizActiveView: React.FC<QuizActiveViewProps> = ({ quizData, onFinish, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(quizData.questions.length).fill(-1));

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate Score
      let score = 0;
      userAnswers.forEach((ans, idx) => {
          if (ans === quizData.questions[idx].correctAnswerIndex) {
              score++;
          }
      });
      onFinish(score, totalQuestions, userAnswers);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 max-w-md mx-auto animate-fade-in relative">
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div 
            className="bg-indigo-600 h-2 transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top Bar */}
      <div className="p-4 flex justify-between items-center text-sm font-bold text-gray-500">
        <span>سؤال {currentQuestionIndex + 1} من {totalQuestions}</span>
        <button onClick={onCancel} className="text-red-400 hover:text-red-600">إلغاء</button>
      </div>

      {/* Question Card */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <h2 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
            {currentQuestion.text}
        </h2>

        <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, idx) => {
                const isSelected = userAnswers[currentQuestionIndex] === idx;
                return (
                    <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`
                            p-4 rounded-2xl border-2 text-right transition-all duration-200
                            ${isSelected 
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md transform scale-[1.01]' 
                                : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:bg-gray-50'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                                ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}
                            `}>
                                {isSelected && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className="font-medium">{option}</span>
                        </div>
                    </button>
                );
            })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex gap-3">
         <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={`flex-1 py-3 rounded-xl font-bold transition-colors
                ${currentQuestionIndex === 0 ? 'bg-gray-100 text-gray-400 opacity-50' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
         >
            السابق
         </button>
         
         <button
            onClick={handleNext}
            disabled={userAnswers[currentQuestionIndex] === -1}
            className={`flex-[2] py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95
                ${userAnswers[currentQuestionIndex] === -1 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'}`}
         >
            {currentQuestionIndex === totalQuestions - 1 ? 'تسليم الإجابات ✅' : 'التالي ➜'}
         </button>
      </div>
    </div>
  );
};