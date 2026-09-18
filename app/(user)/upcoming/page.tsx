'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { bookingAPI } from '@/lib/api';
import { Booking } from '@/types';
import { motion } from 'framer-motion';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

export default function UpcomingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/upcoming');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await bookingAPI.myBookings({ limit: 100 });
        const all = response.data.data.bookings || [];

        // Filter upcoming only
        const now = new Date();
        const upcoming = all
          .filter((b) => {
            const travelDate = new Date(b.package?.travelDate || '');
            return (
              travelDate >= now &&
              b.bookingStatus !== 'COMPLETED' &&
              b.bookingStatus !== 'CANCELLED'
            );
          })
          .sort(
            (a, b) =>
              new Date(a.package?.travelDate || '').getTime() -
              new Date(b.package?.travelDate || '').getTime()
          );

        setBookings(upcoming);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [isAuthenticated]);

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
      <FadeUp>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-on-surface">
            Upcoming Journey
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Your next pilgrimage awaits
          </p>
        </div>
      </FadeUp>

      {bookings.length === 0 ? (
        <FadeUp delay={0.1}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="w-20 h-20 rounded-full bg-primary-fixed/40 flex items-center justify-center mx-auto mb-4"
            >
              <span className="material-symbols-outlined text-4xl text-primary">
                flight_takeoff
              </span>
            </motion.div>
            <h3 className="text-xl font-bold text-on-surface mb-1">
              No upcoming journeys
            </h3>
            <p className="text-sm text-on-surface-variant mb-6 max-w-md mx-auto">
              Start your sacred journey today. Book a package with just 20%
              advance.
            </p>
            <Link href="/umrah" className="btn-primary inline-flex">
              <span className="material-symbols-outlined text-lg">
                travel_explore
              </span>
              Browse Packages
            </Link>
          </div>
        </FadeUp>
      ) : (
        <StaggerContainer className="grid grid-cols-1 gap-6">
          {bookings.map((booking, idx) => {
            const travelDate = new Date(
              booking.package?.travelDate || ''
            );
            const daysUntil = Math.ceil(
              (travelDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            return (
              <StaggerItem key={booking.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-3xl overflow-hidden shadow-xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* Image */}
                    <div className="relative h-48 lg:h-auto overflow-hidden">
                      {booking.package?.posterUrl ? (
                        <img
                          src={booking.package.posterUrl}
                          alt={booking.package.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                          <span className="material-symbols-outlined text-6xl text-white/40">
                            mosque
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent lg:bg-gradient-to-r" />
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span
                          className={`badge ${
                            booking.package?.type === 'HAJJ'
                              ? 'bg-tertiary text-white'
                              : 'bg-primary text-white'
                          }`}
                        >
                          {booking.package?.type}
                        </span>
                        {daysUntil > 0 && daysUntil <= 30 && (
                          <span className="badge bg-gold text-white animate-pulse">
                            {daysUntil} Days Left
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-2 p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded">
                          {booking.bookingRef}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded-full">
                          {booking.bookingStatus}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-on-surface mb-2">
                        {booking.package?.name}
                      </h2>

                      <div className="flex flex-wrap gap-4 text-xs text-on-surface-variant mb-4">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            calendar_today
                          </span>
                          {travelDate.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            schedule
                          </span>
                          {booking.package?.duration} Days
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            flight_takeoff
                          </span>
                          {booking.package?.departureCity}
                        </span>
                      </div>

                      {/* Countdown */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary-fixed/30 border border-primary/20 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                              Departs In
                            </span>
                            <p className="text-2xl font-bold text-primary">
                              {daysUntil} Days
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                              Total Amount
                            </span>
                            <p className="text-lg font-bold text-on-surface">
                              LKR {booking.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/bookings/${booking.id}`}
                          className="btn-primary text-xs px-4 py-2"
                        >
                          <span className="material-symbols-outlined text-base">
                            visibility
                          </span>
                          View Details
                        </Link>
                        {booking.balanceDue > 0 && (
                          <Link
                            href={`/bookings/${booking.id}/pay?type=BALANCE`}
                            className="btn-gold text-xs px-4 py-2"
                          >
                            <span className="material-symbols-outlined text-base">
                              payments
                            </span>
                            Pay Balance
                          </Link>
                        )}
                      </div>
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