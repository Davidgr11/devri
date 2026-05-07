import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { sendProposalSentEmail } from '@/lib/resend/client';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: roleData } = await supabase
    .from('user_roles').select('role').eq('user_id', user.id).single() as { data: { role: string } | null; error: any };
  if (!roleData || roleData.role !== 'admin') return null;
  return user;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devri.com.mx';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('client_id');

  let query = supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });

  if (clientId) query = query.eq('client_user_id', clientId);

  const { data: proposals, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const clientIds = [...new Set((proposals || []).map((p: any) => p.client_user_id))];
  const adminClient = createAdminClient();
  const { data: profiles } = clientIds.length
    ? await adminClient.from('user_profiles').select('id, full_name').in('id', clientIds)
    : { data: [] };
  const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]));
  const result = (proposals || []).map((p: any) => ({ ...p, client: profileMap[p.client_user_id] || null }));

  return NextResponse.json({ proposals: result });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { client_user_id, title, content, amount_mxn, valid_until, notes, status } = body;

  if (!client_user_id || !title || !content) {
    return NextResponse.json({ error: 'client_user_id, title y content son requeridos' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('proposals')
    .insert({
      client_user_id,
      created_by: user.id,
      title,
      content,
      status: status || 'draft',
      amount_mxn: amount_mxn || null,
      valid_until: valid_until || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ proposal: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  const allowed = ['title', 'content', 'status', 'amount_mxn', 'valid_until', 'notes', 'attachment_url', 'attachment_name'];
  const filtered = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));

  // Detect if status is being set to 'sent' (triggers email)
  let prevProposal: any = null;
  if (filtered.status === 'sent') {
    const { data } = await supabase
      .from('proposals')
      .select('client_user_id, title, amount_mxn, status')
      .eq('id', id)
      .single();
    prevProposal = data;
  }

  const { data, error } = await supabase
    .from('proposals')
    .update(filtered)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Email client when proposal is sent
  if (prevProposal && prevProposal.status !== 'sent') {
    try {
      const adminClient = createAdminClient();
      const [profileRes, userRes] = await Promise.all([
        adminClient.from('user_profiles').select('full_name').eq('id', prevProposal.client_user_id).single(),
        adminClient.auth.admin.getUserById(prevProposal.client_user_id),
      ]);
      const name = (profileRes.data as any)?.full_name || 'Cliente';
      const email = userRes.data?.user?.email;
      if (email) {
        await sendProposalSentEmail({
          to: email, name,
          title: prevProposal.title,
          amount: prevProposal.amount_mxn,
          dashboardUrl: `${SITE_URL}/dashboard/proposals`,
        });
      }
    } catch {}
  }

  return NextResponse.json({ proposal: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  const { error } = await supabase.from('proposals').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
