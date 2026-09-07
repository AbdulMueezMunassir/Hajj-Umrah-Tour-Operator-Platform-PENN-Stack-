import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import PackageCard from '@/components/packages/PackageCard';

export default function HomePage() {
  const featured = [
    { id: '1', name: 'Premium Umrah Package', duration: '11 Days', price: 460000, advance: 92000, image: '/img/umrah1.jpg', slug: 'premium-umrah' },
    { id: '2', name: 'Luxury Umrah + Taif', duration: '14 Days', price: 540000, advance: 108000, image: '/img/umrah2.jpg', slug: 'luxury-umrah' },
    { id: '3', name: 'Express Umrah Retreat', duration: '7 Days', price: 375000, advance: 75000, image: '/img/umrah3.jpg', slug: 'express-umrah' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-secondary text-white py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/img/kaaba-bg.jpg')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold tracking-wide border border-white/10">
            <span className="material-symbols-outlined text-sm">verified</span>
            Trusted Hajj & Umrah Operator • Sri Lanka
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-outfit mt-4 leading-tight">
            Your Sacred Journey <br />
            <span className="text-tertiary-fixed underline decoration-tertiary-fixed/30 underline-offset-8">Begins Here</span>
          </h1>
          <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto opacity-90">
            Trusted Hajj & Umrah travel services from Sri Lanka. Plan your spiritual journey with carefully designed packages.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link href="/umrah" className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-xl font-bold shadow-lg transition">
              Explore Packages
            </Link>
            <Link href="/booking/select-package" className="btn bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 px-8 py-3 rounded-xl font-semibold transition">
              Plan Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Widget */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <div className="glass rounded-2xl p-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-primary">Travel Month</label>
              <select className="w-full p-3 rounded-xl bg-surface-container-low border-0 focus:ring-2 focus:ring-primary">
                <option>September 2026</option>
                <option>October 2026</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-primary">Duration</label>
              <select className="w-full p-3 rounded-xl bg-surface-container-low border-0 focus:ring-2 focus:ring-primary">
                <option>11 Days</option>
                <option>14 Days</option>
                <option>7 Days</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-primary">Travellers</label>
              <select className="w-full p-3 rounded-xl bg-surface-container-low border-0 focus:ring-2 focus:ring-primary">
                <option>1 Pilgrim</option>
                <option>2 Pilgrims</option>
                <option>3 Pilgrims</option>
                <option>4+ Group</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-primary">Package Type</label>
              <select className="w-full p-3 rounded-xl bg-surface-container-low border-0 focus:ring-2 focus:ring-primary">
                <option>All</option>
                <option>Economy</option>
                <option>Standard</option>
                <option>Premium</option>
              </select>
            </div>
            <Button className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md">
              Find Packages
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Packages */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold uppercase text-gold">Featured</span>
            <h2 className="text-2xl md:text-3xl font-bold font-outfit">Upcoming Spiritual Journeys</h2>
          </div>
          <Link href="/umrah" className="text-sm font-semibold text-primary hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {featured.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
      </div>

      {/* Why Choose */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase text-gold">Why MHK</span>
          <h2 className="text-2xl md:text-3xl font-bold font-outfit">Why Choose MHK Travels</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['Experienced Team', 'Trusted Service', 'Premium Hotels', '24/7 Support', '20% Advance', 'Direct Flights'].map((feature) => (
            <div key={feature} className="bg-white p-4 rounded-xl text-center shadow-sm hover:shadow-lg transition">
              <div className="text-3xl mb-2">✨</div>
              <h3 className="font-bold text-sm">{feature}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold">Ready to Begin Your Sacred Journey?</h2>
          <p className="mt-2 opacity-90">Explore our upcoming Hajj & Umrah packages and book today.</p>
          <Link href="/umrah" className="inline-block mt-4 px-8 py-3 bg-white text-primary rounded-xl font-bold shadow-lg hover:shadow-xl transition">
            Explore Packages
          </Link>
        </div>
      </div>
    </div>
  );
}