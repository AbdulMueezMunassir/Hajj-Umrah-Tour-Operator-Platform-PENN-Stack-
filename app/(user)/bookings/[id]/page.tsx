'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { bookingAPI } from '@/lib/api';
import { Booking } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp } from '@/components/ui/MotionDiv';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/bookings/${params.id}`);
    }
  }, [authLoading, isAuthenticated, router, params.id]);

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

  const handleCancel = async () => {
    if (!booking) return;
    setIsCancelling(true);
    try {
      await bookingAPI.cancel(booking.id, 'User cancelled');
      setBooking({ ...booking, bookingStatus: 'CANCELLED' });
      setShowCancel(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDelete = async () => {
  if (!booking) return;
  setIsDeleting(true);
  try {
    await bookingAPI.delete(booking.id);
    window.location.href = '/bookings?deleted=true';
    // Force full reload so the bookings list refreshes
    window.location.href = '/bookings?deleted=true';
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to delete booking');
    setIsDeleting(false);
  }
};

  if (authLoading || loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-surface-container rounded-2xl" />
        <div className="h-64 bg-surface-container rounded-2xl" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-12 shadow-lg text-center">
        <span className="material-symbols-outlined text-6xl text-error">
          error
        </span>
        <h2 className="text-xl font-bold text-on-surface mt-4">
          {error || 'Booking not found'}
        </h2>
        <Link href="/bookings" className="btn-primary inline-flex mt-6">
          <span className="material-symbols-outlined text-lg">
            arrow_back
          </span>
          Back to Bookings
        </Link>
      </div>
    );
  }

  const advanceAmount =
    booking.advancePaid || Math.round((booking.totalAmount * 20) / 100);
  const balanceAmount = booking.balanceDue;
  const isCancelled = booking.bookingStatus === 'CANCELLED';
  const canPayAdvance = booking.bookingStatus === 'PENDING_PAYMENT';
  const canPayBalance =
    !isCancelled &&
    booking.bookingStatus !== 'PENDING_PAYMENT' &&
    balanceAmount > 0;

  const travelDate = booking.package?.travelDate
    ? new Date(booking.package.travelDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Date TBD';

  const daysUntil = booking.package?.travelDate
    ? Math.ceil(
        (new Date(booking.package.travelDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="space-y-6">
      <FadeUp>
        <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
          <Link href="/bookings" className="hover:text-primary transition">
            My Bookings
          </Link>
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
          <span className="text-primary font-semibold">
            {booking.bookingRef}
          </span>
        </nav>

        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary rounded-3xl p-6 lg:p-8 text-white shadow-xl">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none"
          />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                  {booking.bookingRef}
                </span>
                <StatusBadge status={booking.bookingStatus} />
                {!isCancelled && daysUntil > 0 && (
                  <span className="text-[10px] font-bold uppercase bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                    {daysUntil} days to go
                  </span>
                )}
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold mb-1 line-clamp-2">
                {booking.package?.name || 'Package'}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">
                    calendar_today
                  </span>
                  {travelDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">
                    flight_takeoff
                  </span>
                  {booking.package?.departureCity || 'Colombo'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">
                    group
                  </span>
                  {booking.travellersData?.length || 1} Pilgrim
                  {(booking.travellersData?.length || 1) > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="https://wa.me/94776290290"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white text-primary text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
              >
                <span className="material-symbols-outlined text-base">
                  chat
                </span>
                Contact Support
              </motion.a>
            </div>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
          <h2 className="font-bold text-on-surface mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              timeline
            </span>
            Journey Progress
          </h2>
          <Timeline status={booking.bookingStatus} isCancelled={isCancelled} />
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FadeUp delay={0.15}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  account_balance_wallet
                </span>
                Payment Summary
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container">
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                    Total
                  </span>
                  <p className="text-xl font-bold text-on-surface mt-1">
                    LKR {booking.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-primary-fixed/30 border border-primary-fixed">
                  <span className="text-[10px] font-bold uppercase text-primary">
                    Paid
                  </span>
                  <p className="text-xl font-bold text-primary mt-1">
                    LKR {advanceAmount.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-tertiary-fixed/30 border border-tertiary-fixed">
                  <span className="text-[10px] font-bold uppercase text-tertiary">
                    Due
                  </span>
                  <p className="text-xl font-bold text-tertiary mt-1">
                    LKR {balanceAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-primary">
                    {booking.totalAmount > 0
                      ? Math.round(
                          (advanceAmount / booking.totalAmount) * 100
                        )
                      : 0}
                    % Paid
                  </span>
                  <span className="text-on-surface-variant">
                    LKR {balanceAmount.toLocaleString()} remaining
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        booking.totalAmount > 0
                          ? (advanceAmount / booking.totalAmount) * 100
                          : 0
                      }%`,
                    }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                  />
                </div>
              </div>

              {(canPayAdvance || canPayBalance) && (
                <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-surface-container">
                  {canPayAdvance && (
                    <Link
                      href={`/bookings/${booking.id}/pay?type=ADVANCE`}
                      className="btn-primary inline-flex"
                    >
                      <span className="material-symbols-outlined text-lg">
                        payments
                      </span>
                      Pay Advance — LKR {advanceAmount.toLocaleString()}
                    </Link>
                  )}
                  {canPayBalance && (
                    <Link
                      href={`/bookings/${booking.id}/pay?type=BALANCE`}
                      className="btn-gold inline-flex"
                    >
                      <span className="material-symbols-outlined text-lg">
                        payments
                      </span>
                      Pay Balance — LKR {balanceAmount.toLocaleString()}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">
                  group
                </span>
                Pilgrims ({booking.travellersData?.length || 0})
              </h2>

              <div className="space-y-3">
                {(booking.travellersData || []).map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center font-bold text-white flex-shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-on-surface text-sm truncate">
                        {t.fullName}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant mt-0.5">
                        <span>NIC: {t.nic || '—'}</span>
                        <span>Passport: {t.passportNumber}</span>
                      </div>
                    </div>
                    {t.relationship && (
                      <span className="text-[10px] font-bold uppercase bg-primary-fixed/40 text-primary px-2 py-0.5 rounded-full">
                        {t.relationship}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>

        <div className="space-y-6">
          <FadeUp delay={0.25}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  info
                </span>
                Booking Info
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-on-surface-variant">Booked On</span>
                  <p className="font-semibold text-on-surface">
                    {new Date(booking.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div>
                  <span className="text-on-surface-variant">
                    Payment Status
                  </span>
                  <p className="mt-1">
                    <PaymentBadge status={booking.paymentStatus} />
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Booking Actions */}
          <FadeUp delay={0.3}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg space-y-3">
              <h3 className="font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">
                  settings
                </span>
                Booking Actions
              </h3>

              {/* Cancel — for active bookings */}
              {!isCancelled &&
                booking.bookingStatus !== 'COMPLETED' &&
                booking.bookingStatus !== 'CANCELLED' && (
                  <button
                    onClick={() => setShowCancel(true)}
                    className="w-full py-2.5 rounded-xl bg-tertiary-fixed/40 text-on-tertiary-fixed font-semibold text-xs hover:bg-tertiary hover:text-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">cancel</span>
                    Cancel Booking
                  </button>
                )}

              {/* Delete — only for cancelled or unpaid bookings */}
              {(isCancelled || booking.bookingStatus === 'PENDING_PAYMENT') && (
                <button
                  onClick={() => setShowDelete(true)}
                  className="w-full py-2.5 rounded-xl bg-error-container text-on-error-container font-semibold text-xs hover:bg-error hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  Delete Booking
                </button>
              )}

              {/* Info notice */}
              <p className="text-[10px] text-on-surface-variant leading-snug pt-1 border-t border-surface-container">
                <span className="font-bold text-on-surface">Note:</span> Bookings with
                completed payments cannot be deleted. Contact support for refunds.
              </p>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCancel(false)}
            className="fixed inset-0 z-[100] bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <h3 className="text-xl font-bold text-center text-on-surface">
                Cancel Booking?
              </h3>
              <p className="text-sm text-on-surface-variant text-center mt-2">
                Are you sure you want to cancel booking{' '}
                <strong className="text-on-surface">{booking.bookingRef}</strong>?
                This action cannot be undone.
              </p>

              <div className="p-3 rounded-xl bg-tertiary-fixed/30 mt-4 text-xs text-on-tertiary-fixed">
                <p className="font-bold flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Refund Policy
                </p>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Advance payments will be refunded within 7-14 business days minus
                  any applicable cancellation fees.
                </p>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowCancel(false)}
                  disabled={isCancelling}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="flex-1 py-2.5 rounded-xl bg-tertiary text-white font-bold text-sm hover:bg-tertiary-container transition-colors disabled:opacity-50"
                >
                  {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDelete(false)}
            className="fixed inset-0 z-[100] bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">delete_forever</span>
              </div>
              <h3 className="text-xl font-bold text-center text-on-surface">
                Delete Permanently?
              </h3>
              <p className="text-sm text-on-surface-variant text-center mt-2">
                Booking{' '}
                <strong className="text-on-surface">{booking.bookingRef}</strong> will
                be permanently removed. This <strong>cannot</strong> be undone.
              </p>

              <div className="p-3 rounded-xl bg-error-container/50 mt-4 text-xs text-on-error-container">
                <p className="font-bold flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  This action is permanent
                </p>
                <p className="text-[11px] leading-relaxed opacity-90">
                  All booking data, traveller information, and history will be
                  deleted. If you want to keep a record, use Cancel instead.
                </p>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowDelete(false)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-error text-white font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="material-symbols-outlined text-base"
                      >
                        refresh
                      </motion.span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">delete_forever</span>
                      Delete Forever
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string }> = {
    PENDING_PAYMENT: { label: 'Pending Payment', bg: 'bg-tertiary-fixed text-on-tertiary-fixed' },
    ADVANCE_PAID: { label: 'Advance Paid', bg: 'bg-primary-fixed text-on-primary-fixed' },
    CONFIRMED: { label: 'Confirmed', bg: 'bg-secondary-container text-on-secondary-container' },
    DOCUMENTS_PENDING: { label: 'Docs Pending', bg: 'bg-tertiary-fixed text-on-tertiary-fixed' },
    DOCUMENTS_VERIFIED: { label: 'Docs Verified', bg: 'bg-secondary-container text-on-secondary-container' },
    TRAVEL_READY: { label: 'Travel Ready', bg: 'bg-primary text-white' },
    COMPLETED: { label: 'Completed', bg: 'bg-surface-container-high text-on-surface' },
    CANCELLED: { label: 'Cancelled', bg: 'bg-error-container text-on-error-container' },
  };
  const c = map[status] || { label: status, bg: 'bg-surface-container' };
  return (
    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${c.bg}`}>
      {c.label}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string }> = {
    PENDING: { label: 'Pending', bg: 'bg-tertiary-fixed text-on-tertiary-fixed' },
    PAID: { label: 'Paid', bg: 'bg-primary text-white' },
    FAILED: { label: 'Failed', bg: 'bg-error-container text-on-error-container' },
    REFUNDED: { label: 'Refunded', bg: 'bg-surface-container-high text-on-surface' },
  };
  const c = map[status] || { label: status, bg: 'bg-surface-container' };
  return (
    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${c.bg}`}>
      {c.label}
    </span>
  );
}

function Timeline({ status, isCancelled }: { status: string; isCancelled: boolean }) {
  const steps = [
    { key: 'PENDING_PAYMENT', label: 'Created', icon: 'receipt_long' },
    { key: 'ADVANCE_PAID', label: 'Advance Paid', icon: 'payments' },
    { key: 'CONFIRMED', label: 'Confirmed', icon: 'verified' },
    { key: 'DOCUMENTS_VERIFIED', label: 'Docs Verified', icon: 'badge' },
    { key: 'TRAVEL_READY', label: 'Travel Ready', icon: 'flight_takeoff' },
    { key: 'COMPLETED', label: 'Completed', icon: 'check_circle' },
  ];
  const order = [
    'PENDING_PAYMENT', 'ADVANCE_PAID', 'CONFIRMED',
    'DOCUMENTS_PENDING', 'DOCUMENTS_VERIFIED', 'TRAVEL_READY', 'COMPLETED',
  ];
  const current = order.indexOf(status);

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {steps.map((step, idx) => {
        const stepIdx = order.indexOf(step.key);
        const isDone = stepIdx <= current && !isCancelled;
        const isActive = stepIdx === current && !isCancelled;
        const isCancel = isCancelled && idx === 0;

        return (
          <div key={step.key} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isCancel
                  ? 'bg-error text-white'
                  : isActive
                  ? 'bg-primary text-white shadow-lg ring-4 ring-primary/20'
                  : isDone
                  ? 'bg-primary text-white'
                  : 'bg-surface-container text-on-surface-variant border-2 border-dashed border-outline-variant'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isCancel ? 'cancel' : isDone ? 'check' : step.icon}
              </span>
            </div>
            <p className="text-[9px] font-bold uppercase text-center mt-2 leading-tight text-on-surface-variant">
              {isCancel ? 'Cancelled' : step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}