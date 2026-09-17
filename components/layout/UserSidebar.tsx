'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/bookings', label: 'My Bookings', icon: 'receipt_long' },
  { href: '/upcoming', label: 'Upcoming Journey', icon: 'flight_takeoff' },
  { href: '/payments', label: 'Payments', icon: 'payments' },
  { href: '/notifications', label: 'Notifications', icon: 'notifications' },
  { href: '/profile', label: 'Profile', icon: 'person' },
  { href: '/support', label: 'Support', icon: 'support_agent' },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  // ==========================================
  // Sidebar Content
  // ==========================================
  const SidebarContent = () => (
    <div className="space-y-3">
      {/* User Card */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
            {user?.firstName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-on-surface truncate text-xs">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[9px] text-on-surface-variant truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-1.5 shadow-lg">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                    active
                      ? 'bg-primary text-white shadow-md shadow-primary/25'
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
        {/* Back to Home */}
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all group"
          style={{
            color: 'var(--on-surface-variant)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--on-surface-variant)';
          }}
        >
          <span className="material-symbols-outlined text-lg">home</span>
          <span>Back to Home</span>
        </Link>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all text-left"
          style={{
            color: '#ba1a1a',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ba1a1a';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#ba1a1a';
          }}
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-2xl bg-primary text-white shadow-2xl flex items-center justify-center"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
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
                <h2 className="font-bold text-primary">Menu</h2>
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

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 z-[100] bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-2xl">
                    logout
                  </span>
                </div>
                <h3 className="text-xl font-bold text-center text-on-surface">
                  Confirm Logout
                </h3>
                <p className="text-sm text-on-surface-variant text-center mt-1">
                  Are you sure you want to logout from your account?
                </p>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                    style={{
                      backgroundColor: '#eaedff',
                      color: '#131b2e',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e2e7ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#eaedff';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors"
                    style={{
                      backgroundColor: '#ba1a1a',
                      color: '#ffffff',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#991b1b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ba1a1a';
                    }}
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}