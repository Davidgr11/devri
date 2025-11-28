/**
 * Admin API - Testimonials Management
 * Handles CRUD operations for testimonials using service role
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

// GET - Fetch all testimonials
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error fetching testimonials' },
      { status: 500 }
    );
  }
}

// POST - Create new testimonial
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, business_name, rating, quote, image_url, is_active, order_index } = body;

    if (!name || !quote || !rating) {
      return NextResponse.json(
        { error: 'Name, quote, and rating are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert({
        name,
        business_name,
        rating,
        quote,
        image_url,
        is_active: is_active ?? true,
        order_index: order_index ?? 0,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error creating testimonial' },
      { status: 500 }
    );
  }
}

// PUT - Update testimonial
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, business_name, rating, quote, image_url, is_active, order_index } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update({
        name,
        business_name,
        rating,
        quote,
        image_url,
        is_active,
        order_index,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error updating testimonial' },
      { status: 500 }
    );
  }
}

// DELETE - Delete testimonial
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error deleting testimonial' },
      { status: 500 }
    );
  }
}
