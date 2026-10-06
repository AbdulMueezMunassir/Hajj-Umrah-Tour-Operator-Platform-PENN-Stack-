'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/MotionDiv';

const channels = [
  {
    icon: 'chat',
    title: 'WhatsApp',
    value: '+94 776 290 290',
    href: 'https://wa.me/94776290290',
    external: true,
  },
  {
    icon: 'call',
    title: 'Call Us',
    value: '(+94) 776 290 290',
    href: 'tel:+94776290290',
    external: false,
  },
  {
    icon: 'mail',
    title: 'Email',
    value: 'info@mhktravels.com',
    href: 'mailto:info@mhktravels.com',
    external: false,
  },
  {
    icon: 'help',
    title: 'FAQ',
    value: 'Common questions answered',
    href: '/faq',
    external: false,
  },
];

export default function SupportPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/support');
    }
  }, [authLoading, isAuthenticated, router]);

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary rounded-3xl p-8 text-white">
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider border border-white/20 mb-2">
              <span className="material-symbols-outlined text-xs">
                support_agent
              </span>
              Support
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold">How can we help?</h1>
            <p className="text-sm opacity-90 mt-1">
              Reach our team about bookings, payments or travel documents.
            </p>
          </div>
        </div>
      </FadeUp>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {channels.map((c) => {
          const card = (
            <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-4 h-full">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  {c.icon}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-on-surface">{c.title}</p>
                <p className="text-sm text-on-surface-variant truncate">
                  {c.value}
                </p>
              </div>
            </div>
          );
          return (
            <StaggerItem key={c.title}>
              {c.external ? (
                <a href={c.href} target="_blank" rel="noopener noreferrer">
                  {card}
                </a>
              ) : c.href.startsWith('/') ? (
                <Link href={c.href}>{card}</Link>
              ) : (
                <a href={c.href}>{card}</a>
              )}
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      <FadeUp delay={0.2}>
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-on-surface">Need to send a message?</h2>
            <p className="text-sm text-on-surface-variant">
              Use our contact form and we will get back to you.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg transition-all"
          >
            Contact Form
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}