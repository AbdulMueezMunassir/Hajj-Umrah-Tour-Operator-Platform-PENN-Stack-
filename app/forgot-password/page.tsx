'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: Implement forgot password endpoint
      // For now, simulate success
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80')",
        }}
      />

      {/* Ornaments */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-tertiary-fixed/20 blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/img/logo.png"
              alt="MHK Travels"
              width={140}
              height={50}
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-2xl border border-white/90 rounded-3xl p-8 shadow-2xl"
        >
          {!isSuccess ? (
            <>
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="w-16 h-16 rounded-2xl bg-primary-fixed/40 flex items-center justify-center mx-auto mb-4"
                >
                  <span className="material-symbols-outlined text-3xl text-primary">
                    lock_reset
                  </span>
                </motion.div>
                <h1 className="text-2xl font-bold text-on-surface mb-1">
                  Reset Your Password
                </h1>
                <p className="text-sm text-on-surface-variant">
                  Enter your email and we&apos;ll send you reset instructions
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-error-container text-on-error-container text-sm flex items-start gap-2"
                >
                  <span className="material-symbols-outlined text-lg">
                    error
                  </span>
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-primary">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">
                      mail
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-sm text-on-surface transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02, y: -2 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
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
                      Send Reset Link
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-center text-sm text-on-surface-variant mt-6">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="font-bold text-primary hover:underline"
                >
                  Back to Login
                </Link>
              </p>
            </>
          ) : (
            // Success State
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 rounded-full bg-primary-fixed/40 flex items-center justify-center mx-auto mb-4"
              >
                <span className="material-symbols-outlined text-4xl text-primary">
                  mark_email_read
                </span>
              </motion.div>
              <h2 className="text-2xl font-bold text-on-surface mb-2">
                Check Your Email
              </h2>
              <p className="text-sm text-on-surface-variant mb-6">
                We&apos;ve sent password reset instructions to{' '}
                <strong className="text-on-surface">{email}</strong>. Please
                check your inbox.
              </p>

              <div className="p-3 rounded-xl bg-primary-fixed/20 text-xs text-on-surface-variant mb-6 text-left">
                <p className="font-semibold text-on-surface mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    info
                  </span>
                  Didn&apos;t receive the email?
                </p>
                <ul className="list-disc list-inside space-y-0.5 ml-1">
                  <li>Check your spam or junk folder</li>
                  <li>The link expires in 1 hour</li>
                  <li>Make sure you used the right email address</li>
                </ul>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                  }}
                  className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm transition-colors"
                >
                  Try Different Email
                </button>
                <Link
                  href="/login"
                  className="block w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm text-center transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <div className="flex justify-center items-center gap-4 mt-6 text-[10px] text-on-surface-variant">
          <Link href="/privacy" className="hover:text-primary transition">
            Privacy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-primary transition">
            Terms
          </Link>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-primary">
              lock
            </span>
            Secure
          </span>
        </div>
      </motion.div>
    </div>
  );
}