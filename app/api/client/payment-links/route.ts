import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentReportedByClientEmail } from '@/lib/resend/client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://devri.com.mx';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('client_payment_links')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ links: data });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  // Verify ownership and current status with the user's client
  const { data: link } = await supabase
    .from('client_payment_links')
    .select('id, user_id, label, payment_status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single() as { data: any; error: any };

  if (!link) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  if (link.payment_status !== 'pending') {
    return NextResponse.json({ error: 'Solo se puede reportar un pago pendiente' }, { status: 400 });
  }

  // Use admin client to bypass RLS for the update (ownership already verified above)
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('client_payment_links')
    .update({ payment_status: 'processing' })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify all admins (non-blocking)
  try {
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
        await sendPaymentReportedByClientEmail({
          to: adminEmails,
          clientName,
          label: link.label,
          adminUrl: `${SITE_URL}/admin/payment-links`,
        });
      }
    }
  } catch {}

  return NextResponse.json({ link: data });
}
