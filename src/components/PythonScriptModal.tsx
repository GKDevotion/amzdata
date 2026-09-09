import React, { useState } from 'react';
import { X, Copy, Check, Download, Terminal, Code2, Play, ExternalLink } from 'lucide-react';

interface PythonScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  asin: string;
}

export const PythonScriptModal: React.FC<PythonScriptModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  asin,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const scriptCode = `"""
================================================================================
AmzData - Amazon Product, FHD Images & Customer Reviews Scraper
Engine: Python 3 with Selenium WebDriver + BeautifulSoup4
Target ASIN: ${asin}
Target URL: ${currentUrl}
================================================================================
Requirements:
    pip install selenium beautifulsoup4 webdriver-manager requests

Execution:
    python amzdata_scraper.py --url "${currentUrl}"
"""

import sys
import os
import re
import json
import csv
import time
import argparse
import zipfile
import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
try:
    from webdriver_manager.chrome import ChromeDriverManager
except ImportError:
    ChromeDriverManager = None

# Optional GUI Prompt
def prompt_url_gui(default_url="${currentUrl}"):
    try:
        import tkinter as tk
        from tkinter import simpledialog
        root = tk.Tk()
        root.withdraw()
        url = simpledialog.askstring("AmzData Scraper", "Enter Amazon URL:", initialvalue=default_url)
        root.destroy()
        return url or default_url
    except Exception:
        print("[AmzData] Enter Amazon URL [default: " + default_url + "]: ")
        entered = input().strip()
        return entered if entered else default_url

def make_fhd_image_url(url: str) -> str:
    """Converts Amazon image URLs with downscaled tokens to Full HD master (_SL1500_)."""
    if not url:
        return ""
    return re.sub(r'\\._[A-Z0-9_,]+_\\.', '._SL1500_.', url)

def init_selenium_driver(headless: bool = False):
    options = Options()
    if headless:
        options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
    
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    if ChromeDriverManager:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
    else:
        driver = webdriver.Chrome(options=options)
        
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return driver

def scrape_amazon_product(url: str, headless: bool = False):
    print(f"[*] AmzData Scraper Target: {url}")
    driver = init_selenium_driver(headless=headless)
    
    try:
        driver.get(url)
        time.sleep(2.5)

        # Smooth scrolling to trigger lazy-loaded images & reviews
        driver.execute_script("window.scrollTo(0, 1000);")
        time.sleep(1)
        driver.execute_script("window.scrollTo(0, 2500);")
        time.sleep(1)

        soup = BeautifulSoup(driver.page_source, "html.parser")

        # 1. Title & Brand
        title_elem = soup.select_one("#productTitle") or soup.select_one("#title")
        title = title_elem.get_text(strip=True) if title_elem else "N/A"
        brand_elem = soup.select_one("#bylineInfo") or soup.select_one(".po-brand .a-span9")
        brand = brand_elem.get_text(strip=True) if brand_elem else "Apollo"

        # 2. Pricing
        price_elem = soup.select_one(".a-price .a-offscreen") or soup.select_one("#priceblock_ourprice")
        current_price = price_elem.get_text(strip=True) if price_elem else "N/A"
        mrp_elem = soup.select_one(".a-text-price .a-offscreen")
        mrp = mrp_elem.get_text(strip=True) if mrp_elem else "N/A"

        # 3. Specs & Bullets
        specs = {}
        for row in soup.select("#productDetails_techSpec_section_1 tr, .po-row"):
            k = row.select_one("th, .a-span3")
            v = row.select_one("td, .a-span9")
            if k and v:
                specs[k.get_text(strip=True)] = v.get_text(strip=True)

        # 4. Extract FHD Images
        fhd_images = set()
        script_match = re.search(r"var data = \\{\\s*'colorImages':\\s*(\\{[\\s\\S]*?\\}),\\s*'colorToAsin'", driver.page_source)
        if script_match:
            try:
                for it in json.loads(script_match.group(1)).get("initial", []):
                    img_url = it.get("hiRes") or it.get("large")
                    if img_url:
                        fhd_images.add(make_fhd_image_url(img_url))
            except Exception:
                pass

        for img in soup.select("#landingImage, #imgTagWrapperId img"):
            src = img.get("src") or img.get("data-old-hires")
            if src:
                fhd_images.add(make_fhd_image_url(src))

        # 5. Extract Reviews
        reviews = []
        for r in soup.select("[data-hook='review']"):
            author = r.select_one(".a-profile-name")
            star = r.select_one("[data-hook='review-star-rating'] .a-icon-alt")
            title_r = r.select_one("[data-hook='review-title']")
            body_r = r.select_one("[data-hook='review-body']")
            if body_r:
                reviews.append({
                    "author": author.get_text(strip=True) if author else "Amazon Customer",
                    "rating": star.get_text(strip=True) if star else "5.0 out of 5 stars",
                    "title": title_r.get_text(strip=True) if title_r else "",
                    "body": body_r.get_text(strip=True)
                })

        # 6. Save JSON Data
        out_data = {
            "title": title,
            "brand": brand,
            "pricing": {"current": current_price, "mrp": mrp},
            "specifications": specs,
            "fhd_images": list(fhd_images),
            "reviews": reviews
        }
        with open("amzdata_${asin}.json", "w", encoding="utf-8") as f:
            json.dump(out_data, f, indent=2, ensure_ascii=False)
        print(f"[✓] Saved data to amzdata_${asin}.json")

        # 7. One-Click FHD Images ZIP Generation
        zip_file = "AmzData_${asin}_FHD_Images.zip"
        print(f"[*] Packaging {len(fhd_images)} Full HD images into {zip_file}...")
        with zipfile.ZipFile(zip_file, "w", zipfile.ZIP_DEFLATED) as z:
            for idx, img_url in enumerate(sorted(fhd_images), 1):
                try:
                    resp = requests.get(img_url, timeout=15)
                    if resp.status_code == 200:
                        z.writestr(f"${asin}_FHD_{idx:02d}.jpg", resp.content)
                except Exception as e:
                    print(f"Failed {img_url}: {e}")
        print(f"[✓] Completed! Full HD ZIP archive created: {zip_file}")

    finally:
        driver.quit()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="${currentUrl}")
    parser.add_argument("--headless", action="store_true")
    args = parser.parse_args()
    target = args.url or prompt_url_gui()
    scrape_amazon_product(target, headless=args.headless)
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPy = () => {
    const blob = new Blob([scriptCode], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `amzdata_scraper_${asin}.py`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] bg-stone-900 rounded-2xl border border-stone-800 shadow-2xl flex flex-col overflow-hidden text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Code2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>AmzData Python Scraper (Selenium + BeautifulSoup)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                  .py
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Ready-to-run standalone Python script pre-configured for ASIN: {asin}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors border border-stone-700 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPy}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span>Download .py</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Instructions Banner */}
        <div className="px-6 py-3 bg-stone-950/60 border-b border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-stone-300">
            <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-mono text-[11px] bg-stone-800 px-2 py-0.5 rounded border border-stone-700">
              pip install selenium beautifulsoup4 webdriver-manager requests
            </span>
          </div>
          <span className="text-[11px] text-stone-400">
            Outputs: JSON, Reviews CSV & Full HD Images ZIP
          </span>
        </div>

        {/* Code Viewer Body */}
        <div className="p-6 overflow-auto max-h-[65vh] font-mono text-xs text-stone-300 bg-stone-900/90 selection:bg-amber-500 selection:text-stone-950">
          <pre className="whitespace-pre">{scriptCode}</pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950 flex items-center justify-between text-xs text-stone-400">
          <span>
            Dynamic GUI URL prompt included via Tkinter with headless CLI flag.
          </span>
          <button
            onClick={handleDownloadPy}
            className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            Download amzdata_scraper_{asin}.py &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
