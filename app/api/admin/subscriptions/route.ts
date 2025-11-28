/**
 * Admin Subscriptions API
 * Returns all subscriptions with client details
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createAuthClient } from '@/lib/supabase/server';

export async function GET() {
  try {
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

    // Use service role for queries
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

    // Get all subscriptions with plan details
    const { data: subs, error: subsError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_plans (
          id,
          name,
          slug,
          price_mxn,
          features
        )
      `)
      .order('created_at', { ascending: false });

    if (subsError) throw subsError;
    if (!subs) return NextResponse.json({ subscriptions: [] });

    // Enrich with client data
    const enrichedSubs = await Promise.all(
      subs.map(async (sub) => {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('id', sub.user_id)
          .single();

        const { data: { user: authUser }, error: userError } = await supabase.auth.admin.getUserById(sub.user_id);

        return {
          ...sub,
          plan: (sub as any).subscription_plans,
          client_name: profile?.full_name || 'N/A',
          client_email: authUser?.email || 'N/A',
        };
      })
    );

    return NextResponse.json({ subscriptions: enrichedSubs });

  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
