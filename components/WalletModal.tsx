import React from 'react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  canClaimDaily: boolean;
  onClaimDaily: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, points, canClaimDaily, onClaimDaily }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl transform transition-all scale-100 animate-fade-in text-center">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-5xl shadow-inner">
                🥞
            </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">محفظة الفطائر</h2>
        <p className="text-gray-500 text-sm mb-6">رصيدك الحالي</p>

        <div className="text-4xl font-black text-indigo-600 mb-8 tracking-tight">
            {points} <span className="text-xl text-gray-400 font-medium">فطيرة</span>
        </div>

        {canClaimDaily ? (
            <button
                onClick={onClaimDaily}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 transform transition hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
                <span>🎁 استلام المكافأة اليومية</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm">+5</span>
            </button>
        ) : (
            <button
                disabled
                className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-2xl cursor-not-allowed border border-gray-200"
            >
                ✅ تم استلام مكافأة اليوم
            </button>
        )}
        
        <p className="mt-4 text-xs text-gray-400">عد غداً للحصول على المزيد من الفطائر!</p>
      </div>
    </div>
  );
};