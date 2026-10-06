'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

// Placeholder reviews (in real app, fetch from API)
interface Review {
  id: string;
  customerName: string;
  customerEmail: string;
  packageName: string;
  rating: number;
  review: string;
  date: string;
  status: 'APPROVED' | 'PENDING' | 'HIDDEN';
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    customerName: 'Aneeq Ahamed',
    customerEmail: 'aneeq@gmail.com',
    packageName: 'Premium Umrah Package - September 2026',
    rating: 5,
    review:
      'Alhamdulillah, MHK Travels made our Umrah journey comfortable and well organized. The accommodations were excellent and the guide was very knowledgeable.',
    date: '2026-09-20T10:30:00Z',
    status: 'APPROVED',
  },
  {
    id: '2',
    customerName: 'Fathima Zeenath',
    customerEmail: 'fathima@example.com',
    packageName: 'Royal Ramadhan Umrah 1447H',
    rating: 5,
    review:
      'An unforgettable spiritual experience. The Ramadhan programs were beautifully organized, and the Sri Lankan meals made us feel at home.',
    date: '2026-09-18T15:20:00Z',
    status: 'APPROVED',
  },
  {
    id: '3',
    customerName: 'Mohamed Rizwan',
    customerEmail: 'rizwan@example.com',
    packageName: 'Economy Hajj Package 1447H',
    rating: 4,
    review:
      'Good value for the price. The tent facilities at Mina could be slightly better, but overall a very memorable Hajj.',
    date: '2026-09-15T08:45:00Z',
    status: 'PENDING',
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [filter, setFilter] = useState<'all' | 'APPROVED' | 'PENDING' | 'HIDDEN'>('all');

  const filtered = reviews.filter((r) => filter === 'all' || r.status === filter);

  const counts = {
    all: reviews.length,
    APPROVED: reviews.filter((r) => r.status === 'APPROVED').length,
    PENDING: reviews.filter((r) => r.status === 'PENDING').length,
    HIDDEN: reviews.filter((r) => r.status === 'HIDDEN').length,
  };

  const handleStatusChange = (id: string, status: Review['status']) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this review permanently?')) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="relative overflow-hidden bg-gradient-to-br from-tertiary via-tertiary-container to-primary rounded-3xl p-6 lg:p-8 text-white shadow-xl">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/20 blur-3xl pointer-events-none"
          />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/20 mb-3">
                <span className="material-symbols-outlined text-xs">
                  reviews
                </span>
                Review Management
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold">Reviews</h1>
              <p className="text-sm opacity-90 mt-1">
                {reviews.length} total • {avgRating} avg rating
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-tertiary-fixed">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-xs opacity-90 mt-1">Average rating</p>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Filters */}
      <FadeUp delay={0.1}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-lg">
          <div className="flex flex-wrap gap-1 p-1 bg-surface-container rounded-xl">
            {[
              { id: 'all', label: 'All', count: counts.all },
              { id: 'APPROVED', label: 'Approved', count: counts.APPROVED },
              { id: 'PENDING', label: 'Pending', count: counts.PENDING },
              { id: 'HIDDEN', label: 'Hidden', count: counts.HIDDEN },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? 'bg-tertiary text-white shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/60'
                }`}
              >
                {tab.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    filter === tab.id
                      ? 'bg-white/20'
                      : 'bg-surface-container-high'
                  }`}
                >
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Reviews List */}
      {filtered.length === 0 ? (
        <FadeUp delay={0.2}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
            <span className="material-symbols-outlined text-6xl text-outline">
              reviews
            </span>
            <h3 className="text-xl font-bold text-on-surface mt-4">
              No reviews found
            </h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Reviews from customers will appear here
            </p>
          </div>
        </FadeUp>
      ) : (
        <StaggerContainer className="space-y-3">
          {filtered.map((review) => (
            <StaggerItem key={review.id}>
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-tertiary to-tertiary-container flex items-center justify-center text-white font-bold shadow-sm">
                      {review.customerName[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-sm">
                        {review.customerName}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        {review.customerEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        review.status === 'APPROVED'
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : review.status === 'PENDING'
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {review.status}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      {new Date(review.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Package & Rating */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Link
                    href="/admin/packages"
                    className="text-[10px] font-bold text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded hover:underline"
                  >
                    {review.packageName}
                  </Link>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={`material-symbols-outlined text-sm ${
                          s <= review.rating ? 'text-tertiary' : 'text-outline-variant'
                        }`}
                        style={{
                          fontVariationSettings:
                            s <= review.rating ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        star
                      </span>
                    ))}
                    <span className="text-[10px] font-bold text-on-surface ml-1">
                      {review.rating}.0
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-sm text-on-surface-variant leading-relaxed italic mb-4">
                  &ldquo;{review.review}&rdquo;
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-surface-container">
                  {review.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleStatusChange(review.id, 'APPROVED')}
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">
                        check_circle
                      </span>
                      Approve
                    </button>
                  )}
                  {review.status !== 'HIDDEN' && (
                    <button
                      onClick={() => handleStatusChange(review.id, 'HIDDEN')}
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">
                        visibility_off
                      </span>
                      Hide
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container hover:bg-error hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 ml-auto"
                  >
                    <span className="material-symbols-outlined text-sm">
                      delete
                    </span>
                    Delete
                  </button>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}