'use client';

import { useAuth } from '@/lib/auth';
import { Navigation } from '@/components/Navigation';
import { Providers } from '@/components/providers';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  HeartIcon, 
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

type Item = Database['public']['Tables']['items']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

export default function ItemDetailPage() {
  const { user, profile, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [item, setItem] = useState<Item | null>(null);
  const [loadingItem, setLoadingItem] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');

  const itemId = params.id as string;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && itemId) {
      fetchItem();
    }
  }, [mounted, itemId]);

  const fetchItem = async () => {
    try {
      setLoadingItem(true);
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          profiles (
            id,
            full_name,
            avatar_url,
            points
          )
        `)
        .eq('id', itemId)
        .single();

      if (error) throw error;
      setItem(data);
    } catch (error) {
      console.error('Error fetching item:', error);
      router.push('/browse');
    } finally {
      setLoadingItem(false);
    }
  };

  const handleSwapRequest = async () => {
    if (!user || !item) return;

    try {
      setSwapLoading(true);
      
      // Check if user has enough points
      if (profile && profile.points < item.points_value) {
        alert('You don\'t have enough points to request this swap.');
        return;
      }

      // Create swap request
      const { error } = await supabase
        .from('swaps')
        .insert({
          requester_id: user.id,
          item_id: item.id,
          status: 'pending'
        });

      if (error) throw error;

      // Update item status to pending
      await supabase
        .from('items')
        .update({ status: 'pending' })
        .eq('id', item.id);

      setShowSwapModal(false);
      alert('Swap request sent successfully!');
      fetchItem(); // Refresh item data
    } catch (error) {
      console.error('Error creating swap request:', error);
      alert('Failed to send swap request. Please try again.');
    } finally {
      setSwapLoading(false);
    }
  };

  const handleRedeemWithPoints = async () => {
    if (!user || !item || !profile) return;

    try {
      setRedeemLoading(true);
      
      // Check if user has enough points
      if (profile.points < item.points_value) {
        alert('You don\'t have enough points to redeem this item.');
        return;
      }

      // Deduct points from user
      const { error: pointsError } = await supabase
        .from('profiles')
        .update({ points: profile.points - item.points_value })
        .eq('id', user.id);

      if (pointsError) throw pointsError;

      // Add points to item owner
      const { error: ownerPointsError } = await supabase
        .from('profiles')
        .update({ points: (item.profiles.points || 0) + item.points_value })
        .eq('id', item.user_id);

      if (ownerPointsError) throw ownerPointsError;

      // Update item status to swapped
      const { error: itemError } = await supabase
        .from('items')
        .update({ status: 'swapped' })
        .eq('id', item.id);

      if (itemError) throw itemError;

      setShowRedeemModal(false);
      alert('Item redeemed successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error redeeming item:', error);
      alert('Failed to redeem item. Please try again.');
    } finally {
      setRedeemLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Item...</p>
        </div>
      </div>
    );
  }

  if (loadingItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
            <p className="text-gray-600 mb-6">The item you're looking for doesn't exist or has been removed.</p>
            <Link href="/browse" className="btn-primary">
              Browse Other Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === item.user_id;
  const canSwap = user && !isOwner && item.status === 'available';
  const canRedeem = user && !isOwner && item.status === 'available' && profile && profile.points >= item.points_value;

  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link href="/browse" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Browse
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[selectedImage]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <HeartIcon className="h-16 w-16" />
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {item.images && item.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-emerald-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${item.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                <div className="flex items-center text-amber-600 font-semibold text-xl mb-4">
                  <CurrencyDollarIcon className="h-6 w-6 mr-2" />
                  {item.points_value} points
                </div>
                
                {/* Status Badge */}
                <div className="mb-4">
                  {item.status === 'available' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Available
                    </span>
                  )}
                  {item.status === 'pending' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      Pending
                    </span>
                  )}
                  {item.status === 'swapped' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      Swapped
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category</span>
                    <p className="capitalize">{item.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Type</span>
                    <p className="capitalize">{item.type}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Size</span>
                    <p className="uppercase">{item.size}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Condition</span>
                    <p className="capitalize">{item.condition}</p>
                  </div>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Tags</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Uploader Info */}
              <div className="card p-4 mb-8">
                <h3 className="font-semibold mb-3">Listed by</h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                    <UserIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">{item.profiles?.full_name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">
                      Listed on {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {!isOwner && item.status === 'available' && (
                <div className="space-y-4">
                  {canSwap && (
                    <button
                      onClick={() => setShowSwapModal(true)}
                      className="w-full btn-primary flex items-center justify-center"
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                      Request Swap
                    </button>
                  )}
                  
                  {canRedeem && (
                    <button
                      onClick={() => setShowRedeemModal(true)}
                      className="w-full btn-secondary flex items-center justify-center"
                    >
                      <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                      Redeem with Points ({item.points_value} pts)
                    </button>
                  )}
                  
                  {!canRedeem && user && profile && (
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <p className="text-amber-800 text-sm">
                        You need {item.points_value - profile.points} more points to redeem this item
                      </p>
                    </div>
                  )}
                </div>
              )}

              {isOwner && (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800">This is your item</p>
                  </div>
                  
                  {item.status === 'available' && (
                    <Link
                      href={`/items/${item.id}/edit`}
                      className="w-full btn-secondary flex items-center justify-center"
                    >
                      <PencilIcon className="h-5 w-5 mr-2" />
                      Edit Item
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Swap Request Modal */}
        {showSwapModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Request Swap</h3>
              <p className="text-gray-600 mb-4">
                Send a swap request to the owner of "{item.title}". They'll review your request and get back to you.
              </p>
              <textarea
                value={swapMessage}
                onChange={(e) => setSwapMessage(e.target.value)}
                placeholder="Add a message to your swap request (optional)..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSwapModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSwapRequest}
                  disabled={swapLoading}
                  className="flex-1 btn-primary"
                >
                  {swapLoading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Redeem Modal */}
        {showRedeemModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Redeem Item</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to redeem "{item.title}" for {item.points_value} points?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRedeemWithPoints}
                  disabled={redeemLoading}
                  className="flex-1 btn-secondary"
                >
                  {redeemLoading ? 'Redeeming...' : 'Confirm Redemption'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Providers>
  );
} 