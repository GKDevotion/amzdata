import JSZip from 'jszip';
import { ProductImage } from '../types';

/**
 * Downloads all FHD images and saves them as a ZIP archive.
 * Tries server-side bundling first for optimal speed and reliability,
 * and seamlessly falls back to client-side JSZip if needed.
 */
export async function downloadFhdImagesAsZip(
  images: ProductImage[],
  asin: string,
  title: string,
  onProgress?: (msg: string) => void
): Promise<void> {
  const safeAsin = (asin || 'Product').replace(/[^a-zA-Z0-9_-]/g, '');
  const zipFilename = `AmzData_${safeAsin}_FHD_Images.zip`;

  if (onProgress) onProgress('Initiating FHD image ZIP package...');

  // Attempt 1: Server-side ZIP endpoint
  try {
    if (onProgress) onProgress('Requesting Full HD image package from server...');
    const response = await fetch('/api/download-zip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        images,
        asin: safeAsin,
        title,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      triggerBlobDownload(blob, zipFilename);
      if (onProgress) onProgress('Download ready!');
      return;
    }
  } catch (err) {
    console.warn('[AmzData] Server zip fetch failed, attempting client-side bundle:', err);
  }

  // Attempt 2: Client-side JSZip fallback
  if (onProgress) onProgress('Bundling Full HD images in browser...');
  const zip = new JSZip();
  const folder = zip.folder(`AmzData_${safeAsin}_FHD_Images`);

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const targetUrl = img.fhdUrl || img.thumbUrl;
    if (!targetUrl) continue;

    if (onProgress) {
      onProgress(`Downloading image ${i + 1} of ${images.length} in FHD...`);
    }

    try {
      const resp = await fetch(targetUrl, { mode: 'cors' });
      if (resp.ok) {
        const arrayBuf = await resp.arrayBuffer();
        const ext = targetUrl.includes('.png') ? '.png' : targetUrl.includes('.webp') ? '.webp' : '.jpg';
        const filename = `${safeAsin}_FHD_${String(i + 1).padStart(2, '0')}${ext}`;
        if (folder) {
          folder.file(filename, arrayBuf);
        }
      }
    } catch (e) {
      console.warn(`[AmzData] Failed to fetch image ${targetUrl} via client:`, e);
    }
  }

  if (folder) {
    folder.file(
      'README.txt',
      `AmzData - High Definition Amazon Product Images\n` +
      `ASIN: ${safeAsin}\n` +
      `Product: ${title}\n` +
      `Extracted: ${new Date().toISOString()}\n` +
      `Resolution: Full High Definition (1500px)\n`
    );
  }

  if (onProgress) onProgress('Compressing ZIP archive...');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(zipBlob, zipFilename);
  if (onProgress) onProgress('ZIP Download started!');
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
