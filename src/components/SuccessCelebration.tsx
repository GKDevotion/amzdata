import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles, Image, FileSpreadsheet, Star, X, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import { ProductDetails } from '../types';

interface SuccessCelebrationProps {
  show: boolean;
  onClose: () => void;
  product: ProductDetails | null;
  onDownloadZip: () => void;
  onViewImages: () => void;
}

export const SuccessCelebration: React.FC<SuccessCelebrationProps> = ({
  show,
  onClose,
  product,
  onDownloadZip,
  onViewImages,
}) => {
  if (!show || !product) return null;

  const imagesCount = product.images.length;
  const specsCount = Object.keys(product.specs).length;
  const reviewsCount = product.reviews.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
        {/* Animated Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Decorative Header with Amber & Emerald Glow */}
          <div className="relative bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 px-6 pt-7 pb-6 text-white overflow-hidden">
            {/* Background Glow Blobs */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-stone-400 hover:text-white rounded-full hover:bg-stone-800/80 transition-colors cursor-pointer z-10"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Bouncing Animated Checkmark Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  damping: 14,
                  stiffness: 260,
                  delay: 0.1,
                }}
                className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mb-3.5 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-9 h-9 text-emerald-400" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Extraction Succeeded</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Amazon Product Scraped Successfully!
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1 max-w-sm mx-auto">
                  {product.title}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Body with Extracted Metrics */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Metric 1: FHD Images */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80"
              >
                <div className="flex items-center gap-2 mb-1 text-amber-900">
                  <Image className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold">FHD Images</span>
                </div>
                <p className="text-xl font-black text-amber-900">{imagesCount}</p>
                <p className="text-[11px] text-amber-700 font-medium">1500px master resolution</p>
              </motion.div>

              {/* Metric 2: Pricing */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80"
              >
                <div className="flex items-center gap-2 mb-1 text-emerald-900">
                  <span className="text-xs font-bold">Live Price</span>
                </div>
                <p className="text-xl font-black text-emerald-800">
                  {product.pricing.currentPrice || 'Available'}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium">
                  {product.pricing.discountPercentage ? `${product.pricing.discountPercentage} discount` : 'Current pricing'}
                </p>
              </motion.div>

              {/* Metric 3: Technical Specs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200"
              >
                <div className="flex items-center gap-2 mb-1 text-stone-900">
                  <FileSpreadsheet className="w-4 h-4 text-stone-600" />
                  <span className="text-xs font-bold">Attributes</span>
                </div>
                <p className="text-xl font-black text-stone-900">{specsCount}+</p>
                <p className="text-[11px] text-stone-500 font-medium">Structured specs parsed</p>
              </motion.div>

              {/* Metric 4: Customer Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200"
              >
                <div className="flex items-center gap-2 mb-1 text-stone-900">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold">Reviews</span>
                </div>
                <p className="text-xl font-black text-stone-900">{reviewsCount}</p>
                <p className="text-[11px] text-stone-500 font-medium">
                  {product.averageRating}★ average rating
                </p>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="pt-2 flex flex-col sm:flex-row gap-2.5"
            >
              <button
                onClick={() => {
                  onClose();
                  onDownloadZip();
                }}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download FHD Images ZIP</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onViewImages();
                }}
                className="inline-flex items-center justify-center px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold rounded-xl border border-stone-200 transition-colors cursor-pointer gap-1.5"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>

          {/* Footer Security Badge */}
          <div className="px-6 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full HD 1500px resolution verified</span>
            </span>
            <span className="font-mono text-stone-400">ASIN: {product.asin}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
