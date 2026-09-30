'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeUp } from '@/components/ui/MotionDiv';

const SECTIONS = [
  {
    id: 'introduction',
    title: '1. Introduction',
    content:
      'Welcome to MHK Travels (Pvt) Ltd. These Terms & Conditions govern your use of our website and services, including the booking of Hajj and Umrah packages. By accessing our platform or making a booking, you agree to these terms.',
  },
  {
    id: 'booking',
    title: '2. Booking Terms',
    content: [
      'All bookings are subject to availability and confirmation by MHK Travels.',
      'A booking is only confirmed upon receipt of the 20% advance payment.',
      'The remaining 80% balance must be paid at least 30 days before departure or upon visa issuance, whichever comes first.',
      'Passenger names must match the passports provided. Name changes after ticketing may incur additional airline fees.',
      'MHK Travels reserves the right to decline any booking without providing a reason.',
    ],
  },
  {
    id: 'payment',
    title: '3. Payment Terms',
    content: [
      'All prices are quoted in Sri Lankan Rupees (LKR) unless otherwise stated.',
      'We accept payments via PayHere gateway (Visa, MasterCard, AMEX, FriMi, Genie, Sampath Vishwa) and direct bank transfers.',
      'Payments are processed securely through PayHere, a Central Bank of Sri Lanka approved payment gateway.',
      'Installments after the 20% advance are permitted but must be cleared before visa submission.',
      'Any bank charges or currency conversion fees are the responsibility of the customer.',
    ],
  },
  {
    id: 'cancellation',
    title: '4. Cancellation Policy',
    content: [
      'Cancellations 60+ days before departure: 90% refund of advance payment.',
      'Cancellations 30-60 days before departure: 50% refund of advance payment.',
      'Cancellations less than 30 days before departure: No refund (except visa refusal cases).',
      'Cancellations after visa issuance: No refund, as visa and airline seats are non-transferable.',
      'All cancellation requests must be submitted in writing via email to info@mhktravels.com.',
    ],
  },
  {
    id: 'refunds',
    title: '5. Refund Policy',
    content: [
      '100% refund if MHK Travels cancels a confirmed departure due to unforeseen circumstances.',
      '100% refund if Saudi authorities reject your Umrah or Hajj visa.',
      'Refunds are processed within 7-14 business days via the same payment method used for booking.',
      'Refunds are calculated excluding non-refundable third-party charges (airline cancellation fees, hotel deposits, visa fees already paid to Saudi authorities).',
      'MHK Travels complies with SLTDA (Sri Lanka Tourism Development Authority) refund guidelines.',
    ],
  },
  {
    id: 'passports',
    title: '6. Travel Documents',
    content: [
      'Pilgrims must hold a valid Sri Lankan passport with at least 6 months validity from the date of departure.',
      'Passports must have at least 2 blank pages for visa stamping.',
      'It is the pilgrim\'s responsibility to ensure all travel documents are valid and accurate.',
      'MHK Travels is not liable for denied boarding due to invalid or expired passports.',
      'Biometrics enrollment (Saudi Bio App) is mandatory and must be completed prior to visa submission.',
    ],
  },
  {
    id: 'responsibilities',
    title: '7. Pilgrim Responsibilities',
    content: [
      'Pilgrims must comply with Saudi Arabian laws and customs during their stay.',
      'Any damage to hotel property or public facilities is the pilgrim\'s responsibility.',
      'Pilgrims must attend pre-departure briefings arranged by MHK Travels.',
      'Pilgrims should disclose any medical conditions, dietary restrictions, or special needs at time of booking.',
      'MHK Travels is not responsible for personal items lost during the journey.',
    ],
  },
  {
    id: 'liability',
    title: '8. Limitation of Liability',
    content: [
      'MHK Travels acts as an agent for airlines, hotels, and transport providers and is not liable for their independent actions.',
      'We are not liable for delays, cancellations, or schedule changes caused by airlines, weather, or Saudi authorities.',
      'Our maximum liability for any claim is limited to the total amount paid by the customer.',
      'Pilgrims are strongly advised to purchase comprehensive travel insurance.',
    ],
  },
  {
    id: 'medical',
    title: '9. Medical & Health Requirements',
    content: [
      'Meningitis ACWY vaccination is mandatory for all pilgrims as required by Saudi authorities.',
      'Additional vaccinations (COVID-19, influenza) may be required based on prevailing regulations.',
      'Elderly or medically-compromised pilgrims must obtain fitness certificates from qualified physicians.',
      'MHK Travels arranges doctors for groups but is not liable for independent medical emergencies.',
    ],
  },
  {
    id: 'changes',
    title: '10. Changes to Terms',
    content:
      'MHK Travels reserves the right to modify these Terms & Conditions at any time. Changes will be effective upon posting to our website. Continued use of our services constitutes acceptance of updated terms. For material changes affecting existing bookings, we will notify affected customers directly.',
  },
  {
    id: 'governing-law',
    title: '11. Governing Law & Dispute Resolution',
    content: [
      'These Terms & Conditions are governed by the laws of Sri Lanka.',
      'Any disputes shall be resolved through good-faith negotiation first.',
      'Unresolved disputes will be subject to the exclusive jurisdiction of the courts of Colombo, Sri Lanka.',
      'MHK Travels complies with the regulatory framework of MRCA (Ministry of Muslim Religious and Cultural Affairs).',
    ],
  },
];

export default function TermsPage() {
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
              gavel
            </span>
            Legal
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto"
          >
            Terms &amp; Conditions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg mt-6 max-w-2xl mx-auto opacity-90"
          >
            Please read these terms carefully before making a booking
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

      {/* CONTENT */}
      <section className="py-16">
        <div className="container-mhk max-w-4xl">
          {/* Intro card */}
          <FadeUp>
            <div className="bg-primary-fixed/20 border border-primary/20 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-2xl mt-0.5">
                  info
                </span>
                <div>
                  <p className="font-bold text-primary">
                    Important Notice
                  </p>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                    These Terms &amp; Conditions form a legally binding agreement between you
                    and MHK Travels (Pvt) Ltd. By making a booking or using our services,
                    you acknowledge that you have read, understood, and agreed to these terms.
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
                contact_support
              </span>
              <h3 className="font-bold text-on-surface text-lg mt-2">
                Questions About Our Terms?
              </h3>
              <p className="text-sm text-on-surface-variant mt-1 mb-4 max-w-lg mx-auto">
                If you have any questions or concerns about these Terms &amp; Conditions,
                please don't hesitate to contact us.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/contact" className="btn-primary inline-flex">
                  <span className="material-symbols-outlined text-lg">
                    mail
                  </span>
                  Contact Us
                </Link>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    shield
                  </span>
                  Privacy Policy
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}