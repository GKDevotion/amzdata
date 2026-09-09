import React from 'react';
import { Code2, RefreshCw, FileText } from 'lucide-react';
import { AmzDataLogo } from './AmzDataLogo';

interface HeaderProps {
  onOpenPythonScript: () => void;
  onOpenExport: () => void;
  onFlushData: () => void;
  hasData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPythonScript,
  onOpenExport,
  onFlushData,
  hasData,
}) => {
  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo with Best Color Combination */}
        <AmzDataLogo size="md" />

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {hasData && (
            <button
              onClick={onFlushData}
              title="Flush all old data and start fresh"
              className="inline-flex items-center px-2.5 sm:px-3 py-2 text-xs font-medium text-stone-600 hover:text-red-700 bg-stone-100 hover:bg-red-50 border border-stone-200 rounded-lg transition-colors cursor-pointer min-h-[38px]"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Flush Data</span>
            </button>
          )}

          <button
            onClick={onOpenExport}
            disabled={!hasData}
            className={`inline-flex items-center px-2.5 sm:px-3 py-2 text-xs font-medium border rounded-lg transition-colors cursor-pointer min-h-[38px] ${
              hasData
                ? 'text-stone-700 bg-white hover:bg-stone-50 border-stone-300'
                : 'text-stone-300 bg-stone-50 border-stone-200 cursor-not-allowed'
            }`}
          >
            <FileText className="w-3.5 h-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Export Scraped Data</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
