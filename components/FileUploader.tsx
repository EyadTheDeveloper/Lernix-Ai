import React, { useRef, useState } from 'react';
import { FileData } from '../types';

interface FileUploaderProps {
  onFileSelected: (file: FileData) => void;
  currentFileName: string | null;
  onClearFile: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected, currentFileName, onClearFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
    // Reset value so same file can be selected again if cleared
    event.target.value = '';
  };

  const processFile = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      alert('المرجو رفع ملف PDF أو صورة 🥞');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        
        onFileSelected({
            name: file.name,
            mimeType: file.type,
            data: base64String
        });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  if (currentFileName) {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 animate-fade-in">
              <div className="bg-indigo-600 p-4 rounded-full mb-3 shadow-lg shadow-indigo-500/50">
                <span className="text-3xl">📄</span>
              </div>
              <p className="text-white font-bold text-center break-all max-w-[90%] mb-1 line-clamp-2">{currentFileName}</p>
              <p className="text-indigo-300 text-xs mb-4">تم رفع الملف بنجاح</p>
              
              <button 
                onClick={(e) => { e.stopPropagation(); onClearFile(); }}
                className="flex items-center gap-2 text-red-100 bg-red-500/20 border border-red-500/30 px-4 py-2 rounded-full text-xs font-medium hover:bg-red-500/30 transition-colors"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  حذف الملف
              </button>
          </div>
      )
  }

  return (
    <div
        className={`
            w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-6 min-h-[220px]
            ${isDragging ? 'bg-indigo-500/20 scale-95' : 'hover:bg-white/5'}
        `}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf,image/*"
          className="hidden"
        />
        <div className="bg-indigo-600 p-4 rounded-2xl mb-4 shadow-lg shadow-indigo-900/50 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
        </div>
        <p className="text-white font-bold text-lg text-center">اسحب الملفات هنا أو اضغط للرفع</p>
        <p className="text-indigo-300 text-sm mt-1 text-center">صور متعددة أو ملف PDF</p>
    </div>
  );
};