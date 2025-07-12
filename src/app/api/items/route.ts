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
    const { title, description, category, type, size, condition, points_value, tags, images } = body;

    // Validate required fields
    if (!title || !description || !category || !type || !size || !condition || !points_value) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (points_value < 1 || points_value > 1000) {
      return NextResponse.json({ error: 'Points value must be between 1 and 1000' }, { status: 400 });
    }

    // Create item
    const { data: item, error: itemError } = await supabase
      .from('items')
      .insert({
        title,
        description,
        category,
        type,
        size,
        condition,
        points_value,
        tags: tags || [],
        images: images || [],
        user_id: user.id,
        status: 'available'
      })
      .select()
      .single();

    if (itemError) {
      return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      item,
      message: 'Item created successfully' 
    });

  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('items')
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('status', 'available');

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (condition && condition !== 'all') {
      query = query.eq('condition', condition);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'points-low':
        query = query.order('points_value', { ascending: true });
        break;
      case 'points-high':
        query = query.order('points_value', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Apply limit
    query = query.limit(limit);

    const { data: items, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }

    return NextResponse.json({ items });

  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 