'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { packageAPI } from '@/lib/api';
import { Package } from '@/types';

export default function HomePage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await packageAPI.list({ limit: 4 });
        setPackages(response.data.data.packages || []);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="w-full">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary-light/85 to-surface/10" />

        <div className="relative container-mhk py-20 lg:py-28 text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold tracking-wide border border-white/10 mb-6">
            <span className="material-symbols-outlined text-sm text-primary-fixed">
              verified
            </span>
            Trusted Hajj &amp; Umrah Operator • Sri Lanka
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto">
            Your Sacred Journey{' '}
            <span className="text-tertiary-fixed underline decoration-tertiary-fixed/30 underline-offset-8">
              Begins Here
            </span>
          </h1>

          <p className="text-lg md:text-xl mt-6 max-w-2xl mx-auto opacity-90">
            Trusted Hajj &amp; Umrah travel services from Sri Lanka. Plan your
            spiritual journey with carefully designed packages, comfortable
            accommodation, and dedicated travel support.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link
              href="/umrah"
              className="px-8 py-3.5 rounded-xl bg-white text-primary font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Explore Packages
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
            >
              Plan Your Journey
            </Link>
          </div>
        </div>

        {/* Booking Widget */}
        <div className="relative container-mhk pb-16 -mb-16">
          <div className="glass rounded-2xl p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Travel Month
                </label>
                <select className="w-full p-3 rounded-xl bg-white border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-sm text-on-surface">
                  <option>September 2026</option>
                  <option>October 2026</option>
                  <option>December 2026</option>
                  <option>Ramadhan 1447H</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Duration
                </label>
                <select className="w-full p-3 rounded-xl bg-white border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-sm text-on-surface">
                  <option>11 Days</option>
                  <option>14 Days</option>
                  <option>7 Days</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Travellers
                </label>
                <select className="w-full p-3 rounded-xl bg-white border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-sm text-on-surface">
                  <option>1 Pilgrim</option>
                  <option>2 Pilgrims</option>
                  <option>3 Pilgrims</option>
                  <option>4+ Group</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Package Type
                </label>
                <select className="w-full p-3 rounded-xl bg-white border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-sm text-on-surface">
                  <option>All</option>
                  <option>Economy</option>
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>VIP</option>
                </select>
              </div>
              <Link
                href="/umrah"
                className="btn-primary w-full h-12 justify-center text-sm"
              >
                <span className="material-symbols-outlined text-lg">
                  travel_explore
                </span>
                Find Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST STATS ============ */}
      <section className="pt-24 pb-12">
        <div className="container-mhk">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: '15+', label: 'Years of Experience' },
              { value: '5,000+', label: 'Pilgrims Served' },
              { value: '50+', label: 'Successful Journeys' },
              { value: '24/7', label: 'Travel Support' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-white shadow-sm card-hover"
              >
                <span className="text-3xl font-bold text-primary block">
                  {stat.value}
                </span>
                <p className="text-xs font-semibold text-on-surface-variant mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PACKAGES ============ */}
      <section className="py-12">
        <div className="container-mhk">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gold">
                Featured
              </span>
              <h2 className="text-3xl font-bold text-on-surface mt-1">
                Upcoming Spiritual Journeys
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Choose the journey that fits your needs.
              </p>
            </div>
            <Link
              href="/umrah"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-surface-container" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-surface-container rounded w-3/4" />
                    <div className="h-3 bg-surface-container rounded w-1/2" />
                    <div className="h-6 bg-surface-container rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-low rounded-2xl">
              <span className="material-symbols-outlined text-4xl text-outline">
                inventory_2
              </span>
              <p className="text-on-surface-variant mt-2">
                No packages available yet.
              </p>
              <Link href="/umrah" className="btn-primary mt-4 inline-flex">
                Browse All
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.slice(0, 3).map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ WHY CHOOSE ============ */}
      <section className="py-16 bg-surface-container-low">
        <div className="container-mhk">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-gold">
              Why MHK
            </span>
            <h2 className="text-3xl font-bold text-on-surface mt-1">
              Why Choose MHK Travels
            </h2>
            <p className="text-sm text-on-surface-variant mt-2 max-w-lg mx-auto">
              We honor every pilgrim&apos;s spiritual dream with meticulously
              organized logistical excellence.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: 'groups', title: 'Experienced Team' },
              { icon: 'verified', title: 'Trusted Service' },
              { icon: 'hotel', title: 'Premium Hotels' },
              { icon: 'support_agent', title: '24/7 Support' },
              { icon: 'payments', title: '20% Advance' },
              { icon: 'flight', title: 'Direct Flights' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-5 rounded-2xl bg-white shadow-sm card-hover text-center"
              >
                <span className="material-symbols-outlined text-3xl text-primary block mb-2">
                  {feature.icon}
                </span>
                <h3 className="text-sm font-bold">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-16">
        <div className="container-mhk">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-light rounded-3xl p-10 lg:p-14 text-white text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/40 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-tertiary-fixed/40 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Ready to Begin Your Sacred Journey?
              </h2>
              <p className="text-lg opacity-90 mt-3 max-w-2xl mx-auto">
                Explore our upcoming Hajj &amp; Umrah packages and book your
                spiritual journey today with just 20% advance.
              </p>
              <Link
                href="/umrah"
                className="inline-flex items-center gap-2 mt-6 px-8 py-3.5 rounded-xl bg-white text-primary font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <span className="material-symbols-outlined">
                  flight_takeoff
                </span>
                Explore Packages
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// PACKAGE CARD COMPONENT
// ==========================================
function PackageCard({ pkg }: { pkg: Package }) {
  const advanceAmount =
    pkg.advanceAmount ||
    Math.round((pkg.totalPrice * pkg.advancePercent) / 100);

  const formattedDate = new Date(pkg.travelDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-md card-hover group">
      <div className="relative h-52 overflow-hidden">
        {pkg.posterUrl ? (
          <img
            src={pkg.posterUrl}
            alt={pkg.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-white/40">
              mosque
            </span>
          </div>
        )}

        <span
          className={`absolute top-3 left-3 badge ${
            pkg.type === 'HAJJ'
              ? 'bg-tertiary text-white'
              : 'bg-primary text-white'
          }`}
        >
          {pkg.type}
        </span>

        {pkg.seatsLeft !== undefined && pkg.seatsLeft < 10 && pkg.seatsLeft > 0 && (
          <span className="absolute top-3 right-3 badge bg-error text-white">
            {pkg.seatsLeft} Seats Left
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="text-xs text-white font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">flight</span>
            {pkg.departureCity} • {formattedDate}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-on-surface line-clamp-2">
          {pkg.name}
        </h3>
        <p className="text-sm text-on-surface-variant mt-1">
          {pkg.duration} Days • {pkg.duration - 1} Nights
        </p>

        {pkg.hotels && pkg.hotels.length > 0 && (
          <div className="mt-3 space-y-1">
            {pkg.hotels.slice(0, 2).map((hotel, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-tertiary text-sm">
                  hotel
                </span>
                <span>
                  {hotel.city === 'MAKKAH' ? 'Makkah' : 'Madinah'}:{' '}
                  {hotel.name}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-surface-container flex justify-between items-center">
          <div>
            <span className="text-xs text-on-surface-variant">From</span>
            <div className="text-2xl font-bold text-primary">
              LKR {pkg.totalPrice.toLocaleString()}
            </div>
            <span className="text-xs text-gold font-bold">
              20% Advance: LKR {advanceAmount.toLocaleString()}
            </span>
          </div>
          <Link
            href={`/package/${pkg.id}`}
            className="btn-primary text-xs px-4 py-2"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}