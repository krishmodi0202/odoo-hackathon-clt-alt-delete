'use client';

import { useAuth } from '@/lib/auth';
import { Navigation } from '@/components/Navigation';
import { Providers } from '@/components/providers';
import { useEffect, useState } from 'react';
import { 
  ShieldCheckIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

type Item = Database['public']['Tables']['items']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [pendingItems, setPendingItems] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalUsers: 0,
    totalSwaps: 0,
    totalPoints: 0
  });
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      checkAdminStatus();
    }
  }, [mounted, user]);

  const checkAdminStatus = async () => {
    // For demo purposes, we'll consider users with email containing 'admin' as admins
    // In a real app, you'd have a proper admin role system
    if (!user?.email?.includes('admin')) {
      alert('Access denied. Admin privileges required.');
      window.history.back();
      return;
    }
    
    fetchAdminData();
  };

  const fetchAdminData = async () => {
    try {
      setLoadingData(true);

      // Fetch pending items
      const { data: pendingData } = await supabase
        .from('items')
        .select(`
          *,
          profiles (
            id,
            full_name,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      // Fetch all items
      const { data: allItemsData } = await supabase
        .from('items')
        .select(`
          *,
          profiles (
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Fetch all users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch swaps for stats
      const { data: swapsData } = await supabase
        .from('swaps')
        .select('*');

      setPendingItems(pendingData || []);
      setAllItems(allItemsData || []);
      setUsers(usersData || []);

      // Calculate stats
      const totalPoints = usersData?.reduce((sum, user) => sum + (user.points || 0), 0) || 0;
      setStats({
        totalItems: allItemsData?.length || 0,
        totalUsers: usersData?.length || 0,
        totalSwaps: swapsData?.length || 0,
        totalPoints
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const approveItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ status: 'available' })
        .eq('id', itemId);

      if (error) throw error;

      alert('Item approved successfully!');
      fetchAdminData();
    } catch (error) {
      console.error('Error approving item:', error);
      alert('Failed to approve item');
    }
  };

  const rejectItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      alert('Item rejected and removed successfully!');
      fetchAdminData();
    } catch (error) {
      console.error('Error rejecting item:', error);
      alert('Failed to reject item');
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      alert('Item deleted successfully!');
      fetchAdminData();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user?.email?.includes('admin')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <ShieldCheckIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-emerald-600 mr-3" />
              <h1 className="text-4xl font-bold text-gradient">Admin Panel</h1>
            </div>
            <p className="text-xl text-gray-600">
              Manage the ReWear platform and moderate content
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg mr-4">
                  <EyeIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <UserIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSwaps}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg mr-4">
                  <CurrencyDollarIcon className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPoints}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'dashboard'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pending'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Pending Items ({pendingItems.length})
                </button>
                <button
                  onClick={() => setActiveTab('all-items')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'all-items'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Users
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          {loadingData ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading data...</p>
            </div>
          ) : (
            <div>
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {allItems.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                              <EyeIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-gray-500">by {item.profiles?.full_name || 'Anonymous'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{item.status}</p>
                            <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Items Tab */}
              {activeTab === 'pending' && (
                <div className="space-y-6">
                  {pendingItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ExclamationTriangleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Items</h3>
                      <p className="text-gray-500">All items have been reviewed!</p>
                    </div>
                  ) : (
                    pendingItems.map((item) => (
                      <div key={item.id} className="card p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              {item.images && item.images.length > 0 ? (
                                <img
                                  src={item.images[0]}
                                  alt={item.title}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <EyeIcon className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                              <p className="text-gray-600 mb-2">{item.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Category: {item.category}</span>
                                <span>Size: {item.size}</span>
                                <span>Condition: {item.condition}</span>
                                <span>{item.points_value} points</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">
                                Listed by: {item.profiles?.full_name || 'Anonymous'} ({item.profiles?.email})
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => approveItem(item.id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => rejectItem(item.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* All Items Tab */}
              {activeTab === 'all-items' && (
                <div className="space-y-6">
                  {allItems.map((item) => (
                    <div key={item.id} className="card p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            {item.images && item.images.length > 0 ? (
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <EyeIcon className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold">{item.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.status === 'available' ? 'bg-green-100 text-green-800' :
                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{item.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Category: {item.category}</span>
                              <span>Size: {item.size}</span>
                              <span>Condition: {item.condition}</span>
                              <span>{item.points_value} points</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                              Listed by: {item.profiles?.full_name || 'Anonymous'} ({item.profiles?.email})
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {users.map((user) => (
                    <div key={user.id} className="card p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{user.full_name || 'Anonymous'}</h3>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-500">
                              Member since {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-amber-600">{user.points || 0}</p>
                          <p className="text-sm text-gray-500">points</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Providers>
  );
} 