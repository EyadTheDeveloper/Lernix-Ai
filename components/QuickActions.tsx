import React from 'react';
import { QuickAction } from '../types';

interface QuickActionsProps {
  onAction: (action: string) => void;
  disabled: boolean;
  hasFile: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction, disabled, hasFile }) => {
  if (!hasFile) return null;

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2 no-scrollbar pb-4">
      {Object.values(QuickAction).map((action) => (
        <button
          key={action}
          onClick={() => onAction(action)}
          disabled={disabled}
          className={`
            whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold shadow-sm border
            transition-all duration-200 transform active:scale-95
            ${disabled 
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                : 'bg-white text-pancake-700 border-pancake-200 hover:bg-pancake-50 hover:border-pancake-300'}
          `}
        >
          {action}
        </button>
      ))}
    </div>
  );
};