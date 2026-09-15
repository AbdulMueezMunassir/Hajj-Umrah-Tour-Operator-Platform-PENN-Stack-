import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low text-on-surface pt-12 pb-6 border-t border-surface-container">
      <div className="container-mhk">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Image
              src="/img/logo.png"
              alt="MHK Travels"
              width={180}
              height={60}
              className="h-14 w-auto object-contain"
            />
            <p className="text-sm text-on-surface-variant max-w-md">
              Sri Lanka&apos;s trusted partner for spiritual journeys to the
              holy sanctuaries of Makkah al-Mukarramah and Al-Madinah
              al-Munawwarah.
            </p>
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-sm">
                verified_user
              </span>
              MRCA Registered Hajj Tour Operator No: <strong>H-248</strong>
            </div>
            <div className="flex gap-2">
              <a
                href="#"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
              </a>
              <a
                href="#"
                aria-label="Email"
                className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition"
              >
                <span className="material-symbols-outlined text-lg">mail</span>
              </a>
              <a
                href="#"
                aria-label="Location"
                className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition"
              >
                <span className="material-symbols-outlined text-lg">
                  pin_drop
                </span>
              </a>
              <a
                href="#"
                aria-label="Call"
                className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition"
              >
                <span className="material-symbols-outlined text-lg">call</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-primary mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li>
                <Link href="/" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/hajj" className="hover:text-primary transition">
                  Hajj Packages
                </Link>
              </li>
              <li>
                <Link href="/umrah" className="hover:text-primary transition">
                  Umrah Packages
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-primary mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li>
                <Link href="/services" className="hover:text-primary transition">
                  VIP Maktab Hajj
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition">
                  Luxury Clock Tower Suites
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition">
                  Direct SriLankan Flights
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition">
                  Private Haramain Transfers
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition">
                  Biometrics &amp; Visa
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-primary mb-3">Office</h4>
            <address className="not-italic text-sm text-on-surface-variant space-y-1">
              <p className="font-bold text-on-surface">MHK Travels (Pvt) Ltd</p>
              <p>
                #201 1/1, City Arcade, Galle Road,
                <br />
                Beruwala, Sri Lanka
              </p>
              <p>
                <strong className="text-on-surface">Hotline:</strong>
                <br />
                (+94) 776 290 290
              </p>
              <p>
                <strong className="text-on-surface">Email:</strong>
                <br />
                info@mhktravels.com
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 mt-6 border-t border-surface-container flex flex-col md:flex-row justify-between items-center text-xs text-on-surface-variant gap-2">
          <p>© 2026 MHK Travels (Pvt) Ltd. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary transition">
              Terms
            </Link>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-xs">
                lock
              </span>
              PayHere Secured
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}