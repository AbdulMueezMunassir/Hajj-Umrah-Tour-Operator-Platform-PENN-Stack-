'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import {
  GoogleIcon,
  FacebookIcon,
  AppleIcon,
  SocialDivider,
} from '@/components/ui/SocialIcons';

// Password strength calculator
function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2)
    return { score: 1, label: 'Weak', color: 'bg-error', textColor: 'text-error' };
  if (score <= 3)
    return { score: 2, label: 'Fair', color: 'bg-gold', textColor: 'text-gold' };
  if (score <= 4)
    return { score: 3, label: 'Good', color: 'bg-primary-fixed', textColor: 'text-primary' };
  return { score: 4, label: 'Strong', color: 'bg-primary', textColor: 'text-primary' };
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const passwordStrength = getPasswordStrength(form.password);
  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!form.agreeTerms) {
      setError('Please agree to the Terms & Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Social signup with ${provider}`);
    alert(`${provider} signup will be available soon. Please use email/password.`);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* ============ LEFT SIDE — IMAGE ============ */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-primary">
        <img
          src="https://images.unsplash.com/photo-1537444532052-02afbc2b5e77?w=1200&q=80"
          alt="Masjid an-Nabawi"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-primary-light/70" />

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

        <div className="relative z-10 px-16 text-white max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold border border-white/20 mb-6"
          >
            <span className="material-symbols-outlined text-sm text-tertiary-fixed">
              celebration
            </span>
            Start Your Sacred Journey Today
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl lg:text-5xl font-bold leading-tight mb-4"
          >
            Begin Your{' '}
            <span className="text-tertiary-fixed">Spiritual Journey</span> with
            MHK Travels
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg opacity-90 leading-relaxed mb-8"
          >
            Create your free account and book premium Hajj &amp; Umrah packages
            with just 20% advance. Track everything in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="space-y-4"
          >
            {[
              {
                icon: 'flight_takeoff',
                title: 'Book in Minutes',
                desc: 'Secure flights with 20% advance via PayHere',
              },
              {
                icon: 'track_changes',
                title: 'Track Your Journey',
                desc: 'Real-time updates on visa, documents, and travel',
              },
              {
                icon: 'support_agent',
                title: '24/7 Support',
                desc: 'Dedicated guide throughout your pilgrimage',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-tertiary-fixed text-2xl mt-0.5">
                  {item.icon}
                </span>
                <div>
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-xs opacity-80">{item.desc}</p>
                </div>
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

          <div className="relative">
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
              <div className="text-center mb-6">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-on-surface mb-1"
                >
                  Create Account
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm text-on-surface-variant"
                >
                  Join Sri Lanka&apos;s trusted pilgrimage platform
                </motion.p>
              </div>

              {/* Social Signup */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-2"
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

              <SocialDivider text="OR SIGN UP WITH EMAIL" />

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

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-primary">
                      First Name
                    </label>
                    <div className="relative">
                      <span
                        className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg transition-colors ${
                          focusedField === 'firstName'
                            ? 'text-primary'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        person
                      </span>
                      <input
                        type="text"
                        required
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        onFocus={() => setFocusedField('firstName')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Mohamed"
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-sm text-on-surface transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-primary">
                      Last Name
                    </label>
                    <div className="relative">
                      <span
                        className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg transition-colors ${
                          focusedField === 'lastName'
                            ? 'text-primary'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        person
                      </span>
                      <input
                        type="text"
                        required
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                        onFocus={() => setFocusedField('lastName')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Rizwan"
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-sm text-on-surface transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
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
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-primary">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span
                      className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg transition-colors ${
                        focusedField === 'phone'
                          ? 'text-primary'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      phone
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="+94 77 123 4567"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-sm text-on-surface transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
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
                      placeholder="Create a strong password"
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

                  {/* Password Strength Meter */}
                  {form.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1.5 pt-1"
                    >
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= passwordStrength.score
                                ? passwordStrength.color
                                : 'bg-surface-container-high'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span
                          className={`font-bold uppercase tracking-wider ${passwordStrength.textColor}`}
                        >
                          {passwordStrength.label}
                        </span>
                        <span className="text-on-surface-variant">
                          Min 6 characters
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-primary">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span
                      className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg transition-colors ${
                        focusedField === 'confirmPassword'
                          ? 'text-primary'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      lock_reset
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Re-enter password"
                      className={`w-full pl-11 pr-12 py-3 rounded-xl bg-white/70 backdrop-blur-sm border outline-none text-sm text-on-surface transition-all ${
                        passwordsMismatch
                          ? 'border-error focus:border-error focus:ring-error/20'
                          : passwordsMatch
                          ? 'border-primary focus:border-primary focus:ring-primary/20'
                          : 'border-surface-container-high focus:border-primary focus:ring-primary/20'
                      } focus:bg-white`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>

                    {passwordsMatch && (
                      <span className="absolute right-10 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-lg">
                        check_circle
                      </span>
                    )}
                  </div>
                  {passwordsMismatch && (
                    <p className="text-[10px] text-error font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">
                        error
                      </span>
                      Passwords do not match
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-2 cursor-pointer group pt-1">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={(e) =>
                        setForm({ ...form, agreeTerms: e.target.checked })
                      }
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                        form.agreeTerms
                          ? 'bg-primary border-primary'
                          : 'bg-white border-surface-container-high group-hover:border-primary/40'
                      }`}
                    >
                      {form.agreeTerms && (
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
                  <span className="text-xs text-on-surface-variant leading-relaxed">
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="text-primary font-semibold hover:underline"
                    >
                      Terms &amp; Conditions
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-primary font-semibold hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                {/* Submit */}
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">
                        person_add
                      </span>
                      Create Account
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-center text-sm text-on-surface-variant mt-6">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-bold text-primary hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}