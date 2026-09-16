'use client';

import { motion } from 'framer-motion';
import GlassSelect from '@/components/ui/GlassSelect';
import GlassCheckbox from '@/components/ui/GlassCheckbox';

export interface FilterState {
  search: string;
  month: string;
  duration: string;
  sort: string;
  priceMax: number;
  hotelProximity: string[];
  travellers?: string;
  packageType?: string;
}

interface PackageFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  type: 'UMRAH' | 'HAJJ';
}

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

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'totalPrice-asc', label: 'Price: Low to High' },
  { value: 'totalPrice-desc', label: 'Price: High to Low' },
  { value: 'travelDate-asc', label: 'Departure: Earliest' },
];

const HOTEL_PROXIMITY = [
  { value: 'courtyard', label: 'Courtyard Front (0-100m)' },
  { value: 'walking', label: 'Walking Distance (100-300m)' },
  { value: 'shuttle', label: 'Shuttle Service' },
];

export default function PackageFilters({
  filters,
  onChange,
  type,
}: PackageFiltersProps) {
  const update = (key: keyof FilterState, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleProximity = (value: string) => {
    const current = filters.hotelProximity || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    update('hotelProximity', next);
  };

  const resetFilters = () => {
    onChange({
      search: '',
      month: '',
      duration: '',
      sort: 'createdAt-desc',
      priceMax: 5000000,
      hotelProximity: [],
    });
  };

  const activeFilterCount = [
    filters.search,
    filters.month,
    filters.duration,
    filters.hotelProximity?.length > 0 ? 'yes' : '',
  ].filter(Boolean).length;

  return (
    <aside className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-lg sticky top-24 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/60">
        <div className="flex items-center gap-2">
          <motion.span
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="material-symbols-outlined text-primary text-xl"
          >
            tune
          </motion.span>
          <h3 className="font-bold text-on-surface">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="text-[11px] font-bold uppercase tracking-wider text-tertiary hover:text-primary transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Search */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-primary">
          Search
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            placeholder="Search packages..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/80 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Travel Month */}
      <GlassSelect
        label="Travel Month"
        value={filters.month}
        options={MONTH_OPTIONS}
        onChange={(v) => update('month', v)}
        icon="calendar_month"
        placeholder="Any Month"
      />

      {/* Duration */}
      <GlassSelect
        label="Duration"
        value={filters.duration}
        options={DURATION_OPTIONS}
        onChange={(v) => update('duration', v)}
        icon="schedule"
        placeholder="Any Duration"
      />

      {/* Price Range */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Max Price
          </label>
          <span className="text-[11px] font-bold text-tertiary">
            LKR {(filters.priceMax / 1000).toFixed(0)}K
          </span>
        </div>
        <input
          type="range"
          min="100000"
          max="5000000"
          step="50000"
          value={filters.priceMax}
          onChange={(e) => update('priceMax', parseInt(e.target.value))}
          className="w-full accent-primary h-1.5 bg-surface-container rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-on-surface-variant">
          <span>LKR 100K</span>
          <span>LKR 5M</span>
        </div>
      </div>

      {/* Hotel Proximity */}
      <div className="space-y-1">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-2">
          Hotel Proximity
        </label>
        <div className="space-y-0.5">
          {HOTEL_PROXIMITY.map((option) => (
            <GlassCheckbox
              key={option.value}
              label={option.label}
              checked={filters.hotelProximity?.includes(option.value) || false}
              onChange={() => toggleProximity(option.value)}
            />
          ))}
        </div>
      </div>

      {/* Sort */}
      <GlassSelect
        label="Sort By"
        value={filters.sort}
        options={SORT_OPTIONS}
        onChange={(v) => update('sort', v)}
        icon="sort"
      />

      {/* Info Card */}
      <div className="p-3 rounded-xl bg-tertiary-fixed/30 border border-tertiary-fixed">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="material-symbols-outlined text-sm text-tertiary">
            verified
          </span>
          <span className="text-[11px] font-bold text-tertiary">
            20% Advance Guarantee
          </span>
        </div>
        <p className="text-[10px] text-on-surface-variant leading-snug">
          Lock flights and hotels with just 20% deposit via PayHere.
        </p>
      </div>
    </aside>
  );
}