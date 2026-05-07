import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

async function requireAdminOrContador(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: roleData } = await supabase
    .from('user_roles').select('role').eq('user_id', user.id).single() as { data: { role: string } | null; error: any };
  if (!roleData || !['admin', 'contador'].includes(roleData.role)) return null;
  return user;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdminOrContador(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const templates = searchParams.get('templates') === 'true';

  let query = supabase.from('accounting_movements').select('*').order('movement_date', { ascending: true });

  if (templates) {
    query = query.eq('is_template', true);
  } else if (month && year) {
    query = query.eq('period_month', parseInt(month)).eq('period_year', parseInt(year));
  } else if (year) {
    query = query.eq('period_year', parseInt(year));
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ movements: data || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdminOrContador(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { file_id, period_month, period_year, type, concept, movement_date, amount, is_template } = body;

  if (!period_month || !period_year || !type || !concept || amount === undefined) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 });
  }

  const { data, error } = await supabase.from('accounting_movements').insert({
    file_id: file_id || null,
    period_month: parseInt(period_month),
    period_year: parseInt(period_year),
    type,
    concept,
    movement_date: movement_date || null,
    amount: parseFloat(amount),
    is_template: is_template || false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ movement: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdminOrContador(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  const allowed = ['type', 'concept', 'movement_date', 'amount', 'is_template', 'file_id'];
  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in rest) updates[key] = rest[key];
  }

  const { data, error } = await supabase.from('accounting_movements').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ movement: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdminOrContador(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  const { error } = await supabase.from('accounting_movements').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
