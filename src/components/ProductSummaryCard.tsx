import React, { useState } from 'react';
import { Star, Download, ShieldCheck, Check, PackageCheck, Truck, ExternalLink, Sparkles, Image as ImageIcon } from 'lucide-react';
import { ProductDetails } from '../types';
import { downloadFhdImagesAsZip } from '../utils/zipDownloader';

interface ProductSummaryCardProps {
  product: ProductDetails;
  onViewImagesTab: () => void;
}

export const ProductSummaryCard: React.FC<ProductSummaryCardProps> = ({ product, onViewImagesTab }) => {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  const mainImage = product.images[0]?.fhdUrl || product.images[0]?.thumbUrl || '';

  const handleDownloadZip = async () => {
    try {
      setDownloadingZip(true);
      await downloadFhdImagesAsZip(
        product.images,
        product.asin,
        product.title,
        (msg) => setDownloadStatus(msg)
      );
    } catch (err: any) {
      alert('Download error: ' + err.message);
    } finally {
      setTimeout(() => {
        setDownloadingZip(false);
        setDownloadStatus(null);
      }, 2000);
    }
  };

  return (
    <article
      itemScope
      itemType="https://schema.org/Product"
      className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden"
    >
      <div className="p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Visual Preview */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-xs sm:max-w-sm rounded-xl border border-stone-200 bg-stone-50/50 p-4 flex items-center justify-center overflow-hidden group">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.title}
                  itemProp="image"
                  loading="eager"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="text-stone-400 flex flex-col items-center">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <span className="text-xs">No image available</span>
                </div>
              )}

              <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-md">
                FHD 1500px
              </div>

              <button
                onClick={onViewImagesTab}
                className="absolute bottom-3 inset-x-3 bg-white/90 hover:bg-white text-stone-800 text-xs font-medium py-2 rounded-lg shadow-sm border border-stone-200 backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>View All {product.images.length} FHD Images</span>
              </button>
            </div>

            {/* Thumbnail mini-strip */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full pb-1">
                {product.images.slice(0, 5).map((img, i) => (
                  <button
                    key={img.id || i}
                    onClick={onViewImagesTab}
                    className="w-12 h-12 rounded-lg border border-stone-200 p-1 bg-white hover:border-amber-500 transition-colors shrink-0 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={img.thumbUrl}
                      alt={`Thumbnail ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
                {product.images.length > 5 && (
                  <button
                    onClick={onViewImagesTab}
                    className="w-12 h-12 rounded-lg border border-dashed border-stone-300 bg-stone-50 flex items-center justify-center text-xs font-semibold text-stone-600 hover:bg-stone-100 shrink-0 cursor-pointer"
                  >
                    +{product.images.length - 5}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Product Information & Pricing Details */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              {/* Category & Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                  {product.brand}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200">
                  ASIN: {product.asin}
                </span>
                {product.pricing.inStock ? (
                  <span className="inline-flex items-center text-xs text-emerald-700 font-medium">
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    {product.pricing.availabilityText || 'In Stock'}
                  </span>
                ) : (
                  <span className="text-xs text-amber-700 font-medium">Currently Unavailable</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug tracking-tight mb-3">
                {product.title}
              </h1>

              {/* Ratings and Reviews summary */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
                <div className="flex items-center bg-amber-500 text-white px-2 py-0.5 rounded text-xs font-bold gap-1">
                  <span>{product.averageRating.toFixed(1)}</span>
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(product.averageRating)
                          ? 'fill-current text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-stone-500 font-medium">
                  {product.totalRatingsCount}
                </span>
                <span className="text-stone-300">|</span>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 font-medium"
                >
                  <span>Open on Amazon</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Pricing Grid */}
              <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-200/80 mb-6">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-stone-900 tracking-tight font-sans">
                    {product.pricing.currentPrice}
                  </span>
                  {product.pricing.originalPrice && product.pricing.originalPrice !== product.pricing.currentPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-stone-500 line-through">
                        M.R.P: {product.pricing.originalPrice}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-red-100 text-red-700">
                        {product.pricing.discountPercentage || 'Discounted'}
                      </span>
                    </div>
                  )}
                </div>

                {product.pricing.savings && (
                  <p className="text-xs text-emerald-700 font-medium mt-1">
                    You Save: {product.pricing.savings}
                  </p>
                )}

                {product.pricing.emiText && (
                  <p className="text-xs text-stone-600 mt-2 flex items-center gap-1.5">
                    <span className="font-semibold text-stone-700">EMI options:</span>
                    <span>{product.pricing.emiText}</span>
                  </p>
                )}
              </div>

              {/* Dynamic Key Specs Badges */}
              {Object.keys(product.specs).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                  {Object.entries(product.specs)
                    .filter(([k]) => !['ASIN'].includes(k))
                    .slice(0, 4)
                    .map(([k, v]) => (
                      <div key={k} className="p-2.5 rounded-lg border border-stone-200 bg-white">
                        <span className="text-[11px] text-stone-500 block truncate" title={k}>{k}</span>
                        <span className="text-xs font-semibold text-stone-800 block truncate" title={String(v)}>
                          {String(v)}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Primary Action Button - 1 Click Download All Images FHD ZIP */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-stone-500">
                <span className="font-medium text-stone-700">{product.images.length} High Definition images</span> extracted at 1500×1500px master resolution.
              </div>

              <button
                onClick={handleDownloadZip}
                disabled={downloadingZip || product.images.length === 0}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {downloadingZip ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span>{downloadStatus || 'Packaging FHD ZIP...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download All {product.images.length} FHD Images (.ZIP)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
