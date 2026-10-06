'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authAPI } from '@/lib/api';
import { FadeUp } from '@/components/ui/MotionDiv';

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-surface-container-high focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none text-sm text-on-surface transition-all';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    whatsapp: '',
    address: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        whatsapp: user.whatsapp || '',
        address: user.address || '',
      });
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-surface-container rounded-2xl" />
        <div className="h-64 bg-surface-container rounded-2xl" />
      </div>
    );
  }

    const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setProfileMessage({
        type: 'error',
        text: 'First name and last name are required.',
      });
      return;
    }

    setSavingProfile(true);
    try {
      const res = await authAPI.updateProfile(form);
      useAuth.setState({ user: { ...user, ...res.data.data.user } });
      setProfileMessage({ type: 'success', text: 'Profile updated.' });
      setEditing(false);
    } catch (error: any) {
      setProfileMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to update profile. Please try again.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({
        type: 'error',
        text: 'New password must be at least 6 characters.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to update password. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const details = [
    { icon: 'badge', label: 'Full Name', value: `${user.firstName} ${user.lastName}` },
    { icon: 'mail', label: 'Email', value: user.email },
    { icon: 'call', label: 'Phone', value: user.phone || '—' },
    { icon: 'chat', label: 'WhatsApp', value: user.whatsapp || '—' },
    { icon: 'home', label: 'Address', value: user.address || '—' },
    {
      icon: 'calendar_month',
      label: 'Member Since',
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : '—',
    },
  ];

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary rounded-3xl p-8 text-white">
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl font-bold shadow-lg">
              {user.firstName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm opacity-90 mt-1">{user.email}</p>
            </div>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b border-surface-container">
            <span className="material-symbols-outlined text-primary">
              person
            </span>
                        <h2 className="font-bold text-on-surface">Account Details</h2>
            {!editing && (
              <button
                onClick={() => {
                  setProfileMessage(null);
                  setEditing(true);
                }}
                className="ml-auto text-xs font-bold text-primary hover:underline"
              >
                Edit
              </button>
            )}
          </div>
          {profileMessage && (
            <div
              className={`mx-5 mt-5 px-4 py-3 rounded-xl text-sm font-medium ${
                profileMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {profileMessage.text}
            </div>
          )}
          {editing ? (
            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="tel"
                  placeholder="WhatsApp"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className={inputClass}
                />
              </div>
              <input
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputClass}
              />
              <p className="text-xs text-on-surface-variant">
                Email cannot be changed here.
              </p>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setProfileMessage(null);
                    setForm({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      phone: user.phone || '',
                      whatsapp: user.whatsapp || '',
                      address: user.address || '',
                    });
                  }}
                  className="px-6 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-lg">
                    {d.icon}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {d.label}
                  </p>
                  <p className="text-sm font-semibold text-on-surface break-words">
                    {d.value}
                  </p>
                </div>
              </div>
                        ))}
          </div>
          )}
        </div>
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b border-surface-container">
            <span className="material-symbols-outlined text-primary">lock</span>
            <h2 className="font-bold text-on-surface">Change Password</h2>
          </div>
          <form onSubmit={handleChangePassword} className="p-5 space-y-4 max-w-md">
            {message && (
              <div
                className={`px-4 py-3 rounded-xl text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}
            <input
              type="password"
              required
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              required
              placeholder="New password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </FadeUp>
    </div>
  );
}