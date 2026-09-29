'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingAPI, paymentAPI } from '@/lib/api';
import { Booking } from '@/types';
import { FadeUp } from '@/components/ui/MotionDiv';

const STATUS_OPTIONS = [
  { value: 'PENDING_PAYMENT', label: 'Pending Payment' },
  { value: 'ADVANCE_PAID', label: 'Advance Paid' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'DOCUMENTS_PENDING', label: 'Documents Pending' },
  { value: 'DOCUMENTS_VERIFIED', label: 'Documents Verified' },
  { value: 'TRAVEL_READY', label: 'Travel Ready' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [showManualPayModal, setShowManualPayModal] = useState(false);
  const [manualPayType, setManualPayType] = useState<'ADVANCE' | 'BALANCE'>('ADVANCE');

  const fetchBooking = async () => {
    try {
      const res = await bookingAPI.get(params.id as string);
      setBooking(res.data.data.booking);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchBooking();
  }, [params.id]);

  const handleStatusUpdate = async () => {
    if (!booking || !newStatus) return;
    setUpdatingStatus(true);
    try {
      await bookingAPI.updateStatus(booking.id, newStatus);
      await fetchBooking();
      setShowStatusModal(false);
      setNewStatus('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleManualPayment = async () => {
    if (!booking) return;
    setUpdatingStatus(true);
    try {
      await paymentAPI.manualConfirm({
        bookingId: booking.id,
        paymentType: manualPayType,
        transactionId: `ADMIN-MANUAL-${Date.now()}`,
      });
      await fetchBooking();
      setShowManualPayModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to confirm payment');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
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
        <Link
          href="/admin/bookings"
          className="btn-primary inline-flex mt-6"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Bookings
        </Link>
      </div>
    );
  }

  const travelDate = booking.package?.travelDate
    ? new Date(booking.package.travelDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'TBD';

  const isCancelled = booking.bookingStatus === 'CANCELLED';

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-3">
          <Link href="/admin/bookings" className="hover:text-tertiary transition">
            Bookings
          </Link>
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
          <span className="text-tertiary font-semibold">
            {booking.bookingRef}
          </span>
        </nav>

        <div className="relative overflow-hidden bg-gradient-to-br from-tertiary via-tertiary-container to-primary rounded-3xl p-6 lg:p-8 text-white shadow-xl">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/20 blur-3xl pointer-events-none"
          />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20 font-mono">
                  {booking.bookingRef}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                  {booking.bookingStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold line-clamp-2">
                {booking.package?.name || 'Package'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm opacity-90 mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">
                    calendar_today
                  </span>
                  {travelDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">
                    group
                  </span>
                  {booking.travellersData?.length || 1} pilgrims
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setNewStatus(booking.bookingStatus);
                  setShowStatusModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-white text-tertiary text-xs font-bold flex items-center gap-1.5 shadow-lg"
              >
                <span className="material-symbols-outlined text-base">
                  edit_note
                </span>
                Update Status
              </motion.button>

              {(booking.bookingStatus === 'PENDING_PAYMENT' ||
                (booking.balanceDue > 0 && !isCancelled)) && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setManualPayType(
                      booking.bookingStatus === 'PENDING_PAYMENT'
                        ? 'ADVANCE'
                        : 'BALANCE'
                    );
                    setShowManualPayModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">
                    payments
                  </span>
                  Confirm Payment
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <FadeUp delay={0.1}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">
                  person
                </span>
                Customer Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-on-surface-variant">Name</span>
                  <p className="font-semibold text-on-surface mt-0.5">
                    {booking.user?.firstName} {booking.user?.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant">Email</span>
                  <p className="font-semibold text-on-surface mt-0.5 break-all">
                    {booking.user?.email}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant">Phone</span>
                  <p className="font-semibold text-on-surface mt-0.5">
                    {booking.user?.phone || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant">
                    Booked On
                  </span>
                  <p className="font-semibold text-on-surface mt-0.5">
                    {new Date(booking.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Payment Summary */}
          <FadeUp delay={0.15}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">
                  account_balance_wallet
                </span>
                Payment Summary
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-surface-container-low">
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                    Total
                  </span>
                  <p className="text-xl font-bold text-on-surface mt-1">
                    LKR {booking.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-primary-fixed/30">
                  <span className="text-[10px] font-bold uppercase text-primary">
                    Paid
                  </span>
                  <p className="text-xl font-bold text-primary mt-1">
                    LKR {booking.advancePaid.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-tertiary-fixed/30">
                  <span className="text-[10px] font-bold uppercase text-tertiary">
                    Due
                  </span>
                  <p className="text-xl font-bold text-tertiary mt-1">
                    LKR {booking.balanceDue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Travellers */}
          <FadeUp delay={0.2}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">
                  groups
                </span>
                Travellers ({booking.travellersData?.length || 0})
              </h2>

              <div className="space-y-3">
                {(booking.travellersData || []).map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tertiary to-tertiary-container flex items-center justify-center font-bold text-white flex-shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-on-surface text-sm truncate">
                        {t.fullName}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant mt-0.5">
                        <span>Passport: {t.passportNumber}</span>
                        {t.nic && <span>NIC: {t.nic}</span>}
                        {t.phone && <span>Phone: {t.phone}</span>}
                      </div>
                    </div>
                    {t.relationship && (
                      <span className="text-[10px] font-bold uppercase bg-tertiary-fixed/40 text-tertiary px-2 py-0.5 rounded-full">
                        {t.relationship}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Payment History */}
          {booking.payments && booking.payments.length > 0 && (
            <FadeUp delay={0.25}>
              <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
                <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">
                    receipt
                  </span>
                  Payment History
                </h2>

                <div className="space-y-2">
                  {booking.payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase text-tertiary">
                          {p.paymentType}
                        </span>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {new Date(p.createdAt).toLocaleString('en-GB')}
                        </p>
                        {p.transactionId && (
                          <p className="text-[10px] text-on-surface-variant font-mono">
                            Txn: {p.transactionId}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-on-surface">
                          LKR {p.amount.toLocaleString()}
                        </p>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            p.status === 'PAID'
                              ? 'bg-primary text-white'
                              : p.status === 'FAILED'
                              ? 'bg-error-container text-on-error-container'
                              : 'bg-tertiary-fixed text-on-tertiary-fixed'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Quick Info */}
          <FadeUp delay={0.3}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">
                  info
                </span>
                Quick Info
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-on-surface-variant">Booking ID</span>
                  <p className="font-mono font-bold text-on-surface mt-0.5 break-all">
                    {booking.id}
                  </p>
                </div>
                <div>
                  <span className="text-on-surface-variant">Package Type</span>
                  <p className="font-semibold text-on-surface mt-0.5">
                    {booking.package?.type || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-on-surface-variant">Departure</span>
                  <p className="font-semibold text-on-surface mt-0.5">
                    {booking.package?.departureCity || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-on-surface-variant">Payment Status</span>
                  <p className="mt-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-on-surface">
                      {booking.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Admin Actions */}
          <FadeUp delay={0.35}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">
                  admin_panel_settings
                </span>
                Admin Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setNewStatus(booking.bookingStatus);
                    setShowStatusModal(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-tertiary text-white font-semibold text-xs hover:bg-tertiary-container transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">
                    edit_note
                  </span>
                  Update Status
                </button>

                <Link
                  href={`/bookings/${booking.id}`}
                  className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">
                    visibility
                  </span>
                  View as User
                </Link>

                <a
                  href={`https://wa.me/${booking.user?.phone?.replace(
                    /\D/g,
                    ''
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-secondary-container text-on-secondary-container font-semibold text-xs hover:bg-secondary/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">
                    chat
                  </span>
                  WhatsApp Customer
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-surface-container">
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface">Note:</strong> Manually
                  confirming payments should only be done after verifying the
                  bank transfer. All actions are logged.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Status Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !updatingStatus && setShowStatusModal(false)}
            className="fixed inset-0 z-[100] bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-on-surface">
                Update Booking Status
              </h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Current: {booking.bookingStatus.replace(/_/g, ' ')}
              </p>

              <div className="mt-4 space-y-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setNewStatus(opt.value)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                      newStatus === opt.value
                        ? 'bg-tertiary text-white shadow-md'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    {opt.label}
                    {newStatus === opt.value && (
                      <span className="material-symbols-outlined text-base">
                        check
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowStatusModal(false)}
                  disabled={updatingStatus}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus || !newStatus}
                  className="flex-1 py-2.5 rounded-xl bg-tertiary text-white font-bold text-sm hover:bg-tertiary-container transition-colors disabled:opacity-50"
                >
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Payment Modal */}
      <AnimatePresence>
        {showManualPayModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !updatingStatus && setShowManualPayModal(false)}
            className="fixed inset-0 z-[100] bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-2xl">
                  payments
                </span>
              </div>
              <h3 className="text-xl font-bold text-center text-on-surface">
                Confirm Manual Payment
              </h3>
              <p className="text-sm text-on-surface-variant text-center mt-2">
                This should only be used after verifying the customer&apos;s
                bank transfer.
              </p>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setManualPayType('ADVANCE')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    manualPayType === 'ADVANCE'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Confirm Advance Payment</span>
                    <span className="text-xs font-bold">
                      LKR {booking.advancePaid.toLocaleString()}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setManualPayType('BALANCE')}
                  disabled={booking.balanceDue <= 0}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 ${
                    manualPayType === 'BALANCE'
                      ? 'bg-tertiary text-white shadow-md'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Confirm Balance Payment</span>
                    <span className="text-xs font-bold">
                      LKR {booking.balanceDue.toLocaleString()}
                    </span>
                  </div>
                </button>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowManualPayModal(false)}
                  disabled={updatingStatus}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualPayment}
                  disabled={updatingStatus}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {updatingStatus ? 'Confirming...' : 'Confirm Payment'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}