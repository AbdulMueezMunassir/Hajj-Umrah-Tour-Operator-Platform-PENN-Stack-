'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

export default function AboutPage() {
  const milestones = [
    {
      year: '2011',
      title: 'Company Founded',
      desc: 'MHK Travels begins its journey in Beruwala with a vision to serve Sri Lankan pilgrims.',
    },
    {
      year: '2015',
      title: 'MRCA Registration',
      desc: 'Officially registered with the Ministry of Muslim Religious and Cultural Affairs.',
    },
    {
      year: '2019',
      title: '10,000+ Pilgrims',
      desc: 'Crossed the milestone of 10,000 pilgrims served with Alhamdulillah.',
    },
    {
      year: '2023',
      title: 'Digital Transformation',
      desc: 'Launched our modern digital booking platform with PayHere payments.',
    },
    {
      year: '2026',
      title: 'Continued Excellence',
      desc: 'Serving 1447H/2026 season with 5-star packages and premium hospitality.',
    },
  ];

  const values = [
    {
      icon: 'verified',
      title: 'Trust',
      desc: 'Fully transparent pricing, MRCA licensed, and Central Bank-approved payment gateway.',
    },
    {
      icon: 'favorite',
      title: 'Care',
      desc: 'Every pilgrim is treated like family with dedicated support throughout their journey.',
    },
    {
      icon: 'workspace_premium',
      title: 'Excellence',
      desc: '5-star accommodations, direct flights, and premium hospitality at every step.',
    },
    {
      icon: 'psychology_alt',
      title: 'Guidance',
      desc: 'Certified Islamic scholars accompany every group for authentic spiritual mentorship.',
    },
  ];

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary-light/85 to-surface/10" />

        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none"
        />

        <div className="relative container-mhk py-20 lg:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold tracking-wide border border-white/10 mb-6"
          >
            <span className="material-symbols-outlined text-sm text-primary-fixed">
              info
            </span>
            About MHK Travels
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto"
          >
            Your Trusted Partner for{' '}
            <span className="text-tertiary-fixed underline decoration-tertiary-fixed/30 underline-offset-8">
              Sacred Journeys
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl mt-6 max-w-2xl mx-auto opacity-90"
          >
            Since 2011, MHK Travels has been Sri Lanka&apos;s trusted pilgrimage partner,
            serving over 10,000 pilgrims with devotion, excellence, and care.
          </motion.p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-16 lg:py-20">
        <div className="container-mhk">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <FadeUp>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80"
                  alt="Masjid al-Haram"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="badge bg-primary text-white mb-2">
                    Since 2011
                  </span>
                  <p className="font-bold text-lg">Serving Sri Lankan Pilgrims</p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold">
                  <span className="material-symbols-outlined text-sm">
                    waving_hand
                  </span>
                  Who We Are
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-on-surface">
                  Sri Lanka&apos;s Trusted Pilgrimage Partner
                </h2>

                <p className="text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface">MHK Travels</strong> is a
                  fully licensed Hajj &amp; Umrah tour operator based in Beruwala,
                  Sri Lanka. Since 2011, we have been dedicated to serving Sri
                  Lankan pilgrims with complete peace of mind throughout their
                  sacred journey.
                </p>

                <p className="text-on-surface-variant leading-relaxed">
                  Our mission is to make the sacred pilgrimage accessible,
                  comfortable, and spiritually enriching for every pilgrim
                  through transparent pricing, expert guidance, and heartfelt
                  hospitality.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { value: '15+', label: 'Years Experience' },
                    { value: '10,000+', label: 'Pilgrims Served' },
                    { value: 'MRCA', label: 'Licensed H-248' },
                    { value: '100%', label: 'Trust Rate' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-3 rounded-xl bg-surface-container-low"
                    >
                      <p className="text-xl font-bold text-primary">
                        {item.value}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold mt-0.5">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-16 bg-surface-container-low">
        <div className="container-mhk">
          <FadeUp>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-gold">
                Our Purpose
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-on-surface mt-1">
                Mission &amp; Vision
              </h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeUp delay={0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all h-full"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white shadow-md mb-5">
                  <span className="material-symbols-outlined text-2xl">
                    flag
                  </span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3">
                  Our Mission
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  To provide every Sri Lankan pilgrim with a comfortable,
                  spiritually fulfilling, and well-organized Hajj or Umrah
                  journey — grounded in trust, transparency, and Islamic values.
                </p>
              </motion.div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all h-full"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-tertiary to-tertiary-container flex items-center justify-center text-white shadow-md mb-5">
                  <span className="material-symbols-outlined text-2xl">
                    visibility
                  </span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3">
                  Our Vision
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  To be Sri Lanka&apos;s most trusted pilgrimage operator,
                  known for unparalleled hospitality, honest pricing, and
                  lifelong relationships with the families we serve.
                </p>
              </motion.div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-16 lg:py-20">
        <div className="container-mhk">
          <FadeUp>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-gold">
                Our Journey
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-on-surface mt-1">
                Milestones
              </h2>
            </div>
          </FadeUp>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-tertiary to-primary" />

            <StaggerContainer className="space-y-6">
              {milestones.map((m) => (
                <StaggerItem key={m.year}>
                  <div className="flex gap-6 items-start">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-xs shadow-lg ring-4 ring-white">
                        {m.year}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex-1 bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
                    >
                      <h3 className="font-bold text-on-surface text-base">
                        {m.title}
                      </h3>
                      <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                        {m.desc}
                      </p>
                    </motion.div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 bg-surface-container-low">
        <div className="container-mhk">
          <FadeUp>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-gold">
                Our Values
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-on-surface mt-1">
                What Sets Us Apart
              </h2>
            </div>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-center h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white shadow-md mx-auto mb-4">
                    <span className="material-symbols-outlined text-2xl">
                      {v.icon}
                    </span>
                  </div>
                  <h3 className="font-bold text-on-surface mb-2">{v.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {v.desc}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
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
                  Ready to Begin Your Sacred Journey?
                </h2>
                <p className="text-lg opacity-90 mt-3 max-w-2xl mx-auto">
                  Join thousands of Sri Lankan pilgrims who have trusted us with
                  their most sacred journeys.
                </p>
                <div className="flex flex-wrap gap-4 justify-center mt-6">
                  <Link
                    href="/umrah"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    <span className="material-symbols-outlined">
                      flight_takeoff
                    </span>
                    Explore Packages
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
                  >
                    <span className="material-symbols-outlined">
                      support_agent
                    </span>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}