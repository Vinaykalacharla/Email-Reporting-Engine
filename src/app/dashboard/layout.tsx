'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Loader2, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
         <Loader2 className="w-8 h-8 text-blue-600 animate-spin" aria-label="Authenticating..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top Navbar specifically rendering Logged-in Details as requested implicitly for auth status */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            {user?.role === 'Admin' ? 'A' : user?.role === 'Marketer' ? 'M' : 'V'}
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">
            {user?.role} Access
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {user?.email}
          </span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>
      {children}
    </div>
  );
}
