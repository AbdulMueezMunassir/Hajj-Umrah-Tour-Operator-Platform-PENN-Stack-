'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));

    setSubmitted(true);
    setSending(false);
  };

  const contactMethods = [
    {
      icon: 'call',
      title: 'Call Us',
      value: '+94 11 234 5678',
      link: 'tel:+94112345678',
      desc: 'Mon-Sat, 9am - 6pm',
      color: 'from-primary to-primary-light',
    },
    {
      icon: 'chat',
      title: 'WhatsApp',
      value: '+94 776 290 290',
      link: 'https://wa.me/94776290290',
      desc: '24/7 Support',
      color: 'from-secondary to-secondary/70',
    },
    {
      icon: 'mail',
      title: 'Email Us',
      value: 'info@mhktravels.com',
      link: 'mailto:info@mhktravels.com',
      desc: 'Reply within 24h',
      color: 'from-tertiary to-tertiary-container',
    },
    {
      icon: 'location_on',
      title: 'Visit Office',
      value: 'Beruwala, Sri Lanka',
      link: '#map',
      desc: 'Galle Road, City Arcade',
      color: 'from-tertiary-fixed-dim to-tertiary',
    },
  ];

  const teamContacts = [
    {
      name: 'Al Hajj - Moulavi M.J.M Ghouse (Sharqi)',
      role: 'Pilgrimage Guide & Director',
      phone: '+94 776 290 290',
    },
    {
      name: 'Al Hajj M.G.M Mahir',
      role: 'Booking Coordinator',
      phone: '+94 775 487 367',
    },
    {
      name: 'Al Hajj M.G.M Mushfik',
      role: 'Booking Coordinator',
      phone: '+94 766 209 204',
    },
    {
      name: 'KSA Ground Office',
      role: 'Saudi Arabia Hotline',
      phone: '+966 53 341 0726',
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
              "url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80')",
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
              support_agent
            </span>
            We&apos;re Here to Help
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto"
          >
            How Can We{' '}
            <span className="text-tertiary-fixed underline decoration-tertiary-fixed/30 underline-offset-8">
              Help You?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl mt-6 max-w-2xl mx-auto opacity-90"
          >
            Reach out for bookings, inquiries, or guidance. Our pilgrimage
            experts respond within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* CONTACT METHODS */}
      <section className="py-16">
        <div className="container-mhk">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactMethods.map((method) => (
              <StaggerItem key={method.title}>
                <motion.a
                  href={method.link}
                  target={method.link.startsWith('http') ? '_blank' : undefined}
                  rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="block bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-center h-full"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white shadow-md mx-auto mb-4`}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {method.icon}
                    </span>
                  </div>
                  <h3 className="font-bold text-on-surface text-sm mb-1">
                    {method.title}
                  </h3>
                  <p className="text-sm font-semibold text-primary break-all">
                    {method.value}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-1">
                    {method.desc}
                  </p>
                </motion.a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="py-16 bg-surface-container-low">
        <div className="container-mhk">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <FadeUp>
                <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-3xl p-8 shadow-lg">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-4"
                      >
                        <span className="material-symbols-outlined text-4xl text-primary">
                          check_circle
                        </span>
                      </motion.div>
                      <h2 className="text-2xl font-bold text-on-surface mb-2">
                        Message Sent Successfully!
                      </h2>
                      <p className="text-sm text-on-surface-variant mb-6 max-w-md mx-auto">
                        Thank you for contacting MHK Travels. Our team will
                        reach out to you within 24 hours.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setForm({
                            name: '',
                            email: '',
                            phone: '',
                            subject: '',
                            message: '',
                          });
                        }}
                        className="btn-primary inline-flex"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-on-surface">
                          Send Us a Message
                        </h2>
                        <p className="text-sm text-on-surface-variant mt-1">
                          Fill in the form and we&apos;ll get back to you
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">
                              Your Name *
                            </label>
                            <div className="relative">
                              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant pointer-events-none">
                                person
                              </span>
                              <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) =>
                                  setForm({ ...form, name: e.target.value })
                                }
                                placeholder="Mohamed Rizwan"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">
                              Email Address *
                            </label>
                            <div className="relative">
                              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant pointer-events-none">
                                mail
                              </span>
                              <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) =>
                                  setForm({ ...form, email: e.target.value })
                                }
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">
                              Phone Number
                            </label>
                            <div className="relative">
                              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant pointer-events-none">
                                phone
                              </span>
                              <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) =>
                                  setForm({ ...form, phone: e.target.value })
                                }
                                placeholder="+94 77 123 4567"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">
                              Subject *
                            </label>
                            <div className="relative">
                              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant pointer-events-none">
                                subject
                              </span>
                              <input
                                type="text"
                                required
                                value={form.subject}
                                onChange={(e) =>
                                  setForm({ ...form, subject: e.target.value })
                                }
                                placeholder="Booking inquiry"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">
                            Message *
                          </label>
                          <textarea
                            required
                            value={form.message}
                            onChange={(e) =>
                              setForm({ ...form, message: e.target.value })
                            }
                            placeholder="Tell us about your inquiry..."
                            rows={5}
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all resize-none"
                          />
                        </div>

                        <motion.button
                          type="submit"
                          disabled={sending}
                          whileHover={{ scale: sending ? 1 : 1.02 }}
                          whileTap={{ scale: sending ? 1 : 0.98 }}
                          className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {sending ? (
                            <>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: 'linear',
                                }}
                                className="material-symbols-outlined text-lg"
                              >
                                refresh
                              </motion.span>
                              Sending...
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-lg">
                                send
                              </span>
                              Send Message
                            </>
                          )}
                        </motion.button>
                      </form>
                    </>
                  )}
                </div>
              </FadeUp>
            </div>

            {/* Team + Office */}
            <div className="space-y-6">
              <FadeUp delay={0.15}>
                <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      groups
                    </span>
                    Direct Contacts
                  </h3>

                  <div className="space-y-3">
                    {teamContacts.map((contact) => (
                      <div
                        key={contact.name}
                        className="p-3 rounded-xl bg-surface-container-low border border-surface-container"
                      >
                        <p className="font-semibold text-on-surface text-xs leading-snug">
                          {contact.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">
                          {contact.role}
                        </p>
                        <a
                          href={`tel:${contact.phone.replace(/\s/g, '')}`}
                          className="text-xs font-bold text-primary hover:underline mt-1 inline-block"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.2}>
                <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      schedule
                    </span>
                    Office Hours
                  </h3>

                  <div className="space-y-2 text-xs">
                    {[
                      { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                      { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
                      { day: 'Sunday', hours: 'By appointment' },
                      { day: 'WhatsApp', hours: '24/7 Available' },
                    ].map((row) => (
                      <div
                        key={row.day}
                        className="flex justify-between py-1.5 border-b border-surface-container last:border-0"
                      >
                        <span className="text-on-surface-variant">
                          {row.day}
                        </span>
                        <span className="font-semibold text-on-surface">
                          {row.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* MAP / OFFICE */}
      <section className="py-16" id="map">
        <div className="container-mhk">
          <FadeUp>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-3xl p-6 shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="order-2 lg:order-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">
                    Visit Us
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-on-surface mt-1 mb-4">
                    Head Office
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary mt-0.5">
                        location_on
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface">
                          MHK Travels (Pvt) Ltd
                        </p>
                        <p className="text-on-surface-variant text-xs">
                          #201 1/1, 1st Floor, City Arcade Building, Galle Road,
                          Beruwala, Sri Lanka
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary mt-0.5">
                        call
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface">
                          Hotline
                        </p>
                        <p className="text-on-surface-variant text-xs">
                          +94 11 234 5678 / +94 776 290 290
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary mt-0.5">
                        mail
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface">Email</p>
                        <p className="text-on-surface-variant text-xs">
                          info@mhktravels.com
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://maps.google.com/?q=Beruwala,Sri+Lanka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      open_in_new
                    </span>
                    Open in Google Maps
                  </a>
                </div>

                <div className="order-1 lg:order-2">
                  <div
                    className="w-full h-80 rounded-2xl bg-cover bg-center shadow-md"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80')",
                    }}
                  />
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}