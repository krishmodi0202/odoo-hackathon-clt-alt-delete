import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Singleton pattern to prevent multiple client instances
let supabaseInstance: SupabaseClient | null = null;

export const supabase = (() => {
  if (supabaseInstance) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase client already initialized, returning existing instance');
    }
    return supabaseInstance;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Initializing Supabase client...');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'rewear-auth-token',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      headers: {
        'X-Client-Info': 'rewear-app',
      },
    },
  });

  return supabaseInstance;
})();

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      items: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          type: string;
          size: string;
          condition: string;
          tags: string[];
          images: string[];
          points_value: number;
          user_id: string;
          status: 'available' | 'pending' | 'swapped';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          type: string;
          size: string;
          condition: string;
          tags?: string[];
          images?: string[];
          points_value?: number;
          user_id: string;
          status?: 'available' | 'pending' | 'swapped';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          type?: string;
          size?: string;
          condition?: string;
          tags?: string[];
          images?: string[];
          points_value?: number;
          user_id?: string;
          status?: 'available' | 'pending' | 'swapped';
          created_at?: string;
          updated_at?: string;
        };
      };
      swaps: {
        Row: {
          id: string;
          requester_id: string;
          item_id: string;
          status: 'pending' | 'accepted' | 'rejected' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          item_id: string;
          status?: 'pending' | 'accepted' | 'rejected' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          requester_id?: string;
          item_id?: string;
          status?: 'pending' | 'accepted' | 'rejected' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 