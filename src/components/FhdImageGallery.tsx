import React, { useState } from 'react';
import { Download, ExternalLink, Copy, Check, Maximize2, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { ProductImage } from '../types';
import { downloadFhdImagesAsZip } from '../utils/zipDownloader';

interface FhdImageGalleryProps {
  images: ProductImage[];
  asin: string;
  title: string;
}

export const FhdImageGallery: React.FC<FhdImageGalleryProps> = ({ images, asin, title }) => {
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<ProductImage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDownloadAllZip = async () => {
    try {
      setDownloadingZip(true);
      await downloadFhdImagesAsZip(images, asin, title, (msg) => setStatusMsg(msg));
    } catch (err: any) {
      alert('Failed to download ZIP: ' + err.message);
    } finally {
      setTimeout(() => {
        setDownloadingZip(false);
        setStatusMsg(null);
      }, 2000);
    }
  };

  const handleCopyUrl = (img: ProductImage) => {
    navigator.clipboard.writeText(img.fhdUrl || img.originalUrl);
    setCopiedId(img.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSingle = async (img: ProductImage, index: number) => {
    const targetUrl = img.fhdUrl || img.thumbUrl;
    try {
      const response = await fetch(targetUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${asin}_FHD_${String(index + 1).padStart(2, '0')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      window.open(targetUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & One-Click ZIP Button */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <ImageIcon className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-stone-900">
              Full HD Image Extraction Gallery
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              1500px Uncompressed
            </span>
          </div>
          <p className="text-xs text-stone-500">
            All Amazon dynamic resolution limits have been converted into Full High Definition master assets.
          </p>
        </div>

        <button
          onClick={handleDownloadAllZip}
          disabled={downloadingZip || images.length === 0}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          {downloadingZip ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              <span>{statusMsg || 'Packaging ZIP...'}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              <span>1-Click Download All as ZIP ({images.length} FHD)</span>
            </>
          )}
        </button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((img, index) => {
          const isCopied = copiedId === img.id;
          return (
            <div
              key={img.id || index}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Image Preview Container */}
              <div
                onClick={() => setActiveLightboxImage(img)}
                className="relative aspect-square p-4 bg-stone-50/50 flex items-center justify-center overflow-hidden cursor-pointer"
              >
                <img
                  src={img.thumbUrl || img.fhdUrl}
                  alt={img.altText || `Product View ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlays */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-stone-900/80 backdrop-blur-xs text-[11px] font-mono text-white">
                  #{index + 1}
                </div>

                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-600/90 text-white text-[10px] font-semibold">
                  FHD 1500×1500
                </div>

                <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 rounded-full bg-white/90 text-stone-800 shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Card Footer Details & Actions */}
              <div className="p-3 border-t border-stone-100 bg-white">
                <div className="text-xs font-semibold text-stone-800 truncate mb-1" title={img.label || img.altText}>
                  {img.label || `Gallery View ${index + 1}`}
                </div>
                <div className="text-[11px] text-stone-400 font-mono truncate mb-3" title={img.fhdUrl}>
                  {img.fhdUrl}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDownloadSingle(img, index)}
                    className="flex-1 inline-flex items-center justify-center py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    title="Download individual FHD JPG"
                  >
                    <Download className="w-3.5 h-3.5 mr-1 text-stone-600" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => handleCopyUrl(img)}
                    className="inline-flex items-center justify-center p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs transition-colors cursor-pointer"
                    title="Copy direct FHD URL"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={img.fhdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs transition-colors"
                    title="Open full resolution in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full HD Lightbox Modal */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  {activeLightboxImage.label || activeLightboxImage.altText}
                </h4>
                <p className="text-xs text-stone-500 font-mono">
                  Resolution: 1500 × 1500 Full HD Master
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyUrl(activeLightboxImage)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  <span>Copy Link</span>
                </button>

                <a
                  href={activeLightboxImage.fhdUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Save Image</span>
                </a>

                <button
                  onClick={() => setActiveLightboxImage(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Display */}
            <div className="p-6 flex items-center justify-center bg-stone-100/50 overflow-auto max-h-[75vh]">
              <img
                src={activeLightboxImage.fhdUrl}
                alt={activeLightboxImage.altText}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-sm border border-stone-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
