import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, message } = body;

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Check if item exists and is available
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('*')
      .eq('id', itemId)
      .eq('status', 'available')
      .single();

    if (itemError || !item) {
      return NextResponse.json({ error: 'Item not found or not available' }, { status: 404 });
    }

    // Check if user is not the owner
    if (item.user_id === user.id) {
      return NextResponse.json({ error: 'Cannot request swap for your own item' }, { status: 400 });
    }

    // Check if user has enough points
    const { data: profile } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', user.id)
      .single();

    if (!profile || profile.points < item.points_value) {
      return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
    }

    // Create swap request
    const { data: swap, error: swapError } = await supabase
      .from('swaps')
      .insert({
        requester_id: user.id,
        item_id: itemId,
        status: 'pending'
      })
      .select()
      .single();

    if (swapError) {
      return NextResponse.json({ error: 'Failed to create swap request' }, { status: 500 });
    }

    // Update item status to pending
    await supabase
      .from('items')
      .update({ status: 'pending' })
      .eq('id', itemId);

    return NextResponse.json({ 
      success: true, 
      swap,
      message: 'Swap request created successfully' 
    });

  } catch (error) {
    console.error('Error creating swap request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'sent' or 'received'

    let query = supabase
      .from('swaps')
      .select(`
        *,
        items (
          id,
          title,
          images,
          points_value,
          user_id
        ),
        profiles!swaps_requester_id_fkey (
          id,
          full_name,
          email
        )
      `);

    if (type === 'sent') {
      query = query.eq('requester_id', user.id);
    } else if (type === 'received') {
      query = query.eq('items.user_id', user.id);
    } else {
      // Get all swaps user is involved in
      query = query.or(`requester_id.eq.${user.id},items.user_id.eq.${user.id}`);
    }

    const { data: swaps, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch swaps' }, { status: 500 });
    }

    return NextResponse.json({ swaps });

  } catch (error) {
    console.error('Error fetching swaps:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 