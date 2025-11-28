/**
 * Contact Form API Route
 * Handles contact form submissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendContactFormNotification } from '@/lib/resend/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      business_type,
      message,
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Insert into database
    const { data, error: dbError } = await supabase
      .from('contact_forms')
      .insert({
        name,
        email,
        phone,
        business_type: business_type || null,
        message: message || 'Sin mensaje',
        status: 'new',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        {
          error: 'Failed to save contact form',
          details: dbError.message,
          code: dbError.code,
        },
        { status: 500 }
      );
    }

    // Send notification email (non-blocking)
    try {
      await sendContactFormNotification({
        name,
        email,
        phone,
        businessType: business_type || 'No especificado',
        message: message || 'Sin mensaje',
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data,
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
