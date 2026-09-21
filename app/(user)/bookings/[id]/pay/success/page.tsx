'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { bookingAPI, paymentAPI } from '@/lib/api';
import { Booking } from '@/types';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!isAuthenticated || !params.id) return;
      try {
        const res = await bookingAPI.get(params.id as string);
        setBooking(res.data.data.booking);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [isAuthenticated, params.id]);

  const copyRef = () => {
    if (!booking) return;
    navigator.clipboard.writeText(booking.bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || loading) return <Skeleton />;

  if (!booking) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <span className="material-symbols-outlined text-6xl text-error">
          error
        </span>
        <h2 className="text-xl font-bold mt-4">Booking not found</h2>
        <Link href="/bookings" className="btn-primary inline-flex mt-6">
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Success Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary rounded-3xl p-8 lg:p-12 text-white text-center shadow-2xl"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-tertiary-fixed/40 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none"
        />

        <div className="relative">
          {/* Success icon with ring animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="relative inline-flex items-center justify-center w-24 h-24 mb-6"
          >
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-white/30"
            />
            <div className="relative w-20 h-20 rounded-full bg-white text-primary flex items-center justify-center shadow-xl">
              <span className="material-symbols-outlined text-5xl">
                check_circle
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl lg:text-4xl font-bold mb-3"
          >
            Alhamdulillah! Payment Successful
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg opacity-90 max-w-lg mx-auto"
          >
            Your advance payment has been received. Booking confirmed for
            your sacred journey.
          </motion.p>
        </div>
      </motion.div>

      {/* Booking Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              receipt_long
            </span>
            <h2 className="font-bold text-on-surface">Booking Details</h2>
          </div>
          <button
            onClick={copyRef}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-sm">
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Copied!' : 'Copy Ref'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-on-surface-variant">
              Booking Reference
            </span>
            <p className="font-bold text-primary font-mono mt-0.5">
              {booking.bookingRef}
            </p>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant">Package</span>
            <p className="font-semibold text-on-surface mt-0.5">
              {booking.package?.name}
            </p>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant">
              Total Amount
            </span>
            <p className="font-semibold text-on-surface mt-0.5">
              LKR {booking.totalAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant">
              Advance Paid
            </span>
            <p className="font-bold text-primary mt-0.5">
              LKR {booking.advancePaid.toLocaleString()}
            </p>
          </div>
          {booking.balanceDue > 0 && (
            <div>
              <span className="text-xs text-on-surface-variant">
                Remaining Balance
              </span>
              <p className="font-bold text-tertiary mt-0.5">
                LKR {booking.balanceDue.toLocaleString()}
              </p>
            </div>
          )}
          <div>
            <span className="text-xs text-on-surface-variant">
              Payment Status
            </span>
            <p className="mt-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-white">
                Paid
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            route
          </span>
          What Happens Next?
        </h2>

        <div className="space-y-3">
          {[
            {
              icon: 'mail',
              title: 'Confirmation Email',
              desc: 'A detailed voucher has been sent to your email address.',
            },
            {
              icon: 'badge',
              title: 'Document Verification',
              desc: 'Our team will verify your passport details within 48 hours.',
            },
            {
              icon: 'flight_takeoff',
              title: 'Pre-Departure Briefing',
              desc: 'You will be invited to our pre-departure seminar in Colombo.',
            },
            {
              icon: 'support_agent',
              title: 'Dedicated Coordinator',
              desc: 'A travel coordinator will contact you within 24 hours.',
            },
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container"
            >
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-lg">
                  {step.icon}
                </span>
              </div>
              <div>
                <p className="font-semibold text-on-surface text-sm">
                  {step.title}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Link
          href={`/bookings/${booking.id}`}
          className="flex-1 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm text-center shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">
            receipt_long
          </span>
          View Booking Details
        </Link>
        <Link
          href="/dashboard"
          className="flex-1 py-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm text-center transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">
            dashboard
          </span>
          Go to Dashboard
        </Link>
        <button
          onClick={() => window.print()}
          className="px-5 py-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">print</span>
        </button>
      </motion.div>

      {/* Support */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-center"
      >
        <p className="text-xs text-on-surface-variant mb-2">
          Need help? Contact us anytime
        </p>
        <a
          href="https://wa.me/94776290290"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <span className="material-symbols-outlined text-sm">chat</span>
          WhatsApp: +94 776 290 290
        </a>
      </motion.div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="h-72 bg-surface-container rounded-3xl" />
      <div className="h-48 bg-surface-container rounded-2xl" />
      <div className="h-64 bg-surface-container rounded-2xl" />
    </div>
  );
}