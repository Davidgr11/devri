import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const proposalId = searchParams.get('id');
  if (!proposalId) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  // Verify the user owns this proposal (RLS enforces client_user_id = user)
  const { data: proposal } = await supabase
    .from('proposals')
    .select('attachment_url')
    .eq('id', proposalId)
    .eq('client_user_id', user.id)
    .neq('status', 'draft')
    .single() as { data: { attachment_url: string | null } | null; error: any };

  if (!proposal?.attachment_url) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  // Generate signed URL using admin client (bypasses storage RLS)
  const adminClient = createAdminClient();
  const { data, error } = await adminClient.storage
    .from('proposals')
    .createSignedUrl(proposal.attachment_url, 3600);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: 'Error al generar enlace de descarga' }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
