import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, Copy, Check } from 'lucide-react';
import { ProductDetails } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetails | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(product, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `amzdata_${product.asin}_details.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadReviewsCsv = () => {
    const headers = ['Author', 'Rating', 'Title', 'Date', 'Verified Purchase', 'Helpful Count', 'Review Body'];
    const rows = product.reviews.map((r) => [
      `"${(r.author || '').replace(/"/g, '""')}"`,
      `"${r.rating}"`,
      `"${(r.title || '').replace(/"/g, '""')}"`,
      `"${(r.date || '').replace(/"/g, '""')}"`,
      r.verifiedPurchase ? 'Yes' : 'No',
      `"${(r.helpfulCount || '0').replace(/"/g, '""')}"`,
      `"${(r.body || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `amzdata_${product.asin}_reviews.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSpecsCsv = () => {
    const headers = ['Specification Key', 'Value'];
    const rows = Object.entries(product.specs).map(([k, v]) => [
      `"${String(k || '').replace(/"/g, '""')}"`,
      `"${String(v || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `amzdata_${product.asin}_specs.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadDescriptionTxt = () => {
    const descText = [
      `PRODUCT: ${product.title}`,
      `ASIN: ${product.asin}`,
      `BRAND: ${product.brand}`,
      `URL: ${product.url}`,
      `PRICE: ${product.pricing.currentPrice} (${product.pricing.discountPercentage})`,
      '\n' + '='.repeat(60),
      'PRODUCT DESCRIPTION',
      '='.repeat(60),
      product.description || product.features.join('\n\n'),
      '\n' + '='.repeat(60),
      'KEY BULLET FEATURES',
      '='.repeat(60),
      ...product.features.map((f, i) => `${i + 1}. ${f}`),
      ...(product.aplusContent && product.aplusContent.length > 0 ? [
        '\n' + '='.repeat(60),
        'FROM THE MANUFACTURER (A+ CONTENT)',
        '='.repeat(60),
        ...product.aplusContent.map(a => `[${a.title}] ${a.heading ? `\n${a.heading}` : ''}\n${a.body}\n`),
      ] : []),
      ...(product.importantInformation ? [
        '\n' + '='.repeat(60),
        'IMPORTANT INFORMATION',
        '='.repeat(60),
        ...Object.entries(product.importantInformation).map(([k, v]) => `${k}:\n${v}\n`),
      ] : []),
    ].join('\n');

    const blob = new Blob([descText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `amzdata_${product.asin}_descriptions.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(product, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-amber-600" />
            <span>Export Scraped Data</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <button
            onClick={handleDownloadJson}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-stone-100 group-hover:bg-amber-100 text-stone-700 group-hover:text-amber-800 transition-colors">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-stone-900">Complete JSON Package</h4>
                <p className="text-xs text-stone-500">Includes details, pricing, FHD URLs, and reviews</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-stone-400 group-hover:text-amber-600" />
          </button>

          <button
            onClick={handleDownloadReviewsCsv}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-stone-100 group-hover:bg-amber-100 text-stone-700 group-hover:text-amber-800 transition-colors">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-stone-900">Customer Reviews CSV</h4>
                <p className="text-xs text-stone-500">Structured table of {product.reviews.length} customer reviews</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-stone-400 group-hover:text-amber-600" />
          </button>

          <button
            onClick={handleDownloadSpecsCsv}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-stone-100 group-hover:bg-amber-100 text-stone-700 group-hover:text-amber-800 transition-colors">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-stone-900">Technical Specs CSV</h4>
                <p className="text-xs text-stone-500">Attributes: Rim, width, aspect ratio, speed rating</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-stone-400 group-hover:text-amber-600" />
          </button>

          <button
            onClick={handleDownloadDescriptionTxt}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-stone-100 group-hover:bg-amber-100 text-stone-700 group-hover:text-amber-800 transition-colors">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-stone-900">Product Descriptions (TXT)</h4>
                <p className="text-xs text-stone-500">Editorial description, A+ content, and guidelines</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-stone-400 group-hover:text-amber-600" />
          </button>
        </div>

        <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={handleCopyJson}
            className="inline-flex items-center text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span>Copied JSON!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1 text-stone-500" />
                <span>Copy JSON to Clipboard</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
