import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cpu, Globe, Search, Database, Layers, CheckCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: 'Scraping' | 'FHD Images' | 'Python & Selenium' | 'Data Flush';
}

const FAQS: FaqItem[] = [
  {
    question: 'How does AmzData scrape complete Amazon product details, pricing, and specs?',
    answer: 'AmzData utilizes a dual-engine architecture: a high-speed server-side Cheerio HTML parser with rotating user-agents and browser headers, complemented by a standalone Python script powered by Selenium WebDriver and BeautifulSoup4. It extracts structured attributes from #productTitle, #productDetails_techSpec_section_1, .a-price, and customer review containers.',
    category: 'Scraping',
  },
  {
    question: 'How are Amazon images extracted and converted into Full HD (1500px) resolution?',
    answer: 'Amazon CDN URLs typically store dynamically downscaled images using token qualifiers (e.g. ._AC_SX679_., ._SY450_.). AmzData parses master image keys from colorImages JavaScript objects and data-a-dynamic-image attributes, replacing sizing tokens with ._SL1500_ or extracting raw master assets. These are then bundled into a single ZIP archive using JSZip.',
    category: 'FHD Images',
  },
  {
    question: 'How do I run the Python script using Selenium and BeautifulSoup locally?',
    answer: 'Install the required dependencies: `pip install selenium beautifulsoup4 webdriver-manager requests`. Run `python amzdata_scraper.py --url "YOUR_AMAZON_URL"`. The script automatically initializes a Chrome WebDriver with anti-detection flags, scrolls down to load dynamic reviews, parses all fields with BeautifulSoup4, saves amzdata_details.json and amzdata_reviews.csv, and packages all FHD images into a ZIP archive.',
    category: 'Python & Selenium',
  },
  {
    question: 'What is the purpose of the "Flush Data & Reset" control?',
    answer: 'Because Amazon product URLs are dynamic and user scraping workflows require consecutive queries, the Flush Data control purges all previously cached images, DOM trees, review records, and technical tables from state memory, ensuring zero cross-product data contamination.',
    category: 'Data Flush',
  },
  {
    question: 'Is AmzData optimized for AEO, SEO, and GEO search engines?',
    answer: 'Yes. AmzData implements full semantic HTML, Open Graph tags, Twitter Card metadata, geographic tags, and dynamic Schema.org JSON-LD microdata including WebApplication, FAQPage, HowTo, and Product schemas to ensure maximum visibility across traditional search engines and AI generative answer engines.',
    category: 'Scraping',
  },
];

export const AeoKnowledgeSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Scraping', 'FHD Images', 'Python & Selenium', 'Data Flush'];

  const filteredFaqs = activeCategory === 'All'
    ? FAQS
    : FAQS.filter((f) => f.category === activeCategory);

  return (
    <section aria-labelledby="aeo-faq-heading" className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <HelpCircle className="w-4 h-4" />
            </span>
            <h3 id="aeo-faq-heading" className="text-base sm:text-lg font-bold text-stone-900">
              AEO & Technical Architecture Reference
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
              GEO & SEO Compliant
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Structured answers for generative AI answer engines, developers, and data engineers.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-stone-200 rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left bg-stone-50/50 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-amber-700 font-mono">
                    Q{idx + 1}.
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-stone-800">
                    {faq.question}
                  </h4>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 py-4 bg-white border-t border-stone-100 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Technical Entity Badges */}
      <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Schema.org JSON-LD</span>
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open Graph Protocol</span>
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Twitter Cards</span>
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mobile Responsive Viewport</span>
          </span>
        </div>
        <span className="font-mono text-stone-400">AmzData Engineering Specs v2.4</span>
      </div>
    </section>
  );
};
