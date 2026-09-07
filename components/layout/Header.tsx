'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-white/80 shadow-sm">
      <div className="bg-primary text-white text-xs font-semibold py-1.5 px-4 flex justify-between items-center">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">verified</span>
          Sri Lanka Approved Hajj & Umrah Operator • Hotline: (+94) 776 290 290
        </span>
        <span className="hidden md:flex items-center gap-4">
          <span>Beruwala & Colombo</span>
          <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full font-bold">2026/1447H Open</span>
        </span>
      </div>

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/img/logo.png" alt="MHK Travels" width={120} height={40} className="h-10 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 bg-surface-container p-1 rounded-xl">
          <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-high transition">Home</Link>
          <Link href="/umrah" className="px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white shadow-sm">Umrah</Link>
          <Link href="/hajj" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-high transition">Hajj</Link>
          <Link href="/about" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-high transition">About</Link>
          <Link href="/services" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-high transition">Services</Link>
          <Link href="/contact" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-surface-container-high transition">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden md:block text-sm font-medium text-on-surface-variant hover:text-primary">Login</Link>
          <Link href="/register" className="hidden md:block btn-primary px-4 py-2 rounded-xl text-sm font-bold">Sign Up</Link>
          <Link href="/booking/select-package" className="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-base">flight_takeoff</span>
            <span className="hidden sm:inline">Book Now</span>
          </Link>
          <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-surface-container-lowest p-4 shadow-lg">
          <nav className="flex flex-col gap-2">
            <Link href="/" className="px-3 py-2 rounded-lg hover:bg-surface-container transition">Home</Link>
            <Link href="/umrah" className="px-3 py-2 rounded-lg bg-primary text-white">Umrah</Link>
            <Link href="/hajj" className="px-3 py-2 rounded-lg hover:bg-surface-container transition">Hajj</Link>
            <Link href="/about" className="px-3 py-2 rounded-lg hover:bg-surface-container transition">About</Link>
            <Link href="/services" className="px-3 py-2 rounded-lg hover:bg-surface-container transition">Services</Link>
            <Link href="/contact" className="px-3 py-2 rounded-lg hover:bg-surface-container transition">Contact</Link>
            <hr />
            <Link href="/login" className="px-3 py-2 rounded-lg hover:bg-surface-container transition">Login</Link>
            <Link href="/register" className="px-3 py-2 rounded-lg bg-primary text-white text-center">Sign Up</Link>
          </nav>
        </div>
      )}
    </header>
  );
}