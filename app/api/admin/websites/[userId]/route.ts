/**
 * Admin Website Management API
 * Allows admin to publish/update client websites
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createAuthClient } from '@/lib/supabase/server';
import { sendWebsitePublishedEmail } from '@/lib/resend/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Await params
    const { userId } = await params;

    // Verify admin access
    const authClient = await createAuthClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await authClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || (roleData as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { url, status } = await req.json();

    // Use service role for update
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if website record exists
    const { data: existingWebsite } = await supabase
      .from('client_websites')
      .select('id, status')
      .eq('user_id', userId)
      .single();

    // Build update object
    const updates: any = {};
    if (url !== undefined) updates.url = url;
    if (status !== undefined) updates.status = status;

    // Check if this is a new publish (status changing to published)
    const isNewlyPublished = status === 'published' &&
      (!existingWebsite || existingWebsite.status !== 'published');

    // If publishing for first time, set published_at
    if (status === 'published' && !existingWebsite) {
      updates.published_at = new Date().toISOString();
    }

    let result;

    if (existingWebsite) {
      // Update existing
      const { data, error } = await supabase
        .from('client_websites')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('client_websites')
        .insert({
          user_id: userId,
          ...updates,
          published_at: status === 'published' ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    // Send email notification if website was just published
    if (isNewlyPublished && url) {
      try {
        // Get user details for email
        const { data: user } = await supabase
          .from('users')
          .select('email, full_name')
          .eq('id', userId)
          .single();

        if (user) {
          await sendWebsitePublishedEmail({
            to: user.email,
            name: user.full_name,
            websiteUrl: url,
          });
          console.log(`Website published email sent to ${user.email}`);
        }
      } catch (emailError) {
        console.error('Error sending website published email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      website: result,
    });

  } catch (error: any) {
    console.error('Error updating website:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update website' },
      { status: 500 }
    );
  }
}
