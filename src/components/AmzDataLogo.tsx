import React from 'react';

interface AmzDataLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const AmzDataLogo: React.FC<AmzDataLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Visual Logo Mark with Best Color Combination: Obsidian #0F172A, Amber #FF9900 & Cyan #06B6D4 */}
      <div className={`relative ${iconDimensions} rounded-xl overflow-hidden shadow-xs border border-amber-500/30 group shrink-0 bg-stone-950 flex items-center justify-center`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/40 via-cyan-500/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Real Generated Logo Image with SVG fallback */}
        <img
          src="/amzdata_logo.jpg"
          alt="AmzData Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover relative z-10"
          onError={(e) => {
            // Fallback to inline vector if image is not yet rendered
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback geometric vector mark */}
        <div className="absolute inset-0 z-0 flex items-center justify-center p-1.5">
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <rect width="40" height="40" rx="8" fill="#0F172A" />
            {/* Dynamic stylized A & data cube */}
            <path
              d="M20 7L32 29H24.5L20 20L15.5 29H8L20 7Z"
              fill="url(#amzGrad)"
            />
            {/* Amazon-style dynamic curved smile/arrow */}
            <path
              d="M11 31C16 35 24 35 29 31"
              stroke="#FF9900"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="20" cy="18" r="3" fill="#06B6D4" />
            <defs>
              <linearGradient id="amzGrad" x1="8" y1="7" x2="32" y2="29" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF9900" />
                <stop offset="1" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className={`font-black tracking-tight text-stone-900 ${textSize} font-sans`}>
              Amz<span className="text-amber-600">Data</span>
            </span>
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              PRO
            </span>
          </div>
          <span className="text-[10px] text-stone-500 font-medium tracking-wide uppercase">
            Product & FHD Image Scraper
          </span>
        </div>
      )}
    </div>
  );
};
