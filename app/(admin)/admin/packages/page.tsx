'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { packageAPI } from '@/lib/api';
import { Package } from '@/types';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

type TabType = 'all' | 'HAJJ' | 'UMRAH' | 'ACTIVE' | 'INACTIVE';

export default function AdminPackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Package | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await packageAPI.list({ limit: 100 });
      setPackages(res.data.data.packages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Filter
  const filtered = useMemo(() => {
    let result = [...packages];

    if (activeTab === 'HAJJ' || activeTab === 'UMRAH') {
      result = result.filter((p) => p.type === activeTab);
    } else if (activeTab === 'ACTIVE') {
      result = result.filter((p) => p.status === 'ACTIVE');
    } else if (activeTab === 'INACTIVE') {
      result = result.filter((p) => p.status === 'INACTIVE');
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.departureCity.toLowerCase().includes(q)
      );
    }

    return result;
  }, [packages, activeTab, searchQuery]);

  const counts = {
    all: packages.length,
    HAJJ: packages.filter((p) => p.type === 'HAJJ').length,
    UMRAH: packages.filter((p) => p.type === 'UMRAH').length,
    ACTIVE: packages.filter((p) => p.status === 'ACTIVE').length,
    INACTIVE: packages.filter((p) => p.status === 'INACTIVE').length,
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await packageAPI.delete(deleteTarget.id);
      setPackages(packages.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete package');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (pkg: Package) => {
    const newStatus = pkg.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await packageAPI.toggleStatus(pkg.id, newStatus);
      setPackages(
        packages.map((p) =>
          p.id === pkg.id ? { ...p, status: newStatus as any } : p
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

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
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/20 mb-3">
                <span className="material-symbols-outlined text-xs">
                  inventory_2
                </span>
                Package Management
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                Travel Packages
              </h1>
              <p className="text-sm opacity-90 mt-1">
                Manage Hajj & Umrah packages • {packages.length} total
              </p>
            </div>
            <Link
              href="/admin/packages/create"
              className="px-5 py-3 rounded-xl bg-white text-tertiary text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Create Package
            </Link>
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
                { id: 'UMRAH', label: 'Umrah', count: counts.UMRAH },
                { id: 'HAJJ', label: 'Hajj', count: counts.HAJJ },
                { id: 'ACTIVE', label: 'Active', count: counts.ACTIVE },
                { id: 'INACTIVE', label: 'Inactive', count: counts.INACTIVE },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-tertiary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/60'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id
                        ? 'bg-white/20'
                        : 'bg-surface-container-high'
                    }`}
                  >
                    {tab.count}
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="relative md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/70 border border-surface-container-high focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 outline-none text-xs transition-all"
              />
            </div>
          </div>
        </div>
      </FadeUp>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-surface-container rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <FadeUp delay={0.2}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
            <span className="material-symbols-outlined text-6xl text-outline">
              inventory_2
            </span>
            <h3 className="text-xl font-bold text-on-surface mt-4">
              No packages found
            </h3>
            <p className="text-sm text-on-surface-variant mt-1 mb-6">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Create your first package to get started'}
            </p>
            <Link
              href="/admin/packages/create"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-tertiary text-white font-bold text-sm shadow-lg"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Create Package
            </Link>
          </div>
        </FadeUp>
      ) : (
        <StaggerContainer className="space-y-3">
          {filtered.map((pkg) => (
            <StaggerItem key={pkg.id}>
              <PackageRow
                pkg={pkg}
                onDelete={() => setDeleteTarget(pkg)}
                onToggleStatus={() => handleToggleStatus(pkg)}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isDeleting && setDeleteTarget(null)}
            className="fixed inset-0 z-[100] bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">
                  delete_forever
                </span>
              </div>
              <h3 className="text-xl font-bold text-center text-on-surface">
                Delete Package?
              </h3>
              <p className="text-sm text-on-surface-variant text-center mt-2">
                Are you sure you want to delete{' '}
                <strong className="text-on-surface">{deleteTarget.name}</strong>
                ?
              </p>

              <div className="p-3 rounded-xl bg-error-container/40 mt-4 text-xs text-on-error-container">
                <p className="font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    warning
                  </span>
                  Cannot be undone
                </p>
                <p className="text-[11px] mt-1">
                  Packages with active bookings cannot be deleted. Deactivate
                  them instead.
                </p>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-error text-white font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// Package Row
// ==========================================
function PackageRow({
  pkg,
  onDelete,
  onToggleStatus,
}: {
  pkg: Package;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  const advanceAmount = Math.round(
    (pkg.totalPrice * (pkg.advancePercent || 20)) / 100
  );
  const travelDate = new Date(pkg.travelDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const isActive = pkg.status === 'ACTIVE';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Image */}
        <div className="lg:w-32 h-24 rounded-xl overflow-hidden relative flex-shrink-0">
          {pkg.posterUrl ? (
            <img
              src={pkg.posterUrl}
              alt={pkg.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-white/40">
                mosque
              </span>
            </div>
          )}
          <span
            className={`absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
              pkg.type === 'HAJJ'
                ? 'bg-tertiary text-white'
                : 'bg-primary text-white'
            }`}
          >
            {pkg.type}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-on-surface text-sm truncate">
              {pkg.name}
            </h3>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isActive
                  ? 'bg-primary-fixed text-on-primary-fixed'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {pkg.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                calendar_today
              </span>
              {travelDate}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                schedule
              </span>
              {pkg.duration} Days
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                flight_takeoff
              </span>
              {pkg.departureCity}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">group</span>
              {pkg.availableSeats} seats
            </span>
          </div>
        </div>

        {/* Pricing */}
        <div className="lg:text-right">
          <div className="text-lg font-bold text-on-surface">
            LKR {pkg.totalPrice.toLocaleString()}
          </div>
          <div className="text-[10px] text-tertiary font-bold">
            Advance: LKR {advanceAmount.toLocaleString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:flex-col lg:items-stretch">
          <Link
            href={`/admin/packages/${pkg.id}/edit`}
            className="flex-1 lg:flex-none px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit
          </Link>

          <button
            onClick={onToggleStatus}
            className={`flex-1 lg:flex-none px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
              isActive
                ? 'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary hover:text-white'
                : 'bg-primary-fixed text-on-primary-fixed hover:bg-primary hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {isActive ? 'visibility_off' : 'visibility'}
            </span>
            {isActive ? 'Deactivate' : 'Activate'}
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-2 rounded-xl bg-error-container text-on-error-container hover:bg-error hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>

          <Link
            href={`/package/${pkg.id}`}
            className="px-3 py-2 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            title="Preview as user"
          >
            <span className="material-symbols-outlined text-sm">
              visibility
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}