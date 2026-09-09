import React, { useState } from 'react';
import { Search, RotateCcw, ArrowRight, CheckCircle2, AlertCircle, Link2, X } from 'lucide-react';

interface UrlInputBarProps {
  url: string;
  setUrl: (url: string) => void;
  onScrape: (customUrl?: string) => void;
  onFlush: () => void;
  isLoading: boolean;
  loadingStage?: string;
  hasData: boolean;
}

export const PRESET_URLS = [
  {
    label: 'Apollo Amazer 4G LIFE (Requested Item)',
    url: 'https://www.amazon.in/Apollo-Amazer-4G-LIFE-Tubeless/dp/B0792G6PF9',
    asin: 'B0792G6PF9',
  },
  {
    label: 'MRF ZVTS Tubeless Tyre',
    url: 'https://www.amazon.in/MRF-ZVTS-165-Tubeless-Tyre/dp/B07G4T47F4',
    asin: 'B07G4T47F4',
  },
  {
    label: 'CEAT Milaze X3 Tubeless Tyre',
    url: 'https://www.amazon.in/CEAT-Milaze-Tubeless-Tyre-Cars/dp/B0764BDQ7J',
    asin: 'B0764BDQ7J',
  },
];

export const UrlInputBar: React.FC<UrlInputBarProps> = ({
  url,
  setUrl,
  onScrape,
  onFlush,
  isLoading,
  loadingStage,
  hasData,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter an Amazon product URL or ASIN');
      return;
    }
    setError(null);
    onScrape(url.trim());
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrl(presetUrl);
    setError(null);
    onScrape(presetUrl);
  };

  return (
    <section aria-label="Amazon Product URL Input" className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Dynamic Amazon Product URL Input</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Paste any Amazon India (.in) or Global (.com) product URL or 10-digit ASIN
          </p>
        </div>

        {hasData && (
          <button
            type="button"
            onClick={onFlush}
            disabled={isLoading}
            className="self-start sm:self-auto inline-flex items-center text-xs font-semibold text-stone-600 hover:text-red-700 bg-stone-50 hover:bg-red-50 border border-stone-200 px-3 py-2 rounded-lg transition-colors cursor-pointer min-h-[40px]"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
            Flush Data & Reset
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Responsive Input & Button Container */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Search className="h-4 w-4" />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="https://www.amazon.in/Apollo-Amazer-4G-LIFE-Tubeless/dp/B0792G6PF9"
              disabled={isLoading}
              className="block w-full pl-10 pr-10 py-3 sm:py-3.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-mono min-h-[44px]"
            />

            {url && !isLoading && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="absolute right-3 p-1 text-stone-400 hover:text-stone-600 rounded-md cursor-pointer"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer min-h-[44px] shrink-0"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>Scraping...</span>
              </>
            ) : (
              <>
                <span>Scrape Product</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1.5 pt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </p>
        )}

        {/* Quick Presets */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 font-medium mr-1">Quick Select:</span>
          {PRESET_URLS.map((preset) => {
            const isSelected = url === preset.url;
            return (
              <button
                key={preset.asin}
                type="button"
                onClick={() => handleSelectPreset(preset.url)}
                disabled={isLoading}
                className={`inline-flex items-center text-xs px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer min-h-[34px] ${
                  isSelected
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold shadow-2xs'
                    : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3 h-3 text-amber-600 mr-1 shrink-0" />}
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Progress status when loading */}
        {isLoading && (
          <div className="mt-3 p-3 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
              <span className="font-medium">
                {loadingStage || 'Extracting Amazon Product Details, FHD Images, and Reviews...'}
              </span>
            </div>
            <span className="text-amber-700 font-mono text-[11px] hidden sm:inline">Connecting to DOM & CDN</span>
          </div>
        )}
      </form>
    </section>
  );
};
