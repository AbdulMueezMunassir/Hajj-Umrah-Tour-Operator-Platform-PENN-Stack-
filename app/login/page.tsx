'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import {
  GoogleIcon,
  FacebookIcon,
  AppleIcon,
  SocialDivider,
} from '@/components/ui/SocialIcons';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { login, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(form.email, form.password, form.rememberMe);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login
    // For now, show a toast
    console.log(`Social login with ${provider}`);
    alert(`${provider} login will be available soon. Please use email/password.`);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* ============ LEFT SIDE — IMAGE ============ */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-primary">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80"
          alt="Masjid al-Haram"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-primary-light/70" />

        {/* Floating Ornaments */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-tertiary-fixed/30 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl"
        />

        {/* Content */}
        <div className="relative z-10 px-16 text-white max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold border border-white/20 mb-6"
          >
            <span className="material-symbols-outlined text-sm text-tertiary-fixed">
              verified
            </span>
            Trusted by 5,000+ Sri Lankan Pilgrims
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl lg:text-5xl font-bold leading-tight mb-4"
          >
            Welcome Back to Your{' '}
            <span className="text-tertiary-fixed">Sacred Journey</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg opacity-90 leading-relaxed mb-8"
          >
            Access your bookings, track your pilgrimage preparations, and
            manage payments — all in one place.
          </motion.p>

          {/* Trust Points */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="space-y-3"
          >
            {[
              { icon: 'verified_user', text: 'MRCA Registered Operator H-248' },
              { icon: 'lock', text: 'Secure PayHere Payment Gateway' },
              { icon: 'support_agent', text: '24/7 Pilgrim Support Team' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary-fixed text-lg">
                  {item.icon}
                </span>
                <span className="text-sm opacity-90">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ============ RIGHT SIDE — FORM ============ */}
      <div className="relative flex items-center justify-center p-6 lg:p-12 bg-surface">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
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
          <div className="relative">
            {/* Ornamental glow */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative bg-white/70 backdrop-blur-2xl border border-white/90 rounded-3xl p-8 shadow-2xl"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-on-surface mb-1"
                >
                  Welcome Back
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm text-on-surface-variant"
                >
                  Sign in to continue your sacred journey
                </motion.p>
              </div>

              {/* Social Login */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-2 mb-2"
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSocialLogin('Google')}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-surface-container-high hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <GoogleIcon className="w-5 h-5" />
                  <span className="text-xs font-semibold text-on-surface hidden sm:inline">
                    Google
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSocialLogin('Facebook')}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-surface-container-high hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <FacebookIcon className="w-5 h-5" />
                  <span className="text-xs font-semibold text-on-surface hidden sm:inline">
                    Facebook
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSocialLogin('Apple')}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-surface-container-high hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <AppleIcon className="w-5 h-5" />
                  <span className="text-xs font-semibold text-on-surface hidden sm:inline">
                    Apple
                  </span>
                </motion.button>
              </motion.div>

              <SocialDivider text="OR CONTINUE WITH EMAIL" />

              {/* Error Message */}
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-1.5"
                >
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-primary">
                    Email Address
                  </label>
                  <div className="relative">
                    <span
                      className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg transition-colors ${
                        focusedField === 'email'
                          ? 'text-primary'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      mail
                    </span>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-sm text-on-surface transition-all"
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="space-y-1.5"
                >
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-primary">
                    Password
                  </label>
                  <div className="relative">
                    <span
                      className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg transition-colors ${
                        focusedField === 'password'
                          ? 'text-primary'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      lock
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-sm text-on-surface transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </motion.div>

                {/* Remember Me & Forgot */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={form.rememberMe}
                        onChange={(e) =>
                          setForm({ ...form, rememberMe: e.target.checked })
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                          form.rememberMe
                            ? 'bg-primary border-primary'
                            : 'bg-white border-surface-container-high group-hover:border-primary/40'
                        }`}
                      >
                        {form.rememberMe && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="material-symbols-outlined text-white text-xs"
                            style={{ fontVariationSettings: "'wght' 700" }}
                          >
                            check
                          </motion.span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Remember me
                    </span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">
                        login
                      </span>
                      Sign In
                    </>
                  )}
                </motion.button>
              </form>

              {/* Sign Up Link */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center text-sm text-on-surface-variant mt-6"
              >
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="font-bold text-primary hover:underline"
                >
                  Create Account
                </Link>
              </motion.p>
            </motion.div>
          </div>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center items-center gap-4 mt-6 text-[10px] text-on-surface-variant"
          >
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
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function LoginSkeleton() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block bg-primary" />
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-surface-container rounded-xl" />
            <div className="h-12 bg-surface-container rounded-xl" />
            <div className="h-12 bg-surface-container rounded-xl" />
            <div className="h-12 bg-surface-container rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}