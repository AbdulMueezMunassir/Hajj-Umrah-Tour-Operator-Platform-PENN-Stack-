'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect non-admins to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin/dashboard');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="container-mhk py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-surface-container rounded-2xl" />
          <div className="h-64 bg-surface-container rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="container-mhk py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
            <AdminSidebar />
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}