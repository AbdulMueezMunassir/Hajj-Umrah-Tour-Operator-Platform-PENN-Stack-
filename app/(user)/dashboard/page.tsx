'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { bookingAPI, paymentAPI } from '@/lib/api';
import { Booking, Payment } from '@/types';
import { motion } from 'framer-motion';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      try {
        const [bookingsRes, paymentsRes] = await Promise.all([
          bookingAPI.myBookings({ limit: 5 }),
          paymentAPI.myPayments({ limit: 5 }),
        ]);
        setBookings(bookingsRes.data.data.bookings || []);
        setPayments(paymentsRes.data.data.payments || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="container-mhk py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-surface-container rounded-2xl" />
          <div className="grid grid-cols-4 gap-4">
            <div className="h-24 bg-surface-container rounded-2xl" />
            <div className="h-24 bg-surface-container rounded-2xl" />
            <div className="h-24 bg-surface-container rounded-2xl" />
            <div className="h-24 bg-surface-container rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Calculate stats
  const activeBookings = bookings.filter(
    (b) => b.bookingStatus !== 'COMPLETED' && b.bookingStatus !== 'CANCELLED'
  );
  const pendingPayments = bookings.filter(
    (b) => b.balanceDue > 0 && b.bookingStatus !== 'CANCELLED'
  );
  const totalPaid = bookings.reduce((sum, b) => sum + b.advancePaid, 0);
  const totalDue = bookings.reduce((sum, b) => sum + b.balanceDue, 0);

  return (
    <div>
      {/* Welcome Header */}
      <FadeUp>
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary rounded-3xl p-8 lg:p-10 text-white mb-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"
          />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl font-bold shadow-lg">
                {user.firstName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/20 mb-1.5">
                  <span className="material-symbols-outlined text-xs text-tertiary-fixed">
                    verified
                  </span>
                  {user.role === 'ADMIN' ? 'Admin' : 'Verified Pilgrim'}
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold">
                  Assalamu Alaikum, {user.firstName}! 👋
                </h1>
                <p className="text-sm opacity-90 mt-1">
                  Welcome back to your sacred journey dashboard.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href="/umrah"
                className="px-5 py-2.5 rounded-xl bg-white text-primary font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">
                  add
                </span>
                New Booking
              </Link>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stats Grid */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: 'flight_takeoff',
            label: 'Active Bookings',
            value: activeBookings.length.toString(),
            color: 'primary',
          },
          {
            icon: 'schedule',
            label: 'Pending Payments',
            value: pendingPayments.length.toString(),
            color: 'gold',
          },
          {
            icon: 'payments',
            label: 'Total Paid',
            value: `LKR ${(totalPaid / 1000).toFixed(0)}K`,
            color: 'primary',
          },
          {
            icon: 'account_balance_wallet',
            label: 'Balance Due',
            value: `LKR ${(totalDue / 1000).toFixed(0)}K`,
            color: 'tertiary',
          },
        ].map((stat) => (
          <StaggerItem key={stat.label}>
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.color === 'primary'
                      ? 'bg-primary-fixed/40 text-primary'
                      : stat.color === 'gold'
                      ? 'bg-tertiary-fixed/40 text-tertiary'
                      : 'bg-secondary-container/40 text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {stat.icon}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-on-surface">
                {stat.value}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">
                {stat.label}
              </p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <FadeUp>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl shadow-lg overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    receipt_long
                  </span>
                  <h2 className="font-bold text-on-surface">
                    Recent Bookings
                  </h2>
                </div>
                <Link
                  href="/bookings"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View All →
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <span className="material-symbols-outlined text-5xl text-outline">
                    luggage
                  </span>
                  <h3 className="font-bold text-on-surface mt-3">
                    No journeys booked yet
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-1 mb-4">
                    Start your sacred journey today with just 20% advance.
                  </p>
                  <Link href="/umrah" className="btn-primary inline-flex">
                    Browse Packages
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-surface-container">
                  {bookings.slice(0, 4).map((booking) => (
                    <motion.div
                      key={booking.id}
                      whileHover={{ backgroundColor: 'rgba(234, 237, 255, 0.4)' }}
                      className="p-5 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded">
                              {booking.bookingRef}
                            </span>
                            <BookingStatusBadge status={booking.bookingStatus} />
                          </div>
                          <h3 className="font-bold text-on-surface truncate">
                            {booking.package?.name || 'Package'}
                          </h3>
                          <p className="text-xs text-on-surface-variant mt-0.5">
                            {booking.package?.type} •{' '}
                            {booking.package?.departureCity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                        <div className="flex items-center gap-4 text-xs">
                          <div>
                            <span className="text-on-surface-variant">
                              Total:
                            </span>{' '}
                            <strong className="text-on-surface">
                              LKR {booking.totalAmount.toLocaleString()}
                            </strong>
                          </div>
                          {booking.balanceDue > 0 && (
                            <div>
                              <span className="text-on-surface-variant">
                                Due:
                              </span>{' '}
                              <strong className="text-tertiary">
                                LKR {booking.balanceDue.toLocaleString()}
                              </strong>
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          View Details →
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </FadeUp>
        </div>

        {/* Side Column */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {/* Quick Actions */}
          <FadeUp delay={0.1}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl shadow-lg p-5">
              <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  bolt
                </span>
                Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  { href: '/bookings', label: 'My Bookings', icon: 'receipt_long' },
                  { href: '/payments', label: 'Payment History', icon: 'payments' },
                  { href: '/profile', label: 'Edit Profile', icon: 'person' },
                  { href: '/support', label: 'Contact Support', icon: 'support_agent' },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group"
                  >
                    <span className="material-symbols-outlined text-primary text-lg">
                      {action.icon}
                    </span>
                    <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                      {action.label}
                    </span>
                    <span className="material-symbols-outlined text-on-surface-variant text-base ml-auto group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Support Card */}
          <FadeUp delay={0.15}>
            <div className="relative overflow-hidden bg-gradient-to-br from-tertiary to-tertiary-container rounded-2xl p-5 text-white shadow-lg">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-2xl"
              />
              <div className="relative">
                <span className="material-symbols-outlined text-3xl mb-2">
                  support_agent
                </span>
                <h3 className="font-bold text-lg mb-1">Need Help?</h3>
                <p className="text-xs opacity-90 mb-4">
                  Our pilgrimage experts are available 24/7 to assist you.
                </p>
                <a
                  href="https://wa.me/94776290290"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-tertiary px-3 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  <span className="material-symbols-outlined text-base">
                    chat
                  </span>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}

// Booking Status Badge
function BookingStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
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

  const { label, color } = config[status] || {
    label: status,
    color: 'bg-surface-container text-on-surface-variant',
  };

  return (
    <span
      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${color}`}
    >
      {label}
    </span>
  );
}