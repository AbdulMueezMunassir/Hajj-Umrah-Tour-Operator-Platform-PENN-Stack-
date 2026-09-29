'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { bookingAPI } from '@/lib/api';
import { Booking } from '@/types';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

type TabType =
  | 'all'
  | 'PENDING_PAYMENT'
  | 'ADVANCE_PAID'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingAPI.allBookings({ limit: 100 });
        setBookings(res.data.data.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = useMemo(() => {
    let result = [...bookings];

    if (activeTab !== 'all') {
      result = result.filter((b) => b.bookingStatus === activeTab);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.bookingRef.toLowerCase().includes(q) ||
          b.package?.name?.toLowerCase().includes(q) ||
          b.user?.email?.toLowerCase().includes(q) ||
          b.user?.firstName?.toLowerCase().includes(q) ||
          b.user?.lastName?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [bookings, activeTab, searchQuery]);

  const counts = {
    all: bookings.length,
    PENDING_PAYMENT: bookings.filter((b) => b.bookingStatus === 'PENDING_PAYMENT').length,
    ADVANCE_PAID: bookings.filter((b) => b.bookingStatus === 'ADVANCE_PAID').length,
    CONFIRMED: bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length,
    COMPLETED: bookings.filter((b) => b.bookingStatus === 'COMPLETED').length,
    CANCELLED: bookings.filter((b) => b.bookingStatus === 'CANCELLED').length,
  };

  const totalRevenue = bookings
    .filter((b) => b.bookingStatus !== 'CANCELLED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

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
                  receipt_long
                </span>
                Bookings Management
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold">All Bookings</h1>
              <p className="text-sm opacity-90 mt-1">
                {bookings.length} total • LKR {totalRevenue.toLocaleString()} revenue
              </p>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Filters */}
      <FadeUp delay={0.1}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-lg">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex flex-wrap gap-1 p-1 bg-surface-container rounded-xl">
              {[
                { id: 'all', label: 'All', count: counts.all },
                { id: 'PENDING_PAYMENT', label: 'Pending', count: counts.PENDING_PAYMENT },
                { id: 'ADVANCE_PAID', label: 'Advance Paid', count: counts.ADVANCE_PAID },
                { id: 'CONFIRMED', label: 'Confirmed', count: counts.CONFIRMED },
                { id: 'COMPLETED', label: 'Completed', count: counts.COMPLETED },
                { id: 'CANCELLED', label: 'Cancelled', count: counts.CANCELLED },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-tertiary text-white shadow-md'
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

            <div className="relative md:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search by ref, name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/70 border border-surface-container-high focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 outline-none text-xs transition-all"
              />
            </div>
          </div>
        </div>
      </FadeUp>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-surface-container rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <FadeUp delay={0.2}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
            <span className="material-symbols-outlined text-6xl text-outline">
              inbox
            </span>
            <h3 className="text-xl font-bold text-on-surface mt-4">
              No bookings found
            </h3>
            <p className="text-sm text-on-surface-variant mt-1">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Bookings will appear here'}
            </p>
          </div>
        </FadeUp>
      ) : (
        <StaggerContainer className="space-y-3">
          {filtered.map((b) => (
            <StaggerItem key={b.id}>
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Image */}
                  <div className="lg:w-24 h-20 rounded-xl overflow-hidden relative flex-shrink-0">
                    {b.package?.posterUrl ? (
                      <img
                        src={b.package.posterUrl}
                        alt={b.package?.name || ''}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl text-white/40">
                          mosque
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded font-mono">
                        {b.bookingRef}
                      </span>
                      <StatusBadge status={b.bookingStatus} />
                    </div>

                    <h3 className="font-bold text-on-surface text-sm truncate">
                      {b.package?.name || 'Package'}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant mt-1">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          person
                        </span>
                        {b.user?.firstName} {b.user?.lastName}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          mail
                        </span>
                        {b.user?.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          group
                        </span>
                        {b.travellersData?.length || 1} pilgrim
                        {(b.travellersData?.length || 1) > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="lg:text-right space-y-1">
                    <div className="text-lg font-bold text-on-surface">
                      LKR {b.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-primary font-bold">
                      Paid: LKR {b.advancePaid.toLocaleString()}
                    </div>
                    {b.balanceDue > 0 && (
                      <div className="text-[10px] text-tertiary font-bold">
                        Due: LKR {b.balanceDue.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="px-3 py-2 rounded-xl bg-tertiary text-white text-xs font-bold hover:bg-tertiary-container transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">
                        visibility
                      </span>
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; bg: string }> = {
    PENDING_PAYMENT: {
      label: 'Pending Payment',
      bg: 'bg-tertiary-fixed text-on-tertiary-fixed',
    },
    ADVANCE_PAID: {
      label: 'Advance Paid',
      bg: 'bg-primary-fixed text-on-primary-fixed',
    },
    CONFIRMED: {
      label: 'Confirmed',
      bg: 'bg-secondary-container text-on-secondary-container',
    },
    DOCUMENTS_PENDING: {
      label: 'Docs Pending',
      bg: 'bg-tertiary-fixed text-on-tertiary-fixed',
    },
    DOCUMENTS_VERIFIED: {
      label: 'Docs Verified',
      bg: 'bg-secondary-container text-on-secondary-container',
    },
    TRAVEL_READY: {
      label: 'Travel Ready',
      bg: 'bg-primary text-white',
    },
    COMPLETED: {
      label: 'Completed',
      bg: 'bg-surface-container-high text-on-surface',
    },
    CANCELLED: {
      label: 'Cancelled',
      bg: 'bg-error-container text-on-error-container',
    },
  };

  const { label, bg } = config[status] || {
    label: status,
    bg: 'bg-surface-container',
  };

  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${bg}`}
    >
      {label}
    </span>
  );
}