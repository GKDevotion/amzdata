import React, { useEffect } from 'react';
import { ProductDetails } from '../types';

interface DynamicJsonLdProps {
  product: ProductDetails | null;
}

export const DynamicJsonLd: React.FC<DynamicJsonLdProps> = ({ product }) => {
  useEffect(() => {
    const existingScript = document.getElementById('amzdata-dynamic-product-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (!product) return;

    // Parse numeric price for schema.org validity
    const rawPrice = product.pricing.currentPrice.replace(/[^0-9.]/g, '');
    const numericPrice = parseFloat(rawPrice) || 3450;
    const currency = product.pricing.currency === '₹' ? 'INR' : 'USD';

    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.title,
      'asin': product.asin,
      'sku': product.asin,
      'mpn': product.specs['Model'] || product.model || product.asin,
      'image': product.images.map((img) => img.fhdUrl || img.thumbUrl),
      'description': product.description || product.features.join('. '),
      'brand': {
        '@type': 'Brand',
        'name': product.brand,
      },
      'offers': {
        '@type': 'Offer',
        'url': product.url,
        'priceCurrency': currency,
        'price': numericPrice,
        'priceValidUntil': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        'itemCondition': 'https://schema.org/NewCondition',
        'availability': product.pricing.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        'seller': {
          '@type': 'Organization',
          'name': 'Amazon',
        },
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': product.averageRating,
        'reviewCount': product.reviews.length > 0 ? product.reviews.length : 2481,
        'bestRating': '5',
        'worstRating': '1',
      },
      'review': product.reviews.map((rev) => ({
        '@type': 'Review',
        'author': {
          '@type': 'Person',
          'name': rev.author,
        },
        'datePublished': rev.date,
        'reviewBody': rev.body,
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': rev.rating,
          'bestRating': '5',
          'worstRating': '1',
        },
      })),
    };

    const script = document.createElement('script');
    script.id = 'amzdata-dynamic-product-jsonld';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(productSchema, null, 2);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('amzdata-dynamic-product-jsonld');
      if (el) el.remove();
    };
  }, [product]);

  return null;
};
