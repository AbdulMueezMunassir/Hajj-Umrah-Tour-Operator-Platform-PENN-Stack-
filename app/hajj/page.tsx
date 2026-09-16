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

export default function HajjPage() {
  return (
    <Suspense fallback={<HajjPageSkeleton />}>
      <HajjContent />
    </Suspense>
  );
}

function HajjPageSkeleton() {
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

function HajjContent() {
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
          type: 'HAJJ',
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

  const filtered = useMemo(() => {
    let result = [...packages];

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.departureCity.toLowerCase().includes(s)
      );
    }

    if (filters.month) {
      result = result.filter((p) => {
        const travelDate = new Date(p.travelDate);
        const monthStr = `${travelDate.getFullYear()}-${String(
          travelDate.getMonth() + 1
        ).padStart(2, '0')}`;
        return monthStr === filters.month;
      });
    }

    if (filters.duration) {
      const maxDuration = parseInt(filters.duration);
      result = result.filter((p) => p.duration <= maxDuration);
    }

    result = result.filter((p) => p.totalPrice <= filters.priceMax);

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
      <section className="relative overflow-hidden bg-gradient-to-br from-tertiary via-tertiary-container to-primary text-white py-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1537444532052-02afbc2b5e77?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-tertiary/95 to-tertiary-container/80" />

        <div className="relative container-mhk">
          <FadeUp>
            <nav className="flex items-center gap-2 text-xs text-white/70 mb-3">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
              <span className="text-white font-semibold">Hajj Packages</span>
            </nav>
            <h1 className="text-4xl lg:text-5xl font-bold">Hajj Packages</h1>
            <p className="text-lg mt-3 opacity-90 max-w-2xl">
              Begin your Hajj journey with experienced travel support. VIP
              Maktab, 5-star hotels, and complete spiritual guidance.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="container-mhk">
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
            <div
              className={`lg:col-span-1 ${
                showMobileFilters ? 'block' : 'hidden lg:block'
              }`}
            >
              <PackageFilters
                filters={filters}
                onChange={setFilters}
                type="HAJJ"
              />
            </div>

            <div className="lg:col-span-3">
              <div className="hidden lg:flex items-center justify-between mb-4">
                <p className="text-sm text-on-surface-variant">
                  Showing{' '}
                  <strong className="text-on-surface">{filtered.length}</strong>{' '}
                  Hajj packages
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
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
                    No Hajj packages found
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