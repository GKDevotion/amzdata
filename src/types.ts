export interface ProductPricing {
  currentPrice: string;
  originalPrice: string;
  discountPercentage: string;
  savings: string;
  currency: string;
  inStock: boolean;
  availabilityText: string;
  emiText?: string;
}

export interface ProductImage {
  id: string;
  thumbUrl: string;
  fhdUrl: string;
  originalUrl: string;
  altText: string;
  width?: number;
  height?: number;
  label?: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  avatarUrl?: string;
  rating: number;
  ratingText: string;
  title: string;
  date: string;
  body: string;
  verifiedPurchase: boolean;
  helpfulCount?: string;
  sentiment?: 'positive' | 'neutral' | 'critical';
}

export interface RatingBreakdown {
  star5: number;
  star4: number;
  star3: number;
  star2: number;
  star1: number;
}

export interface APlusSection {
  id?: string;
  title: string;
  heading?: string;
  body: string;
  imageUrl?: string;
  badge?: string;
}

export interface ProductDetails {
  asin: string;
  url: string;
  title: string;
  brand: string;
  model?: string;
  category?: string;
  averageRating: number;
  totalRatingsCount: string;
  ratingBreakdown: RatingBreakdown;
  pricing: ProductPricing;
  features: string[];
  specs: Record<string, string>;
  description?: string;
  descriptionParagraphs?: string[];
  aplusContent?: APlusSection[];
  importantInformation?: Record<string, string>;
  images: ProductImage[];
  reviews: CustomerReview[];
  scrapedAt: string;
  source: 'live_scraped' | 'cached_fallback';
}

export interface ScrapeResponse {
  success: boolean;
  data?: ProductDetails;
  error?: string;
  durationMs?: number;
}
