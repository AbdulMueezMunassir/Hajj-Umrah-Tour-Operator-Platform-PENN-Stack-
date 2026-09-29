'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

interface SentNotification {
  id: string;
  title: string;
  message: string;
  audience: string;
  type: string;
  sentAt: string;
  recipients: number;
}

const MOCK_SENT: SentNotification[] = [
  {
    id: '1',
    title: 'New Ramadhan Package Available',
    message: 'Our 1447H Ramadhan Umrah packages are now open for booking.',
    audience: 'All Users',
    type: 'promotional',
    sentAt: '2026-09-25T10:00:00Z',
    recipients: 4,
  },
  {
    id: '2',
    title: 'Payment Reminder',
    message: 'Reminder to complete your advance payment to secure your seat.',
    audience: 'Customers with Pending Payments',
    type: 'reminder',
    sentAt: '2026-09-23T14:30:00Z',
    recipients: 3,
  },
];

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');
  const [type, setType] = useState('info');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<SentNotification[]>(MOCK_SENT);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setSending(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));

    const audienceLabels: Record<string, string> = {
      all: 'All Users',
      pilgrims: 'Pilgrims Only',
      admins: 'Admins Only',
      'upcoming-trips': 'Pilgrims with Upcoming Trips',
      'pending-payments': 'Customers with Pending Payments',
    };

    setSent([
      {
        id: Date.now().toString(),
        title,
        message,
        audience: audienceLabels[audience] || audience,
        type,
        sentAt: new Date().toISOString(),
        recipients: audience === 'all' ? 4 : audience === 'pilgrims' ? 3 : 1,
      },
      ...sent,
    ]);

    setTitle('');
    setMessage('');
    setSending(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeUp>
        <div className="relative overflow-hidden bg-gradient-to-br from-tertiary via-tertiary-container to-primary rounded-3xl p-6 lg:p-8 text-white shadow-xl">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/20 blur-3xl pointer-events-none"
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/20 mb-3">
              <span className="material-symbols-outlined text-xs">
                notifications
              </span>
              Notifications
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">
              Send Notification
            </h1>
            <p className="text-sm opacity-90 mt-1">
              Broadcast messages to your pilgrims
            </p>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className="lg:col-span-2">
          <FadeUp delay={0.1}>
            <form
              onSubmit={handleSend}
              className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg space-y-4"
            >
              <h2 className="font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">
                  edit_note
                </span>
                Compose Notification
              </h2>

              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New Ramadhan Package Available"
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 outline-none text-sm transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your notification message..."
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 outline-none text-sm transition-all resize-none"
                />
              </div>

              {/* Audience + Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                    Target Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                  >
                    <option value="all">All Users</option>
                    <option value="pilgrims">Pilgrims Only</option>
                    <option value="admins">Admins Only</option>
                    <option value="upcoming-trips">Pilgrims with Upcoming Trips</option>
                    <option value="pending-payments">Customers with Pending Payments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-tertiary mb-1.5">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-surface-container-high focus:border-tertiary outline-none text-sm"
                  >
                    <option value="info">Info</option>
                    <option value="promotional">Promotional</option>
                    <option value="reminder">Reminder</option>
                    <option value="urgent">Urgent</option>
                    <option value="update">Update</option>
                  </select>
                </div>
              </div>

              {/* Send Button */}
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: sending ? 1 : 1.02 }}
                whileTap={{ scale: sending ? 1 : 0.98 }}
                className="w-full py-3 rounded-xl bg-tertiary hover:bg-tertiary-container text-white font-bold text-sm shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {sending ? (
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
                    Send Notification
                  </>
                )}
              </motion.button>
            </form>
          </FadeUp>
        </div>

        {/* Preview + Info */}
        <div className="space-y-4">
          <FadeUp delay={0.15}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-lg">
                  visibility
                </span>
                Preview
              </h3>

              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-start gap-2 mb-2">
                  <span className="material-symbols-outlined text-tertiary text-lg">
                    notifications
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-on-surface text-sm truncate">
                      {title || 'Notification Title'}
                    </p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      Just now
                    </p>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {message || 'Your notification message will appear here...'}
                </p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-lg">
                  info
                </span>
                Tips
              </h3>
              <ul className="space-y-2 text-xs text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-tertiary text-sm mt-0.5">
                    check_circle
                  </span>
                  Keep titles under 60 characters
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-tertiary text-sm mt-0.5">
                    check_circle
                  </span>
                  Use urgent type for visa deadlines
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-tertiary text-sm mt-0.5">
                    check_circle
                  </span>
                  Target specific groups for better engagement
                </li>
              </ul>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Sent History */}
      <FadeUp delay={0.25}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-6 shadow-lg">
          <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">
              history
            </span>
            Recent Notifications ({sent.length})
          </h2>

          {sent.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-5xl text-outline">
                notifications_off
              </span>
              <p className="text-sm text-on-surface-variant mt-2">
                No notifications sent yet
              </p>
            </div>
          ) : (
            <StaggerContainer className="space-y-3">
              {sent.map((n) => (
                <StaggerItem key={n.id}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low border border-surface-container"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        n.type === 'urgent'
                          ? 'bg-error-container text-on-error-container'
                          : n.type === 'promotional'
                          ? 'bg-tertiary-fixed/40 text-tertiary'
                          : 'bg-primary-fixed/40 text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {n.type === 'urgent'
                          ? 'priority_high'
                          : n.type === 'promotional'
                          ? 'campaign'
                          : 'notifications'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-bold text-on-surface text-sm truncate">
                          {n.title}
                        </p>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                          {n.audience}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-2">
                        {n.message}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">
                            group
                          </span>
                          {n.recipients} recipients
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">
                            schedule
                          </span>
                          {new Date(n.sentAt).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </FadeUp>
    </div>
  );
}