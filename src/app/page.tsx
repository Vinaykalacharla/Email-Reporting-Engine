'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      // Role-Based dynamic routing or general redirect can happen here as requested
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" aria-label="Loading..." />
    </div>
  );
}
