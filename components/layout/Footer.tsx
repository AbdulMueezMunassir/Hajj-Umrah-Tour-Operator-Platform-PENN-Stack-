import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low text-on-surface pt-12 pb-6 border-t border-surface-container">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Image src="/img/logo.png" alt="MHK Travels" width={140} height={40} className="h-10 w-auto" />
            <p className="text-sm text-on-surface-variant max-w-sm">
              Sri Lanka's trusted partner for spiritual journeys to the holy sanctuaries of Makkah and Madinah.
            </p>
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
              MRCA Registered Hajj Tour Operator No: <strong>H-248</strong>
            </div>
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition"><span className="material-symbols-outlined text-lg">chat</span></a>
              <a href="#" className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition"><span className="material-symbols-outlined text-lg">mail</span></a>
              <a href="#" className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition"><span className="material-symbols-outlined text-lg">pin_drop</span></a>
              <a href="#" className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition"><span className="material-symbols-outlined text-lg">call</span></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link href="/" className="hover:text-primary transition">Home</Link></li>
              <li><Link href="/hajj" className="hover:text-primary transition">Hajj Packages</Link></li>
              <li><Link href="/umrah" className="hover:text-primary transition">Umrah Packages</Link></li>
              <li><Link href="/about" className="hover:text-primary transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link href="/services" className="hover:text-primary transition">VIP Maktab Hajj</Link></li>
              <li><Link href="/services" className="hover:text-primary transition">Luxury Clock Tower Suites</Link></li>
              <li><Link href="/services" className="hover:text-primary transition">Direct SriLankan Flights</Link></li>
              <li><Link href="/services" className="hover:text-primary transition">Private Haramain Transfers</Link></li>
              <li><Link href="/services" className="hover:text-primary transition">Biometrics & Visa</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-3">Office</h4>
            <address className="not-italic text-sm text-on-surface-variant space-y-1">
              <p><strong>MHK Travels (Pvt) Ltd</strong></p>
              <p>#201 1/1, City Arcade,<br />Galle Road, Beruwala, Sri Lanka</p>
              <p><span className="font-semibold">Hotline:</span> (+94) 776 290 290</p>
              <p><span className="font-semibold">Email:</span> info@mhktravels.com</p>
            </address>
          </div>
        </div>
        <div className="pt-6 mt-6 border-t border-surface-container flex flex-col md:flex-row justify-between items-center text-xs text-on-surface-variant">
          <p>© 2026 MHK Travels (Pvt) Ltd. All Rights Reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition">Terms</Link>
            <span>PayHere Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
}