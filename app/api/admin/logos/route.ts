/**
 * Admin API - Client Logos Management
 * Handles CRUD operations for client logos using service role
 */

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create Supabase client with service role (server-side only)
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

// GET - Fetch all logos
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('client_logos')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching logos:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching logos' },
      { status: 500 }
    );
  }
}

// POST - Create new logo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, logo_url, is_active } = body;

    if (!name || !logo_url) {
      return NextResponse.json(
        { error: 'Name and logo_url are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('client_logos')
      .insert({
        name,
        logo_url,
        is_active: is_active ?? true,
        order_index: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating logo:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating logo' },
      { status: 500 }
    );
  }
}

// PUT - Update logo
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, logo_url, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Logo ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('client_logos')
      .update({
        name,
        logo_url,
        is_active,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating logo:', error);
    return NextResponse.json(
      { error: error.message || 'Error updating logo' },
      { status: 500 }
    );
  }
}

// DELETE - Delete logo
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Logo ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('client_logos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting logo:', error);
    return NextResponse.json(
      { error: error.message || 'Error deleting logo' },
      { status: 500 }
    );
  }
}
