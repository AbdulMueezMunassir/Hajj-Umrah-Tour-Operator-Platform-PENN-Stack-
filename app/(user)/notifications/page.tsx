'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { notificationAPI } from '@/lib/api';
import { Notification } from '@/types';
import { FadeUp } from '@/components/ui/MotionDiv';

const typeIcon: Record<string, string> = {
  BOOKING: 'receipt_long',
  PAYMENT: 'payments',
  SYSTEM: 'campaign',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/notifications');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await notificationAPI.list({ limit: 100 });
        setNotifications(res.data.data.notifications || []);
      } catch (err: any) {
        setError(
          err.response?.data?.message || 'Failed to load notifications.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [isAuthenticated]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const visible =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkRead = async (n: Notification) => {
    if (n.read) return;
    try {
      await notificationAPI.markRead(n.id);
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications((prev) => prev.map((x) => ({ ...x, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationAPI.delete(id);
      setNotifications((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-surface-container rounded-2xl" />
        <div className="h-20 bg-surface-container rounded-2xl" />
        <div className="h-20 bg-surface-container rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary rounded-3xl p-8 text-white">
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/20 mb-2">
                <span className="material-symbols-outlined text-xs">
                  notifications
                </span>
                Notifications
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold">Your Updates</h1>
              <p className="text-sm opacity-90 mt-1">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : 'You are all caught up'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-5 py-2.5 rounded-xl bg-white text-primary font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </FadeUp>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <FadeUp delay={0.1}>
        <div className="flex gap-1 p-1 bg-surface-container rounded-xl w-fit">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-primary text-white shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </FadeUp>

      <FadeUp delay={0.15}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl shadow-lg overflow-hidden">
          {visible.length === 0 ? (
            <div className="text-center py-12 px-6">
              <span className="material-symbols-outlined text-5xl text-outline">
                notifications_off
              </span>
              <h3 className="font-bold text-on-surface mt-3">
                No notifications
              </h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Booking and payment updates will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-surface-container">
              {visible.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n)}
                  className={`p-4 flex items-start gap-3 transition-colors ${
                    n.read
                      ? ''
                      : 'bg-primary-fixed/20 cursor-pointer hover:bg-primary-fixed/30'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-xl">
                      {typeIcon[n.type] || 'notifications'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-on-surface">
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      {n.message}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 mt-1">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(n.id);
                    }}
                    aria-label="Delete notification"
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-surface-container transition"
                  >
                    <span className="material-symbols-outlined text-lg">
                      close
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeUp>
    </div>
  );
}