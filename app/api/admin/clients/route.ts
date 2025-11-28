/**
 * Admin Clients API Route
 * Get all client users with their details
 */

import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || (userRole as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Use admin client for privileged operations
    const adminClient = createAdminClient();

    // Get all user profiles
    const { data: profiles, error: profilesError } = await adminClient
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) throw profilesError;

    // Get all user roles
    const { data: roles, error: rolesError } = await adminClient
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) throw rolesError;

    // Filter to only client roles
    const clientIds = (roles as any)?.filter((r: any) => r.role === 'client').map((r: any) => r.user_id) || [];
    const clientProfiles = (profiles as any)?.filter((p: any) => clientIds.includes(p.id)) || [];

    // Get emails from auth.users via admin API
    // This requires service role which is only available on server
    const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers();

    if (authError) throw authError;

    // Create a map of user IDs to emails
    const emailMap = new Map(authUsers.users.map(u => [u.id, u.email]));

    // Get subscriptions for all clients
    const { data: subscriptions } = await adminClient
      .from('subscriptions')
      .select('user_id, status, subscription_plans(name)')
      .eq('status', 'active')
      .in('user_id', clientIds);

    // Create subscription map
    const subscriptionMap = new Map(
      (subscriptions as any)?.map((s: any) => [
        s.user_id,
        {
          status: s.status,
          plan_name: s.subscription_plans?.name
        }
      ])
    );

    // Get websites for all clients
    const { data: websites } = await adminClient
      .from('client_websites')
      .select('user_id, url, status')
      .in('user_id', clientIds);

    // Create website map
    const websiteMap = new Map(
      (websites as any)?.map((w: any) => [w.user_id, { url: w.url, status: w.status }])
    );

    // Enrich profiles with email, subscription, and website data
    const enrichedClients = clientProfiles.map((profile: any) => ({
      ...profile,
      email: emailMap.get(profile.id) || 'N/A',
      subscription_status: (subscriptionMap.get(profile.id) as any)?.status,
      plan_name: (subscriptionMap.get(profile.id) as any)?.plan_name,
      website_url: (websiteMap.get(profile.id) as any)?.url,
      website_status: (websiteMap.get(profile.id) as any)?.status,
    }));

    return NextResponse.json({
      clients: enrichedClients,
      total: enrichedClients.length,
    });

  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}
