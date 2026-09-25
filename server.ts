import express from 'express';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import JSZip from 'jszip';
import { createServer as createViteServer } from 'vite';
import { scrapeAmazonProduct } from './server/scraper.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'AmzData', timestamp: new Date().toISOString() });
  });

  // Scrape endpoint (support with and without trailing slash)
  app.post(['/api/scrape', '/api/scrape/'], async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ success: false, error: 'Amazon URL is required' });
      }

      console.log(`[AmzData API] Scraping requested for URL: ${url}`);
      const startTime = Date.now();
      const productData = await scrapeAmazonProduct(url);
      const durationMs = Date.now() - startTime;

      return res.json({
        success: true,
        data: productData,
        durationMs,
      });
    } catch (err: any) {
      console.error('[AmzData API] Scraping error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to scrape Amazon product page',
      });
    }
  });

  // Download FHD or A+ images as ZIP file endpoint
  app.post(['/api/download-zip', '/api/download-zip/'], async (req, res) => {
    try {
      const { images, asin, title, archiveType = 'main', customFilename } = req.body;
      if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ error: 'No images provided for download' });
      }

      const safeAsin = (asin || 'Amazon_Product').replace(/[^a-zA-Z0-9_-]/g, '');
      const isAplus = archiveType === 'aplus';
      const folderName = isAplus ? `AmzData_${safeAsin}_Aplus_Images` : `AmzData_${safeAsin}_FHD_Images`;
      const zipFilename = customFilename || (isAplus ? `AmzData_${safeAsin}_Aplus_Images.zip` : `AmzData_${safeAsin}_FHD_Images.zip`);

      const zip = new JSZip();
      const folder = zip.folder(folderName);

      console.log(`[AmzData API] Building ${isAplus ? 'A+ Content' : 'FHD'} ZIP for ASIN ${safeAsin} with ${images.length} images...`);

      // Fetch images in parallel with timeout
      const downloadPromises = images.map(async (img: { fhdUrl?: string; thumbUrl?: string; originalUrl?: string; label?: string; id?: string }, idx: number) => {
        const targetUrl = img.fhdUrl || img.originalUrl || img.thumbUrl;
        if (!targetUrl) return;

        try {
          const resp = await axios.get(targetUrl, {
            responseType: 'arraybuffer',
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Referer': 'https://www.amazon.in/',
            },
          });

          let ext = path.extname(new URL(targetUrl).pathname) || '.jpg';
          if (!ext || ext.length > 5 || ext === '.') ext = '.jpg';
          const prefix = isAplus ? 'Aplus' : 'FHD';
          const filename = `${safeAsin}_${prefix}_${String(idx + 1).padStart(2, '0')}${ext}`;
          if (folder) {
            folder.file(filename, resp.data);
          }
        } catch (fetchErr: any) {
          console.warn(`[AmzData API] Could not fetch image ${targetUrl}: ${fetchErr.message}`);
        }
      });

      await Promise.all(downloadPromises);

      // Add a README file inside the zip with product metadata
      if (folder) {
        folder.file(
          'README.txt',
          `AmzData - Amazon Product Images Archive\n` +
          `Archive Type: ${isAplus ? 'A+ Enhanced Brand Content Images' : 'Full HD Product Master Images'}\n` +
          `ASIN: ${safeAsin}\n` +
          `Product: ${title || 'Amazon Product'}\n` +
          `Downloaded: ${new Date().toUTCString()}\n` +
          `Total Images: ${images.length}\n` +
          `Generated with AmzData Scraper\n`
        );
      }

      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);
      res.setHeader('Content-Length', zipBuffer.length);
      return res.send(zipBuffer);
    } catch (err: any) {
      console.error('[AmzData API] ZIP generation error:', err);
      return res.status(500).json({ error: 'Failed to generate images ZIP: ' + err.message });
    }
  });

  // Get Python script endpoint
  app.get('/api/python-script', (req, res) => {
    try {
      const scriptPath = path.join(process.cwd(), 'amzdata_scraper.py');
      if (fs.existsSync(scriptPath)) {
        const content = fs.readFileSync(scriptPath, 'utf-8');
        return res.json({ script: content });
      }
      return res.status(404).json({ error: 'Script file not found' });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // Catch-all for API routes to never return HTML index.html
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      error: `API endpoint ${req.method} ${req.path} not found`,
    });
  });

  // Serve public directory assets
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Vite middleware for development vs static serve for production
  const isDev = process.env.NODE_ENV === 'development' || (!process.env.NODE_ENV && !fs.existsSync(path.join(process.cwd(), 'dist', 'index.html')));

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AmzData] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
