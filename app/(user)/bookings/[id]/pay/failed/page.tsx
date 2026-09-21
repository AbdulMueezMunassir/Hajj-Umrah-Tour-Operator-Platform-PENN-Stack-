'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function FailedPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <FailedContent />
    </Suspense>
  );
}

function FailedContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Payment was cancelled or declined';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Failed Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-error to-red-700 rounded-3xl p-8 lg:p-12 text-white text-center shadow-2xl"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/20 blur-3xl"
        />

        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 mb-6"
          >
            <span className="material-symbols-outlined text-4xl">
              error
            </span>
          </motion.div>

          <h1 className="text-3xl font-bold mb-3">
            Payment Could Not Be Completed
          </h1>
          <p className="text-lg opacity-90 max-w-md mx-auto">
            {reason}
          </p>
        </div>
      </motion.div>

      {/* What Happened */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            info
          </span>
          What Can You Do?
        </h2>

        <div className="space-y-3">
          {[
            {
              icon: 'refresh',
              title: 'Try Again',
              desc: 'Your booking is still reserved. Retry the payment.',
            },
            {
              icon: 'credit_card',
              title: 'Try Different Card',
              desc: 'The card may have insufficient funds or 3D Secure issues.',
            },
            {
              icon: 'support_agent',
              title: 'Contact Support',
              desc: 'Our team can help with payment issues 24/7.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                {item.icon}
              </span>
              <div>
                <p className="font-semibold text-on-surface text-sm">
                  {item.title}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Link
          href={`/bookings/${params.id}/pay`}
          className="flex-1 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm text-center shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          Try Payment Again
        </Link>
        <Link
          href={`/bookings/${params.id}`}
          className="flex-1 py-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm text-center transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Booking
        </Link>
      </motion.div>

      {/* Support */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <p className="text-xs text-on-surface-variant mb-2">
          Need help with payment?
        </p>
        <a
          href="https://wa.me/94776290290"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <span className="material-symbols-outlined text-sm">chat</span>
          WhatsApp Support
        </a>
      </motion.div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="h-64 bg-surface-container rounded-3xl" />
      <div className="h-48 bg-surface-container rounded-2xl" />
    </div>
  );
}