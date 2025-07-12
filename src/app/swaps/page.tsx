'use client';

import { useAuth } from '@/lib/auth';
import { Navigation } from '@/components/Navigation';
import { Providers } from '@/components/providers';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ChatBubbleLeftRightIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

type Swap = {
  id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  items: {
    id: string;
    title: string;
    images: string[];
    points_value: number;
  };
  profiles: {
    id: string;
    full_name: string;
    email: string;
  };
};

export default function SwapsPage() {
  const { user, profile, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [receivedSwaps, setReceivedSwaps] = useState<Swap[]>([]);
  const [sentSwaps, setSentSwaps] = useState<Swap[]>([]);
  const [loadingSwaps, setLoadingSwaps] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      fetchSwaps();
    }
  }, [mounted, user]);

  const fetchSwaps = async () => {
    if (!user) return;

    try {
      setLoadingSwaps(true);

      // Fetch swaps where user is the requester (sent swaps)
      const { data: sentData } = await supabase
        .from('swaps')
        .select(`
          *,
          items (
            id,
            title,
            images,
            points_value
          ),
          profiles!items(user_id) (
            id,
            full_name,
            email
          )
        `)
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch swaps for items owned by user (received swaps)
      const { data: receivedData } = await supabase
        .from('swaps')
        .select(`
          *,
          items (
            id,
            title,
            images,
            points_value
          ),
          profiles!swaps(requester_id) (
            id,
            full_name,
            email
          )
        `)
        .eq('items.user_id', user.id)
        .order('created_at', { ascending: false });

      setSentSwaps(sentData || []);
      setReceivedSwaps(receivedData || []);
    } catch (error) {
      console.error('Error fetching swaps:', error);
    } finally {
      setLoadingSwaps(false);
    }
  };

  const handleSwapAction = async (swapId: string, action: 'accept' | 'reject') => {
    try {
      const newStatus = action === 'accept' ? 'accepted' : 'rejected';
      
      const { error } = await supabase
        .from('swaps')
        .update({ status: newStatus })
        .eq('id', swapId);

      if (error) throw error;

      // Refresh swaps data
      await fetchSwaps();
      
      alert(`Swap ${action}ed successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing swap:`, error);
      alert(`Failed to ${action} swap. Please try again.`);
    }
  };

  const handleCompleteSwap = async (swapId: string, itemId: string) => {
    try {
      // Update swap status to completed
      const { error: swapError } = await supabase
        .from('swaps')
        .update({ status: 'completed' })
        .eq('id', swapId);

      if (swapError) throw swapError;

      // Update item status to swapped
      const { error: itemError } = await supabase
        .from('items')
        .update({ status: 'swapped' })
        .eq('id', itemId);

      if (itemError) throw itemError;

      // Refresh swaps data
      await fetchSwaps();
      
      alert('Swap completed successfully!');
    } catch (error) {
      console.error('Error completing swap:', error);
      alert('Failed to complete swap. Please try again.');
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Swaps...</p>
        </div>
      </div>
    );
  }

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="card p-8 max-w-md">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">You need to be signed in to manage swaps.</p>
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
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mr-4">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient">
                Swap Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your swap requests and offers
              </p>
            </div>
          </div>
        </div>

        {loadingSwaps ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading swaps...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Received Swaps */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <UserIcon className="h-6 w-6 mr-2 text-emerald-600" />
                Received Swap Requests
              </h2>
              
              {receivedSwaps.length === 0 ? (
                <div className="text-center py-8">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No received swap requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedSwaps.map((swap) => (
                    <div key={swap.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                          {swap.items?.images && swap.items.images.length > 0 ? (
                            <img 
                              src={swap.items.images[0]} 
                              alt={swap.items.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium">{swap.items?.title}</h3>
                          <p className="text-sm text-gray-500">
                            Requested by {swap.profiles?.full_name || swap.profiles?.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(swap.created_at).toLocaleDateString()}
                          </p>
                          
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {swap.status === 'pending' && <ClockIcon className="h-3 w-3 mr-1" />}
                              {swap.status === 'accepted' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                              {swap.status === 'rejected' && <XCircleIcon className="h-3 w-3 mr-1" />}
                              {swap.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {swap.status === 'pending' && (
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => handleSwapAction(swap.id, 'accept')}
                            className="btn-primary text-sm px-3 py-1"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleSwapAction(swap.id, 'reject')}
                            className="btn-secondary text-sm px-3 py-1"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {swap.status === 'accepted' && (
                        <div className="mt-4">
                          <button
                            onClick={() => handleCompleteSwap(swap.id, swap.items.id)}
                            className="btn-primary text-sm px-3 py-1"
                          >
                            Complete Swap
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sent Swaps */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-blue-600" />
                Sent Swap Requests
              </h2>
              
              {sentSwaps.length === 0 ? (
                <div className="text-center py-8">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No sent swap requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentSwaps.map((swap) => (
                    <div key={swap.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                          {swap.items?.images && swap.items.images.length > 0 ? (
                            <img 
                              src={swap.items.images[0]} 
                              alt={swap.items.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium">{swap.items?.title}</h3>
                          <p className="text-sm text-gray-500">
                            Owner: {swap.profiles?.full_name || swap.profiles?.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(swap.created_at).toLocaleDateString()}
                          </p>
                          
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {swap.status === 'pending' && <ClockIcon className="h-3 w-3 mr-1" />}
                              {swap.status === 'accepted' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                              {swap.status === 'rejected' && <XCircleIcon className="h-3 w-3 mr-1" />}
                              {swap.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {swap.status === 'rejected' && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-700">
                            <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" />
                            Your swap request was rejected by the item owner.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 