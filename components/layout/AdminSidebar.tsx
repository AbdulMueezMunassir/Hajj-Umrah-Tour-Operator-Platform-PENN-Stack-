'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const ADMIN_NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/packages', label: 'Packages', icon: 'inventory_2' },
  { href: '/admin/bookings', label: 'Bookings', icon: 'receipt_long' },
  { href: '/admin/travellers', label: 'Travellers', icon: 'groups' },
  { href: '/admin/users', label: 'Users', icon: 'manage_accounts' },
  { href: '/admin/payments', label: 'Payments', icon: 'payments' },
  { href: '/admin/reports', label: 'Reports', icon: 'analytics' },
  { href: '/admin/reviews', label: 'Reviews', icon: 'reviews' },
  { href: '/admin/notifications', label: 'Notifications', icon: 'notifications' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="space-y-3">
      {/* Admin Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-tertiary to-tertiary-container rounded-2xl p-4 shadow-lg">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/20 blur-2xl"
        />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
            <span className="material-symbols-outlined text-lg">
              admin_panel_settings
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">
              Admin Panel
            </p>
            <p className="font-bold text-white text-xs truncate">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-1.5 shadow-lg">
        <ul className="space-y-0.5">
          {ADMIN_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                    active
                      ? 'bg-tertiary text-white shadow-md shadow-tertiary/25'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg ${
                      active ? 'text-white' : 'text-on-surface-variant'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-1.5 shadow-lg space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all text-on-surface-variant hover:bg-tertiary hover:text-white"
        >
          <span className="material-symbols-outlined text-lg">home</span>
          <span>Public Site</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-2xl bg-tertiary text-white shadow-2xl flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-2">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-inverse-surface/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-surface overflow-y-auto p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-tertiary">Admin Menu</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}