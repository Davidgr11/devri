/**
 * Auth Callback Route
 * Handles email verification and OAuth callbacks from Supabase
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful verification - redirect to next page or dashboard
      const redirectUrl = requestUrl.origin + next;
      return NextResponse.redirect(redirectUrl);
    }

    // If there's an error, redirect to login with error message
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=verification_failed`
    );
  }

  // If no code, redirect to home
  return NextResponse.redirect(requestUrl.origin);
}
