'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { User, Booking, Payment } from '@/types';
import { FadeUp } from '@/components/ui/MotionDiv';

type UserDetail = User & {
  bookings?: Booking[];
  payments?: Payment[];
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingRole, setUpdatingRole] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data.data.user);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load user.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const toggleRole = async () => {
    if (!user) return;
    const nextRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Change this user's role to ${nextRole}?`)) return;
    setUpdatingRole(true);
    try {
      await api.put(`/users/${user.id}/role`, { role: nextRole });
      setUser({ ...user, role: nextRole });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update role.');
    } finally {
      setUpdatingRole(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-surface-container rounded-2xl" />
        <div className="h-64 bg-surface-container rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <h2 className="font-bold text-on-surface mb-2">
          {error || 'User not found'}
        </h2>
        <Link
          href="/admin/users"
          className="text-sm font-bold text-tertiary hover:underline"
        >
          ← Back to Users
        </Link>
      </div>
    );
  }

  const bookings = user.bookings || [];
  const payments = user.payments || [];
  const totalPaid = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="bg-gradient-to-br from-tertiary to-primary rounded-3xl p-8 text-white">
          <Link
            href="/admin/users"
            className="text-xs font-bold opacity-90 hover:underline"
          >
            ← Back to Users
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl font-bold">
                {user.firstName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-sm opacity-90">{user.email}</p>
              </div>
            </div>
            <button
              onClick={toggleRole}
              disabled={updatingRole}
              className="px-5 py-2.5 rounded-xl bg-white text-primary font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
            >
              {updatingRole
                ? 'Updating...'
                : user.role === 'ADMIN'
                ? 'Make Pilgrim'
                : 'Make Admin'}
            </button>
          </div>
        </div>
      </FadeUp>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <FadeUp delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Role', value: user.role },
            { label: 'Bookings', value: bookings.length.toString() },
            { label: 'Payments', value: payments.length.toString() },
            { label: 'Total Paid', value: `LKR ${totalPaid.toLocaleString()}` },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg"
            >
              <div className="text-xl font-bold text-on-surface">{s.value}</div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </FadeUp>

      <FadeUp delay={0.15}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Phone
            </p>
            <p className="font-semibold text-on-surface">{user.phone || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              WhatsApp
            </p>
            <p className="font-semibold text-on-surface">
              {user.whatsapp || '—'}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Address
            </p>
            <p className="font-semibold text-on-surface">
              {user.address || '—'}
            </p>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.2}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-5 border-b border-surface-container">
            <h2 className="font-bold text-on-surface">Bookings</h2>
          </div>
          {bookings.length === 0 ? (
            <p className="p-5 text-sm text-on-surface-variant">
              No bookings yet.
            </p>
          ) : (
            <div className="divide-y divide-surface-container">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      {b.package?.name || 'Package'}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {b.bookingRef} • {b.bookingStatus.replace(/_/g, ' ')} • LKR{' '}
                      {b.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href={`/admin/bookings/${b.id}`}
                    className="text-xs font-bold text-tertiary hover:underline"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeUp>
    </div>
  );
}