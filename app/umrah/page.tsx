'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { packageAPI } from '@/lib/api';
import { Package } from '@/types';
import PackageCard from '@/components/packages/PackageCard';
import PackageFilters, {
  FilterState,
} from '@/components/packages/PackageFilters';
import { motion } from 'framer-motion';
import { FadeUp } from '@/components/ui/MotionDiv';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  month: '',
  duration: '',
  sort: 'createdAt-desc',
  priceMax: 5000000,
  hotelProximity: [],
};

export default function UmrahPage() {
  return (
    <Suspense fallback={<UmrahPageSkeleton />}>
      <UmrahContent />
    </Suspense>
  );
}

function UmrahPageSkeleton() {
  return (
    <div className="w-full">
      <div className="container-mhk py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-surface-container rounded-2xl" />
          <div className="grid grid-cols-4 gap-6">
            <div className="h-96 bg-surface-container rounded-2xl" />
            <div className="col-span-3 grid grid-cols-2 gap-6">
              <div className="h-80 bg-surface-container rounded-2xl" />
              <div className="h-80 bg-surface-container rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UmrahContent() {
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize filters from URL params
  const getInitialFilters = (): FilterState => ({
    search: '',
    month: searchParams.get('month') || '',
    duration: searchParams.get('duration') || '',
    sort: 'createdAt-desc',
    priceMax: 5000000,
    hotelProximity: [],
  });

  const [filters, setFilters] = useState<FilterState>(getInitialFilters());

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await packageAPI.list({
          type: 'UMRAH',
          limit: 50,
        });
        setPackages(response.data.data.packages || []);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Client-side filtering
  const filtered = useMemo(() => {
    let result = [...packages];

    // Search
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.departureCity.toLowerCase().includes(s)
      );
    }

    // Month
    if (filters.month) {
      result = result.filter((p) => {
        const travelDate = new Date(p.travelDate);
        const monthStr = `${travelDate.getFullYear()}-${String(
          travelDate.getMonth() + 1
        ).padStart(2, '0')}`;
        return monthStr === filters.month;
      });
    }

    // Duration
    if (filters.duration) {
      const maxDuration = parseInt(filters.duration);
      result = result.filter((p) => p.duration <= maxDuration);
    }

    // Price
    result = result.filter((p) => p.totalPrice <= filters.priceMax);

    // Sort
    const [sortKey, sortDir] = filters.sort.split('-');
    result.sort((a, b) => {
      const aVal = (a as any)[sortKey];
      const bVal = (b as any)[sortKey];
      if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [packages, filters]);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary text-white py-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 to-primary-light/80" />

        <div className="relative container-mhk">
          <FadeUp>
            <nav className="flex items-center gap-2 text-xs text-white/70 mb-3">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
              <span className="text-white font-semibold">Umrah Packages</span>
            </nav>
            <h1 className="text-4xl lg:text-5xl font-bold">
              Umrah Packages
            </h1>
            <p className="text-lg mt-3 opacity-90 max-w-2xl">
              Choose the right package for your spiritual journey. Premium 5-star
              accommodations, direct flights, and 20% advance booking.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="container-mhk">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4 flex justify-between items-center">
            <p className="text-sm text-on-surface-variant">
              <strong className="text-on-surface">{filtered.length}</strong>{' '}
              packages found
            </p>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white shadow-sm border border-surface-container text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-lg">tune</span>
              Filters
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters */}
            <div
              className={`lg:col-span-1 ${
                showMobileFilters ? 'block' : 'hidden lg:block'
              }`}
            >
              <PackageFilters
                filters={filters}
                onChange={setFilters}
                type="UMRAH"
              />
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="hidden lg:flex flex-wrap items-center justify-between gap-3 mb-4">
  <p className="text-sm text-on-surface-variant">
    Showing{' '}
    <strong className="text-on-surface">{filtered.length}</strong>{' '}
    Umrah packages
  </p>

  {/* Active Filters Chips */}
  {(filters.month || filters.duration || filters.search) && (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-bold uppercase text-on-surface-variant">
        Active:
      </span>
      {filters.month && (
        <span className="inline-flex items-center gap-1 text-[11px] bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full">
          {filters.month}
          <button
            onClick={() => setFilters({ ...filters, month: '' })}
            className="hover:text-error"
          >
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        </span>
      )}
      {filters.duration && (
        <span className="inline-flex items-center gap-1 text-[11px] bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full">
          ≤ {filters.duration} Days
          <button
            onClick={() => setFilters({ ...filters, duration: '' })}
            className="hover:text-error"
          >
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        </span>
      )}
      {filters.search && (
        <span className="inline-flex items-center gap-1 text-[11px] bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full">
          "{filters.search}"
          <button
            onClick={() => setFilters({ ...filters, search: '' })}
            className="hover:text-error"
          >
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        </span>
      )}
    </div>
  )}
</div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
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
              ) : filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 bg-white rounded-2xl shadow-sm"
                >
                  <span className="material-symbols-outlined text-6xl text-outline">
                    search_off
                  </span>
                  <h3 className="text-xl font-bold text-on-surface mt-3">
                    No packages found
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Try adjusting your filters.
                  </p>
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="btn-primary mt-4 inline-flex"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((pkg, idx) => (
                    <PackageCard key={pkg.id} pkg={pkg} index={idx} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}