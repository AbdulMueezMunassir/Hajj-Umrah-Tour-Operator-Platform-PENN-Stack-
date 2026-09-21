'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { paymentAPI } from '@/lib/api';
import { Payment } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

export default function PaymentsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'PAID' | 'PENDING' | 'FAILED'>(
    'all'
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/payments');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await paymentAPI.myPayments({ limit: 100 });
        setPayments(res.data.data.payments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [isAuthenticated]);

  const filtered = payments.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const totalPaid = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  if (authLoading || loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-surface-container rounded-2xl" />
        <div className="h-64 bg-surface-container rounded-2xl" />
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
                Payment History
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                All your transactions with MHK Travels
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                Total Paid
              </span>
              <p className="text-2xl font-bold text-primary">
                LKR {totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Filter Tabs */}
      <FadeUp delay={0.1}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-lg">
          <div className="flex flex-wrap gap-1 p-1 bg-surface-container rounded-xl">
            {[
              { id: 'all', label: 'All', count: payments.length },
              {
                id: 'PAID',
                label: 'Paid',
                count: payments.filter((p) => p.status === 'PAID').length,
              },
              {
                id: 'PENDING',
                label: 'Pending',
                count: payments.filter((p) => p.status === 'PENDING').length,
              },
              {
                id: 'FAILED',
                label: 'Failed',
                count: payments.filter((p) => p.status === 'FAILED').length,
              },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? 'bg-primary text-white shadow-md'
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

      {/* Payments List */}
      {filtered.length === 0 ? (
        <FadeUp delay={0.2}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full bg-primary-fixed/40 flex items-center justify-center mx-auto mb-4"
            >
              <span className="material-symbols-outlined text-4xl text-primary">
                payments
              </span>
            </motion.div>
            <h3 className="text-xl font-bold text-on-surface mb-1">
              No {filter === 'all' ? '' : filter.toLowerCase()} payments
            </h3>
            <p className="text-sm text-on-surface-variant mb-6 max-w-md mx-auto">
              {filter === 'all'
                ? 'Payment history will appear here once you make your first transaction.'
                : `You don't have any ${filter.toLowerCase()} payments.`}
            </p>
            <Link href="/bookings" className="btn-primary inline-flex">
              <span className="material-symbols-outlined text-lg">
                receipt_long
              </span>
              View My Bookings
            </Link>
          </div>
        </FadeUp>
      ) : (
        <StaggerContainer className="space-y-3">
          {filtered.map((payment) => {
            const statusConfig: Record<string, { label: string; bg: string }> = {
              PAID: { label: 'Paid', bg: 'bg-primary text-white' },
              PENDING: {
                label: 'Pending',
                bg: 'bg-tertiary-fixed text-on-tertiary-fixed',
              },
              PROCESSING: {
                label: 'Processing',
                bg: 'bg-tertiary-fixed text-on-tertiary-fixed',
              },
              FAILED: {
                label: 'Failed',
                bg: 'bg-error-container text-on-error-container',
              },
              REFUNDED: {
                label: 'Refunded',
                bg: 'bg-surface-container-high text-on-surface',
              },
            };
            const sc = statusConfig[payment.status] || {
              label: payment.status,
              bg: 'bg-surface-container',
            };

            return (
              <StaggerItem key={payment.id}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          payment.status === 'PAID'
                            ? 'bg-primary-fixed/40 text-primary'
                            : payment.status === 'FAILED'
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-tertiary-fixed/40 text-tertiary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {payment.status === 'PAID'
                            ? 'check_circle'
                            : payment.status === 'FAILED'
                            ? 'error'
                            : 'schedule'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${sc.bg}`}
                          >
                            {sc.label}
                          </span>
                          <span className="text-[10px] font-bold uppercase text-primary bg-primary-fixed/40 px-2 py-0.5 rounded">
                            {payment.paymentType}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1 truncate">
                          {payment.booking?.bookingRef || 'N/A'} •{' '}
                          {payment.gateway}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-on-surface">
                        LKR {payment.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        {new Date(payment.createdAt).toLocaleDateString(
                          'en-GB',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-surface-container">
                    <div className="text-[10px] text-on-surface-variant">
                      {payment.transactionId && (
                        <span>
                          Txn:{' '}
                          <span className="font-mono">
                            {payment.transactionId}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {payment.booking && (
                        <Link
                          href={`/bookings/${payment.booking.id}`}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          View Booking →
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </div>
  );
}'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { paymentAPI } from '@/lib/api';
import { Payment } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

export default function PaymentsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'PAID' | 'PENDING' | 'FAILED'>(
    'all'
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/payments');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await paymentAPI.myPayments({ limit: 100 });
        setPayments(res.data.data.payments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [isAuthenticated]);

  const filtered = payments.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const totalPaid = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  if (authLoading || loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-surface-container rounded-2xl" />
        <div className="h-64 bg-surface-container rounded-2xl" />
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
                Payment History
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                All your transactions with MHK Travels
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                Total Paid
              </span>
              <p className="text-2xl font-bold text-primary">
                LKR {totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Filter Tabs */}
      <FadeUp delay={0.1}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-lg">
          <div className="flex flex-wrap gap-1 p-1 bg-surface-container rounded-xl">
            {[
              { id: 'all', label: 'All', count: payments.length },
              {
                id: 'PAID',
                label: 'Paid',
                count: payments.filter((p) => p.status === 'PAID').length,
              },
              {
                id: 'PENDING',
                label: 'Pending',
                count: payments.filter((p) => p.status === 'PENDING').length,
              },
              {
                id: 'FAILED',
                label: 'Failed',
                count: payments.filter((p) => p.status === 'FAILED').length,
              },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? 'bg-primary text-white shadow-md'
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

      {/* Payments List */}
      {filtered.length === 0 ? (
        <FadeUp delay={0.2}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full bg-primary-fixed/40 flex items-center justify-center mx-auto mb-4"
            >
              <span className="material-symbols-outlined text-4xl text-primary">
                payments
              </span>
            </motion.div>
            <h3 className="text-xl font-bold text-on-surface mb-1">
              No {filter === 'all' ? '' : filter.toLowerCase()} payments
            </h3>
            <p className="text-sm text-on-surface-variant mb-6 max-w-md mx-auto">
              {filter === 'all'
                ? 'Payment history will appear here once you make your first transaction.'
                : `You don't have any ${filter.toLowerCase()} payments.`}
            </p>
            <Link href="/bookings" className="btn-primary inline-flex">
              <span className="material-symbols-outlined text-lg">
                receipt_long
              </span>
              View My Bookings
            </Link>
          </div>
        </FadeUp>
      ) : (
        <StaggerContainer className="space-y-3">
          {filtered.map((payment) => {
            const statusConfig: Record<string, { label: string; bg: string }> = {
              PAID: { label: 'Paid', bg: 'bg-primary text-white' },
              PENDING: {
                label: 'Pending',
                bg: 'bg-tertiary-fixed text-on-tertiary-fixed',
              },
              PROCESSING: {
                label: 'Processing',
                bg: 'bg-tertiary-fixed text-on-tertiary-fixed',
              },
              FAILED: {
                label: 'Failed',
                bg: 'bg-error-container text-on-error-container',
              },
              REFUNDED: {
                label: 'Refunded',
                bg: 'bg-surface-container-high text-on-surface',
              },
            };
            const sc = statusConfig[payment.status] || {
              label: payment.status,
              bg: 'bg-surface-container',
            };

            return (
              <StaggerItem key={payment.id}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          payment.status === 'PAID'
                            ? 'bg-primary-fixed/40 text-primary'
                            : payment.status === 'FAILED'
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-tertiary-fixed/40 text-tertiary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {payment.status === 'PAID'
                            ? 'check_circle'
                            : payment.status === 'FAILED'
                            ? 'error'
                            : 'schedule'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${sc.bg}`}
                          >
                            {sc.label}
                          </span>
                          <span className="text-[10px] font-bold uppercase text-primary bg-primary-fixed/40 px-2 py-0.5 rounded">
                            {payment.paymentType}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1 truncate">
                          {payment.booking?.bookingRef || 'N/A'} •{' '}
                          {payment.gateway}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-on-surface">
                        LKR {payment.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        {new Date(payment.createdAt).toLocaleDateString(
                          'en-GB',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-surface-container">
                    <div className="text-[10px] text-on-surface-variant">
                      {payment.transactionId && (
                        <span>
                          Txn:{' '}
                          <span className="font-mono">
                            {payment.transactionId}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {payment.booking && (
                        <Link
                          href={`/bookings/${payment.booking.id}`}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          View Booking →
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </div>
  );
}