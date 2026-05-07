import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: sites, error } = await supabase
    .from('client_websites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const userIds = [...new Set((sites || []).map((s: any) => s.user_id))];
  const adminClient = createAdminClient();
  const { data: profiles } = userIds.length
    ? await adminClient.from('user_profiles').select('id, full_name').in('id', userIds)
    : { data: [] };
  const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]));
  const result = (sites || []).map((s: any) => ({ ...s, user_profiles: profileMap[s.user_id] || null }));

  return NextResponse.json({ sites: result });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { user_id, url, title, status, instructions, admin_notes } = body;

  if (!user_id) return NextResponse.json({ error: 'user_id requerido' }, { status: 400 });

  const { data, error } = await supabase
    .from('client_websites')
    .insert({
      user_id,
      url: url || null,
      title: title || null,
      status: status || 'pending',
      instructions: instructions || null,
      admin_notes: admin_notes || null,
      published_at: status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ site: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  const allowed = ['url', 'title', 'status', 'instructions', 'admin_notes'];
  const filtered: any = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));

  if (filtered.status === 'published' && !filtered.published_at) {
    const { data: existing } = await supabase.from('client_websites').select('status, published_at').eq('id', id).single() as { data: any };
    if (existing?.status !== 'published') {
      filtered.published_at = new Date().toISOString();
    }
  }

  const { data, error } = await supabase
    .from('client_websites')
    .update(filtered)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ site: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  const { error } = await supabase.from('client_websites').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
