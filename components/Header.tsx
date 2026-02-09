import React from 'react';
import { AppView, TelegramUser } from '../types';

interface HeaderProps {
  points: number;
  currentView: AppView;
  onBack: () => void;
  onOpenWallet: () => void;
  user?: TelegramUser | null;
}

export const Header: React.FC<HeaderProps> = ({ points, currentView, onBack, onOpenWallet, user }) => {
  return (
    <header className="bg-white sticky top-0 z-50 px-4 py-3 shadow-sm border-b border-gray-100">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Left Side: Back Button or User Profile */}
        <div className="flex items-center gap-3">
          {currentView !== 'home' ? (
            <button 
              onClick={onBack}
              className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /> 
              </svg>
            </button>
          ) : user ? (
             // Telegram User Profile
             <div className="flex items-center gap-2 animate-fade-in">
                {user.photo_url ? (
                    <img src={user.photo_url} alt={user.first_name} className="w-9 h-9 rounded-full border border-gray-200" />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
                        {user.first_name.charAt(0)}
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 leading-none">{user.first_name}</span>
                    {user.username && <span className="text-[10px] text-gray-500 font-medium">@{user.username}</span>}
                </div>
             </div>
          ) : (
             // Default Logo
             <div className="flex items-center gap-2">
                 <div className="w-8 h-8 flex items-center justify-center text-2xl">🥞</div>
                 <h1 className="text-xl font-bold text-gray-800 tracking-wide font-sans">
                    Lernix
                 </h1>
             </div>
          )}
        </div>

        {/* Right Side: Stats / Points */}
        <div className="flex items-center gap-3">
            {/* Energy / Points Badge (Clickable) */}
            <button 
                onClick={onOpenWallet}
                className="flex items-center gap-1 bg-gradient-to-r from-pancake-400 to-pancake-500 text-white px-3 py-1.5 rounded-full shadow-sm shadow-pancake-200 active:scale-95 transition-transform"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="font-bold text-sm">{points}</span>
            </button>
        </div>
      </div>
    </header>
  );
};