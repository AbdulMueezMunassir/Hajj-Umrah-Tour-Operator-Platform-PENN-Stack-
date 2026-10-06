'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogout(false);
    router.push('/');
  };
  const pathname = usePathname();

  const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/umrah', label: 'Umrah' },
  { href: '/hajj', label: 'Hajj' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

    return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-white/80 shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-white text-[10px] font-semibold py-1.5 px-4">
        <div className="container-mhk flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary-fixed">
              verified
            </span>
            <span className="hidden sm:inline">
              Sri Lanka Approved Hajj &amp; Umrah Operator • Hotline: (+94) 776
              290 290
            </span>
            <span className="sm:hidden">Hotline: (+94) 776 290 290</span>
          </span>
          <span className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary-fixed">
                location_on
              </span>
              Beruwala &amp; Colombo
            </span>
            <span className="bg-primary-container text-white px-2 py-0.5 rounded-full font-bold">
              2026/1447H Open
            </span>
          </span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container-mhk h-28 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
        <Image
          src="/img/logo.png"
          alt="MHK Travels"
          width={260}
          height={100}
          className="h-24 w-auto object-contain"
          priority
      />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-surface-container rounded-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <Link
                href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                className="hidden md:flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  {user.firstName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-on-surface leading-tight">
                    {user.firstName}
                  </span>
                  <span className="text-[10px] text-primary font-semibold leading-tight">
                    {user.role === 'ADMIN' ? 'Admin' : 'Pilgrim'}
                  </span>
                </div>
              </Link>
              
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:block text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hidden md:block btn-primary text-xs px-4 py-2"
              >
                Sign Up
              </Link>
            </>
          )}

          <Link href="/umrah" className="btn-primary text-xs px-4 py-2">
            <span className="material-symbols-outlined text-base">
              flight_takeoff
            </span>
            <span className="hidden sm:inline">Book Now</span>
          </Link>

          {isAuthenticated && user && (
            <button
              onClick={() => setShowLogout(true)}
              aria-label="Logout"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-error border border-error/30 hover:bg-error hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              <span className="hidden xl:inline">Logout</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-container transition-colors"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-surface-container shadow-lg">
          <nav className="container-mhk py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary text-white'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-surface-container mt-2 pt-3 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <Link
                    href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl font-medium bg-surface-container hover:bg-surface-container-high transition-colors text-center"
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl font-medium text-error hover:bg-error-container transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl font-medium text-center hover:bg-surface-container transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary justify-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
        </header>

    {/* Logout Confirm Modal */}
    {showLogout && (
      <div
        onClick={() => setShowLogout(false)}
        className="fixed inset-0 z-[100] bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-2xl">logout</span>
          </div>
          <h3 className="text-xl font-bold text-center text-on-surface">
            Confirm Logout
          </h3>
          <p className="text-sm text-on-surface-variant text-center mt-1">
            Are you sure you want to logout?
          </p>
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setShowLogout(false)}
              className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-2.5 rounded-xl bg-error hover:bg-red-700 text-white font-bold text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}