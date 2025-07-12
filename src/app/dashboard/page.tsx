'use client';

import { useAuth } from '@/lib/auth';
import { Navigation } from '@/components/Navigation';
import { Providers } from '@/components/providers';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  UserIcon, 
  SparklesIcon, 
  HeartIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [userItems, setUserItems] = useState<any[]>([]);
  const [userSwaps, setUserSwaps] = useState<any[]>([]);
  const [stats, setStats] = useState({
    itemsListed: 0,
    successfulSwaps: 0,
    pointsEarned: 0,
    memberSince: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch user's items
      const { data: itemsData } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch user's swaps
      const { data: swapsData } = await supabase
        .from('swaps')
        .select(`
          *,
          items (
            id,
            title,
            images
          )
        `)
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      setUserItems(itemsData || []);
      setUserSwaps(swapsData || []);

      // Calculate stats
      const itemsListed = itemsData?.length || 0;
      const successfulSwaps = swapsData?.filter(swap => swap.status === 'completed').length || 0;
      const pointsEarned = itemsData?.reduce((sum, item) => {
        if (item.status === 'swapped') return sum + item.points_value;
        return sum;
      }, 0) || 0;

      setStats({
        itemsListed,
        successfulSwaps,
        pointsEarned,
        memberSince: new Date(user.created_at).toLocaleDateString()
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [user]);

  useEffect(() => {
    if (mounted && user) {
      fetchUserData();
    }
  }, [mounted, user, fetchUserData]);

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="card p-8 max-w-md">
            <SparklesIcon className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">You need to be signed in to access the dashboard.</p>
            <Link href="/auth/signin" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mr-4">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient">
                Welcome back, {profile?.full_name || user.email?.split('@')[0] || 'Fashionista'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Ready to continue your sustainable fashion journey?
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg mr-4">
                <HeartIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Items Listed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.itemsListed}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <SparklesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Successful Swaps</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successfulSwaps}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg mr-4">
                <CurrencyDollarIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pointsEarned}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Member Since</p>
                <p className="text-2xl font-bold text-gray-900">{stats.memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-8">
            <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <Link 
                href="/items/add" 
                className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <div className="flex items-center">
                  <SparklesIcon className="h-6 w-6 text-emerald-600 mr-3" />
                  <span className="font-medium">List New Item</span>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400" />
              </Link>
              
              <Link 
                href="/browse" 
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <HeartIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="font-medium">Browse Items</span>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-2xl font-bold mb-4">Recent Activity</h3>
            {userItems.length === 0 && userSwaps.length === 0 ? (
              <div className="text-center py-8">
                <SparklesIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity yet</p>
                <p className="text-sm text-gray-400 mt-2">Start by listing your first item!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                      <HeartIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        Listed on {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'available' ? 'bg-green-100 text-green-800' :
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
                {userSwaps.slice(0, 3).map((swap) => (
                  <div key={swap.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                      <SparklesIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Swap request for {swap.items?.title}</p>
                      <p className="text-sm text-gray-500">
                        Requested on {new Date(swap.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      swap.status === 'completed' ? 'bg-green-100 text-green-800' :
                      swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {swap.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 