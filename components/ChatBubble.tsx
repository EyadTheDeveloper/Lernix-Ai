import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`relative max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
        ${
          isUser
            ? 'bg-pancake-500 text-white rounded-tr-none'
            : 'bg-white text-gray-800 rounded-tl-none border border-pancake-100'
        }
        ${message.isError ? 'bg-red-100 text-red-600 border-red-200' : ''}
        `}
      >
        {/* Avatar / Icon */}
        <div className={`absolute -top-6 ${isUser ? '-right-2' : '-left-2'} text-xl`}>
            {isUser ? '👤' : '🥞'}
        </div>

        {isUser ? (
          <p className="whitespace-pre-wrap">{message.text}</p>
        ) : (
          <div className="prose prose-sm prose-p:text-gray-800 prose-headings:text-pancake-900 prose-a:text-blue-600 prose-strong:text-pancake-800">
             <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};