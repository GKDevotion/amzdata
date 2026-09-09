import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ProductDetails } from '../types';

interface ProductDescriptionsProps {
  product: ProductDetails;
}

export const ProductDescriptions: React.FC<ProductDescriptionsProps> = ({ product }) => {
  const [copied, setCopied] = useState(false);

  const paragraphs = product.descriptionParagraphs && product.descriptionParagraphs.length > 0
    ? product.descriptionParagraphs
    : product.description
      ? product.description.split('\n\n').filter(p => p.trim().length > 0)
      : [
          `The ${product.title} from ${product.brand} offers exceptional performance, reliability, and precision engineering built to meet demanding everyday standards.`,
          `Engineered with premium materials and rigorous quality control, this product delivers dependable longevity and optimal functionality.`,
        ];

  const fullDescriptionText = paragraphs.join('\n\n');
  const wordCount = fullDescriptionText.split(/\s+/).filter(Boolean).length;

  const handleCopyDescription = () => {
    navigator.clipboard.writeText(fullDescriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const aplusItems = product.aplusContent && product.aplusContent.length > 0
    ? product.aplusContent
    : [];

  const importantInfoEntries = product.importantInformation
    ? Object.entries(product.importantInformation)
    : [];

  return (
    <div className="space-y-6">
      {/* Primary Product Description Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Product Description & Editorial Overview
              </h3>
              <p className="text-xs text-stone-500">
                Official Amazon catalog listing copy & manufacturer narratives
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 text-xs font-medium">
              {wordCount} words
            </span>
            <button
              onClick={handleCopyDescription}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer gap-1.5"
              title="Copy entire description to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Formatted Paragraphs */}
        <div className="space-y-4 text-stone-700 text-sm leading-relaxed max-w-4xl">
          {paragraphs.map((paragraph, idx) => (
            <p
              key={idx}
              className={`p-4 rounded-xl transition-colors ${
                idx === 0
                  ? 'bg-amber-50/40 border border-amber-100 text-stone-800 font-normal leading-relaxed'
                  : 'bg-stone-50/60 border border-stone-100'
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* From the Manufacturer (A+ Content / Enhanced Brand Content) */}
      {aplusItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                From the Manufacturer (A+ Content)
              </h3>
              <p className="text-xs text-stone-500">
                Verified brand module content and feature engineering spotlights
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aplusItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="group p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-300 hover:shadow-sm transition-all flex flex-col"
              >
                {item.badge && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100/70 border border-amber-200 text-amber-800 text-[11px] font-semibold self-start mb-3">
                    <Award className="w-3 h-3 text-amber-600" />
                    <span>{item.badge}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {item.imageUrl && (
                    <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0 flex items-center justify-center p-1.5 shadow-2xs">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                      {item.title}
                    </h4>
                    {item.heading && item.heading !== item.title && (
                      <p className="text-xs font-semibold text-amber-700 mt-0.5">
                        {item.heading}
                      </p>
                    )}
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Important Information / Usage Guidance */}
      {importantInfoEntries.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-stone-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Important Information & Product Directives
              </h3>
              <p className="text-xs text-stone-500">
                Safety notices, warranty conditions, and legal guidelines
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {importantInfoEntries.map(([title, detail], idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-stone-900 font-semibold text-xs mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{title}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
