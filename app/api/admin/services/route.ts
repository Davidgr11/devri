/**
 * Admin API - Service Categories Management
 * Handles CRUD operations for service categories using service role
 */

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// GET - Fetch all service categories
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('service_categories')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error fetching categories' },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, callout, icon, type, parent_id, order_index, demo_url, status } = body;

    if (!name || !slug || !type) {
      return NextResponse.json(
        { error: 'Name, slug, and type are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('service_categories')
      .insert({
        name,
        slug,
        description,
        callout,
        icon,
        type,
        parent_id,
        order_index: order_index ?? 0,
        demo_url,
        status: status ?? 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error creating category' },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug, description, callout, icon, type, parent_id, order_index, demo_url, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('service_categories')
      .update({
        name,
        slug,
        description,
        callout,
        icon,
        type,
        parent_id,
        order_index,
        demo_url,
        status,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error updating category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('service_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error deleting category' },
      { status: 500 }
    );
  }
}
