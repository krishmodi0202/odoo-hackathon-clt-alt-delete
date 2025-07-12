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
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon
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
    currentPoints: 0,
    memberSince: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!user) return;

    try {
      console.log('Fetching user data for:', user.id);
      console.log('Current profile:', profile);

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

      // Fetch profile data if not available
      let profileData = profile;
      if (!profileData) {
        const { data: fetchedProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        profileData = fetchedProfile;
        console.log('Fetched profile data:', fetchedProfile);
      }

      // Calculate stats
      const itemsListed = itemsData?.length || 0;
      const successfulSwaps = swapsData?.filter(swap => swap.status === 'completed').length || 0;
      const pointsEarned = itemsData?.reduce((sum, item) => {
        if (item.status === 'swapped') return sum + item.points_value;
        return sum;
      }, 0) || 0;

      // Get current points from profile
      const currentPoints = profileData?.points || 0;
      
      console.log('Profile points:', profileData?.points);
      console.log('Calculated current points:', currentPoints);

      setStats({
        itemsListed,
        successfulSwaps,
        pointsEarned,
        currentPoints,
        memberSince: new Date(user.created_at).toLocaleDateString()
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [user, profile]);

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

        {/* Points Display Section */}
        <div className="mb-12">
          <div className="card p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl mr-6">
                  <CurrencyDollarIcon className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Points Balance</h2>
                  <p className="text-gray-600">Earn points by swapping items and participating in the community</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-amber-600 mb-2">{stats.currentPoints}</div>
                <div className="text-sm text-gray-500">Total Points</div>
              </div>
            </div>
            
            {/* Points breakdown */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-emerald-600 mb-1">{stats.currentPoints}</div>
                <div className="text-sm text-gray-600">Current Balance</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats.pointsEarned}</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">{stats.successfulSwaps}</div>
                <div className="text-sm text-gray-600">Successful Swaps</div>
              </div>
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
                <p className="text-sm font-medium text-gray-600">Current Points</p>
                <p className="text-2xl font-bold text-gray-900">{stats.currentPoints}</p>
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

        {/* Quick Actions and Points Info */}
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

              <Link 
                href="/swaps" 
                className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600 mr-3" />
                  <span className="font-medium">Manage Swaps</span>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400" />
              </Link>

              <Link 
                href="/my-items" 
                className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <div className="flex items-center">
                  <PencilIcon className="h-6 w-6 text-orange-600 mr-3" />
                  <span className="font-medium">Manage My Items</span>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-2xl font-bold mb-4">How to Earn Points</h3>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <SparklesIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">List an Item</p>
                  <p className="text-sm text-gray-600">Earn 10 points for each item you list</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <HeartIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Complete a Swap</p>
                  <p className="text-sm text-gray-600">Earn points equal to the item's value</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Welcome Bonus</p>
                  <p className="text-sm text-gray-600">Get 100 points when you join</p>
                </div>
              </div>
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
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <HeartIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        Listed on {new Date(item.created_at).toLocaleDateString()}
                        {item.status !== 'available' && (
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'swapped' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {item.status}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.status === 'available' && (
                        <Link 
                          href={`/items/${item.id}/edit`} 
                          className="text-blue-600 hover:text-blue-500 p-1 rounded hover:bg-blue-50"
                          title="Edit Item"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                      )}
                      <Link 
                        href={`/items/${item.id}`} 
                        className="text-emerald-600 hover:text-emerald-500"
                        title="View Item"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
                
                {userSwaps.slice(0, 3).map((swap) => (
                  <div key={swap.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                      {swap.items?.images && swap.items.images.length > 0 ? (
                        <img 
                          src={swap.items.images[0]} 
                          alt={swap.items.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <HeartIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Swap request for {swap.items?.title}</p>
                      <p className="text-sm text-gray-500">
                        Status: <span className={`font-medium ${
                          swap.status === 'pending' ? 'text-yellow-600' :
                          swap.status === 'accepted' ? 'text-green-600' :
                          swap.status === 'rejected' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>{swap.status}</span>
                      </p>
                    </div>
                    <Link href={`/items/${swap.item_id}`} className="text-emerald-600 hover:text-emerald-500">
                      View
                    </Link>
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