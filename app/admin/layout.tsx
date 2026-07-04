'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) { router.replace('/login'); return; }
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        router.replace('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') return null;

  return <>{children}</>;
}
