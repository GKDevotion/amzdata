import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  CheckSquare,
  Square,
  Maximize2,
  ExternalLink,
  Award,
  Check,
  Copy,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { ProductDetails, ProductImage, APlusSection } from '../types';
import { downloadAplusImagesAsZip, downloadSingleImage } from '../utils/zipDownloader';

interface AplusContentSectionProps {
  product: ProductDetails;
}

export const AplusContentSection: React.FC<AplusContentSectionProps> = ({ product }) => {
  // Aggregate images from aplusImages and any images inside aplusContent
  const aplusImagesList: ProductImage[] = React.useMemo(() => {
    const list: ProductImage[] = [];
    const seen = new Set<string>();

    if (product.aplusImages && product.aplusImages.length > 0) {
      product.aplusImages.forEach((img) => {
        const key = img.fhdUrl || img.originalUrl || img.thumbUrl;
        if (key && !seen.has(key)) {
          seen.add(key);
          list.push(img);
        }
      });
    }

    if (product.aplusContent && product.aplusContent.length > 0) {
      product.aplusContent.forEach((sec, idx) => {
        if (sec.imageUrl && !seen.has(sec.imageUrl)) {
          seen.add(sec.imageUrl);
          list.push({
            id: `aplus-sec-img-${idx + 1}`,
            thumbUrl: sec.imageUrl,
            fhdUrl: sec.imageUrl,
            originalUrl: sec.imageUrl,
            altText: sec.heading || sec.title || `A+ Asset ${idx + 1}`,
            width: 1500,
            height: 1500,
            label: sec.title,
          });
        }
      });
    }

    return list;
  }, [product.aplusImages, product.aplusContent]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [singleDownloadingId, setSingleDownloadingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<ProductImage | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const safeAsin = (product.asin || 'Product').replace(/[^a-zA-Z0-9_-]/g, '');

  const toggleSelectImage = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === aplusImagesList.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(aplusImagesList.map((img) => img.id)));
    }
  };

  // Download all A+ images as a separate ZIP file
  const handleDownloadAllZip = async () => {
    if (aplusImagesList.length === 0) return;
    try {
      setDownloadingZip(true);
      await downloadAplusImagesAsZip(
        aplusImagesList,
        product.asin,
        product.title,
        (msg) => setDownloadStatus(msg)
      );
    } catch (err: any) {
      alert('A+ ZIP Download failed: ' + err.message);
    } finally {
      setTimeout(() => {
        setDownloadingZip(false);
        setDownloadStatus(null);
      }, 1800);
    }
  };

  // Download selected A+ images as a ZIP file
  const handleDownloadSelectedZip = async () => {
    const selectedImages = aplusImagesList.filter((img) => selectedIds.has(img.id));
    if (selectedImages.length === 0) return;

    try {
      setDownloadingZip(true);
      await downloadAplusImagesAsZip(
        selectedImages,
        `${product.asin}_Selected`,
        product.title,
        (msg) => setDownloadStatus(msg)
      );
    } catch (err: any) {
      alert('Selected A+ ZIP Download failed: ' + err.message);
    } finally {
      setTimeout(() => {
        setDownloadingZip(false);
        setDownloadStatus(null);
      }, 1800);
    }
  };

  // Download particular image one by one
  const handleDownloadSingle = async (img: ProductImage, index: number) => {
    const targetUrl = img.fhdUrl || img.originalUrl || img.thumbUrl;
    if (!targetUrl) return;

    const ext = targetUrl.includes('.png') ? '.png' : targetUrl.includes('.webp') ? '.webp' : '.jpg';
    const filename = `${safeAsin}_Aplus_Image_${String(index + 1).padStart(2, '0')}${ext}`;

    try {
      setSingleDownloadingId(img.id);
      await downloadSingleImage(targetUrl, filename);
    } catch (err) {
      console.warn('Single image download error:', err);
    } finally {
      setTimeout(() => {
        setSingleDownloadingId(null);
      }, 1000);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const aplusModules = product.aplusContent || [];

  return (
    <div className="space-y-6">
      {/* A+ Content Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                  Amazon A+ Enhanced Brand Content
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200 inline-flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>Official Manufacturer Content</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600">
                Extracted high-definition brand storytelling graphics, feature modules, and technical visual assets for ASIN <span className="font-mono font-semibold text-stone-800">{product.asin}</span>.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
            {selectedIds.size > 0 && (
              <button
                type="button"
                onClick={handleDownloadSelectedZip}
                disabled={downloadingZip}
                className="inline-flex items-center px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                <span>Download Selected ({selectedIds.size}) ZIP</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadAllZip}
              disabled={downloadingZip || aplusImagesList.length === 0}
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {downloadingZip ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span>{downloadStatus || 'Packaging A+ ZIP...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2 text-amber-400" />
                  <span>Download All {aplusImagesList.length} A+ Images (.ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Info & Select All bar */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-4">
            <span className="font-medium text-stone-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>{aplusImagesList.length} High-Res A+ Images</span>
            </span>
            <span>•</span>
            <span>{aplusModules.length} Narrative Modules</span>
            <span>•</span>
            <span className="hidden sm:inline text-stone-500">Master Brand Resolution (1500px)</span>
          </div>

          {aplusImagesList.length > 0 && (
            <button
              type="button"
              onClick={handleSelectAll}
              className="inline-flex items-center gap-1.5 text-stone-700 hover:text-amber-800 font-semibold cursor-pointer py-1 px-2 rounded-md hover:bg-stone-100 transition-colors"
            >
              {selectedIds.size === aplusImagesList.length ? (
                <>
                  <CheckSquare className="w-4 h-4 text-amber-600" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 text-stone-400" />
                  <span>Select All Images</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* A+ Image Gallery Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>A+ Brand Imagery Assets</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Click any image to inspect in full size, or download individually one by one.
            </p>
          </div>

          <span className="text-xs text-stone-500 font-medium bg-stone-100 px-2.5 py-1 rounded-lg">
            {selectedIds.size} of {aplusImagesList.length} selected
          </span>
        </div>

        {aplusImagesList.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-sm">
            No distinct A+ graphics detected in this listing.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {aplusImagesList.map((img, idx) => {
              const isSelected = selectedIds.has(img.id);
              const targetUrl = img.fhdUrl || img.originalUrl || img.thumbUrl;
              const isDownloadingThis = singleDownloadingId === img.id;
              const isCopied = copiedUrl === targetUrl;

              return (
                <div
                  key={img.id || idx}
                  className={`group relative rounded-xl border transition-all duration-200 flex flex-col bg-white overflow-hidden ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-400/30 shadow-md'
                      : 'border-stone-200 hover:border-amber-300 hover:shadow-sm'
                  }`}
                >
                  {/* Select Checkbox & Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectImage(img.id);
                      }}
                      className="pointer-events-auto p-1.5 rounded-lg bg-white/90 hover:bg-white text-stone-700 shadow-xs border border-stone-200/80 backdrop-blur-xs transition-colors cursor-pointer"
                      title={isSelected ? 'Deselect image' : 'Select image for batch download'}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />
                      )}
                    </button>

                    <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md shadow-2xs">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Thumbnail Container */}
                  <div
                    onClick={() => setPreviewImage(img)}
                    className="relative aspect-square w-full bg-stone-50/60 p-3 flex items-center justify-center cursor-pointer overflow-hidden border-b border-stone-100"
                  >
                    <img
                      src={targetUrl}
                      alt={img.altText || `A+ Asset ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                      <span className="px-3 py-1.5 rounded-lg bg-white/95 text-stone-800 text-xs font-medium shadow-sm flex items-center gap-1.5 backdrop-blur-xs">
                        <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Preview Fullscreen</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Meta & 1-by-1 Download Button */}
                  <div className="p-3 bg-white flex flex-col justify-between flex-1 gap-2.5">
                    <div>
                      <h4 className="text-xs font-semibold text-stone-900 line-clamp-1" title={img.altText}>
                        {img.label || img.altText || `A+ Graphic #${idx + 1}`}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                        High Resolution Asset
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-stone-100">
                      {/* One by one download button as requested */}
                      <button
                        type="button"
                        onClick={() => handleDownloadSingle(img, idx)}
                        disabled={isDownloadingThis}
                        className="flex-1 inline-flex items-center justify-center px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200 transition-colors cursor-pointer disabled:opacity-50"
                        title="Download this particular image"
                      >
                        {isDownloadingThis ? (
                          <div className="w-3.5 h-3.5 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 mr-1 text-amber-600" />
                            <span>Download Image</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(targetUrl)}
                        className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer"
                        title="Copy direct image link"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer"
                        title="Open image in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* A+ Narrative Story Modules */}
      {aplusModules.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 tracking-tight">
                From the Manufacturer (Brand Story Modules)
              </h3>
              <p className="text-xs text-stone-500">
                Official verified seller copywriting and spotlight features
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {aplusModules.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 hover:bg-white hover:border-amber-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-100/70 border border-amber-200 text-amber-900 text-[11px] font-semibold">
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                      <span>{item.badge || 'Manufacturer Feature'}</span>
                    </div>
                    <span className="text-[11px] font-mono text-stone-400">Module #{idx + 1}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {item.imageUrl && (
                      <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0 p-1.5 shadow-2xs flex items-center justify-center group/mod relative">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-stone-900">
                        {item.title}
                      </h4>
                      {item.heading && item.heading !== item.title && (
                        <p className="text-xs font-semibold text-amber-800 mt-0.5">
                          {item.heading}
                        </p>
                      )}
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>

                {item.imageUrl && (
                  <div className="pt-3 mt-3 border-t border-stone-200/60 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const filename = `${safeAsin}_Aplus_Module_${idx + 1}.jpg`;
                        downloadSingleImage(item.imageUrl!, filename);
                      }}
                      className="inline-flex items-center text-xs font-semibold text-amber-700 hover:text-amber-900 hover:underline cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      <span>Download Module Graphic</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal for Fullscreen Image Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-sm font-bold text-stone-900 truncate">
                  {previewImage.label || previewImage.altText || 'A+ Content Master Graphic'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const idx = aplusImagesList.findIndex((i) => i.id === previewImage.id);
                    handleDownloadSingle(previewImage, idx >= 0 ? idx : 0);
                  }}
                  className="inline-flex items-center px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Download This Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Canvas */}
            <div className="flex-1 bg-stone-900/95 flex items-center justify-center p-6 overflow-auto min-h-[350px]">
              <img
                src={previewImage.fhdUrl || previewImage.originalUrl || previewImage.thumbUrl}
                alt={previewImage.altText}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] max-w-full object-contain shadow-2xl rounded-lg"
              />
            </div>

            {/* Footer with dimensions and URLs */}
            <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <span className="font-mono text-stone-500">
                Resolution: Master High-Definition ({previewImage.width || 1500} × {previewImage.height || 1500}px)
              </span>
              <a
                href={previewImage.fhdUrl || previewImage.originalUrl || previewImage.thumbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Open Raw Asset</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
