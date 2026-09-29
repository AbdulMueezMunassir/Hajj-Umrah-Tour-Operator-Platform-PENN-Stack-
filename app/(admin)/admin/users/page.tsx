'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { User, Booking } from '@/types';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ADMIN' | 'USER'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch users
      try {
        const usersRes = await api.get('/users');
        const usersData = usersRes.data.data?.users || usersRes.data.data || [];
        setUsers(Array.isArray(usersData) ? usersData : []);
        console.log('✅ Users loaded:', usersData.length);
      } catch (err) {
        console.error('❌ Users fetch failed:', err);
      }

      // Fetch bookings
      try {
        const bookingsRes = await api.get('/bookings/admin/all?limit=500');
        setBookings(bookingsRes.data.data.bookings || []);
        console.log('✅ Bookings loaded');
      } catch (err) {
        console.error('❌ Bookings fetch failed:', err);
      }
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  // Count bookings per user
  const userBookingsCount = useMemo(() => {
    const count: Record<string, number> = {};
    bookings.forEach((b) => {
      count[b.userId] = (count[b.userId] || 0) + 1;
    });
    return count;
  }, [bookings]);

  const filtered = useMemo(() => {
    let result = [...users];
    if (filter !== 'all') {
      result = result.filter((u) => u.role === filter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          u.firstName?.toLowerCase().includes(q) ||
          u.lastName?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, filter, searchQuery]);

  const counts = {
    all: users.length,
    ADMIN: users.filter((u) => u.role === 'ADMIN').length,
    USER: users.filter((u) => u.role === 'USER').length,
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
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/20 mb-3">
              <span className="material-symbols-outlined text-xs">
                manage_accounts
              </span>
              User Management
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">Users</h1>
            <p className="text-sm opacity-90 mt-1">
              {users.length} total • {counts.ADMIN} admin, {counts.USER} pilgrims
            </p>
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
                { id: 'USER', label: 'Pilgrims', count: counts.USER },
                { id: 'ADMIN', label: 'Admins', count: counts.ADMIN },
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

            <div className="relative md:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/70 border border-surface-container-high focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 outline-none text-xs transition-all"
              />
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Users Table */}
      {filtered.length === 0 ? (
        <FadeUp delay={0.2}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
            <span className="material-symbols-outlined text-6xl text-outline">
              person_off
            </span>
            <h3 className="text-xl font-bold text-on-surface mt-4">
              No users found
            </h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Try adjusting your search
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
                    <th className="p-4 font-bold">User</th>
                    <th className="p-4 font-bold">Contact</th>
                    <th className="p-4 font-bold">Role</th>
                    <th className="p-4 font-bold">Bookings</th>
                    <th className="p-4 font-bold">Joined</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filtered.map((user) => (
                    <motion.tr
                      key={user.id}
                      whileHover={{ backgroundColor: 'rgba(234, 237, 255, 0.4)' }}
                      className="transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tertiary to-tertiary-container flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                            {user.firstName?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-on-surface text-sm truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-[10px] text-on-surface-variant font-mono truncate">
                              {user.id.substring(0, 12)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs">
                        <p className="text-on-surface truncate">
                          {user.email}
                        </p>
                        {user.phone && (
                          <p className="text-on-surface-variant">
                            {user.phone}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            user.role === 'ADMIN'
                              ? 'bg-tertiary text-white'
                              : 'bg-primary-fixed text-on-primary-fixed'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-bold text-on-surface">
                          {userBookingsCount[user.id] || 0}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-on-surface-variant">
                        {new Date(user.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="text-xs font-bold text-tertiary hover:underline"
                        >
                          View →
                        </Link>
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