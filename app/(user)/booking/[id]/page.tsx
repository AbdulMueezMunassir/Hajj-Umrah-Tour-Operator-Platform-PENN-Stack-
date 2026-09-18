'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { packageAPI, bookingAPI } from '@/lib/api';
import { Package, Traveller } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp } from '@/components/ui/MotionDiv';

export default function BookingFormPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [travellers, setTravellers] = useState<Traveller[]>([
    {
      fullName: '',
      passportNumber: '',
      dateOfBirth: '',
      gender: 'Male',
      relationship: 'Self',
      nic: '',
      phone: '',
    },
  ]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/booking/${params.id}`);
    }
  }, [authLoading, isAuthenticated, router, params.id]);

  useEffect(() => {
    const fetchPkg = async () => {
      if (!params.id) return;
      try {
        const res = await packageAPI.get(params.id as string);
        setPkg(res.data.data.package);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Package not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPkg();
  }, [params.id]);

  const addTraveller = () => {
    setTravellers([
      ...travellers,
      {
        fullName: '',
        passportNumber: '',
        dateOfBirth: '',
        gender: 'Male',
        relationship: 'Family',
        nic: '',
        phone: '',
      },
    ]);
  };

  const removeTraveller = (i: number) => {
    if (travellers.length <= 1) return;
    setTravellers(travellers.filter((_, idx) => idx !== i));
  };

  const updateTraveller = (
    i: number,
    field: keyof Traveller,
    value: string
  ) => {
    const updated = [...travellers];
    updated[i] = { ...updated[i], [field]: value };
    setTravellers(updated);
  };

  const handleSubmit = async () => {
    if (!pkg) return;

    for (const t of travellers) {
      if (!t.fullName || !t.passportNumber || !t.dateOfBirth || !t.gender) {
        setError('Please fill in all required traveller fields');
        return;
      }
    }

    if (!agreeTerms) {
      setError('Please agree to the terms & conditions');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await bookingAPI.create({
        packageId: pkg.id,
        travellers: travellers.map((t) => ({
          fullName: t.fullName,
          passportNumber: t.passportNumber,
          dateOfBirth: t.dateOfBirth,
          gender: t.gender,
          relationship: t.relationship,
          nic: t.nic,
          phone: t.phone,
        })),
      });

      const bookingId = res.data.data.booking.id;
      window.location.href = `/bookings/${bookingId}`;
      
      router.push(`/bookings/${bookingId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) return <Skeleton />;

  if (!pkg) {
    return (
      <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
        <span className="material-symbols-outlined text-6xl text-error">
          error
        </span>
        <h2 className="text-xl font-bold text-on-surface mt-4">
          {error || 'Package Not Found'}
        </h2>
        <Link href="/umrah" className="btn-primary inline-flex mt-6">
          Browse Packages
        </Link>
      </div>
    );
  }

  const advancePercent = pkg.advancePercent || 20;
  const totalAmount = pkg.totalPrice * travellers.length;
  const advanceAmount = Math.round((totalAmount * advancePercent) / 100);
  const balanceAmount = totalAmount - advanceAmount;

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-on-surface">
            Complete Your Booking
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Add traveller details to secure your sacred journey
          </p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-error-container text-on-error-container text-sm flex items-start gap-2"
            >
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{error}</span>
            </motion.div>
          )}

          <FadeUp delay={0.1}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    group
                  </span>
                  Travellers ({travellers.length})
                </h2>
                <button
                  onClick={addTraveller}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Traveller
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {travellers.map((t, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-xl bg-surface-container-low border border-surface-container"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-on-surface">
                            {idx === 0 ? 'Lead Pilgrim' : `Traveller ${idx + 1}`}
                          </span>
                        </div>
                        {idx > 0 && (
                          <button
                            onClick={() => removeTraveller(idx)}
                            className="text-error hover:bg-error-container p-1 rounded transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">
                              delete
                            </span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                            Full Name (as in passport) *
                          </label>
                          <input
                            type="text"
                            value={t.fullName}
                            onChange={(e) =>
                              updateTraveller(idx, 'fullName', e.target.value)
                            }
                            placeholder="Mohamed Rizwan Farook"
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                            Passport Number *
                          </label>
                          <input
                            type="text"
                            value={t.passportNumber}
                            onChange={(e) =>
                              updateTraveller(
                                idx,
                                'passportNumber',
                                e.target.value.toUpperCase()
                              )
                            }
                            placeholder="N12345678"
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                            NIC Number
                          </label>
                          <input
                            type="text"
                            value={t.nic || ''}
                            onChange={(e) =>
                              updateTraveller(idx, 'nic', e.target.value)
                            }
                            placeholder="198421903421"
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            value={t.dateOfBirth}
                            onChange={(e) =>
                              updateTraveller(
                                idx,
                                'dateOfBirth',
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                            Gender *
                          </label>
                          <select
                            value={t.gender}
                            onChange={(e) =>
                              updateTraveller(idx, 'gender', e.target.value)
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                            Relationship
                          </label>
                          <select
                            value={t.relationship || 'Family'}
                            onChange={(e) =>
                              updateTraveller(
                                idx,
                                'relationship',
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                          >
                            <option value="Self">Self</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Son">Son</option>
                            <option value="Daughter">Daughter</option>
                            <option value="Brother">Brother</option>
                            <option value="Sister">Sister</option>
                            <option value="Family">Family</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={t.phone || ''}
                            onChange={(e) =>
                              updateTraveller(idx, 'phone', e.target.value)
                            }
                            placeholder="+94 77 123 4567"
                            className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <label className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/90 shadow-lg cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    agreeTerms
                      ? 'bg-primary border-primary'
                      : 'bg-white border-surface-container-high group-hover:border-primary/40'
                  }`}
                >
                  {agreeTerms && (
                    <span className="material-symbols-outlined text-white text-sm">
                      check
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-on-surface-variant leading-relaxed">
                I confirm all traveller details are accurate and agree to the{' '}
                <Link
                  href="/terms"
                  className="text-primary font-semibold hover:underline"
                >
                  Terms
                </Link>{' '}
                &{' '}
                <Link
                  href="/privacy"
                  className="text-primary font-semibold hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/package/${pkg.id}`}
                className="flex-1 py-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm text-center transition-colors"
              >
                ← Back to Package
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
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
                    Creating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">
                      check_circle
                    </span>
                    Confirm Booking
                  </>
                )}
              </motion.button>
            </div>
          </FadeUp>
        </div>

        <div>
          <FadeUp delay={0.1}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl shadow-lg overflow-hidden lg:sticky lg:top-24">
              <div className="relative h-32 overflow-hidden">
                {pkg.posterUrl ? (
                  <img
                    src={pkg.posterUrl}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-white/40">
                      mosque
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span
                  className={`absolute top-3 left-3 badge ${
                    pkg.type === 'HAJJ'
                      ? 'bg-tertiary text-white'
                      : 'bg-primary text-white'
                  }`}
                >
                  {pkg.type}
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-on-surface text-sm line-clamp-2">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {pkg.duration} Days
                  </p>
                </div>

                <div className="border-t border-surface-container pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      Price × {travellers.length}
                    </span>
                    <span className="font-semibold">
                      LKR {totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-primary">
                    <span className="font-semibold">
                      {advancePercent}% Advance
                    </span>
                    <span className="font-bold">
                      LKR {advanceAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant text-xs">
                    <span>Balance</span>
                    <span>LKR {balanceAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-20 bg-surface-container rounded-2xl" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-96 bg-surface-container rounded-2xl" />
        <div className="h-96 bg-surface-container rounded-2xl" />
      </div>
    </div>
  );
}