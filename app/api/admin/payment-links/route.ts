import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  sendPaymentLinkAssignedEmail,
  sendPaymentStatusChangedEmail,
} from '@/lib/resend/client';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single() as { data: { role: string } | null; error: any };
  if (!roleData || roleData.role !== 'admin') return null;
  return user;
}

async function getClientInfo(adminClient: ReturnType<typeof createAdminClient>, userId: string) {
  const [profileRes, userRes] = await Promise.all([
    adminClient.from('user_profiles').select('full_name').eq('id', userId).single(),
    adminClient.auth.admin.getUserById(userId),
  ]);
  return {
    name: (profileRes.data as any)?.full_name || 'Cliente',
    email: userRes.data?.user?.email || null,
  };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devri.com.mx';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  let query = supabase
    .from('client_payment_links')
    .select('*')
    .order('created_at', { ascending: false });

  if (userId) query = query.eq('user_id', userId);

  const { data: links, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const userIds = [...new Set((links || []).map((l: any) => l.user_id))];
  const adminClient = createAdminClient();
  const { data: profiles } = userIds.length
    ? await adminClient.from('user_profiles').select('id, full_name').in('id', userIds)
    : { data: [] };
  const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]));
  const result = (links || []).map((l: any) => ({ ...l, user_profiles: profileMap[l.user_id] || null }));

  return NextResponse.json({ links: result });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { user_id, stripe_url, label, description, amount_mxn, type, notes, transfer_details, payment_status } = body;

  if (!user_id || !label) {
    return NextResponse.json({ error: 'user_id y label son requeridos' }, { status: 400 });
  }
  if (type !== 'transfer' && !stripe_url) {
    return NextResponse.json({ error: 'stripe_url requerido para este tipo de pago' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('client_payment_links')
    .insert({
      user_id,
      stripe_url: type === 'transfer' ? null : stripe_url,
      label,
      description: description || null,
      amount_mxn: amount_mxn || null,
      type: type || 'subscription',
      notes: notes || null,
      transfer_details: transfer_details || null,
      payment_status: payment_status || 'pending',
      assigned_by: user.id,
      is_active: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send email to client (non-blocking)
  try {
    const adminClient = createAdminClient();
    const { name, email } = await getClientInfo(adminClient, user_id);
    if (email) {
      await sendPaymentLinkAssignedEmail({
        to: email, name, label, amount: amount_mxn || null,
        dashboardUrl: `${SITE_URL}/dashboard/payments`,
      });
    }
  } catch {}

  return NextResponse.json({ link: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  const allowed = [
    'stripe_url', 'label', 'description', 'amount_mxn', 'type',
    'notes', 'is_active', 'transfer_details', 'payment_status',
  ];
  const filtered = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));

  // Fetch current link before update to detect status change and get user_id
  let prevLink: any = null;
  if ('payment_status' in filtered) {
    const { data } = await supabase
      .from('client_payment_links')
      .select('user_id, label, payment_status')
      .eq('id', id)
      .single();
    prevLink = data;
  }

  const { data, error } = await supabase
    .from('client_payment_links')
    .update(filtered)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send email on meaningful status changes
  const notifyStatuses = ['paid', 'active_subscription', 'inactive'];
  if (
    prevLink &&
    filtered.payment_status &&
    notifyStatuses.includes(filtered.payment_status as string) &&
    filtered.payment_status !== prevLink.payment_status
  ) {
    try {
      const adminClient = createAdminClient();
      const { name, email } = await getClientInfo(adminClient, prevLink.user_id);
      if (email) {
        await sendPaymentStatusChangedEmail({
          to: email, name,
          label: prevLink.label,
          status: filtered.payment_status as string,
          dashboardUrl: `${SITE_URL}/dashboard/payments`,
        });
      }
    } catch {}
  }

  return NextResponse.json({ link: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  const { error } = await supabase.from('client_payment_links').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
