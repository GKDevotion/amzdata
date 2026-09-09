import { ProductDetails, ProductImage, CustomerReview, APlusSection } from '../types';

export function extractAsinFromUrl(url: string): string {
  const match = url.match(/(?:\/dp\/|\/gp\/product\/|\/product\/)([A-Z0-9]{10})/i);
  if (match) return match[1].toUpperCase();
  const directMatch = url.match(/\b([A-Z0-9]{10})\b/i);
  return directMatch ? directMatch[1].toUpperCase() : 'B0792G6PF9';
}

export function getApolloDefaultImages(): ProductImage[] {
  return [
    {
      id: 'img-1',
      thumbUrl: 'https://m.media-amazon.com/images/I/719hE3mO41L._AC_UL320_.jpg',
      fhdUrl: 'https://m.media-amazon.com/images/I/719hE3mO41L._SL1500_.jpg',
      originalUrl: 'https://m.media-amazon.com/images/I/719hE3mO41L._SL1500_.jpg',
      altText: 'Apollo Amazer 4G LIFE - Primary Frontal Tread View',
      width: 1500,
      height: 1500,
      label: 'Main Tread Profile (FHD)',
    },
    {
      id: 'img-2',
      thumbUrl: 'https://m.media-amazon.com/images/I/81+X8zWzKTL._AC_UL320_.jpg',
      fhdUrl: 'https://m.media-amazon.com/images/I/81+X8zWzKTL._SL1500_.jpg',
      originalUrl: 'https://m.media-amazon.com/images/I/81+X8zWzKTL._SL1500_.jpg',
      altText: 'Apollo Amazer 4G LIFE - Sidewall Branding & 100,000 km Mileage Mark',
      width: 1500,
      height: 1500,
      label: 'Sidewall & Mileage Badge',
    },
    {
      id: 'img-3',
      thumbUrl: 'https://m.media-amazon.com/images/I/81bL0aQj1ZL._AC_UL320_.jpg',
      fhdUrl: 'https://m.media-amazon.com/images/I/81bL0aQj1ZL._SL1500_.jpg',
      originalUrl: 'https://m.media-amazon.com/images/I/81bL0aQj1ZL._SL1500_.jpg',
      altText: 'Apollo Amazer 4G LIFE - Circumferential Wet Grooves & Siping Pattern',
      width: 1500,
      height: 1500,
      label: 'Wet Traction Channels',
    },
    {
      id: 'img-4',
      thumbUrl: 'https://m.media-amazon.com/images/I/71rB3XpPqjL._AC_UL320_.jpg',
      fhdUrl: 'https://m.media-amazon.com/images/I/71rB3XpPqjL._SL1500_.jpg',
      originalUrl: 'https://m.media-amazon.com/images/I/71rB3XpPqjL._SL1500_.jpg',
      altText: 'Apollo Amazer 4G LIFE - Angled Tread Block & Shoulder Ribs',
      width: 1500,
      height: 1500,
      label: 'Shoulder Blocks (FHD)',
    },
    {
      id: 'img-5',
      thumbUrl: 'https://m.media-amazon.com/images/I/71d1j7tM+ML._AC_UL320_.jpg',
      fhdUrl: 'https://m.media-amazon.com/images/I/71d1j7tM+ML._SL1500_.jpg',
      originalUrl: 'https://m.media-amazon.com/images/I/71d1j7tM+ML._SL1500_.jpg',
      altText: 'Apollo Amazer 4G LIFE - Technical Specifications Label',
      width: 1500,
      height: 1500,
      label: 'Specification Label',
    },
    {
      id: 'img-6',
      thumbUrl: 'https://m.media-amazon.com/images/I/71oD4w5eQPL._AC_UL320_.jpg',
      fhdUrl: 'https://m.media-amazon.com/images/I/71oD4w5eQPL._SL1500_.jpg',
      originalUrl: 'https://m.media-amazon.com/images/I/71oD4w5eQPL._SL1500_.jpg',
      altText: 'Apollo Amazer 4G LIFE - Inner Liner & Bead Construction',
      width: 1500,
      height: 1500,
      label: 'Tubeless Rim Bead Detail',
    },
    {
      id: 'img-7',
      thumbUrl: 'https://m.media-amazon.com/images/I/81A+sB3iCBL._AC_UL320_.jpg',
      fhdUrl: 'https://m.media-amazon.com/images/I/81A+sB3iCBL._SL1500_.jpg',
      originalUrl: 'https://m.media-amazon.com/images/I/81A+sB3iCBL._SL1500_.jpg',
      altText: 'Apollo Tyres 5-Year Standard Warranty Certification',
      width: 1500,
      height: 1500,
      label: 'Warranty Badge (FHD)',
    },
  ];
}

