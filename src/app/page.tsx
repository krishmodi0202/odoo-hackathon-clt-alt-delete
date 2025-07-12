'use client';

import { useAuth } from '@/lib/auth';
import { APP_CONFIG } from '@/lib/constants';
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  UserGroupIcon, 
  GlobeAltIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Providers } from '@/components/providers';

export default function Home() {
  const { user, profile, signOut, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ReWear...</p>
        </div>
      </div>
    );
  }

  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        {/* Navigation */}
        <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 mb-4">
                <HeartIcon className="h-4 w-4 mr-2" />
                Sustainable Fashion Revolution
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8">
              <span className="block text-gray-900">Swap, Share,</span>
              <span className="block text-gradient">Save the Planet</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Join the ultimate clothing exchange platform where fashion meets sustainability. 
              <span className="font-semibold text-emerald-600"> Swap directly</span> or use our 
              <span className="font-semibold text-amber-600"> point system</span> to give your clothes a second life!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href={user ? "/browse" : "/auth/signup"} className="btn-primary text-lg px-8 py-4">
                {user ? 'Start Swapping Now' : 'Join the Movement'}
                <ArrowRightIcon className="ml-2 h-6 w-6" />
              </Link>
              <Link href="/browse" className="btn-secondary text-lg px-8 py-4">
                Explore Items
                <SparklesIcon className="ml-2 h-6 w-6" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-gradient mb-2">1000+</div>
                <div className="text-gray-600">Items Swapped</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-gradient mb-2">500+</div>
                <div className="text-gray-600">Happy Users</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-gradient mb-2">2.5K</div>
                <div className="text-gray-600">Points Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Why Choose</span> ReWear?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of sustainable fashion with our innovative features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Direct Swaps */}
            <div className="card p-8 text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Direct Swaps</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect directly with other fashion enthusiasts and swap items instantly. 
                No middleman, just pure community exchange!
              </p>
            </div>

            {/* Point System */}
            <div className="card p-8 text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CurrencyDollarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Point System</h3>
              <p className="text-gray-600 leading-relaxed">
                Earn points for every item you list! Redeem them for amazing pieces 
                from our community marketplace.
              </p>
            </div>

            {/* Instant Exchange */}
            <div className="card p-8 text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Instant Exchange</h3>
              <p className="text-gray-600 leading-relaxed">
                Get your new wardrobe pieces instantly! No waiting, no shipping delays, 
                just immediate fashion gratification.
              </p>
            </div>

            {/* Secure Platform */}
            <div className="card p-8 text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Secure & Safe</h3>
              <p className="text-gray-600 leading-relaxed">
                Your safety is our priority. Verified users, secure transactions, 
                and community-driven trust system.
              </p>
            </div>

            {/* Community */}
            <div className="card p-8 text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Vibrant Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Join thousands of fashion-forward individuals who care about 
                sustainability and style!
              </p>
            </div>

            {/* AI Suggestions */}
            <div className="card p-8 text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <LightBulbIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">AI-Powered Suggestions</h3>
              <p className="text-gray-600 leading-relaxed">
                Get intelligent suggestions for titles, descriptions, and pricing! 
                Our AI helps you create compelling listings instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-gradient-to-r from-emerald-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white/30">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">List Your Items</h3>
              <p className="text-emerald-100">
                Upload photos and details of clothes you want to swap. 
                Set your points value and watch the offers roll in!
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white/30">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Browse & Connect</h3>
              <p className="text-emerald-100">
                Discover amazing pieces from our community. 
                Send swap requests or redeem with points!
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white/30">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Swap & Enjoy</h3>
              <p className="text-emerald-100">
                Complete your swap and enjoy your new wardrobe pieces! 
                It's that simple and sustainable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="card p-12">
            <div className="mb-8">
              <StarIcon className="h-16 w-16 text-amber-500 mx-auto mb-4 animate-bounce-slow" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to <span className="text-gradient">Revolutionize</span> Your Wardrobe?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of fashion enthusiasts who are already making sustainable choices. 
                Your clothes deserve a second life, and so does our planet!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={user ? "/items/add" : "/auth/signup"} className="btn-primary text-lg px-8 py-4">
                {user ? 'List Your First Item' : 'Start Your Journey'}
                <SparklesIcon className="ml-2 h-6 w-6" />
              </Link>
              <Link href="/browse" className="btn-secondary text-lg px-8 py-4">
                Explore the Community
                <HeartIcon className="ml-2 h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mr-3">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">{APP_CONFIG.name}</span>
            </div>
            <p className="text-gray-400 mb-4">
              Making fashion sustainable, one swap at a time. Join the revolution!
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>&copy; 2025 {APP_CONFIG.name}</span>
              <span>•</span>
              <span>Built with ❤️ for the planet</span>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </Providers>
  );
}
