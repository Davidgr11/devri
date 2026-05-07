import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

async function requireAdminOrContador(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single() as { data: { role: string } | null; error: any };
  if (!roleData || !['admin', 'contador'].includes(roleData.role)) return null;
  return user;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdminOrContador(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const month = searchParams.get('month');
  const type = searchParams.get('type');

  let query = supabase
    .from('accounting_files')
    .select('*')
    .order('period_year', { ascending: false })
    .order('period_month', { ascending: false });

  if (year) query = query.eq('period_year', parseInt(year));
  if (month) query = query.eq('period_month', parseInt(month));
  if (type) query = query.eq('type', type);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ files: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdminOrContador(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { type, period_month, period_year, file_url, file_name, file_size_bytes, storage_path, notes, amount_total, currency, initial_balance, final_balance } = body;

  if (!type || !period_month || !period_year || !file_url || !file_name) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('accounting_files')
    .insert({
      uploaded_by: user.id,
      type,
      period_month: parseInt(period_month),
      period_year: parseInt(period_year),
      file_url,
      file_name,
      file_size_bytes: file_size_bytes || null,
      storage_path: storage_path || null,
      notes: notes || null,
      amount_total: amount_total || null,
      currency: currency || 'MXN',
      initial_balance: initial_balance != null ? parseFloat(initial_balance) : null,
      final_balance: final_balance != null ? parseFloat(final_balance) : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ file: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdminOrContador(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  const allowed = ['notes', 'amount_total', 'initial_balance', 'final_balance', 'currency'];
  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in rest) updates[key] = rest[key];
  }

  const { data, error } = await supabase.from('accounting_files').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ file: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdminOrContador(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  const { error } = await supabase.from('accounting_files').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
