'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { bookingAPI, paymentAPI } from '@/lib/api';
import { Booking } from '@/types';
import { motion } from 'framer-motion';
import { FadeUp } from '@/components/ui/MotionDiv';

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentSkeleton />}>
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const paymentType = (searchParams.get('type') || 'ADVANCE') as
    | 'ADVANCE'
    | 'BALANCE';

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [error, setError] = useState('');
  const [mockEnabled, setMockEnabled] = useState(false);
  const [mockLoading, setMockLoading] = useState(false);
  const [checkout, setCheckout] = useState<{
    checkoutUrl: string;
    checkoutData: any;
  } | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/bookings/${params.id}/pay`);
    }
  }, [authLoading, isAuthenticated, router, params.id]);

  // Fetch booking
  useEffect(() => {
    const fetchBooking = async () => {
      if (!isAuthenticated || !params.id) return;
      try {
        const res = await bookingAPI.get(params.id as string);
        setBooking(res.data.data.booking);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [isAuthenticated, params.id]);

    // Check whether the mock (test) gateway is enabled on the backend
  useEffect(() => {
    paymentAPI
      .config()
      .then((res) => setMockEnabled(!!res.data.data.mockEnabled))
      .catch(() => setMockEnabled(false));
  }, []);

  // Mock payment (testing only)
  const handleMockPayment = async (outcome: 'success' | 'failed') => {
    if (!booking) return;
    setMockLoading(true);
    setError('');

    try {
      await paymentAPI.mock({
        bookingId: booking.id,
        paymentType,
        outcome,
      });
      router.push(
        outcome === 'success'
          ? `/bookings/${booking.id}/pay/success`
          : `/bookings/${booking.id}/pay/failed`
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mock payment failed');
      setMockLoading(false);
    }
  };

  // Initiate payment
  const handleInitiatePayment = async () => {
    if (!booking) return;
    setInitiating(true);
    setError('');

    try {
      const res = await paymentAPI.initiate({
        bookingId: booking.id,
        paymentType,
      });

      const { checkoutUrl, checkoutData } = res.data.data;
      setCheckout({ checkoutUrl, checkoutData });

      // Auto-submit the form to PayHere after render
      setTimeout(() => {
        formRef.current?.submit();
      }, 500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
      setInitiating(false);
    }
  };

  if (authLoading || loading) return <PaymentSkeleton />;

  if (error && !booking) {
    return (
      <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
        <span className="material-symbols-outlined text-6xl text-error">
          error
        </span>
        <h2 className="text-xl font-bold text-on-surface mt-4">
          {error || 'Booking not found'}
        </h2>
        <Link href="/bookings" className="btn-primary inline-flex mt-6">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Bookings
        </Link>
      </div>
    );
  }

  if (!booking) return null;

  const advanceAmount =
    booking.advancePaid || Math.round((booking.totalAmount * 20) / 100);
  const paymentAmount =
    paymentType === 'ADVANCE' ? advanceAmount : booking.balanceDue;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <FadeUp>
        <nav className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Link href="/bookings" className="hover:text-primary transition">
            My Bookings
          </Link>
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
          <Link
            href={`/bookings/${booking.id}`}
            className="hover:text-primary transition"
          >
            {booking.bookingRef}
          </Link>
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
          <span className="text-primary font-semibold">
            Pay {paymentType === 'ADVANCE' ? 'Advance' : 'Balance'}
          </span>
        </nav>
      </FadeUp>

      {/* Header */}
      <FadeUp delay={0.1}>
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary rounded-3xl p-6 lg:p-8 text-white shadow-xl">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none"
          />

          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">
                lock
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/20">
                Secure Payment
              </span>
              <h1 className="text-2xl lg:text-3xl font-bold mt-2">
                Pay {paymentType === 'ADVANCE' ? '20% Advance' : 'Remaining Balance'}
              </h1>
              <p className="text-sm opacity-90 mt-1">
                {booking.package?.name || 'Package'} • {booking.bookingRef}
              </p>
            </div>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Card */}
          <FadeUp delay={0.15}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  receipt_long
                </span>
                Payment Amount
              </h2>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white text-center">
                <span className="text-xs uppercase tracking-wider opacity-90">
                  Total to Pay Now
                </span>
                <p className="text-4xl font-bold mt-2">
                  LKR {paymentAmount.toLocaleString()}
                </p>
                <span className="text-xs opacity-80 mt-1 block">
                  {paymentType === 'ADVANCE'
                    ? `20% Advance of LKR ${booking.totalAmount.toLocaleString()}`
                    : 'Remaining balance'}
                </span>
              </div>

              {/* Breakdown */}
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-surface-container">
                  <span className="text-on-surface-variant">
                    Total Package Amount
                  </span>
                  <span className="font-semibold">
                    LKR {booking.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-surface-container">
                  <span className="text-on-surface-variant">
                    Already Paid
                  </span>
                  <span className="font-semibold text-primary">
                    LKR{' '}
                    {(
                      booking.totalAmount - booking.balanceDue
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-surface-container">
                  <span className="text-on-surface-variant">
                    Paying Now
                  </span>
                  <span className="font-bold text-tertiary">
                    LKR {paymentAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-on-surface-variant">
                    Balance After Payment
                  </span>
                  <span className="font-semibold">
                    LKR{' '}
                    {(
                      paymentType === 'ADVANCE'
                        ? booking.balanceDue
                        : booking.balanceDue - paymentAmount
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Payment Method */}
          <FadeUp delay={0.2}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  credit_card
                </span>
                Payment Method
              </h2>

              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      credit_score
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-on-surface">
                      PayHere Secure Gateway
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Visa, MasterCard, AMEX, FriMi, Genie, Sampath Vishwa,
                      eZ Cash
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary">
                    verified
                  </span>
                </div>
              </div>

              {/* Security Badges */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-surface-container-low text-center">
                  <span className="material-symbols-outlined text-primary text-xl block">
                    lock
                  </span>
                  <span className="text-[10px] font-bold text-on-surface-variant mt-1 block">
                    256-Bit SSL
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low text-center">
                  <span className="material-symbols-outlined text-primary text-xl block">
                    verified_user
                  </span>
                  <span className="text-[10px] font-bold text-on-surface-variant mt-1 block">
                    PCI-DSS Level 1
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low text-center">
                  <span className="material-symbols-outlined text-primary text-xl block">
                    security
                  </span>
                  <span className="text-[10px] font-bold text-on-surface-variant mt-1 block">
                    CBSL Compliant
                  </span>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Terms */}
          <FadeUp delay={0.25}>
            <div className="p-4 rounded-2xl bg-tertiary-fixed/30 border border-tertiary-fixed">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-tertiary text-lg mt-0.5">
                  info
                </span>
                <div>
                  <p className="font-bold text-tertiary text-sm mb-1">
                    Refund Policy
                  </p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Advance payments are 100% refundable if visa is refused
                    by Saudi authorities. Voluntary cancellations prior to
                    ticketing permit a 90% refund per SLTDA guidelines.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-error-container text-on-error-container text-sm flex items-start gap-2"
            >
              <span className="material-symbols-outlined text-lg">error</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Actions */}
          <FadeUp delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/bookings/${booking.id}`}
                className="flex-1 py-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm text-center transition-colors"
              >
                ← Back to Booking
              </Link>
              <motion.button
                whileHover={{ scale: initiating ? 1 : 1.02 }}
                whileTap={{ scale: initiating ? 1 : 0.98 }}
                onClick={handleInitiatePayment}
                disabled={initiating || !!checkout}
                className="flex-1 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {initiating ? (
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
                    Connecting to PayHere...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">
                      lock
                    </span>
                    Pay LKR {paymentAmount.toLocaleString()}
                  </>
                )}
                            </motion.button>
            </div>
          </FadeUp>

          {/* Mock gateway (testing only) */}
          {mockEnabled && (
            <FadeUp delay={0.35}>
              <div className="p-4 rounded-2xl border border-dashed border-tertiary/40 bg-tertiary-fixed/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">
                    science
                  </span>
                  <p className="text-xs font-bold text-tertiary uppercase tracking-wider">
                    Test Mode - Mock Payment
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleMockPayment('success')}
                    disabled={mockLoading || initiating || !!checkout}
                    className="flex-1 py-3 rounded-xl bg-tertiary hover:opacity-90 text-white font-bold text-sm transition-all disabled:opacity-60"
                  >
                    {mockLoading
                      ? 'Processing...'
                      : `Mock Pay LKR ${paymentAmount.toLocaleString()}`}
                  </button>
                  <button
                    onClick={() => handleMockPayment('failed')}
                    disabled={mockLoading || initiating || !!checkout}
                    className="flex-1 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors disabled:opacity-60"
                  >
                    Simulate Failure
                  </button>
                </div>
              </div>
            </FadeUp>
          )}
        </div>

        {/* Right — Summary */}
        <div className="space-y-6">
          <FadeUp delay={0.15}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg lg:sticky lg:top-24">
              <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">
                  verified_user
                </span>
                Booking Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-on-surface-variant">Package</span>
                  <p className="font-semibold text-on-surface mt-0.5">
                    {booking.package?.name}
                  </p>
                </div>
                <div>
                  <span className="text-on-surface-variant">Booking Ref</span>
                  <p className="font-mono font-bold text-primary mt-0.5">
                    {booking.bookingRef}
                  </p>
                </div>
                <div>
                  <span className="text-on-surface-variant">Pilgrims</span>
                  <p className="font-semibold text-on-surface mt-0.5">
                    {booking.travellersData?.length || 1} Pilgrim
                    {(booking.travellersData?.length || 1) > 1 ? 's' : ''}
                  </p>
                </div>
                {booking.package?.travelDate && (
                  <div>
                    <span className="text-on-surface-variant">
                      Travel Date
                    </span>
                    <p className="font-semibold text-on-surface mt-0.5">
                      {new Date(
                        booking.package.travelDate
                      ).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-surface-container">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">
                    What happens next?
                  </span>
                </div>
                <ul className="mt-2 space-y-2 text-[11px] text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                      check_circle
                    </span>
                    <span>
                      Redirect to PayHere secure gateway to enter card
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                      check_circle
                    </span>
                    <span>Instant payment confirmation via webhook</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                      check_circle
                    </span>
                    <span>Voucher emailed + booking status updated</span>
                  </li>
                </ul>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Hidden PayHere Form — Auto-submits when checkout is ready */}
      {checkout && (
        <form
          ref={formRef}
          method="POST"
          action={checkout.checkoutUrl}
          style={{ display: 'none' }}
        >
          {Object.entries(checkout.checkoutData).map(([key, value]) => (
            <input
              key={key}
              type="hidden"
              name={key}
              value={String(value)}
            />
          ))}
        </form>
      )}

      {/* Loading overlay when redirecting to PayHere */}
      {checkout && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[200] bg-inverse-surface/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-4"
            >
              <span className="material-symbols-outlined text-3xl">
                lock
              </span>
            </motion.div>
            <h3 className="text-xl font-bold text-on-surface">
              Redirecting to PayHere
            </h3>
            <p className="text-sm text-on-surface-variant mt-2">
              Please do not close this window...
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 rounded-full bg-primary"
              />
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                className="w-2 h-2 rounded-full bg-primary"
              />
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function PaymentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 bg-surface-container rounded-2xl" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="h-64 bg-surface-container rounded-2xl" />
          <div className="h-48 bg-surface-container rounded-2xl" />
        </div>
        <div className="h-96 bg-surface-container rounded-2xl" />
      </div>
    </div>
  );
}