'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

interface TravellerData {
  id: string;
  fullName: string;
  passportNumber: string;
  nic?: string;
  dateOfBirth: string;
  gender: string;
  relationship?: string;
  phone?: string;
  bookingId: string;
  booking?: {
    id: string;
    bookingRef: string;
    bookingStatus: string;
    package?: {
      name: string;
      type: string;
      travelDate: string;
      departureCity: string;
    };
    user?: {
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}

export default function AdminTravellersPage() {
  const [travellers, setTravellers] = useState<TravellerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTravellers = async () => {
      try {
        // Get all bookings, then flatten their travellers
        const bookingsRes = await api.get('/bookings/admin/all?limit=100');
        const bookings = bookingsRes.data.data.bookings || [];

        const allTravellers: TravellerData[] = [];
        bookings.forEach((b: any) => {
          (b.travellersData || []).forEach((t: any) => {
            allTravellers.push({
              ...t,
              bookingId: b.id,
              booking: {
                id: b.id,
                bookingRef: b.bookingRef,
                bookingStatus: b.bookingStatus,
                package: b.package,
                user: b.user,
              },
            });
          });
        });

        setTravellers(allTravellers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTravellers();
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery) return travellers;
    const q = searchQuery.toLowerCase();
    return travellers.filter(
      (t) =>
        t.fullName.toLowerCase().includes(q) ||
        t.passportNumber.toLowerCase().includes(q) ||
        t.nic?.toLowerCase().includes(q) ||
        t.phone?.toLowerCase().includes(q) ||
        t.booking?.bookingRef.toLowerCase().includes(q)
    );
  }, [travellers, searchQuery]);

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
              <span className="material-symbols-outlined text-xs">groups</span>
              Pilgrims Registry
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">Travellers</h1>
            <p className="text-sm opacity-90 mt-1">
              {travellers.length} registered pilgrims across all bookings
            </p>
          </div>
        </div>
      </FadeUp>

      {/* Search */}
      <FadeUp delay={0.1}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-lg">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name, passport, NIC, phone, or booking ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/70 border border-surface-container-high focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 outline-none text-xs transition-all"
            />
          </div>
        </div>
      </FadeUp>

      {/* Table */}
      {filtered.length === 0 ? (
        <FadeUp delay={0.2}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
            <span className="material-symbols-outlined text-6xl text-outline">
              groups
            </span>
            <h3 className="text-xl font-bold text-on-surface mt-4">
              No travellers found
            </h3>
            <p className="text-sm text-on-surface-variant mt-1">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Travellers will appear when bookings are created'}
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
                    <th className="p-4 font-bold">Traveller</th>
                    <th className="p-4 font-bold">Passport / NIC</th>
                    <th className="p-4 font-bold">Contact</th>
                    <th className="p-4 font-bold">Booking</th>
                    <th className="p-4 font-bold">Package</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filtered.map((t) => (
                    <motion.tr
                      key={t.id}
                      whileHover={{ backgroundColor: 'rgba(234, 237, 255, 0.4)' }}
                      className="transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tertiary to-tertiary-container flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                            {t.fullName[0]?.toUpperCase() || 'T'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-on-surface text-sm truncate">
                              {t.fullName}
                            </p>
                            <p className="text-[10px] text-on-surface-variant">
                              {t.gender} • {t.relationship || 'Family'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs">
                        <p className="font-mono text-on-surface">
                          {t.passportNumber}
                        </p>
                        {t.nic && (
                          <p className="font-mono text-on-surface-variant text-[10px]">
                            {t.nic}
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-xs">
                        {t.phone ? (
                          <p className="text-on-surface">{t.phone}</p>
                        ) : (
                          <span className="text-on-surface-variant">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {t.booking && (
                          <Link
                            href={`/admin/bookings/${t.booking.id}`}
                            className="text-[10px] font-bold text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded font-mono hover:underline"
                          >
                            {t.booking.bookingRef}
                          </Link>
                        )}
                      </td>
                      <td className="p-4 text-xs">
                        <p className="text-on-surface truncate max-w-[200px]">
                          {t.booking?.package?.name || '—'}
                        </p>
                        <p className="text-[10px] text-on-surface-variant">
                          {t.booking?.package?.type}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        {t.booking && (
                          <Link
                            href={`/admin/bookings/${t.booking.id}`}
                            className="text-xs font-bold text-tertiary hover:underline"
                          >
                            View Booking →
                          </Link>
                        )}
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