'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import api from '@/lib/api';

const inputClass =
  'w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-sm text-on-surface transition-all';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token') || '');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to reset password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface relative overflow-hidden">
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

        <div className="bg-white/70 backdrop-blur-2xl border border-white/90 rounded-3xl p-8 shadow-2xl">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-primary-fixed/40 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-primary">
                  check_circle
                </span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-2">
                Password Updated
              </h2>
              <p className="text-sm text-on-surface-variant mb-6">
                Your password has been reset. You can now log in with your new
                password.
              </p>
              <Link
                href="/login"
                className="inline-block w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                Go to Login
              </Link>
            </div>
          ) : !token ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-error-container flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-on-error-container">
                  link_off
                </span>
              </div>
              <h2 className="text-xl font-bold text-on-surface mb-2">
                Invalid Reset Link
              </h2>
              <p className="text-sm text-on-surface-variant mb-6">
                This link is missing its token. Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="font-bold text-primary hover:underline text-sm"
              >
                Request a new link
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary-fixed/40 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    lock_reset
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-on-surface mb-1">
                  Choose a New Password
                </h1>
                <p className="text-sm text-on-surface-variant">
                  Enter a new password for your account
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-error-container text-on-error-container text-sm flex items-start gap-2">
                  <span className="material-symbols-outlined text-lg">
                    error
                  </span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">
                    lock
                  </span>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 characters)"
                    className={inputClass}
                  />
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">
                    lock
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}