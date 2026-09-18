'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { bookingAPI } from '@/lib/api';
import { Booking } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';


type TabType = 'all' | 'upcoming' | 'pending' | 'completed' | 'cancelled';

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const justCreated = searchParams.get('created');
  const justDeleted = searchParams.get('deleted');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/bookings');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch bookings on mount AND whenever auth/path changes
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      setLoading(true); // Show loading state on every fetch
      try {
        const response = await bookingAPI.myBookings({ limit: 100 });
        setBookings(response.data.data.bookings || []);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, searchParams]); // ← Add searchParams so it re-runs on param change

  // Refetch when user returns to the tab
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        bookingAPI
          .myBookings({ limit: 100 })
          .then((res) => setBookings(res.data.data.bookings || []))
          .catch(() => {});
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated]);

  // Filter by tab
  const filteredBookings = bookings.filter((booking) => {
    // Tab filter
    if (activeTab === 'upcoming') {
      const travelDate = new Date(booking.package?.travelDate || '');
      const now = new Date();
      if (
        travelDate < now ||
        booking.bookingStatus === 'COMPLETED' ||
        booking.bookingStatus === 'CANCELLED'
      ) {
        return false;
      }
    }
    if (activeTab === 'pending') {
      if (
        booking.bookingStatus !== 'PENDING_PAYMENT' &&
        booking.bookingStatus !== 'ADVANCE_PAID'
      ) {
        return false;
      }
    }
    if (activeTab === 'completed') {
      if (booking.bookingStatus !== 'COMPLETED') return false;
    }
    if (activeTab === 'cancelled') {
      if (booking.bookingStatus !== 'CANCELLED') return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.bookingRef.toLowerCase().includes(query) ||
        booking.package?.name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Count for tabs
  const counts = {
    all: bookings.length,
    upcoming: bookings.filter((b) => {
      const travelDate = new Date(b.package?.travelDate || '');
      return (
        travelDate >= new Date() &&
        b.bookingStatus !== 'COMPLETED' &&
        b.bookingStatus !== 'CANCELLED'
      );
    }).length,
    pending: bookings.filter(
      (b) =>
        b.bookingStatus === 'PENDING_PAYMENT' ||
        b.bookingStatus === 'ADVANCE_PAID'
    ).length,
    completed: bookings.filter((b) => b.bookingStatus === 'COMPLETED').length,
    cancelled: bookings.filter((b) => b.bookingStatus === 'CANCELLED').length,
  };

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-surface-container rounded-2xl" />
          <div className="h-64 bg-surface-container rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-on-surface">
                My Bookings
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Manage all your Hajj &amp; Umrah pilgrimages
              </p>
            </div>
            <Link
              href="/umrah"
              className="btn-primary inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              New Booking
            </Link>
          </div>
        </div>
      </FadeUp>

      {/* Tabs + Search */}
      <FadeUp delay={0.1}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-lg">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Tabs */}
            <div className="flex flex-wrap gap-1 p-1 bg-surface-container rounded-xl overflow-x-auto">
              {[
                { id: 'all', label: 'All', count: counts.all },
                { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
                { id: 'pending', label: 'Pending', count: counts.pending },
                {
                  id: 'completed',
                  label: 'Completed',
                  count: counts.completed,
                },
                {
                  id: 'cancelled',
                  label: 'Cancelled',
                  count: counts.cancelled,
                },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/60'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? 'bg-white/20'
                        : 'bg-surface-container-high'
                    }`}
                  >
                    {tab.count}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Search */}
            <div className="relative md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/70 border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs transition-all"
              />
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-surface-container rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <FadeUp delay={0.2}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-primary-fixed/40 flex items-center justify-center mx-auto mb-4"
            >
              <span className="material-symbols-outlined text-4xl text-primary">
                {activeTab === 'all' ? 'luggage' : 'search_off'}
              </span>
            </motion.div>
            <h3 className="text-xl font-bold text-on-surface mb-1">
              {activeTab === 'all'
                ? 'No bookings yet'
                : `No ${activeTab} bookings`}
            </h3>
            <p className="text-sm text-on-surface-variant mb-6 max-w-md mx-auto">
              {activeTab === 'all'
                ? 'Start your sacred journey today with just 20% advance. Browse our packages.'
                : 'Try a different tab or filter to see your bookings.'}
            </p>
            {activeTab === 'all' && (
              <Link href="/umrah" className="btn-primary inline-flex">
                <span className="material-symbols-outlined text-lg">
                  travel_explore
                </span>
                Browse Packages
              </Link>
            )}
          </div>
        </FadeUp>
      ) : (
        <StaggerContainer className="space-y-4">
          {filteredBookings.map((booking, idx) => (
            <StaggerItem key={booking.id}>
              <BookingCard booking={booking} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}

// ==========================================
// Booking Card
// ==========================================
function BookingCard({ booking }: { booking: Booking }) {
  const travelDate = new Date(booking.package?.travelDate || '').toLocaleDateString(
    'en-GB',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );

  const daysUntil = Math.ceil(
    (new Date(booking.package?.travelDate || '').getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );

  const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING_PAYMENT: {
      label: 'Pending Payment',
      color: 'bg-tertiary-fixed text-on-tertiary-fixed',
    },
    ADVANCE_PAID: {
      label: 'Advance Paid',
      color: 'bg-primary-fixed text-on-primary-fixed',
    },
    CONFIRMED: {
      label: 'Confirmed',
      color: 'bg-secondary-container text-on-secondary-container',
    },
    DOCUMENTS_PENDING: {
      label: 'Docs Pending',
      color: 'bg-tertiary-fixed text-on-tertiary-fixed',
    },
    DOCUMENTS_VERIFIED: {
      label: 'Docs Verified',
      color: 'bg-secondary-container text-on-secondary-container',
    },
    TRAVEL_READY: {
      label: 'Travel Ready',
      color: 'bg-primary text-white',
    },
    COMPLETED: {
      label: 'Completed',
      color: 'bg-surface-container-high text-on-surface',
    },
    CANCELLED: {
      label: 'Cancelled',
      color: 'bg-error-container text-on-error-container',
    },
  };

  const status = statusConfig[booking.bookingStatus] || {
    label: booking.bookingStatus,
    color: 'bg-surface-container',
  };

  const isCancelled = booking.bookingStatus === 'CANCELLED';
  const isPending =
    booking.bookingStatus === 'PENDING_PAYMENT' ||
    booking.bookingStatus === 'ADVANCE_PAID';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-48 h-32 md:h-auto relative overflow-hidden flex-shrink-0">
          {booking.package?.posterUrl ? (
            <img
              src={booking.package.posterUrl}
              alt={booking.package.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-white/40">
                mosque
              </span>
            </div>
          )}
          <span
            className={`absolute top-3 left-3 badge ${
              booking.package?.type === 'HAJJ'
                ? 'bg-tertiary text-white'
                : 'bg-primary text-white'
            }`}
          >
            {booking.package?.type || 'UMRAH'}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 min-w-0">
          {/* Top Row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded">
              {booking.bookingRef}
            </span>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${status.color}`}
            >
              {status.label}
            </span>
            {!isCancelled && daysUntil > 0 && daysUntil <= 30 && (
              <span className="text-[10px] font-bold text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">
                  schedule
                </span>
                {daysUntil} days to go
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-on-surface line-clamp-1">
            {booking.package?.name || 'Package'}
          </h3>

          <div className="flex flex-wrap gap-4 text-xs text-on-surface-variant mt-2">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                calendar_today
              </span>
              {travelDate}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">group</span>
              {Array.isArray(booking.travellers)
                ? booking.travellers.length
                : 1}{' '}
              Pilgrim
              {(Array.isArray(booking.travellers)
                ? booking.travellers.length
                : 1) > 1
                ? 's'
                : ''}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                flight_takeoff
              </span>
              {booking.package?.departureCity || 'Colombo'}
            </span>
          </div>

          {/* Bottom Row — Financials + Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-surface-container">
            <div className="flex flex-wrap gap-4 text-xs">
              <div>
                <span className="text-on-surface-variant">Total</span>
                <p className="font-bold text-on-surface">
                  LKR {booking.totalAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-on-surface-variant">Paid</span>
                <p className="font-bold text-primary">
                  LKR {booking.advancePaid.toLocaleString()}
                </p>
              </div>
              {booking.balanceDue > 0 && !isCancelled && (
                <div>
                  <span className="text-on-surface-variant">Due</span>
                  <p className="font-bold text-tertiary">
                    LKR {booking.balanceDue.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {isPending && booking.bookingStatus === 'PENDING_PAYMENT' && (
                <Link
                  href={`/bookings/${booking.id}/pay?type=ADVANCE`}
                  className="btn-primary text-xs px-4 py-2"
                >
                  Pay Advance
                </Link>
              )}
              <Link
                href={`/bookings/${booking.id}`}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors"
              >
                View Details
              </Link>

              {(booking.bookingStatus === 'CANCELLED' ||
                booking.bookingStatus === 'PENDING_PAYMENT') && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      confirm(
                        `Delete booking ${booking.bookingRef}? This cannot be undone.`
                      )
                    ) {
                      // TODO: implement delete + refresh
                      bookingAPI.delete(booking.id).then(() => window.location.reload());
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-error-container text-on-error-container hover:bg-error hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// Default export with Suspense boundary
// ==========================================
export default function BookingsPage() {
  return (
    <Suspense fallback={<BookingsSkeleton />}>
      <BookingsContent />
    </Suspense>
  );
}

function BookingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-surface-container rounded-2xl" />
        <div className="h-16 bg-surface-container rounded-2xl" />
        <div className="h-64 bg-surface-container rounded-2xl" />
      </div>
    </div>
  );
}