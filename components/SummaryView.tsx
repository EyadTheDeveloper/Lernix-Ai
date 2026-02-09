import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';

// Declare html2pdf for TypeScript since it's loaded via CDN
declare const html2pdf: any;

interface SummaryViewProps {
  content: string;
  fileName: string;
  onBack: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ content, fileName, onBack }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!contentRef.current) return;

    const element = contentRef.current;
    const opt = {
      margin:       [10, 10, 10, 10], // top, left, bottom, right
      filename:     `ملخص_${fileName.replace(/\.[^/.]+$/, "")}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Use the global html2pdf library from CDN
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col h-full bg-gray-800/90 fixed inset-0 z-50 animate-fade-in backdrop-blur-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/10 text-white backdrop-blur-md">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <span className="font-bold">معاينة الملخص</span>
        <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
        >
            <span>تحميل PDF</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        </button>
      </div>

      {/* PDF Viewer Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
        <div className="max-w-[210mm] w-full bg-white shadow-2xl min-h-[297mm] p-[15mm] md:p-[20mm] rounded-sm relative">
            
            {/* Watermark */}
            <div className="absolute top-4 left-4 opacity-10 font-black text-6xl text-gray-400 rotate-[-15deg] select-none pointer-events-none">
                Lernix 🥞
            </div>

            {/* Printable Content */}
            <div ref={contentRef} className="print-content text-right" dir="rtl">
                 <div className="flex items-center gap-2 mb-6 border-b-2 border-indigo-100 pb-4">
                    <span className="text-3xl">🥞</span>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 m-0 leading-none">ملخص دراسي</h1>
                        <p className="text-xs text-gray-400 mt-1">تم إنشاؤه بواسطة Lernix AI</p>
                    </div>
                 </div>

                 <div className="prose prose-sm prose-p:text-gray-700 prose-headings:text-indigo-900 max-w-none prose-li:text-gray-700">
                    <ReactMarkdown>{content}</ReactMarkdown>
                 </div>

                 <div className="mt-12 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
                    تم التلخيص بمساعدة الذكاء الاصطناعي - Lernix 🥞
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
};