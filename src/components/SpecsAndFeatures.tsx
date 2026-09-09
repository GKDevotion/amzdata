import React, { useState } from 'react';
import { CheckCircle, Search, SlidersHorizontal, Copy, Check, Info } from 'lucide-react';

interface SpecsAndFeaturesProps {
  features: string[];
  specs: Record<string, string>;
  brand: string;
  model?: string;
}

export const SpecsAndFeatures: React.FC<SpecsAndFeaturesProps> = ({
  features,
  specs,
  brand,
  model,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const specEntries = Object.entries(specs);
  const filteredSpecs = specEntries.filter(([key, val]) =>
    String(key).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(val).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyAllSpecs = () => {
    const text = specEntries.map(([k, v]) => `${k}: ${v}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Bullet Points / About This Item */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs">
        <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-600" />
          About This Item (Key Features)
        </h3>

        <div className="space-y-3">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition-colors">
              <span className="p-1 rounded-full bg-amber-50 text-amber-600 mt-0.5 shrink-0">
                <CheckCircle className="w-4 h-4" />
              </span>
              <p className="text-sm text-stone-700 leading-relaxed">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Specifications Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-amber-600" />
              Technical Specifications & Product Details
            </h3>
            <p className="text-xs text-stone-500">
              Extracted from technical tables and manufacturer attributes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter specs..."
                className="text-xs pl-8 pr-3 py-1.5 border border-stone-300 rounded-lg bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              onClick={handleCopyAllSpecs}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1 text-stone-500" />
                  <span>Copy Specs</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Specs Table */}
        <div className="overflow-hidden border border-stone-200 rounded-xl">
          <table className="min-w-full divide-y divide-stone-200 text-left">
            <thead className="bg-stone-50 text-stone-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3 w-1/3">
                  Specification Attribute
                </th>
                <th scope="col" className="px-5 py-3 w-2/3">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white text-xs sm:text-sm">
              {filteredSpecs.length > 0 ? (
                filteredSpecs.map(([key, val], idx) => (
                  <tr
                    key={key}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}
                  >
                    <td className="px-5 py-3 font-semibold text-stone-900 border-r border-stone-100">
                      {key}
                    </td>
                    <td className="px-5 py-3 text-stone-700 font-mono text-xs sm:text-sm">
                      {val}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-5 py-6 text-center text-stone-400 text-xs">
                    No specifications match "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
