'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  // General
  {
    id: 'g1',
    category: 'general',
    question: 'What is MHK Travels?',
    answer:
      'MHK Travels is a fully licensed Hajj & Umrah tour operator based in Beruwala, Sri Lanka, registered with the Ministry of Muslim Religious and Cultural Affairs (MRCA) under license H-248. We have been serving Sri Lankan pilgrims since 2011.',
  },
  {
    id: 'g2',
    category: 'general',
    question: 'Are you a government-approved operator?',
    answer:
      'Yes. We are officially registered with MRCA Sri Lanka (License #H-248) and are also compliant with the Saudi Ministry of Hajj & Umrah through the Nusuk portal for Hajj quota allotments.',
  },
  {
    id: 'g3',
    category: 'general',
    question: 'What languages do your staff speak?',
    answer:
      'Our team speaks Tamil, Sinhala, English, and Arabic. Our scholars and group leaders provide guidance in all four languages during the journey.',
  },

  // Hajj
  {
    id: 'h1',
    category: 'hajj',
    question: 'When is Hajj 1447H?',
    answer:
      'Hajj 1447H is expected in May-June 2027 (exact date depends on moon sighting). Our standard and VIP packages run for 25-28 days.',
  },
  {
    id: 'h2',
    category: 'hajj',
    question: 'What does VIP Maktab A include?',
    answer:
      'VIP Maktab A includes air-conditioned premium tents in Mina with private restrooms, 5-star Makkah accommodation (Fairmont Clock Tower), premium meals prepared by Sri Lankan chefs, dedicated doctor and nursing staff, and personal Islamic scholar guidance.',
  },
  {
    id: 'h3',
    category: 'hajj',
    question: 'Is Qurbani included in the package?',
    answer:
      'Qurbani (Dham) is included in our Standard and VIP Hajj packages. For Economy packages, Qurbani can be added as an optional extra.',
  },

  // Umrah
  {
    id: 'u1',
    category: 'umrah',
    question: 'When can I perform Umrah?',
    answer:
      'Umrah can be performed year-round except during the 5 days of Hajj (8-13 Dhul Hijjah). We operate monthly departures throughout the year.',
  },
  {
    id: 'u2',
    category: 'umrah',
    question: 'How long are your Umrah packages?',
    answer:
      'Our Umrah packages range from 7 days (express) to 14 days (luxury with Taif extension). Popular options are 11 days (5 nights Makkah + 5 nights Madinah) and 14 days.',
  },
  {
    id: 'u3',
    category: 'umrah',
    question: 'What is the best time for Umrah?',
    answer:
      'Ramadhan (especially last 10 nights), Rabi-ul-Awwal (school holidays), and December holidays are the most popular. September-October offer the best weather and value.',
  },

  // Booking
  {
    id: 'b1',
    category: 'booking',
    question: 'How do I book a package?',
    answer:
      'Simply browse our packages online, click "Book Now," add your traveller details, and pay the 20% advance online via PayHere. Our team will then contact you within 24 hours to complete documentation.',
  },
  {
    id: 'b2',
    category: 'booking',
    question: 'How many pilgrims can I book for?',
    answer:
      'You can book 1-10 pilgrims in a single booking. For groups larger than 10 (family/friends groups), please contact us directly for a custom quote.',
  },
  {
    id: 'b3',
    category: 'booking',
    question: 'Can I book for someone else?',
    answer:
      'Yes, you can book on behalf of family members. The lead pilgrim (first traveller) acts as the primary contact. Ensure all passport details match exactly.',
  },

  // Payment
  {
    id: 'p1',
    category: 'payment',
    question: 'How does the 20% advance work?',
    answer:
      'The 20% advance secures your booking, flight seats, and hotel rooms. Remaining 80% balance is due 30 days before departure or after visa approval.',
  },
  {
    id: 'p2',
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit/debit cards (Visa, MasterCard, AMEX), FriMi, Genie, LankaPay, Sampath Vishwa, Commercial Bank IPG, and cash/bank transfers at our Colombo office.',
  },
  {
    id: 'p3',
    category: 'payment',
    question: 'Is my payment secure?',
    answer:
      'Absolutely. All online payments are processed through PayHere, Sri Lanka\'s Central Bank-approved payment gateway with 256-bit SSL encryption and PCI-DSS Level 1 compliance.',
  },
  {
    id: 'p4',
    category: 'payment',
    question: 'Can I pay in installments?',
    answer:
      'Yes. After the 20% advance, the remaining balance can be paid in 2-3 flexible installments as long as all dues are cleared before visa issuance.',
  },

  // Visa
  {
    id: 'v1',
    category: 'visa',
    question: 'Do you handle visa processing?',
    answer:
      'Yes. We provide complete visa assistance — Saudi biometrics enrollment (Saudi Bio App), Nusuk registration, VFS Tasheel appointments in Colombo, and Saudi Ministry documentation.',
  },
  {
    id: 'v2',
    category: 'visa',
    question: 'How long does visa take?',
    answer:
      'Saudi Umrah visas are typically issued within 48-72 hours after biometrics completion. Hajj visas are part of the Saudi Ministry quota system and take 2-3 weeks.',
  },
  {
    id: 'v3',
    category: 'visa',
    question: 'What if my visa is rejected?',
    answer:
      'In the rare case of visa rejection by Saudi authorities, we provide a 100% refund of all payments (per SLTDA guidelines). This is covered in our terms & conditions.',
  },

  // Hotels
  {
    id: 'ho1',
    category: 'hotels',
    question: 'How close are your hotels to Haram?',
    answer:
      'Our 5-star packages feature hotels within 0-150m of Haram (Makkah Clock Tower, Fairmont) and 50-200m from Masjid an-Nabawi in Madinah. Standard packages use 3-4 star hotels with shuttle service.',
  },
  {
    id: 'ho2',
    category: 'hotels',
    question: 'Can I choose specific hotels?',
    answer:
      'Yes. Contact us to customize your hotel selection. Upgrades to Premium, VIP, and Suite categories are available on request.',
  },
  {
    id: 'ho3',
    category: 'hotels',
    question: 'What room types are available?',
    answer:
      'We offer Double sharing, Triple sharing, Quad sharing, and private Single rooms. Family interconnected rooms are available at select hotels.',
  },

  // Transportation
  {
    id: 't1',
    category: 'transportation',
    question: 'Are flights included?',
    answer:
      'Yes, all our packages include direct return air tickets from Colombo (BIA) via SriLankan Airlines or Saudia. Business class upgrades available on request.',
  },
  {
    id: 't2',
    category: 'transportation',
    question: 'How do you transfer between Makkah and Madinah?',
    answer:
      'Our premium packages include the Haramain High-Speed Bullet Train (2-hour journey in business class). Standard packages use luxury air-conditioned private buses.',
  },
  {
    id: 't3',
    category: 'transportation',
    question: 'Do you provide airport transfers?',
    answer:
      'Yes. All packages include meet-and-assist at Colombo BIA and private transfers from Jeddah/Madinah airports to your hotels.',
  },

  // Cancellation
  {
    id: 'c1',
    category: 'cancellation',
    question: 'Can I cancel my booking?',
    answer:
      'Yes. Cancellations 60+ days before departure get 90% refund of advance. 30-60 days get 50% refund. Less than 30 days are non-refundable except for visa refusal cases.',
  },
  {
    id: 'c2',
    category: 'cancellation',
    question: 'How long do refunds take?',
    answer:
      'Refunds are processed within 7-14 business days via the same payment method used for booking (PayHere, bank transfer, etc.).',
  },
  {
    id: 'c3',
    category: 'cancellation',
    question: 'What if MHK cancels the journey?',
    answer:
      'In the extremely unlikely event we cancel a departure, you will receive a 100% refund or the option to transfer to another package at no extra cost.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Questions', icon: 'help' },
  { id: 'general', label: 'General', icon: 'info' },
  { id: 'hajj', label: 'Hajj', icon: 'mosque' },
  { id: 'umrah', label: 'Umrah', icon: 'flight_takeoff' },
  { id: 'booking', label: 'Booking', icon: 'event_available' },
  { id: 'payment', label: 'Payment', icon: 'payments' },
  { id: 'visa', label: 'Visa', icon: 'badge' },
  { id: 'hotels', label: 'Hotels', icon: 'hotel' },
  { id: 'transportation', label: 'Transport', icon: 'directions_bus' },
  { id: 'cancellation', label: 'Cancellation', icon: 'cancel' },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...FAQS];

    if (activeCategory !== 'all') {
      result = result.filter((f) => f.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: FAQS.length };
    CATEGORIES.forEach((cat) => {
      if (cat.id === 'all') return;
      c[cat.id] = FAQS.filter((f) => f.category === cat.id).length;
    });
    return c;
  }, []);

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1537444532052-02afbc2b5e77?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary-light/85 to-surface/10" />

        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none"
        />

        <div className="relative container-mhk py-20 lg:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold tracking-wide border border-white/10 mb-6"
          >
            <span className="material-symbols-outlined text-sm text-primary-fixed">
              quiz
            </span>
            Frequently Asked Questions
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto"
          >
            Got Questions?{' '}
            <span className="text-tertiary-fixed underline decoration-tertiary-fixed/30 underline-offset-8">
              We Have Answers
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl mt-6 max-w-2xl mx-auto opacity-90"
          >
            Everything you need to know about Hajj, Umrah, booking, payment, and
            our services.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="relative max-w-xl mx-auto mt-8"
          >
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search for a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-md text-on-surface text-sm font-medium shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
            />
          </motion.div>
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <section className="py-8 bg-surface">
        <div className="container-mhk">
          <FadeUp>
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map((cat) => {
                const count = counts[cat.id] || 0;
                const isActive = activeCategory === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white/70 backdrop-blur-sm border border-white/90 text-on-surface-variant hover:text-on-surface hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {cat.icon}
                    </span>
                    {cat.label}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20'
                          : 'bg-surface-container-high'
                      }`}
                    >
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="py-12 bg-surface">
        <div className="container-mhk max-w-4xl">
          {filtered.length === 0 ? (
            <FadeUp>
              <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
                <span className="material-symbols-outlined text-6xl text-outline">
                  search_off
                </span>
                <h3 className="text-xl font-bold text-on-surface mt-4">
                  No questions found
                </h3>
                <p className="text-sm text-on-surface-variant mt-1 mb-6">
                  Try a different search or category
                </p>
                <Link href="/contact" className="btn-primary inline-flex">
                  <span className="material-symbols-outlined text-lg">
                    support_agent
                  </span>
                  Ask us directly
                </Link>
              </div>
            </FadeUp>
          ) : (
            <StaggerContainer className="space-y-3">
              {filtered.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <StaggerItem key={faq.id}>
                    <motion.div
                      className={`bg-white/70 backdrop-blur-xl border rounded-2xl shadow-lg overflow-hidden transition-all ${
                        isOpen ? 'border-primary/40' : 'border-white/90'
                      }`}
                    >
                      <button
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-surface-container-low/50 transition-colors"
                      >
                        <span className="flex items-start gap-3 flex-1 min-w-0">
                          <span
                            className={`material-symbols-outlined text-lg mt-0.5 flex-shrink-0 transition-colors ${
                              isOpen ? 'text-primary' : 'text-on-surface-variant'
                            }`}
                          >
                            help
                          </span>
                          <span className="font-semibold text-on-surface text-sm leading-relaxed">
                            {faq.question}
                          </span>
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className={`material-symbols-outlined text-lg flex-shrink-0 transition-colors ${
                            isOpen ? 'text-primary' : 'text-on-surface-variant'
                          }`}
                        >
                          expand_more
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1 border-t border-surface-container">
                              <p className="text-sm text-on-surface-variant leading-relaxed pl-8">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-surface-container-low">
        <div className="container-mhk">
          <FadeUp>
            <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-light rounded-3xl p-10 lg:p-14 text-white text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/40 blur-3xl"
              />
              <div className="relative">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Still Have Questions?
                </h2>
                <p className="text-lg opacity-90 mt-3 max-w-2xl mx-auto">
                  Our pilgrimage experts are ready to answer any additional
                  questions you may have.
                </p>
                <div className="flex flex-wrap gap-4 justify-center mt-6">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    <span className="material-symbols-outlined">
                      support_agent
                    </span>
                    Contact Us
                  </Link>
                  <a
                    href="https://wa.me/94776290290"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
                  >
                    <span className="material-symbols-outlined">chat</span>
                    WhatsApp Now
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}