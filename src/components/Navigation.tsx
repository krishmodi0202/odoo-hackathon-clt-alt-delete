'use client';

import { useAuth } from '@/lib/auth';
import { APP_CONFIG } from '@/lib/constants';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Navigation() {
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">{APP_CONFIG.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">{APP_CONFIG.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="btn-outline text-sm">
                  Dashboard
                </Link>
                <Link href="/browse" className="btn-outline text-sm">
                  Browse Items
                </Link>
                <Link href="/swaps" className="btn-outline text-sm">
                  Swaps
                </Link>
                <Link href="/items/add" className="btn-outline text-sm">
                  List Item
                </Link>
                <Link href="/admin/login" className="btn-outline text-sm bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
                  Admin
                </Link>
                <button onClick={signOut} className="btn-secondary text-sm">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="btn-outline text-sm">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 