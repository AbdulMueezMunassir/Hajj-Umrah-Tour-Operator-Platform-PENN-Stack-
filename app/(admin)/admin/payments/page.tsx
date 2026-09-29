'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { paymentAPI } from '@/lib/api';
import { Payment } from '@/types';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

type TabType = 'all' | 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>({
    total: 0,
    paid: 0,
    pending: 0,
    failed: 0,
    refunded: 0,
    totalCollected: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsRes, statsRes] = await Promise.allSettled([
          paymentAPI.allPayments({ limit: 100 }),
          paymentAPI.stats(),
        ]);

        if (paymentsRes.status === 'fulfilled') {
          setPayments(paymentsRes.value.data.data.payments || []);
        }
        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data.data || stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    let result = [...payments];

    if (activeTab !== 'all') {
      result = result.filter((p) => p.status === activeTab);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.transactionId?.toLowerCase().includes(q) ||
          p.booking?.bookingRef?.toLowerCase().includes(q) ||
          p.user?.email?.toLowerCase().includes(q) ||
          p.user?.firstName?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [payments, activeTab, searchQuery]);

  const counts = {
    all: payments.length,
    PAID: payments.filter((p) => p.status === 'PAID').length,
    PENDING: payments.filter((p) => p.status === 'PENDING').length,
    FAILED: payments.filter((p) => p.status === 'FAILED').length,
    REFUNDED: payments.filter((p) => p.status === 'REFUNDED').length,
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-surface-container rounded-3xl" />
        <div className="h-96 bg-surface-container rounded-2xl" />
      </div>
    );
  }

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
                  payments
                </span>
                Payment Monitoring
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold">Payments</h1>
              <p className="text-sm opacity-90 mt-1">
                {stats.total} total • LKR{' '}
                {(stats.totalCollected || 0).toLocaleString()} collected
              </p>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stats Grid */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: 'check_circle',
            label: 'Paid',
            value: counts.PAID,
            sub: 'successful',
            color: 'primary',
          },
          {
            icon: 'schedule',
            label: 'Pending',
            value: counts.PENDING,
            sub: 'awaiting',
            color: 'tertiary',
          },
          {
            icon: 'error',
            label: 'Failed',
            value: counts.FAILED,
            sub: 'unsuccessful',
            color: 'error',
          },
          {
            icon: 'undo',
            label: 'Refunded',
            value: counts.REFUNDED,
            sub: 'returned',
            color: 'outline',
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
                      : stat.color === 'tertiary'
                      ? 'bg-tertiary-fixed/40 text-tertiary'
                      : stat.color === 'error'
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-surface-container text-on-surface-variant'
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
              <p className="text-[10px] text-on-surface-variant mt-0.5">
                {stat.sub}
              </p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Filters */}
      <FadeUp delay={0.1}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-lg">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex flex-wrap gap-1 p-1 bg-surface-container rounded-xl">
              {[
                { id: 'all', label: 'All', count: counts.all },
                { id: 'PAID', label: 'Paid', count: counts.PAID },
                { id: 'PENDING', label: 'Pending', count: counts.PENDING },
                { id: 'FAILED', label: 'Failed', count: counts.FAILED },
                { id: 'REFUNDED', label: 'Refunded', count: counts.REFUNDED },
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
                placeholder="Search by txn, ref, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/70 border border-surface-container-high focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 outline-none text-xs transition-all"
              />
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Payments List */}
      {filtered.length === 0 ? (
        <FadeUp delay={0.2}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
            <span className="material-symbols-outlined text-6xl text-outline">
              payments
            </span>
            <h3 className="text-xl font-bold text-on-surface mt-4">
              No payments found
            </h3>
            <p className="text-sm text-on-surface-variant mt-1">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Payments will appear here'}
            </p>
          </div>
        </FadeUp>
      ) : (
        <FadeUp delay={0.15}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-wider">
                    <th className="p-4 font-bold">Transaction</th>
                    <th className="p-4 font-bold">Customer</th>
                    <th className="p-4 font-bold">Booking</th>
                    <th className="p-4 font-bold">Type</th>
                    <th className="p-4 font-bold">Amount</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filtered.map((p) => (
                    <motion.tr
                      key={p.id}
                      whileHover={{ backgroundColor: 'rgba(234, 237, 255, 0.4)' }}
                      className="transition-colors"
                    >
                      <td className="p-4">
                        <span className="text-[10px] font-mono text-on-surface-variant">
                          {p.transactionId?.substring(0, 16) || '—'}
                        </span>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">
                          {p.gateway}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-xs font-semibold text-on-surface truncate">
                          {p.user?.firstName} {p.user?.lastName}
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate">
                          {p.user?.email}
                        </p>
                      </td>
                      <td className="p-4">
                        {p.booking ? (
                          <Link
                            href={`/admin/bookings/${p.booking.id}`}
                            className="text-[10px] font-bold text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded font-mono hover:underline"
                          >
                            {p.booking.bookingRef}
                          </Link>
                        ) : (
                          <span className="text-[10px] text-on-surface-variant">
                            —
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            p.paymentType === 'ADVANCE'
                              ? 'bg-primary-fixed text-on-primary-fixed'
                              : 'bg-secondary-container text-on-secondary-container'
                          }`}
                        >
                          {p.paymentType}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-bold text-on-surface">
                          LKR {p.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            p.status === 'PAID'
                              ? 'bg-primary text-white'
                              : p.status === 'FAILED'
                              ? 'bg-error-container text-on-error-container'
                              : p.status === 'REFUNDED'
                              ? 'bg-surface-container-high text-on-surface'
                              : 'bg-tertiary-fixed text-on-tertiary-fixed'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-[10px] text-on-surface-variant whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        <br />
                        {new Date(p.createdAt).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeUp>
      )}
    </div>
  );
}

