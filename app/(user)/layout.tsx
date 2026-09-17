'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import UserSidebar from '@/components/layout/UserSidebar';

export default function UserLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <div className="container-mhk py-6">
        {isAuthenticated ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
              <UserSidebar />
            </aside>
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        ) : (
          <div className="w-full">{children}</div>
        )}
      </div>
    </div>
  );
}