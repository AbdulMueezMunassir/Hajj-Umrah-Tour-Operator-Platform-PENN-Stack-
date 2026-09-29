'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { bookingAPI, packageAPI, paymentAPI } from '@/lib/api';
import { Booking, Package } from '@/types';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

export default function AdminReportsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [paymentStats, setPaymentStats] = useState<any>({});
  const [bookingStats, setBookingStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, packagesRes, payStats, bkStats] =
          await Promise.allSettled([
            bookingAPI.allBookings({ limit: 100 }),
            packageAPI.list({ limit: 100 }),
            paymentAPI.stats(),
            bookingAPI.stats(),
          ]);

        if (bookingsRes.status === 'fulfilled') {
          setBookings(bookingsRes.value.data.data.bookings || []);
        }
        if (packagesRes.status === 'fulfilled') {
          setPackages(packagesRes.value.data.data.packages || []);
        }
        if (payStats.status === 'fulfilled') {
          setPaymentStats(payStats.value.data.data || {});
        }
        if (bkStats.status === 'fulfilled') {
          setBookingStats(bkStats.value.data.data || {});
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter by date range
  const filteredBookings = useMemo(() => {
    if (dateRange === 'all') return bookings;
    const now = Date.now();
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return bookings.filter(
      (b) => new Date(b.createdAt).getTime() >= cutoff
    );
  }, [bookings, dateRange]);

  // Top packages by bookings
  const topPackages = useMemo(() => {
    const counts: Record<string, { name: string; count: number; revenue: number }> = {};
    filteredBookings.forEach((b) => {
      const pkgId = b.packageId;
      const pkgName = b.package?.name || 'Unknown';
      if (!counts[pkgId]) {
        counts[pkgId] = { name: pkgName, count: 0, revenue: 0 };
      }
      counts[pkgId].count++;
      if (b.bookingStatus !== 'CANCELLED') {
        counts[pkgId].revenue += b.totalAmount;
      }
    });
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredBookings]);

  // Monthly revenue trend (last 6 months)
  const monthlyTrend = useMemo(() => {
    const months: Record<string, { bookings: number; revenue: number }> = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric',
      });
      months[key] = { bookings: 0, revenue: 0 };
    }

    filteredBookings.forEach((b) => {
      if (b.bookingStatus === 'CANCELLED') return;
      const d = new Date(b.createdAt);
      const key = d.toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric',
      });
      if (months[key]) {
        months[key].bookings++;
        months[key].revenue += b.totalAmount;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }, [filteredBookings]);

  const maxRevenue = Math.max(...monthlyTrend.map((m) => m.revenue), 1);

  // Totals
  const totals = useMemo(() => {
    const active = filteredBookings.filter(
      (b) => b.bookingStatus !== 'CANCELLED'
    );
    return {
      bookings: filteredBookings.length,
      revenue: active.reduce((s, b) => s + b.totalAmount, 0),
      advance: active.reduce((s, b) => s + b.advancePaid, 0),
      balance: active.reduce((s, b) => s + b.balanceDue, 0),
      avgBooking:
        active.length > 0
          ? Math.round(
              active.reduce((s, b) => s + b.totalAmount, 0) / active.length
            )
          : 0,
    };
  }, [filteredBookings]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-surface-container rounded-3xl" />
        <div className="h-64 bg-surface-container rounded-2xl" />
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
                  analytics
                </span>
                Business Analytics
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold">Reports</h1>
              <p className="text-sm opacity-90 mt-1">
                Revenue, bookings &amp; performance overview
              </p>
            </div>

            {/* Date Range */}
            <div className="flex gap-1 p-1 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
              {[
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: '90d', label: '90 Days' },
                { id: 'all', label: 'All Time' },
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setDateRange(range.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    dateRange === range.id
                      ? 'bg-white text-tertiary'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Key Metrics */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            icon: 'receipt_long',
            label: 'Bookings',
            value: totals.bookings.toString(),
            sub: `${dateRange === 'all' ? 'all time' : `last ${dateRange}`}`,
            color: 'primary',
          },
          {
            icon: 'payments',
            label: 'Total Revenue',
            value: `LKR ${(totals.revenue / 1000).toFixed(0)}K`,
            sub: 'confirmed bookings',
            color: 'tertiary',
          },
          {
            icon: 'savings',
            label: 'Advance Collected',
            value: `LKR ${(totals.advance / 1000).toFixed(0)}K`,
            sub: '20% deposits',
            color: 'primary',
          },
          {
            icon: 'schedule',
            label: 'Outstanding',
            value: `LKR ${(totals.balance / 1000).toFixed(0)}K`,
            sub: 'to be collected',
            color: 'tertiary',
          },
          {
            icon: 'analytics',
            label: 'Avg Booking',
            value: `LKR ${(totals.avgBooking / 1000).toFixed(0)}K`,
            sub: 'per customer',
            color: 'primary',
          },
        ].map((stat) => (
          <StaggerItem key={stat.label}>
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  stat.color === 'primary'
                    ? 'bg-primary-fixed/40 text-primary'
                    : 'bg-tertiary-fixed/40 text-tertiary'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {stat.icon}
                </span>
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <FadeUp delay={0.1}>
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">
                  trending_up
                </span>
                Revenue Trend (Last 6 Months)
              </h3>
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                LKR
              </span>
            </div>

            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between gap-3 h-48">
              {monthlyTrend.map((data, idx) => {
                const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-[10px] font-bold text-tertiary">
                      {(data.revenue / 1000).toFixed(0)}K
                    </div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="w-full bg-gradient-to-t from-tertiary to-tertiary-container rounded-t-lg min-h-[4px]"
                      style={{ maxHeight: '160px' }}
                    />
                    <div className="text-[10px] text-on-surface-variant font-semibold text-center">
                      {data.month}
                    </div>
                    <div className="text-[10px] text-on-surface-variant">
                      {data.bookings} bkgs
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeUp>

        {/* Booking Status Breakdown */}
        <FadeUp delay={0.15}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">
                pie_chart
              </span>
              Status Breakdown
            </h3>

            <div className="space-y-4">
              {[
                {
                  label: 'Pending',
                  value: bookingStats.pending || 0,
                  color: 'bg-tertiary',
                },
                {
                  label: 'Confirmed',
                  value: bookingStats.confirmed || 0,
                  color: 'bg-secondary',
                },
                {
                  label: 'Completed',
                  value: bookingStats.completed || 0,
                  color: 'bg-primary',
                },
                {
                  label: 'Cancelled',
                  value: bookingStats.cancelled || 0,
                  color: 'bg-error',
                },
              ].map((item) => {
                const pct =
                  (bookingStats.total || 0) > 0
                    ? (item.value / bookingStats.total) * 100
                    : 0;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-on-surface">
                        {item.label}
                      </span>
                      <span className="font-bold text-on-surface">
                        {item.value} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-surface-container text-center">
              <span className="text-[10px] text-on-surface-variant">
                Total bookings in system
              </span>
              <p className="text-3xl font-bold text-on-surface">
                {bookingStats.total || 0}
              </p>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* Top Packages */}
      <FadeUp delay={0.2}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">
                workspace_premium
              </span>
              Top Performing Packages
            </h3>
            <span className="text-[10px] font-bold uppercase text-on-surface-variant">
              By bookings
            </span>
          </div>

          {topPackages.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-5xl text-outline">
                inventory_2
              </span>
              <p className="text-sm text-on-surface-variant mt-2">
                No packages with bookings in this period
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topPackages.map((pkg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-surface-container"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tertiary to-tertiary-container flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface text-sm truncate">
                      {pkg.name}
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      {pkg.count} bookings
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-tertiary">
                      LKR {(pkg.revenue / 1000).toFixed(0)}K
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      revenue
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </FadeUp>

      {/* Export Options */}
      <FadeUp delay={0.25}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">
              download
            </span>
            Export Reports
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                const csv = [
                  ['Booking Ref', 'Customer', 'Package', 'Amount', 'Status', 'Date'],
                  ...filteredBookings.map((b) => [
                    b.bookingRef,
                    `${b.user?.firstName} ${b.user?.lastName}`,
                    b.package?.name || '',
                    b.totalAmount,
                    b.bookingStatus,
                    new Date(b.createdAt).toLocaleDateString(),
                  ]),
                ]
                  .map((row) => row.join(','))
                  .join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `bookings-${Date.now()}.csv`;
                a.click();
              }}
              className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-left flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">
                  table_view
                </span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm">
                  Export Bookings
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  CSV format
                </p>
              </div>
            </button>

            <button
              onClick={() => window.print()}
              className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-left flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/40 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">
                  picture_as_pdf
                </span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm">
                  Print Report
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  PDF via browser
                </p>
              </div>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-left flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">
                  refresh
                </span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm">
                  Refresh Data
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  Reload all stats
                </p>
              </div>
            </button>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}