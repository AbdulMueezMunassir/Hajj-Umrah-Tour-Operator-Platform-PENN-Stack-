'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

export default function ServicesPage() {
  const services = [
    {
      icon: 'mosque',
      title: 'Hajj Packages',
      desc: 'Complete Hajj arrangements with VIP Maktab, 5-star accommodations, and certified scholars accompanying every group.',
      features: [
        'Direct Colombo-Jeddah flights',
        'Nusuk visa processing',
        'Mina & Arafat premium camps',
        'Qurbani arrangement',
      ],
      href: '/hajj',
      color: 'from-tertiary to-tertiary-container',
    },
    {
      icon: 'flight_takeoff',
      title: 'Umrah Packages',
      desc: 'Year-round Umrah journeys with flexible dates, premium hotels near Haram, and direct flights from Sri Lanka.',
      features: [
        'Multiple departure dates',
        '5-star Clock Tower options',
        'Full board Sri Lankan meals',
        'Historical Ziyarat included',
      ],
      href: '/umrah',
      color: 'from-primary to-primary-light',
    },
    {
      icon: 'badge',
      title: 'Visa Assistance',
      desc: 'End-to-end visa processing — biometrics, Nusuk registration, and Saudi Ministry documentation handled by experts.',
      features: [
        'Saudi Bio App assistance',
        'Nusuk registration',
        'VFS Tasheel appointment',
        'Fast-track processing',
      ],
      href: '/contact',
      color: 'from-secondary to-secondary/70',
    },
    {
      icon: 'hotel',
      title: 'Hotel Accommodation',
      desc: 'Curated 5-star and premium 4-star hotels within walking distance of Haram in both Makkah and Madinah.',
      features: [
        'Courtyard-front suites',
        'Family interconnected rooms',
        'Wheelchair-accessible options',
        'Multi-night flexibility',
      ],
      href: '/contact',
      color: 'from-tertiary-fixed-dim to-tertiary',
    },
    {
      icon: 'directions_bus',
      title: 'Airport Transfers',
      desc: 'Private air-conditioned coaches and VIP cars for comfortable transfers between airports, hotels, and Haram.',
      features: [
        'Meet-and-assist at BIA',
        'Private SUV options',
        'Luxury highway coaches',
        '24/7 availability',
      ],
      href: '/contact',
      color: 'from-primary to-secondary',
    },
    {
      icon: 'travel_explore',
      title: 'Historical Ziyarat',
      desc: 'Guided tours to significant Islamic sites in Makkah, Madinah, and Taif with expert historical commentary.',
      features: [
        'Cave of Hira & Thawr',
        'Masjid Quba & Qiblatayn',
        'Mount Uhud & Martyrs',
        'Taif rose gardens',
      ],
      href: '/contact',
      color: 'from-tertiary to-primary',
    },
    {
      icon: 'school',
      title: 'Pilgrim Guidance',
      desc: 'Certified Muftis and Islamic scholars accompany groups to teach rituals, answer Fiqh questions, and lead prayers.',
      features: [
        'Step-by-step ritual training',
        'Daily Fiqh Q&A sessions',
        'Tamil/Sinhala/English',
        'Pre-departure seminars',
      ],
      href: '/contact',
      color: 'from-secondary to-primary',
    },
    {
      icon: 'support_agent',
      title: '24/7 Travel Support',
      desc: 'Dedicated Colombo-based support team available round-the-clock for any queries, emergencies, or assistance.',
      features: [
        'WhatsApp hotline',
        'KSA emergency contact',
        'Colombo office support',
        'Dedicated coordinator',
      ],
      href: '/contact',
      color: 'from-primary-fixed-dim to-secondary',
    },
  ];

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
              verified
            </span>
            Complete Pilgrimage Services
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto"
          >
            Everything You Need for a{' '}
            <span className="text-tertiary-fixed underline decoration-tertiary-fixed/30 underline-offset-8">
              Sacred Journey
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl mt-6 max-w-2xl mx-auto opacity-90"
          >
            From visa processing to premium accommodations, guided Ziyarat, and
            24/7 support — we handle every detail of your pilgrimage.
          </motion.p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-16 lg:py-20">
        <div className="container-mhk">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <StaggerItem key={service.title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all h-full flex flex-col"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-md mb-4`}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {service.icon}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-on-surface mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4 flex-1">
                    {service.desc}
                  </p>

                  <ul className="space-y-1.5 mb-5">
                    {service.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                          check_circle
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    Learn More
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </Link>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-16 bg-surface-container-low">
        <div className="container-mhk">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <FadeUp>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80"
                  alt="Masjid al-Haram"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge bg-tertiary text-white">
                      MRCA H-248
                    </span>
                    <span className="badge bg-white/20 backdrop-blur-sm text-white">
                      Licensed
                    </span>
                  </div>
                  <p className="font-bold text-xl">
                    Trusted by 10,000+ Sri Lankan Pilgrims
                  </p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold font-label-sm text-label-sm uppercase tracking-wider font-bold">
                  <span className="material-symbols-outlined text-sm">
                    workspace_premium
                  </span>
                  Complete Pilgrimage Solutions
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-on-surface">
                  Why Choose MHK Travels Services?
                </h2>

                <p className="text-on-surface-variant leading-relaxed">
                  We don&apos;t just book your trip — we curate every moment of
                  your sacred journey with attention to spiritual detail,
                  comfort, and hospitality.
                </p>

                <div className="space-y-3">
                  {[
                    {
                      icon: 'verified_user',
                      title: 'Fully Licensed & Insured',
                      desc: 'MRCA registered with CBSL-compliant payment processing',
                    },
                    {
                      icon: 'support_agent',
                      title: 'End-to-End Assistance',
                      desc: 'From visa to return — every step handled for you',
                    },
                    {
                      icon: 'health_and_safety',
                      title: 'Medical Support',
                      desc: 'Onboard physicians and 24/7 emergency coordination',
                    },
                    {
                      icon: 'language',
                      title: 'Multilingual Guides',
                      desc: 'Tamil, Sinhala & English-speaking scholars throughout',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/90"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-lg">
                          {item.icon}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">
                          {item.title}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container-mhk">
          <FadeUp>
            <div className="relative overflow-hidden bg-gradient-to-r from-tertiary via-tertiary-container to-primary rounded-3xl p-10 lg:p-14 text-white text-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/30 blur-3xl"
              />
              <div className="relative">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Have Questions About Our Services?
                </h2>
                <p className="text-lg opacity-90 mt-3 max-w-2xl mx-auto">
                  Our pilgrimage experts are ready to help you plan the perfect
                  sacred journey.
                </p>
                <div className="flex flex-wrap gap-4 justify-center mt-6">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-tertiary font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    <span className="material-symbols-outlined">call</span>
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