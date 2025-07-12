'use client';

import { useAuth } from '@/lib/auth';
import { Navigation } from '@/components/Navigation';
import { Providers } from '@/components/providers';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  HeartIcon, 
  PencilIcon,
  PlusIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function MyItemsPage() {
  const { user, profile, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [userItems, setUserItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'pending' | 'swapped'>('all');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (loading) return;

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    fetchUserItems();
  }, [mounted, loading, user, router]);

  const fetchUserItems = useCallback(async () => {
    if (!user) return;

    try {
      setLoadingItems(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserItems(data || []);
    } catch (error) {
      console.error('Error fetching user items:', error);
    } finally {
      setLoadingItems(false);
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />;
      case 'swapped':
        return <XCircleIcon className="h-4 w-4 text-gray-600" />;
      default:
        return <HeartIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'swapped':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredItems = userItems.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading || loadingItems) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gradient mb-2">
                  My Items
                </h1>
                <p className="text-xl text-gray-600">
                  Manage your listed items and track their status
                </p>
              </div>
              <Link 
                href="/items/add" 
                className="btn-primary flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New Item
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg mr-4">
                  <HeartIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{userItems.length}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userItems.filter(item => item.status === 'available').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userItems.filter(item => item.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg mr-4">
                  <XCircleIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Swapped</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userItems.filter(item => item.status === 'swapped').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {[
                { key: 'all', label: 'All Items', count: userItems.length },
                { key: 'available', label: 'Available', count: userItems.filter(item => item.status === 'available').length },
                { key: 'pending', label: 'Pending', count: userItems.filter(item => item.status === 'pending').length },
                { key: 'swapped', label: 'Swapped', count: userItems.filter(item => item.status === 'swapped').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="card p-12 text-center">
              <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No items yet' : `No ${filter} items`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Start by listing your first item to begin your sustainable fashion journey!'
                  : `You don't have any ${filter} items at the moment.`
                }
              </p>
              {filter === 'all' && (
                <Link href="/items/add" className="btn-primary">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  List Your First Item
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {item.images && item.images.length > 0 ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HeartIcon className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status}</span>
                      </span>
                    </div>

                    {/* Points Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                        {item.points_value}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="capitalize">{item.category}</span> • <span className="capitalize">{item.type}</span>
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
                          className="text-emerald-600 hover:text-emerald-500 text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Providers>
  );
} 