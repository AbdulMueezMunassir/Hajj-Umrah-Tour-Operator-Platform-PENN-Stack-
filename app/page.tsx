'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { packageAPI } from '@/lib/api';
import { Package } from '@/types';
import PackageCard from '@/components/packages/PackageCard';
import GlassSelect from '@/components/ui/GlassSelect';
import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from '@/components/ui/MotionDiv';
import { motion } from 'framer-motion';

// ==========================================
// FILTER OPTIONS
// ==========================================
const MONTH_OPTIONS = [
  { value: '', label: 'Any Month' },
  { value: '2026-09', label: 'September 2026' },
  { value: '2026-10', label: 'October 2026' },
  { value: '2026-11', label: 'November 2026' },
  { value: '2026-12', label: 'December 2026' },
  { value: '2027-03', label: 'March 2027 (Ramadhan)' },
  { value: '2027-05', label: 'May 2027 (Hajj)' },
];

const DURATION_OPTIONS = [
  { value: '', label: 'Any Duration' },
  { value: '7', label: '7 Days or Less' },
  { value: '11', label: '11 Days' },
  { value: '14', label: '14 Days' },
  { value: '21', label: '21 Days' },
  { value: '28', label: '28 Days' },
];

const TRAVELLERS_OPTIONS = [
  { value: '1', label: '1 Pilgrim' },
  { value: '2', label: '2 Pilgrims' },
  { value: '3', label: '3 Pilgrims' },
  { value: '4', label: '4 Pilgrims' },
  { value: '5', label: '5+ Group' },
];

const PACKAGE_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'economy', label: 'Economy' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'vip', label: 'VIP' },
];