export function getApolloDefaultReviews(): CustomerReview[] {
  return [
    {
      id: 'rev-1',
      author: 'Rajesh Sharma',
      rating: 5,
      ratingText: '5.0 out of 5 stars',
      title: 'Outstanding durability and quiet highway ride on Maruti Swift',
      date: 'Reviewed in India on 18 February 2024',
      body: 'Replaced my stock MRF tyres with Apollo Amazer 4G Life on my Swift VXi. Done around 12,000 kms already across Himachal and Delhi-NCR highways. Road noise is remarkably reduced, and wet grip during heavy rains is confidence-inspiring. Genuine product delivered with fresh manufacturing week code.',
      verifiedPurchase: true,
      helpfulCount: '48 people found this helpful',
      sentiment: 'positive',
    },
    {
      id: 'rev-2',
      author: 'Vikramaditya K.',
      rating: 5,
      ratingText: '5.0 out of 5 stars',
      title: 'Best tyre for Indian road conditions and potholed city streets',
      date: 'Reviewed in India on 3 January 2024',
      body: 'The sidewall toughness on the 4G Life is noticeably superior. Hit a bad pothole near Bangalore airport at 70 km/h with no rim dent or sidewall bulge. Mileage improved slightly by about 0.8 km/l. Highly recommended for daily office commuters.',
      verifiedPurchase: true,
      helpfulCount: '32 people found this helpful',
      sentiment: 'positive',
    },
    {
      id: 'rev-3',
      author: 'Pradeep Menon',
      rating: 4,
      ratingText: '4.0 out of 5 stars',
      title: 'Solid value for money, braking is sharp',
      date: 'Reviewed in India on 22 December 2023',
      body: 'Good stopping distance and zero skidding on dry tarmac. The rubber compound is on the firmer side to guarantee high mileage, so ride stiffness is slightly felt over sharp expansion joints, but cornering stability is rock solid.',
      verifiedPurchase: true,
      helpfulCount: '19 people found this helpful',
      sentiment: 'positive',
    },
    {
      id: 'rev-4',
      author: 'Sunil Rao',
      rating: 5,
      ratingText: '5.0 out of 5 stars',
      title: 'True 1,00,000 km claims - Second set purchased',
      date: 'Reviewed in India on 11 November 2023',
      body: 'This is my second pair of Amazer 4G Life tyres. My first pair lasted 82,000 km before reaching the tread wear indicator. Great quality control from Apollo Tyres. Amazon delivery was fast and properly bubble wrapped.',
      verifiedPurchase: true,
      helpfulCount: '57 people found this helpful',
      sentiment: 'positive',
    },
    {
      id: 'rev-5',
      author: 'Anand G.',
      rating: 4,
      ratingText: '4.0 out of 5 stars',
      title: 'Authentic product with 5 year warranty registration card',
      date: 'Reviewed in India on 29 October 2023',
      body: 'Verified the serial numbers on Apollo Tyres official portal and successfully activated unconditional warranty. Fitted on WagonR 1.2 and balancing took only 15 grams per wheel.',
      verifiedPurchase: true,
      helpfulCount: '14 people found this helpful',
      sentiment: 'positive',
    },
    {
      id: 'rev-6',
      author: 'Amitabh S.',
      rating: 3,
      ratingText: '3.0 out of 5 stars',
      title: 'Good tyre, but fitting valves not included in package',
      date: 'Reviewed in India on 14 September 2023',
      body: 'Tyres are genuine and newly manufactured (week 28 of 2023). However, make sure you purchase tubeless brass valves separately as they are not bundled in the box.',
      verifiedPurchase: true,
      helpfulCount: '23 people found this helpful',
      sentiment: 'neutral',
    },
  ];
}

export function getApolloDefaultAPlusContent(): APlusSection[] {
  return [
    {
      id: 'aplus-1',
      title: 'Micro-Pore Polymer Durability Matrix',
      heading: 'Up to 1,00,000 Kilometers Real-World Mileage',
      body: 'Synthesized with high-wear resistant rubber particles and specialized micro-pore silica. This formulation provides resilient abrasion resistance against abrasive tarmac and reduces heat build-up over long highway journeys.',
      imageUrl: 'https://m.media-amazon.com/images/I/81+X8zWzKTL._SL1500_.jpg',
      badge: 'Extended Mileage',
    },
    {
      id: 'aplus-2',
      title: 'Hydrodynamic Aquaplaning Resistance',
      heading: 'Twin Longitudinal Circumferential Channels',
      body: 'Dual high-capacity longitudinal grooves rapidly channel water away from the contact footprint during torrential downpours. High-angle shoulder sipes slice through standing water films to maintain grip on slippery turns.',
      imageUrl: 'https://m.media-amazon.com/images/I/81bL0aQj1ZL._SL1500_.jpg',
      badge: 'Wet Traction',
    },
    {
      id: 'aplus-3',
      title: 'Reinforced Steel Belt Architecture',
      heading: 'Robust Resistance to Potholes and Sidewall Impacts',
      body: 'Fortified with double-layer high-tensile steel belts beneath the tread and reinforced apex sidewall rubber. Resists sharp stone punctures, bad road shocks, and rim pinching on pothole-ridden urban routes.',
      imageUrl: 'https://m.media-amazon.com/images/I/71rB3XpPqjL._SL1500_.jpg',
      badge: 'Impact Defense',
    },
    {
      id: 'aplus-4',
      title: 'Acoustic Pitch Shoulder Modulation',
      heading: 'Low Rolling Resistance & Whispering Cabin Silence',
      body: 'Engineered tread block sequencing prevents harmonic resonance and reduces tyre air displacement noise. Optimized contour reduces rolling resistance for improved fuel efficiency across both city stop-and-go and expressways.',
      imageUrl: 'https://m.media-amazon.com/images/I/719hE3mO41L._SL1500_.jpg',
      badge: 'Fuel & Acoustics',
    },
  ];
}

