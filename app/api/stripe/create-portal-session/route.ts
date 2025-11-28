/**
 * Stripe Customer Portal API Route
 * Creates a billing portal session for subscription management
 */

import { NextRequest, NextResponse } from 'next/server';
import { createPortalSession } from '@/lib/stripe/server';

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get base URL for return
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin') || 'http://localhost:3000';

    const session = await createPortalSession({
      customerId,
      returnUrl: `${baseUrl}/dashboard/subscription`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
