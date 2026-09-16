'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { packageAPI } from '@/lib/api';
import { Package } from '@/types';
import { motion } from 'framer-motion';
import { FadeUp, FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';
import { useAuth } from '@/hooks/useAuth';

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [travellers, setTravellers] = useState(1);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await packageAPI.get(params.id as string);
        setPkg(response.data.data.package);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load package');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchPackage();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container-mhk py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-96 bg-surface-container rounded-2xl" />
          <div className="h-8 bg-surface-container rounded w-1/2" />
          <div className="h-4 bg-surface-container rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="container-mhk py-24 text-center">
        <span className="material-symbols-outlined text-6xl text-error">
          error
        </span>
        <h1 className="text-2xl font-bold mt-4">Package Not Found</h1>
        <p className="text-on-surface-variant mt-2">{error}</p>
        <Link href="/umrah" className="btn-primary mt-6 inline-flex">
          Browse Packages
        </Link>
      </div>
    );
  }

  const advanceAmount =
    pkg.advanceAmount ||
    Math.round((pkg.totalPrice * pkg.advancePercent) / 100);
  const remainingAmount = pkg.totalPrice - advanceAmount;
  const totalForTravellers = pkg.totalPrice * travellers;
  const totalAdvance = advanceAmount * travellers;

  const formattedDate = new Date(pkg.travelDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const returnDate = new Date(pkg.returnDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleBookNow = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/package/${pkg.id}`);
      return;
    }
    router.push(`/booking/${pkg.id}?travellers=${travellers}`);
  };

  return (
    <div className="w-full">
      {/* Hero Image */}
      <section className="relative h-[400px] lg:h-[500px] overflow-hidden">
        {pkg.posterUrl ? (
          <img
            src={pkg.posterUrl}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            <span className="material-symbols-outlined text-9xl text-white/30">
              mosque
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 container-mhk pb-8">
          <FadeUp>
            <nav className="flex items-center gap-2 text-xs text-white/80 mb-3">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
              <Link href={`/${pkg.type.toLowerCase()}`} className="hover:text-white transition">
                {pkg.type}
              </Link>
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
              <span className="text-white font-semibold truncate">
                {pkg.name}
              </span>
            </nav>

            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`badge ${
                  pkg.type === 'HAJJ'
                    ? 'bg-tertiary text-white'
                    : 'bg-primary text-white'
                }`}
              >
                {pkg.type}
              </span>
              {pkg.seatsLeft !== undefined && pkg.seatsLeft > 0 && pkg.seatsLeft < 10 && (
                <span className="badge bg-error text-white">
                  Only {pkg.seatsLeft} Seats Left
                </span>
              )}
              <span className="badge bg-gold text-white">
                Verified Package
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-white max-w-3xl">
              {pkg.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  calendar_today
                </span>
                {formattedDate} — {returnDate}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  schedule
                </span>
                {pkg.duration} Days
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  flight_takeoff
                </span>
                {pkg.departureCity}
              </span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10">
        <div className="container-mhk">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <FadeIn>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      description
                    </span>
                    About This Package
                  </h2>
                  <p className="text-on-surface-variant leading-relaxed">
                    {pkg.description}
                  </p>
                </div>
              </FadeIn>

              {/* Hotels */}
              {pkg.hotels && pkg.hotels.length > 0 && (
                <FadeIn>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        hotel
                      </span>
                      Accommodations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pkg.hotels.map((hotel) => (
                        <motion.div
                          key={hotel.id}
                          whileHover={{ y: -2 }}
                          className="p-4 rounded-xl bg-surface-container-low border border-surface-container"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`badge ${
                                hotel.city === 'MAKKAH'
                                  ? 'bg-primary text-white'
                                  : 'bg-secondary text-white'
                              }`}
                            >
                              {hotel.city === 'MAKKAH' ? 'Makkah' : 'Madinah'}
                            </span>
                            <div className="flex text-tertiary">
                              {[...Array(hotel.stars)].map((_, i) => (
                                <span
                                  key={i}
                                  className="material-symbols-outlined text-sm"
                                  style={{
                                    fontVariationSettings: "'FILL' 1",
                                  }}
                                >
                                  star
                                </span>
                              ))}
                            </div>
                          </div>
                          <h3 className="font-bold text-on-surface">
                            {hotel.name}
                          </h3>
                          <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-base">
                              directions_walk
                            </span>
                            {hotel.distance}
                          </p>
                          <p className="text-sm text-on-surface-variant mt-1">
                            {hotel.roomType} • {hotel.nights} Nights
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Itinerary */}
              {pkg.itinerary && pkg.itinerary.length > 0 && (
                <FadeIn>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        route
                      </span>
                      Day-by-Day Itinerary
                    </h2>
                    <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
                      {pkg.itinerary.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className="relative"
                        >
                          <div className="absolute -left-[27px] top-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                            {item.day}
                          </div>
                          <div className="bg-surface-container-low p-4 rounded-xl">
                            <h4 className="font-bold text-on-surface">
                              {item.title}
                            </h4>
                            <p className="text-sm text-on-surface-variant mt-1">
                              {item.description}
                            </p>
                            {item.location && (
                              <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-semibold">
                                <span className="material-symbols-outlined text-sm">
                                  location_on
                                </span>
                                {item.location}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Inclusions */}
              {pkg.inclusions && pkg.inclusions.length > 0 && (
                <FadeIn>
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        check_circle
                      </span>
                      What&apos;s Included
                    </h2>
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {pkg.inclusions.map((inc) => (
                        <StaggerItem key={inc.id}>
                          <div className="flex items-center gap-2 text-sm text-on-surface">
                            <span className="material-symbols-outlined text-primary text-lg">
                              check
                            </span>
                            {inc.name}
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                </FadeIn>
              )}
            </div>

            {/* Sticky Booking Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-24 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/80 overflow-hidden"
              >
                {/* Price Header */}
                <div className="bg-gradient-to-br from-primary to-primary-light text-white p-5">
                  <span className="text-xs uppercase tracking-wider opacity-80">
                    Package Price
                  </span>
                  <div className="text-3xl font-bold mt-1">
                    LKR {pkg.totalPrice.toLocaleString()}
                  </div>
                  <span className="text-xs opacity-80">per pilgrim</span>
                </div>

                {/* Travellers Selector */}
                <div className="p-5 border-b border-surface-container">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-2">
                    Number of Pilgrims
                  </label>
                  <div className="flex items-center justify-between bg-surface-container-low p-2 rounded-xl">
                    <button
                      onClick={() => setTravellers(Math.max(1, travellers - 1))}
                      className="w-9 h-9 rounded-lg bg-white hover:bg-surface-container transition-colors flex items-center justify-center font-bold disabled:opacity-40"
                      disabled={travellers <= 1}
                    >
                      <span className="material-symbols-outlined text-base">
                        remove
                      </span>
                    </button>
                    <span className="text-xl font-bold text-on-surface">
                      {travellers}
                    </span>
                    <button
                      onClick={() =>
                        setTravellers(Math.min(pkg.seatsLeft || 10, travellers + 1))
                      }
                      className="w-9 h-9 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors flex items-center justify-center font-bold"
                    >
                      <span className="material-symbols-outlined text-base">
                        add
                      </span>
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-5 space-y-3 border-b border-surface-container">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">
                      Total ({travellers} pilgrim{travellers > 1 ? 's' : ''})
                    </span>
                    <span className="font-bold text-on-surface">
                      LKR {totalForTravellers.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-tertiary-fixed/40">
                    <div className="flex justify-between">
                      <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
                        20% Advance
                      </span>
                      <span className="font-bold text-tertiary text-lg">
                        LKR {totalAdvance.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-1">
                      Pay via PayHere to confirm
                    </p>
                  </div>

                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>Balance Due</span>
                    <span className="font-semibold">
                      LKR{' '}
                      {(
                        totalForTravellers - totalAdvance
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="p-5 space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBookNow}
                    className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <span className="material-symbols-outlined">
                      flight_takeoff
                    </span>
                    Book Now
                  </motion.button>

                  <a
                    href="https://wa.me/94776290290"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-secondary">
                      chat
                    </span>
                    Ask on WhatsApp
                  </a>
                </div>

                {/* Trust Footer */}
                <div className="px-5 pb-5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-sm">
                      lock
                    </span>
                    Secure payment via PayHere
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-sm">
                      verified_user
                    </span>
                    MRCA Registered Operator
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-sm">
                      refund
                    </span>
                    100% refund if visa refused
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}