/**
 * Admin Stats API
 * Returns dashboard statistics
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
    const { data: roleData } = await authClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role !== 'admin') {
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

    // Get admin user IDs to exclude
    const { data: adminRoles } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    const adminIds = adminRoles?.map((r) => r.user_id) || [];

    // Get total clients (excluding admins)
    const { count: totalClients } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .not('id', 'in', `(${adminIds.join(',')})`);

    // Get active subscriptions
    const { count: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get total revenue (sum of actual monthly prices for active subs)
    const { data: subscriptionsData } = await supabase
      .from('subscriptions')
      .select('actual_monthly_price, plan_id, subscription_plans(price_mxn)')
      .eq('status', 'active');

    const totalRevenue = subscriptionsData?.reduce((sum, sub: any) => {
      // Use actual_monthly_price if available, otherwise fallback to plan price
      const price = sub.actual_monthly_price ?? sub.subscription_plans?.price_mxn ?? 0;
      return sum + price;
    }, 0) || 0;

    // Get published websites
    const { count: publishedWebsites } = await supabase
      .from('client_websites')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    // Get pending contact forms
    const { count: pendingForms } = await supabase
      .from('contact_forms')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    // Get new clients this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: newClientsThisMonth } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString())
      .not('id', 'in', `(${adminIds.join(',')})`);

    // Get recent clients
    const { data: recentClientsData } = await supabase
      .from('user_profiles')
      .select('id, full_name, created_at')
      .not('id', 'in', `(${adminIds.join(',')})`)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get emails for recent clients
    const recentWithEmails = await Promise.all(
      (recentClientsData || []).map(async (client) => {
        const { data: { user }, error } = await supabase.auth.admin.getUserById(client.id);
        return {
          ...client,
          email: user?.email || 'N/A',
        };
      })
    );

    return NextResponse.json({
      stats: {
        totalClients: totalClients || 0,
        activeSubscriptions: activeSubscriptions || 0,
        totalRevenue,
        publishedWebsites: publishedWebsites || 0,
        pendingForms: pendingForms || 0,
        newClientsThisMonth: newClientsThisMonth || 0,
      },
      recentClients: recentWithEmails,
    });

  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
