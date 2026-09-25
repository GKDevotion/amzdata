import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Tag,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
  Info
} from 'lucide-react';
import { ProductDetails } from '../types';

interface ProductDescriptionsProps {
  product: ProductDetails;
}

export const ProductDescriptions: React.FC<ProductDescriptionsProps> = ({ product }) => {
  const [copied, setCopied] = useState(false);

  // Formatted paragraphs
  const paragraphs = React.useMemo(() => {
    if (product.descriptionParagraphs && product.descriptionParagraphs.length > 0) {
      return product.descriptionParagraphs.filter((p) => p.trim().length > 0);
    }
    if (product.description) {
      const split = product.description.split('\n\n').filter((p) => p.trim().length > 0);
      if (split.length > 0) return split;
    }
    return [
      `The ${product.title} from ${product.brand} delivers authentic craftsmanship, functional elegance, and dependable durability.`,
      `Engineered with verified materials and precision manufacturing, this item is tailored for home, kitchen, and everyday lifestyle needs.`
    ];
  }, [product.descriptionParagraphs, product.description, product.title, product.brand]);

  const fullDescriptionText = paragraphs.join('\n\n');
  const wordCount = fullDescriptionText.split(/\s+/).filter(Boolean).length;
  const estimatedReadMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopyDescription = () => {
    navigator.clipboard.writeText(fullDescriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Structured Catalog Description Attributes (Specs that describe physical/functional attributes)
  const catalogAttributes = React.useMemo(() => {
    const relevantKeys = [
      'Brand',
      'Material Type',
      'Material',
      'Colour',
      'Capacity',
      'Item Dimensions L x W x H',
      'Item Dimensions',
      'Item Weight',
      'Size',
      'Shape',
      'Container Shape',
      'Closure Type',
      'Finish Type',
      'Pattern',
      'Theme',
      'Included Components',
      'Item Type Name',
      'Model',
      'Item model number',
      'Country of Origin',
      'Manufacturer',
    ];

    const entries: Array<{ key: string; value: string }> = [];
    const usedKeys = new Set<string>();

    // First check prioritised keys
    relevantKeys.forEach((k) => {
      if (product.specs && product.specs[k] && !usedKeys.has(k)) {
        entries.push({ key: k, value: product.specs[k] });
        usedKeys.add(k);
      }
    });

    // Then check any remaining descriptive keys
    if (product.specs) {
      Object.entries(product.specs).forEach(([k, v]) => {
        if (!usedKeys.has(k) && !k.toLowerCase().includes('asin') && entries.length < 12) {
          entries.push({ key: k, value: String(v) });
          usedKeys.add(k);
        }
      });
    }

    return entries;
  }, [product.specs]);

  const importantInfoEntries = product.importantInformation
    ? Object.entries(product.importantInformation)
    : [];

  return (
    <div className="space-y-6">
      {/* Editorial Overview Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Product Description & Editorial Copy
              </h3>
              <p className="text-xs text-stone-500">
                Official Amazon catalog listing description & narrative presentation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 text-xs font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>{estimatedReadMinutes} min read ({wordCount} words)</span>
            </span>

            <button
              type="button"
              onClick={handleCopyDescription}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer gap-1.5"
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

        {/* Formatted Paragraph Blocks */}
        <div className="space-y-3.5 text-stone-700 text-sm leading-relaxed max-w-4xl">
          {paragraphs.map((paragraph, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl transition-colors ${
                idx === 0
                  ? 'bg-amber-50/50 border border-amber-200/60 text-stone-900 font-normal leading-relaxed'
                  : 'bg-stone-50/70 border border-stone-200/60 text-stone-700'
              }`}
            >
              <p className="leading-relaxed">{paragraph}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Description Attributes Grid */}
      {catalogAttributes.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 tracking-tight">
                Catalog Description Attributes & Values
              </h3>
              <p className="text-xs text-stone-500">
                Standardized product dimensions, material attributes, and item classifications
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {catalogAttributes.map(({ key, value }, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-amber-300 transition-colors flex flex-col justify-between"
              >
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1 block">
                  {key}
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-900 break-words">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Feature Takeaways */}
      {product.features && product.features.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 tracking-tight">
                Key Product Highlights & Takeaways
              </h3>
              <p className="text-xs text-stone-500">
                Core selling propositions and functional benefits
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {product.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-stone-50/60 border border-stone-100"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Important Information / Product Directives */}
      {importantInfoEntries.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-stone-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 tracking-tight">
                Important Product Directives & Guidance
              </h3>
              <p className="text-xs text-stone-500">
                Usage recommendations, safety warnings, and warranty terms
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {importantInfoEntries.map(([title, detail], idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-stone-50/60 border border-stone-200 flex flex-col justify-between"
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