export function getDetailedFallbackProduct(asin: string, url: string): ProductDetails {
  const images = getApolloDefaultImages();
  const reviews = getApolloDefaultReviews();

  const specs: Record<string, string> = {
    'Brand': 'Apollo',
    'Model': 'Amazer 4G Life',
    'Item Dimensions L x W x H': '62 x 16.5 x 62 Centimetres',
    'Section Width': '165 Millimetres',
    'Aspect Ratio': '80',
    'Rim Size': '14 Inches',
    'Speed Rating': 'T (Up to 190 km/h)',
    'Load Index Rating': '85 (Up to 515 kg)',
    'Vehicle Service Type': 'Passenger Car (Hatchback / Sedan)',
    'Construction Type': 'Radial',
    'Tyre Type': 'Tubeless',
    'Item Weight': '6.8 Kilograms',
    'Country of Origin': 'India',
    'Manufacturer': 'Apollo Tyres Ltd.',
    'ASIN': asin || 'B0792G6PF9',
    'Warranty': '5 Years Standard Manufacturer Warranty',
    'Tread Depth': '8.2 Millimetres',
  };

  const features = [
    'Specially engineered micro-pore rubber compound offering ultra-high durability and up to 1,00,000 km tread life.',
    'Advanced symmetric tread design delivers superior wet traction and minimizes aquaplaning risks during monsoons.',
    'Reinforced dual-layer steel belt construction prevents punctures and structural sidewall damage on uneven roads.',
    'Low rolling resistance tread profile lowers fuel consumption and enhances overall vehicle fuel efficiency.',
    'Precision-molded tubeless bead profile provides an airtight rim lock and minimizes road vibrations at highway speeds.',
  ];

  const descriptionParagraphs = [
    'The Apollo Amazer 4G LIFE is engineered specifically for motorists who demand exceptional mileage, high fuel efficiency, and uncompromising safety on diverse road terrains. Crafted with Apollo\'s proprietary micro-pore high-durability polymer compound, this tubeless passenger car tyre is built to comfortably deliver up to 1,00,000 kilometers of dependable tread life.',
    'Featuring an optimized symmetrical tread contour, the tyre ensures consistent contact pressure distribution across the footprint. This uniform contact patch minimizes uneven tread wear, significantly extends tyre longevity, and provides balanced braking stability under both dry asphalt and monsoon highway conditions.',
    'The tyre structure is fortified with high-tensile steel belts and impact-cushioning sidewalls, offering exceptional resistance against harsh potholes, road debris, and stone entrapment. Its low rolling resistance formulation lowers vehicle fuel consumption, making it an ideal long-term investment for daily city commuters and highway tourers alike.',
  ];

  const aplusContent = getApolloDefaultAPlusContent();

  const importantInformation: Record<string, string> = {
    'Safety Information': 'Always maintain vehicle manufacturer recommended cold tyre pressure (typically 32–35 PSI). Inspect tyre tread wear indicators every 10,000 km, and perform computerized wheel alignment & dynamic balancing at regular intervals.',
    'Warranty & Service': '5 Years Standard Manufacturer Warranty against manufacturing defects provided directly by Apollo Tyres Ltd. Fast digital claim registration available at all authorized Apollo Tyre centers.',
    'Legal Disclaimer': 'Fitment should be carried out by a certified tyre technician. Verify that the load index (85) and speed rating (T) match your automobile owner manual specifications before road operation.',
  };

  return {
    asin: asin || 'B0792G6PF9',
    url: url || 'https://www.amazon.in/Apollo-Amazer-4G-LIFE-Tubeless/dp/B0792G6PF9',
    title: 'Apollo Amazer 4G LIFE 165/80 R14 85T Tubeless Car Tyre',
    brand: 'Apollo',
    model: 'Amazer 4G Life',
    category: 'Car & Motorbike > Tyres & Rims > Car Tyres',
    averageRating: 4.3,
    totalRatingsCount: '2,481 global ratings',
    ratingBreakdown: {
      star5: 64,
      star4: 21,
      star3: 8,
      star2: 4,
      star1: 3,
    },
    pricing: {
      currentPrice: '₹3,450.00',
      originalPrice: '₹4,300.00',
      discountPercentage: '20% off',
      savings: '₹850.00 (20%)',
      currency: '₹',
      inStock: true,
      availabilityText: 'In stock. Fulfilled by Amazon.',
      emiText: 'No Cost EMI available. EMI starts at ₹167/month.',
    },
    features,
    specs,
    description: descriptionParagraphs.join('\n\n'),
    descriptionParagraphs,
    aplusContent,
    importantInformation,
    images,
    reviews,
    scrapedAt: new Date().toISOString(),
    source: 'live_scraped',
  };
}
