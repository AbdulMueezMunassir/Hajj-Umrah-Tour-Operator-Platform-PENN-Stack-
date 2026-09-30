'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeUp } from '@/components/ui/MotionDiv';

const SECTIONS = [
  {
    id: 'introduction',
    title: '1. Introduction',
    content:
      'MHK Travels (Pvt) Ltd is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.',
  },
  {
    id: 'information',
    title: '2. Information We Collect',
    content: [
      'Personal Identification: Full name, passport number, NIC, date of birth, gender, nationality.',
      'Contact Information: Email address, phone number, WhatsApp number, physical address.',
      'Travel Documents: Passport bio-page copies, biometric data required by Saudi authorities.',
      'Payment Information: Transaction records (we do NOT store full credit card numbers).',
      'Journey Data: Package preferences, traveller details, emergency contacts.',
      'Technical Data: IP address, browser type, device info (for website improvement).',
    ],
  },
  {
    id: 'use',
    title: '3. How We Use Your Information',
    content: [
      'Processing bookings, payments, and issuing vouchers.',
      'Submitting visa applications to Saudi authorities via the Nusuk portal.',
      'Communicating critical travel updates, departure briefings, and emergencies.',
      'Coordinating hotel bookings, airline tickets, and ground transportation.',
      'Sending promotional offers (only with your consent, opt-out available anytime).',
      'Complying with MRCA and SLTDA regulatory requirements.',
    ],
  },
  {
    id: 'sharing',
    title: '4. Information Sharing',
    content: [
      'Saudi Authorities: Passport details, biometrics, and photographs for visa processing.',
      'Airlines: Passenger names and passport details for ticketing.',
      'Hotels: Guest names and room preferences for reservations.',
      'PayHere Gateway: Payment details processed securely under PCI-DSS compliance.',
      'We never sell your personal information to third parties.',
      'Third-party partners are contractually bound to protect your data.',
    ],
  },
  {
    id: 'security',
    title: '5. Data Security',
    content: [
      'All website traffic is encrypted with 256-bit SSL/TLS.',
      'Payments are processed via PayHere, a PCI-DSS Level 1 certified gateway.',
      'Database access is restricted to authorized staff only.',
      'Passwords are hashed with industry-standard bcrypt encryption.',
      'We perform regular security audits and vulnerability testing.',
      'Data is stored on secure cloud infrastructure with daily backups.',
    ],
  },
  {
    id: 'retention',
    title: '6. Data Retention',
    content: [
      'Booking records are retained for 7 years for legal and tax compliance.',
      'Visa documents are retained for the duration required by Saudi authorities.',
      'Marketing contact data is retained until you unsubscribe.',
      'Website analytics data is anonymized after 26 months.',
      'You can request deletion of your data (subject to legal retention requirements).',
    ],
  },
  {
    id: 'rights',
    title: '7. Your Rights',
    content: [
      'Access: Request a copy of all personal data we hold about you.',
      'Correction: Update inaccurate or incomplete information.',
      'Deletion: Request erasure of your data (subject to legal retention).',
      'Portability: Receive your data in a machine-readable format.',
      'Objection: Object to processing for marketing purposes.',
      'Complaint: Lodge a complaint with the relevant data protection authority.',
    ],
  },
  {
    id: 'cookies',
    title: '8. Cookies & Tracking',
    content: [
      'We use essential cookies for authentication and session management.',
      'Analytics cookies help us understand how visitors use our site.',
      'No advertising or tracking cookies are used without consent.',
      'You can disable cookies in your browser settings (may affect functionality).',
      'We do not track you across other websites.',
    ],
  },
  {
    id: 'children',
    title: '9. Children\'s Privacy',
    content:
      'Our services are intended for adults. For pilgrims under 18, we collect information with parental consent as part of the family booking. We do not knowingly collect data from unaccompanied minors.',
  },
  {
    id: 'updates',
    title: '10. Policy Updates',
    content:
      'We may update this Privacy Policy from time to time. Material changes will be communicated via email to registered users and posted on this page. Continued use of our services constitutes acceptance of the updated policy.',
  },
  {
    id: 'contact',
    title: '11. Contact & Data Protection Officer',
    content: [
      'Data Protection Officer: MHK Travels Legal Department',
      'Email: privacy@mhktravels.com',
      'Phone: +94 11 234 5678',
      'Address: #201 1/1, City Arcade, Galle Road, Beruwala, Sri Lanka',
      'You may also contact us for any data-related inquiries or to exercise your rights.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary-light/85 to-surface/10" />

        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none"
        />

        <div className="relative container-mhk py-16 lg:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold tracking-wide border border-white/10 mb-6"
          >
            <span className="material-symbols-outlined text-sm text-primary-fixed">
              shield
            </span>
            Privacy &amp; Security
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg mt-6 max-w-2xl mx-auto opacity-90"
          >
            Your privacy matters. Learn how we protect your personal information
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold border border-white/20"
          >
            <span className="material-symbols-outlined text-sm text-tertiary-fixed">
              update
            </span>
            Last updated: September 2026
          </motion.div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-8 bg-surface">
        <div className="container-mhk max-w-4xl">
          <FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: 'lock', label: '256-bit SSL' },
                { icon: 'verified_user', label: 'PCI-DSS L1' },
                { icon: 'security', label: 'CBSL Compliant' },
                { icon: 'encrypted', label: 'AES-256 Encryption' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/90 shadow-sm text-center"
                >
                  <span className="material-symbols-outlined text-primary text-2xl">
                    {badge.icon}
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">
                    {badge.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 bg-surface">
        <div className="container-mhk max-w-4xl">
          {/* Intro card */}
          <FadeUp>
            <div className="bg-primary-fixed/20 border border-primary/20 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-2xl mt-0.5">
                  lock
                </span>
                <div>
                  <p className="font-bold text-primary">
                    Your Trust, Our Responsibility
                  </p>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                    We handle your personal information with the highest standards of
                    security and confidentiality. This policy outlines exactly what we
                    collect, why we collect it, and how we protect it.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Quick Navigation */}
          <FadeUp delay={0.1}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg mb-8">
              <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">
                  list
                </span>
                Table of Contents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-xs text-primary hover:underline flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">
                      chevron_right
                    </span>
                    {section.title}
                  </a>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Sections */}
          <div className="space-y-6">
            {SECTIONS.map((section, idx) => (
              <FadeUp key={section.id} delay={0.1 + idx * 0.03}>
                <div
                  id={section.id}
                  className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg scroll-mt-24"
                >
                  <h2 className="font-bold text-on-surface text-lg mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    {section.title.replace(/^\d+\.\s*/, '')}
                  </h2>

                  {typeof section.content === 'string' ? (
                    <p className="text-sm text-on-surface-variant leading-relaxed pl-10">
                      {section.content}
                    </p>
                  ) : (
                    <ul className="space-y-2 pl-10">
                      {section.content.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-on-surface-variant leading-relaxed"
                        >
                          <span className="material-symbols-outlined text-primary text-base mt-0.5 flex-shrink-0">
                            check_circle
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Contact footer */}
          <FadeUp delay={0.5}>
            <div className="mt-10 bg-tertiary-fixed/30 border border-tertiary-fixed rounded-2xl p-6 text-center">
              <span className="material-symbols-outlined text-tertiary text-3xl">
                privacy_tip
              </span>
              <h3 className="font-bold text-on-surface text-lg mt-2">
                Questions About Privacy?
              </h3>
              <p className="text-sm text-on-surface-variant mt-1 mb-4 max-w-lg mx-auto">
                If you have questions about your data or wish to exercise your
                privacy rights, contact our Data Protection Officer.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/contact" className="btn-primary inline-flex">
                  <span className="material-symbols-outlined text-lg">
                    mail
                  </span>
                  Contact DPO
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    gavel
                  </span>
                  Terms &amp; Conditions
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}