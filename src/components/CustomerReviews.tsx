import React, { useState } from 'react';
import { Star, MessageSquare, ShieldCheck, ThumbsUp, Filter, Search } from 'lucide-react';
import { CustomerReview, RatingBreakdown } from '../types';

interface CustomerReviewsProps {
  reviews: CustomerReview[];
  averageRating: number;
  totalRatingsCount: string;
  ratingBreakdown: RatingBreakdown;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews,
  averageRating,
  totalRatingsCount,
  ratingBreakdown,
}) => {
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReviews = reviews.filter((rev) => {
    const matchesRating = ratingFilter === null || Math.floor(rev.rating) === ratingFilter;
    const matchesSearch =
      rev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const breakdownRows = [
    { star: 5, pct: ratingBreakdown.star5 },
    { star: 4, pct: ratingBreakdown.star4 },
    { star: 3, pct: ratingBreakdown.star3 },
    { star: 2, pct: ratingBreakdown.star2 },
    { star: 1, pct: ratingBreakdown.star1 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Rating Summary Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Big Score Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-stone-200 text-center">
            <span className="text-5xl font-extrabold text-stone-900 tracking-tight font-sans">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex items-center text-amber-500 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(averageRating) ? 'fill-current text-amber-400' : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-semibold text-stone-600">out of 5 stars</p>
            <p className="text-xs text-stone-400 mt-0.5">{totalRatingsCount}</p>
          </div>

          {/* Star Distribution Progress Bars */}
          <div className="md:col-span-8 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Customer Rating Breakdown
            </h4>
            {breakdownRows.map((row) => (
              <div
                key={row.star}
                onClick={() => setRatingFilter(ratingFilter === row.star ? null : row.star)}
                className="flex items-center gap-3 text-xs cursor-pointer group"
              >
                <span className="w-12 text-stone-600 font-medium group-hover:text-amber-600 flex items-center justify-end gap-1">
                  {row.star} star
                </span>
                <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 group-hover:bg-amber-600 rounded-full transition-all"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-9 text-stone-400 text-right font-mono text-[11px]">
                  {row.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Star Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-stone-500 mr-1 font-medium">Filter:</span>
          <button
            onClick={() => setRatingFilter(null)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              ratingFilter === null
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setRatingFilter(ratingFilter === star ? null : star)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition-colors cursor-pointer ${
                ratingFilter === star
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>{star}</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>

        {/* Search Reviews */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reviews..."
            className="w-full sm:w-56 text-xs pl-8 pr-3 py-1.5 border border-stone-300 rounded-lg bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:border-stone-300 transition-colors"
            >
              {/* Reviewer Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-700">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">
                      {rev.author}
                    </span>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center text-[11px] text-amber-700 font-medium">
                        <ShieldCheck className="w-3 h-3 mr-1 text-amber-600" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[11px] text-stone-400 font-medium">{rev.date}</span>
              </div>

              {/* Star Rating & Title */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'fill-current text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <h5 className="text-sm font-bold text-stone-900">{rev.title}</h5>
              </div>

              {/* Body */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                {rev.body}
              </p>

              {/* Helpful Votes */}
              {rev.helpfulCount && (
                <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-2 border-t border-stone-100">
                  <ThumbsUp className="w-3 h-3 text-stone-400" />
                  <span>{rev.helpfulCount}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-stone-300" />
            <p className="text-sm">No reviews found matching your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
