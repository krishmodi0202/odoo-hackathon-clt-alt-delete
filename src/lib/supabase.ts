import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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