export default function HomePage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchFilters, setSearchFilters] = useState({
    month: '',
    duration: '',
    travellers: '1',
    packageType: '',
  });

  // Build URL with filters
  const buildSearchUrl = () => {
    // Determine base path
    let path = '/umrah';
    if (activeTab === 'hajj') path = '/hajj';
    if (activeTab === 'ramadhan') path = '/umrah'; // Ramadhan is Umrah

    // Build query string
    const params = new URLSearchParams();
    if (searchFilters.month) params.set('month', searchFilters.month);
    if (searchFilters.duration) params.set('duration', searchFilters.duration);
    if (searchFilters.travellers)
      params.set('travellers', searchFilters.travellers);
    if (searchFilters.packageType)
      params.set('type', searchFilters.packageType);

    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await packageAPI.list({ limit: 6 });
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

        {/* Floating Ornaments */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none"
        />

        <div className="relative container-mhk py-20 lg:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold tracking-wide border border-white/10 mb-6"
          >
            <span className="material-symbols-outlined text-sm text-primary-fixed">
              verified
            </span>
            Trusted Hajj &amp; Umrah Operator • Sri Lanka
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto"
          >
            Your Sacred Journey{' '}
            <span className="text-tertiary-fixed underline decoration-tertiary-fixed/30 underline-offset-8">
              Begins Here
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl mt-6 max-w-2xl mx-auto opacity-90"
          >
            Trusted Hajj &amp; Umrah travel services from Sri Lanka. Plan your
            spiritual journey with carefully designed packages, comfortable
            accommodation, and dedicated travel support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center mt-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/umrah"
                className="inline-block px-8 py-3.5 rounded-xl bg-white text-primary font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Explore Packages
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/contact"
                className="inline-block px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
              >
                Plan Your Journey
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ BOOKING WIDGET (Outside Hero, Floating) ============ */}
      <div className="relative -mt-16 z-30 mb-8">
        <div className="container-mhk">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-3xl p-6 shadow-2xl"
            style={{ overflow: 'visible' }}
          >
            {/* Tab Selector */}
            <div className="flex flex-wrap gap-1 p-1 bg-surface-container/80 backdrop-blur-sm rounded-xl mb-5">
              {[
                { id: 'all', label: 'All Packages', icon: 'explore' },
                { id: 'umrah', label: 'Umrah', icon: 'mosque' },
                { id: 'hajj', label: 'Hajj 1447H', icon: 'flight_takeoff' },
                { id: 'ramadhan', label: 'Ramadhan', icon: 'nightlight' },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {tab.icon}
                  </span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Filters Row — with z-index so dropdowns overlay */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
              style={{ position: 'relative', zIndex: 50 }}
            >
              <GlassSelect
                label="Travel Month"
                value={searchFilters.month}
                options={MONTH_OPTIONS}
                onChange={(v) =>
                  setSearchFilters({ ...searchFilters, month: v })
                }
                icon="calendar_month"
                placeholder="Any Month"
              />

              <GlassSelect
                label="Duration"
                value={searchFilters.duration}
                options={DURATION_OPTIONS}
                onChange={(v) =>
                  setSearchFilters({ ...searchFilters, duration: v })
                }
                icon="schedule"
                placeholder="Any Duration"
              />

              <GlassSelect
                label="Travellers"
                value={searchFilters.travellers}
                options={TRAVELLERS_OPTIONS}
                onChange={(v) =>
                  setSearchFilters({ ...searchFilters, travellers: v })
                }
                icon="group"
                placeholder="1 Pilgrim"
              />

              <GlassSelect
                label="Package Type"
                value={searchFilters.packageType}
                options={PACKAGE_TYPE_OPTIONS}
                onChange={(v) =>
                  setSearchFilters({ ...searchFilters, packageType: v })
                }
                icon="tune"
                placeholder="All Types"
              />

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Link
                  href={buildSearchUrl()}
                  className="btn-primary w-full h-12 justify-center text-sm"
                >
                  <span className="material-symbols-outlined text-lg">
                    travel_explore
                  </span>
                  Find Packages
                </Link>
              </motion.div>
            </div>

            {/* Trust Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-surface-container/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Trusted by Sri Lankans:
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/5 px-2 py-1 rounded-full border border-primary/20">
                <span className="material-symbols-outlined text-xs">
                  verified
                </span>
                MRCA H-248
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-tertiary bg-tertiary-fixed/30 px-2 py-1 rounded-full border border-tertiary-fixed">
                <span className="material-symbols-outlined text-xs">lock</span>
                PayHere Secured
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
                <span className="material-symbols-outlined text-xs">
                  payments
                </span>
                20% Advance Booking
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============ TRUST STATS ============ */}
      <section className="py-12">
        <div className="container-mhk">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: '15+', label: 'Years of Experience' },
              { value: '5,000+', label: 'Pilgrims Served' },
              { value: '50+', label: 'Successful Journeys' },
              { value: '24/7', label: 'Travel Support' },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <span className="text-3xl font-bold text-primary block">
                    {stat.value}
                  </span>
                  <p className="text-xs font-semibold text-on-surface-variant mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============ FEATURED PACKAGES ============ */}
      <section className="py-12">
        <div className="container-mhk">
          <FadeUp>
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
          </FadeUp>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="h-52 bg-surface-container" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-surface-container rounded w-3/4" />
                    <div className="h-3 bg-surface-container rounded w-1/2" />
                    <div className="h-8 bg-surface-container rounded w-1/3" />
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
              {packages.map((pkg, idx) => (
                <PackageCard key={pkg.id} pkg={pkg} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ WHY CHOOSE ============ */}
      <section className="py-16 bg-surface-container-low">
        <div className="container-mhk">
          <FadeUp>
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
          </FadeUp>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: 'groups', title: 'Experienced Team' },
              { icon: 'verified', title: 'Trusted Service' },
              { icon: 'hotel', title: 'Premium Hotels' },
              { icon: 'support_agent', title: '24/7 Support' },
              { icon: 'payments', title: '20% Advance' },
              { icon: 'flight', title: 'Direct Flights' },
            ].map((feature) => (
              <StaggerItem key={feature.title}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="p-5 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 text-center"
                >
                  <motion.span
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="material-symbols-outlined text-3xl text-primary block mb-2"
                  >
                    {feature.icon}
                  </motion.span>
                  <h3 className="text-sm font-bold">{feature.title}</h3>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-16">
        <div className="container-mhk">
          <FadeUp>
            <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-light rounded-3xl p-10 lg:p-14 text-white text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.15, 0.1],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/40 blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.1, 0.15, 0.1],
                }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-tertiary-fixed/40 blur-3xl"
              />

              <div className="relative">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Ready to Begin Your Sacred Journey?
                </h2>
                <p className="text-lg opacity-90 mt-3 max-w-2xl mx-auto">
                  Explore our upcoming Hajj &amp; Umrah packages and book your
                  spiritual journey today with just 20% advance.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block mt-6"
                >
                  <Link
                    href="/umrah"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="material-symbols-outlined">
                      flight_takeoff
                    </span>
                    Explore Packages
                  </Link>
                </motion.div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}