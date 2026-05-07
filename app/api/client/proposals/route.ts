import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { sendProposalSignedEmail } from '@/lib/resend/client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devri.com.mx';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('client_user_id', user.id)
    .neq('status', 'draft')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ proposals: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { proposal_id, signature_name } = body;

  if (!proposal_id || !signature_name?.trim()) {
    return NextResponse.json({ error: 'proposal_id y signature_name son requeridos' }, { status: 400 });
  }

  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  const userAgent = headersList.get('user-agent') || 'unknown';

  const { data: proposal } = await supabase
    .from('proposals')
    .select('id, status, client_user_id, title')
    .eq('id', proposal_id)
    .eq('client_user_id', user.id)
    .single() as { data: { id: string; status: string; client_user_id: string; title: string } | null; error: any };

  if (!proposal) return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 });
  if (proposal.status !== 'sent') return NextResponse.json({ error: 'Esta propuesta no está disponible para firma' }, { status: 400 });

  const signedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from('proposals')
    .update({
      status: 'signed',
      signed_at: signedAt,
      signature_data: {
        name: signature_name.trim(),
        signed_at: signedAt,
        ip,
        user_agent: userAgent,
      },
    })
    .eq('id', proposal_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify all admins (non-blocking)
  try {
    const adminClient = createAdminClient();
    const [profileRes, adminRolesRes] = await Promise.all([
      adminClient.from('user_profiles').select('full_name').eq('id', user.id).single(),
      adminClient.from('user_roles').select('user_id').eq('role', 'admin'),
    ]);
    const clientName = (profileRes.data as any)?.full_name || 'Cliente';
    const adminIds = ((adminRolesRes.data || []) as any[]).map((r) => r.user_id);
    if (adminIds.length) {
      const { data: authUsers } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      const adminEmails = authUsers.users
        .filter((u) => adminIds.includes(u.id) && u.email)
        .map((u) => u.email as string);
      if (adminEmails.length) {
        await sendProposalSignedEmail({
          to: adminEmails,
          clientName,
          title: proposal.title,
          signedAt,
          adminUrl: `${SITE_URL}/admin/proposals`,
        });
      }
    }
  } catch {}

  return NextResponse.json({ proposal: data });
}
