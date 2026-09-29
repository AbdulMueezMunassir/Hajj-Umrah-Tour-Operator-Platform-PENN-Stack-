'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeUp } from '@/components/ui/MotionDiv';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    'company' | 'contact' | 'booking' | 'payment' | 'email'
  >('company');

  // Company settings
  const [company, setCompany] = useState({
    name: 'MHK Travels (Pvt) Ltd',
    tagline: 'Hajj & Umrah Tour Operators',
    license: 'H-248',
    about:
      "Sri Lanka's trusted partner for spiritual journeys to the holy sanctuaries of Makkah al-Mukarramah and Al-Madinah al-Munawwarah.",
  });

  // Contact
  const [contact, setContact] = useState({
    address: '#201 1/1, City Arcade, Galle Road, Beruwala, Sri Lanka',
    hotline: '+94 11 234 5678',
    whatsapp: '+94 776 290 290',
    email: 'info@mhktravels.com',
    ksa: '+966 53 341 0726',
  });

  // Booking
  const [booking, setBooking] = useState({
    advancePercent: 20,
    allowBooking: true,
    autoConfirm: false,
    maxTravellers: 10,
  });

  // Payment
  const [payment, setPayment] = useState({
    merchantId: '1238014',
    environment: 'sandbox',
    currency: 'LKR',
  });

  // Email
  const [email, setEmail] = useState({
    senderName: 'MHK Travels',
    senderEmail: 'noreply@mhktravels.com',
    replyTo: 'info@mhktravels.com',
    sendConfirmations: true,
    sendReminders: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: 'business' },
    { id: 'contact', label: 'Contact', icon: 'contact_phone' },
    { id: 'booking', label: 'Booking', icon: 'event_available' },
    { id: 'payment', label: 'Payment', icon: 'payments' },
    { id: 'email', label: 'Email', icon: 'mail' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="relative overflow-hidden bg-gradient-to-br from-tertiary via-tertiary-container to-primary rounded-3xl p-6 lg:p-8 text-white shadow-xl">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/20 blur-3xl pointer-events-none"
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/20 mb-3">
              <span className="material-symbols-outlined text-xs">
                settings
              </span>
              System Settings
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
            <p className="text-sm opacity-90 mt-1">
              Configure platform preferences and integrations
            </p>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <FadeUp delay={0.1}>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-2 shadow-lg">
            <ul className="space-y-0.5">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-tertiary text-white shadow-md'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>

        {/* Content */}
        <div className="lg:col-span-3">
          <FadeUp delay={0.15}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg space-y-4">
              {/* Company Settings */}
              {activeTab === 'company' && (
                <>
                  <h2 className="font-bold text-on-surface flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-tertiary">
                      business
                    </span>
                    Company Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={company.name}
                        onChange={(e) =>
                          setCompany({ ...company, name: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={company.tagline}
                        onChange={(e) =>
                          setCompany({ ...company, tagline: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                        MRCA License Number
                      </label>
                      <input
                        type="text"
                        value={company.license}
                        onChange={(e) =>
                          setCompany({ ...company, license: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                        About Company
                      </label>
                      <textarea
                        value={company.about}
                        onChange={(e) =>
                          setCompany({ ...company, about: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm resize-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Contact Settings */}
              {activeTab === 'contact' && (
                <>
                  <h2 className="font-bold text-on-surface flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-tertiary">
                      contact_phone
                    </span>
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    {Object.entries(contact).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            setContact({ ...contact, [key]: e.target.value })
                          }
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Booking Settings */}
              {activeTab === 'booking' && (
                <>
                  <h2 className="font-bold text-on-surface flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-tertiary">
                      event_available
                    </span>
                    Booking Settings
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                        Default Advance Percentage (%)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={booking.advancePercent}
                        onChange={(e) =>
                          setBooking({
                            ...booking,
                            advancePercent: parseInt(e.target.value) || 20,
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                      />
                      <p className="text-[10px] text-on-surface-variant mt-1">
                        Standard advance payment (typically 20%)
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                        Max Travellers Per Booking
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={booking.maxTravellers}
                        onChange={(e) =>
                          setBooking({
                            ...booking,
                            maxTravellers: parseInt(e.target.value) || 10,
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      {[
                        {
                          key: 'allowBooking',
                          label: 'Allow New Bookings',
                          desc: 'Enable or disable new booking submissions',
                        },
                        {
                          key: 'autoConfirm',
                          label: 'Auto-Confirm Bookings',
                          desc: 'Automatically confirm bookings on advance payment',
                        },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-on-surface text-sm">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-on-surface-variant">
                              {item.desc}
                            </p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={(booking as any)[item.key]}
                              onChange={(e) =>
                                setBooking({
                                  ...booking,
                                  [item.key]: e.target.checked,
                                })
                              }
                              className="absolute opacity-0 pointer-events-none"
                            />
                            <div
                              className={`w-11 h-6 rounded-full transition-all ${
                                (booking as any)[item.key]
                                  ? 'bg-tertiary'
                                  : 'bg-surface-container-high'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full bg-white shadow-md transition-all mt-0.5 ${
                                  (booking as any)[item.key]
                                    ? 'translate-x-5.5 ml-5'
                                    : 'ml-0.5'
                                }`}
                              />
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <>
                  <h2 className="font-bold text-on-surface flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-tertiary">
                      payments
                    </span>
                    Payment Gateway (PayHere)
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-tertiary-fixed/20 border border-tertiary-fixed">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-tertiary text-lg mt-0.5">
                          info
                        </span>
                        <div>
                          <p className="font-bold text-tertiary text-sm">
                            PayHere Sandbox Environment
                          </p>
                          <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                            Payments are currently processed in sandbox mode.
                            Switch to live mode when ready to accept real
                            payments.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                        Merchant ID
                      </label>
                      <input
                        type="text"
                        value={payment.merchantId}
                        onChange={(e) =>
                          setPayment({ ...payment, merchantId: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                          Environment
                        </label>
                        <select
                          value={payment.environment}
                          onChange={(e) =>
                            setPayment({
                              ...payment,
                              environment: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                        >
                          <option value="sandbox">Sandbox (Testing)</option>
                          <option value="live">Live (Production)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                          Currency
                        </label>
                        <select
                          value={payment.currency}
                          onChange={(e) =>
                            setPayment({ ...payment, currency: e.target.value })
                          }
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                        >
                          <option value="LKR">LKR (Sri Lankan Rupee)</option>
                          <option value="USD">USD (US Dollar)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <>
                  <h2 className="font-bold text-on-surface flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-tertiary">
                      mail
                    </span>
                    Email Settings
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                        Sender Name
                      </label>
                      <input
                        type="text"
                        value={email.senderName}
                        onChange={(e) =>
                          setEmail({ ...email, senderName: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                        Sender Email
                      </label>
                      <input
                        type="email"
                        value={email.senderEmail}
                        onChange={(e) =>
                          setEmail({ ...email, senderEmail: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                        Reply-To Email
                      </label>
                      <input
                        type="email"
                        value={email.replyTo}
                        onChange={(e) =>
                          setEmail({ ...email, replyTo: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      {[
                        {
                          key: 'sendConfirmations',
                          label: 'Send Booking Confirmations',
                          desc: 'Automatically email booking confirmations',
                        },
                        {
                          key: 'sendReminders',
                          label: 'Send Payment Reminders',
                          desc: 'Email reminders for outstanding balances',
                        },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-on-surface text-sm">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-on-surface-variant">
                              {item.desc}
                            </p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={(email as any)[item.key]}
                              onChange={(e) =>
                                setEmail({
                                  ...email,
                                  [item.key]: e.target.checked,
                                })
                              }
                              className="absolute opacity-0 pointer-events-none"
                            />
                            <div
                              className={`w-11 h-6 rounded-full transition-all ${
                                (email as any)[item.key]
                                  ? 'bg-tertiary'
                                  : 'bg-surface-container-high'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full bg-white shadow-md transition-all mt-0.5 ${
                                  (email as any)[item.key]
                                    ? 'translate-x-5.5 ml-5'
                                    : 'ml-0.5'
                                }`}
                              />
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Save Button */}
              <div className="pt-4 border-t border-surface-container flex items-center justify-between gap-3">
                <p className="text-[10px] text-on-surface-variant">
                  Changes are applied immediately
                </p>
                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all ${
                    saved
                      ? 'bg-primary text-white'
                      : 'bg-tertiary text-white hover:bg-tertiary-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {saved ? 'check_circle' : 'save'}
                  </span>
                  {saved ? 'Saved!' : 'Save Changes'}
                </motion.button>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}