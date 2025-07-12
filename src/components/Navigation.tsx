'use client';

import { useAuth } from '@/lib/auth';
import { APP_CONFIG } from '@/lib/constants';
import { SparklesIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Navigation() {
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Navigation links component to avoid code duplication
  const NavigationLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`${isMobile ? 'flex flex-col space-y-3 p-4' : 'hidden md:flex items-center space-x-2'}`}>
      {user ? (
        <>
          <Link 
            href="/dashboard" 
            className={`${isMobile ? 'w-full text-left' : ''} btn-outline text-sm`}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            href="/browse" 
            className={`${isMobile ? 'w-full text-left' : ''} btn-outline text-sm`}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            Browse Items
          </Link>
          <Link 
            href="/swaps" 
            className={`${isMobile ? 'w-full text-left' : ''} btn-outline text-sm`}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            Swaps
          </Link>
          <Link 
            href="/items/add" 
            className={`${isMobile ? 'w-full text-left' : ''} btn-outline text-sm`}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            List Item
          </Link>
          <Link 
            href="/admin/login" 
            className={`${isMobile ? 'w-full text-left' : ''} btn-outline text-sm bg-red-50 text-red-700 border-red-200 hover:bg-red-100`}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            Admin
          </Link>
          <button 
            onClick={() => {
              signOut();
              isMobile && setMobileMenuOpen(false);
            }} 
            className={`${isMobile ? 'w-full text-left' : ''} btn-secondary text-sm`}
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <Link 
            href="/auth/signin" 
            className={`${isMobile ? 'w-full text-left' : ''} btn-outline text-sm`}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link 
            href="/auth/signup" 
            className={`${isMobile ? 'w-full text-left' : ''} btn-primary text-sm`}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            Get Started
          </Link>
        </>
      )}
    </div>
  );

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">{APP_CONFIG.name}</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <NavigationLinks />
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <NavigationLinks isMobile />
        </div>
      )}
    </nav>
  );
}