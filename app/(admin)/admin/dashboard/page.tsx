'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { packageAPI, bookingAPI, paymentAPI } from '@/lib/api';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    packages: { total: 0, active: 0, hajj: 0, umrah: 0 },
    bookings: {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    },
    payments: {
      total: 0,
      paid: 0,
      pending: 0,
      failed: 0,
      refunded: 0,
      totalCollected: 0,
    },
    revenue: {
      total: 0,
      advance: 0,
      balance: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [pkgStats, bkStats, payStats, recentBk] = await Promise.all([
        packageAPI.stats(),
        bookingAPI.stats(),
        paymentAPI.stats(),
        bookingAPI.allBookings({ limit: 5 }),
      ]);

      const bk = bkStats.data.data;
      const fin = bk.financials || {};

      setStats({
        packages: pkgStats.data.data || {
          total: 0,
          active: 0,
          hajj: 0,
          umrah: 0,
        },
        bookings: {
          total: bk.total || 0,
          pending: bk.pending || 0,
          confirmed: bk.confirmed || 0,
          completed: bk.completed || 0,
          cancelled: bk.cancelled || 0,
        },
        payments: payStats.data.data || {
          total: 0,
          paid: 0,
          pending: 0,
          failed: 0,
          refunded: 0,
          totalCollected: 0,
        },
        revenue: {
          total: fin.totalRevenue || 0,
          advance: fin.totalAdvance || 0,
          balance: fin.totalBalance || 0,
        },
      });

      setRecentBookings(recentBk.data.data.bookings || []);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-surface-container rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-surface-container rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="relative overflow-hidden bg-gradient-to-br from-tertiary via-tertiary-container to-primary rounded-3xl p-6 lg:p-8 text-white shadow-xl">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/20 blur-3xl pointer-events-none"
          />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/20 mb-3">
                <span className="material-symbols-outlined text-xs">
                  admin_panel_settings
                </span>
                Admin Panel
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                Dashboard Overview
              </h1>
              <p className="text-sm opacity-90 mt-1">
                Manage your platform at a glance
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/admin/packages/create"
                className="px-4 py-2.5 rounded-xl bg-white text-tertiary text-xs font-bold flex items-center gap-1.5 shadow-lg hover:shadow-xl transition-all"
              >
                <span className="material-symbols-outlined text-base">add</span>
                New Package
              </Link>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Stats Grid */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: 'inventory_2',
            label: 'Total Packages',
            value: stats.packages.total.toString(),
            sub: `${stats.packages.active} active`,
            color: 'primary',
          },
          {
            icon: 'receipt_long',
            label: 'Total Bookings',
            value: stats.bookings.total.toString(),
            sub: `${stats.bookings.pending} pending`,
            color: 'tertiary',
          },
          {
            icon: 'payments',
            label: 'Revenue',
            value: `LKR ${(stats.revenue.total / 1000000).toFixed(2)}M`,
            sub: `${stats.payments.paid} paid`,
            color: 'primary',
          },
          {
            icon: 'account_balance_wallet',
            label: 'Advance Collected',
            value: `LKR ${(stats.revenue.advance / 1000000).toFixed(2)}M`,
            sub: `${stats.payments.advanceCount || 0} advances`,
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
                      : 'bg-tertiary-fixed/40 text-tertiary'
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

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Breakdown */}
        <FadeUp delay={0.1}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                bar_chart
              </span>
              Booking Breakdown
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Pending', value: stats.bookings.pending, color: 'bg-tertiary' },
                { label: 'Confirmed', value: stats.bookings.confirmed, color: 'bg-secondary' },
                { label: 'Completed', value: stats.bookings.completed, color: 'bg-primary' },
                { label: 'Cancelled', value: stats.bookings.cancelled, color: 'bg-error' },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-on-surface">
                      {item.label}
                    </span>
                    <span className="font-bold text-on-surface">
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          stats.bookings.total > 0
                            ? (item.value / stats.bookings.total) * 100
                            : 0
                        }%`,
                      }}
                      transition={{ duration: 0.8 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Financial Summary */}
        <FadeUp delay={0.15}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                savings
              </span>
              Financial Summary
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-primary-fixed/30">
                <span className="text-[10px] font-bold uppercase text-primary">
                  Total Revenue
                </span>
                <p className="text-lg font-bold text-on-surface mt-0.5">
                  LKR {(stats.revenue.total || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-tertiary-fixed/30">
                <span className="text-[10px] font-bold uppercase text-tertiary">
                  Advance Collected
                </span>
                <p className="text-lg font-bold text-on-surface mt-0.5">
                  LKR {stats.revenue.advance.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                  Outstanding Balance
                </span>
                <p className="text-lg font-bold text-on-surface mt-0.5">
                  LKR {stats.revenue.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Quick Actions */}
        <FadeUp delay={0.2}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                bolt
              </span>
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { href: '/admin/packages/create', label: 'Create Package', icon: 'add_box' },
                { href: '/admin/bookings', label: 'View Bookings', icon: 'list_alt' },
                { href: '/admin/users', label: 'Manage Users', icon: 'manage_accounts' },
                { href: '/admin/payments', label: 'Payment Reports', icon: 'receipt' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-tertiary/5 border border-transparent hover:border-tertiary/20 transition-all group"
                >
                  <span className="material-symbols-outlined text-tertiary text-lg">
                    {action.icon}
                  </span>
                  <span className="text-sm font-medium text-on-surface group-hover:text-tertiary transition-colors">
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
      </div>

      {/* Recent Bookings */}
      <FadeUp delay={0.25}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-surface-container">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                receipt_long
              </span>
              <h3 className="font-bold text-on-surface">Recent Bookings</h3>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-primary hover:underline"
            >
              View All →
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-outline">
                inbox
              </span>
              <p className="text-sm text-on-surface-variant mt-2">
                No bookings yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-wider">
                    <th className="p-3 font-bold">Ref</th>
                    <th className="p-3 font-bold">Customer</th>
                    <th className="p-3 font-bold">Package</th>
                    <th className="p-3 font-bold">Amount</th>
                    <th className="p-3 font-bold">Status</th>
                    <th className="p-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-t border-surface-container hover:bg-surface-container-low transition-colors"
                    >
                      <td className="p-3">
                        <span className="text-[10px] font-bold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded">
                          {b.bookingRef}
                        </span>
                      </td>
                      <td className="p-3 text-xs">
                        {b.user?.firstName} {b.user?.lastName}
                      </td>
                      <td className="p-3 text-xs truncate max-w-[200px]">
                        {b.package?.name}
                      </td>
                      <td className="p-3 text-xs font-bold">
                        LKR {b.totalAmount?.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </FadeUp>
    </div>
  );
}