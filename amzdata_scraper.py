"""
================================================================================
AmzData - Amazon Product, FHD Images & Customer Reviews Scraper
Using Python with BeautifulSoup4 and Selenium WebDriver
================================================================================
Requirements:
    pip install selenium beautifulsoup4 webdriver-manager requests

Usage:
    # 1. Run with interactive GUI / prompt:
    python amzdata_scraper.py

    # 2. Or specify URL directly via CLI argument:
    python amzdata_scraper.py --url "https://www.amazon.in/Apollo-Amazer-4G-LIFE-Tubeless/dp/B0792G6PF9"

    # 3. Headless mode (no visible browser window):
    python amzdata_scraper.py --url "https://www.amazon.in/Apollo-Amazer-4G-LIFE-Tubeless/dp/B0792G6PF9" --headless
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

# Optional GUI URL prompt using built-in tkinter
def prompt_url_gui(default_url="https://www.amazon.in/Apollo-Amazer-4G-LIFE-Tubeless/dp/B0792G6PF9"):
    try:
        import tkinter as tk
        from tkinter import simpledialog, messagebox
        root = tk.Tk()
        root.withdraw()
        url = simpledialog.askstring(
            "AmzData - Amazon Scraper",
            "Enter Amazon Product URL (Dynamic Link):",
            initialvalue=default_url
        )
        root.destroy()
        return url
    except Exception:
        # Fallback to terminal input if Tkinter / X11 is unavailable
        print(f"\n[AmzData GUI Prompt]")
        entered = input(f"Enter Amazon Product URL [{default_url}]: ").strip()
        return entered if entered else default_url

def extract_asin_from_url(url: str) -> str:
    match = re.search(r'/(?:dp|gp/product|product)/([A-Z0-9]{10})', url, re.IGNORECASE)
    if match:
        return match.group(1).upper()
    match_any = re.search(r'([A-Z0-9]{10})', url)
    return match_any.group(1).upper() if match_any else "UNKNOWN_ASIN"

def make_fhd_image_url(url: str) -> str:
    """Converts Amazon image URLs with downscaled size tokens to Full HD (_SL1500_)."""
    if not url:
        return ""
    # Strip Amazon dynamic image transformation strings e.g. ._AC_SX679_. or ._SY450_.
    fhd_url = re.sub(r'\._[A-Z0-9_,]+_\.', '._SL1500_.', url)
    return fhd_url

def init_selenium_driver(headless: bool = False):
    options = Options()
    if headless:
        options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36")
    
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    try:
        if ChromeDriverManager:
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=options)
        else:
            driver = webdriver.Chrome(options=options)
    except Exception as e:
        print(f"[!] Standard Chrome init failed: {e}. Trying system Chrome...")
        driver = webdriver.Chrome(options=options)
        
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return driver

def scrape_amazon_product(url: str, headless: bool = False):
    print(f"\n==========================================")
    print(f"[*] AmzData Scraper Starting...")
    print(f"[*] Target URL: {url}")
    asin = extract_asin_from_url(url)
    print(f"[*] Detected ASIN: {asin}")
    print(f"==========================================\n")

    driver = init_selenium_driver(headless=headless)
    
    try:
        print("[*] Navigating to Amazon page via Selenium...")
        driver.get(url)
        time.sleep(2.5)

        # Wait for title to appear
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "#productTitle, #title, #centerCol"))
            )
        except Exception:
            print("[!] Timeout waiting for #productTitle. Continuing with current DOM...")

        # Smooth scrolling to trigger lazy-loaded images & reviews
        print("[*] Scrolling down to load dynamic widgets and customer reviews...")
        driver.execute_script("window.scrollTo(0, 800);")
        time.sleep(1)
        driver.execute_script("window.scrollTo(0, 1800);")
        time.sleep(1)
        driver.execute_script("window.scrollTo(0, 3000);")
        time.sleep(1)

        # Pass page source to BeautifulSoup
        page_html = driver.page_source
        soup = BeautifulSoup(page_html, "html.parser")

        # 1. Product Title
        title_tag = soup.select_one("#productTitle") or soup.select_one("#title")
        title = title_tag.get_text(strip=True) if title_tag else "N/A"
        print(f"\n[+] Title: {title[:90]}...")

        # 2. Brand
        brand_tag = soup.select_one("#bylineInfo") or soup.select_one(".po-brand .a-span9")
        brand = brand_tag.get_text(strip=True) if brand_tag else "Apollo"

        # 3. Pricing
        current_price = "N/A"
        price_elem = (
            soup.select_one(".a-price .a-offscreen") or
            soup.select_one("#corePriceDisplay_desktop_feature_div .a-price .a-offscreen") or
            soup.select_one("#priceblock_ourprice") or
            soup.select_one("#priceblock_dealprice")
        )
        if price_elem:
            current_price = price_elem.get_text(strip=True)

        original_price = "N/A"
        mrp_elem = (
            soup.select_one(".a-text-price .a-offscreen") or
            soup.select_one("#corePriceDisplay_desktop_feature_div .basisPrice .a-offscreen") or
            soup.select_one(".priceBlockStrikePriceString")
        )
        if mrp_elem:
            original_price = mrp_elem.get_text(strip=True)

        discount = "N/A"
        savings_elem = soup.select_one(".savingsPercentage")
        if savings_elem:
            discount = savings_elem.get_text(strip=True)

        availability_elem = soup.select_one("#availability span")
        availability = availability_elem.get_text(strip=True) if availability_elem else "In stock"

        print(f"[+] Pricing: Current: {current_price} | MRP: {original_price} | Discount: {discount} | Status: {availability}")

        # 4. Rating & Reviews Count
        rating_elem = soup.select_one("#acrPopover .a-size-base") or soup.select_one("span[data-hook='rating-out-of-text']")
        rating = rating_elem.get_text(strip=True) if rating_elem else "N/A"

        reviews_count_elem = soup.select_one("#acrCustomerReviewText")
        total_reviews_count = reviews_count_elem.get_text(strip=True) if reviews_count_elem else "N/A"
        print(f"[+] Rating: {rating} ({total_reviews_count})")

        # 5. Feature Bullets
        bullets = []
        for li in soup.select("#feature-bullets ul li span.a-list-item"):
            text = li.get_text(strip=True)
            if text and not text.startswith("P.when"):
                bullets.append(text)
        print(f"[+] Features Extracted: {len(bullets)} bullets")

        # 6. Technical Specifications Table
        specs = {}
        for row in soup.select("#productDetails_techSpec_section_1 tr, .po-row, #prodDetails table tr"):
            th = row.select_one("th, .a-span3")
            td = row.select_one("td, .a-span9")
            if th and td:
                key = th.get_text(strip=True)
                val = td.get_text(strip=True)
                if key and val:
                    specs[key] = val

        print(f"[+] Specifications Extracted: {len(specs)} fields")

        # 7. Images (Extract Full HD Images)
        image_urls = set()
        
        # A. Look inside JavaScript colorImages JSON block
        script_match = re.search(r"var data = \{\s*'colorImages':\s*(\{[\s\S]*?\}),\s*'colorToAsin'", page_html)
        if script_match:
            try:
                color_data = json.loads(script_match.group(1))
                initial = color_data.get("initial", [])
                for item in initial:
                    hires = item.get("hiRes") or item.get("large") or item.get("main")
                    if hires:
                        image_urls.add(make_fhd_image_url(hires))
            except Exception as e:
                print(f"[!] Error parsing colorImages JSON: {e}")

        # B. Look at data-a-dynamic-image attributes on landing images
        for img in soup.select("#landingImage, #imgTagWrapperId img, .imageThumbnail img, .image-item img"):
            dyn = img.get("data-a-dynamic-image")
            if dyn:
                try:
                    dyn_dict = json.loads(dyn)
                    for raw_url in dyn_dict.keys():
                        image_urls.add(make_fhd_image_url(raw_url))
                except Exception:
                    pass
            src = img.get("src") or img.get("data-old-hires")
            if src and "m.media-amazon.com" in src:
                image_urls.add(make_fhd_image_url(src))

        fhd_images = sorted(list(image_urls))
        print(f"[+] FHD Images Found: {len(fhd_images)} high-definition URLs")

        # 8. Customer Reviews
        reviews = []
        for rev_el in soup.select("[data-hook='review']"):
            author_el = rev_el.select_one(".a-profile-name")
            star_el = rev_el.select_one("[data-hook='review-star-rating'] .a-icon-alt, .a-icon-star .a-icon-alt")
            title_el = rev_el.select_one("[data-hook='review-title'] span, [data-hook='review-title']")
            date_el = rev_el.select_one("[data-hook='review-date']")
            body_el = rev_el.select_one("[data-hook='review-body'] span, [data-hook='review-body']")
            vp_el = rev_el.select_one("[data-hook='avp-badge']")
            helpful_el = rev_el.select_one("[data-hook='helpful-vote-statement']")

            author = author_el.get_text(strip=True) if author_el else "Amazon Customer"
            star_text = star_el.get_text(strip=True) if star_el else "5.0 out of 5 stars"
            rev_title = title_el.get_text(strip=True) if title_el else ""
            rev_date = date_el.get_text(strip=True) if date_el else ""
            rev_body = body_el.get_text(strip=True) if body_el else ""
            is_vp = vp_el is not None
            helpful = helpful_el.get_text(strip=True) if helpful_el else "0"

            reviews.append({
                "author": author,
                "rating": star_text,
                "title": rev_title,
                "date": rev_date,
                "body": rev_body,
                "verified_purchase": is_vp,
                "helpful_votes": helpful
            })

        print(f"[+] Customer Reviews Extracted: {len(reviews)} reviews")

        # Package collected data
        data = {
            "asin": asin,
            "url": url,
            "title": title,
            "brand": brand,
            "pricing": {
                "current_price": current_price,
                "original_price": original_price,
                "discount": discount,
                "availability": availability
            },
            "rating": rating,
            "total_reviews": total_reviews_count,
            "features": bullets,
            "specifications": specs,
            "fhd_images": fhd_images,
            "customer_reviews": reviews
        }

        # Save to JSON file
        out_json = f"amzdata_{asin}_details.json"
        with open(out_json, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"\n[✓] Saved complete product data to: {out_json}")

        # Save reviews to CSV
        if reviews:
            out_csv = f"amzdata_{asin}_reviews.csv"
            with open(out_csv, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=["author", "rating", "title", "date", "verified_purchase", "helpful_votes", "body"])
                writer.writeheader()
                for r in reviews:
                    writer.writerow(r)
            print(f"[✓] Saved {len(reviews)} reviews to: {out_csv}")

        # 9. Download all FHD Images and bundle into ZIP
        if fhd_images:
            zip_filename = f"AmzData_{asin}_FHD_Images.zip"
            print(f"\n[*] Downloading {len(fhd_images)} Full HD images and packaging into '{zip_filename}'...")
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                "Referer": "https://www.amazon.in/"
            }

            with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
                for idx, img_url in enumerate(fhd_images, start=1):
                    try:
                        ext = os.path.splitext(urlparse(img_url).path)[1] or ".jpg"
                        img_name = f"{asin}_FHD_image_{idx:02d}{ext}"
                        print(f"    -> [{idx}/{len(fhd_images)}] Fetching FHD image: {img_name}")
                        resp = requests.get(img_url, headers=headers, timeout=15)
                        if resp.status_code == 200:
                            zipf.writestr(img_name, resp.content)
                        else:
                            print(f"       [!] Failed HTTP {resp.status_code} for {img_url}")
                    except Exception as err:
                        print(f"       [!] Error fetching {img_url}: {err}")

            print(f"[✓] Successfully generated Full HD images ZIP: {zip_filename}")
            print(f"[✓] Size: {os.path.getsize(zip_filename) / (1024 * 1024):.2f} MB")

        print("\n==========================================")
        print("[✓] AmzData Scraping Completed Successfully!")
        print("==========================================\n")
        return data

    finally:
        driver.quit()

def main():
    parser = argparse.ArgumentParser(description="AmzData - Amazon Product & FHD Image Scraper")
    parser.add_argument("--url", help="Dynamic Amazon product URL to scrape")
    parser.add_argument("--headless", action="store_true", help="Run Chrome in headless mode")
    args = parser.parse_args()

    target_url = args.url
    if not target_url:
        target_url = prompt_url_gui("https://www.amazon.in/Apollo-Amazer-4G-LIFE-Tubeless/dp/B0792G6PF9")

    if not target_url or not target_url.strip():
        print("[!] No URL provided. Exiting.")
        sys.exit(1)

    scrape_amazon_product(target_url.strip(), headless=args.headless)

if __name__ == "__main__":
    main()
