import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

function parseStripeDate(raw: string): string | null {
  if (!raw) return null;
  const m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (m) {
    const [, a, b, y, h = '00', min = '00', s = '00'] = m;
    const aNum = parseInt(a, 10);
    const bNum = parseInt(b, 10);
    // If first part > 12 it must be the day (DD/MM/YYYY).
    // If second part > 12 it must be the day (MM/DD/YYYY, US format Stripe sometimes exports).
    // Otherwise default to DD/MM/YYYY.
    let day: string, month: string;
    if (bNum > 12) { month = a; day = b; }       // MM/DD/YYYY
    else { day = a; month = b; }                  // DD/MM/YYYY (default)
    return `${y}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${h}:${min}:${s}Z`;
  }
  const parsed = new Date(raw);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

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

  let query = supabase.from('accounting_stripe_transactions').select('*').order('transaction_date', { ascending: false });
  if (month && year) {
    query = query.eq('period_month', parseInt(month)).eq('period_year', parseInt(year));
  } else if (year) {
    query = query.eq('period_year', parseInt(year));
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ transactions: data || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdminOrContador(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { file_id, period_month, period_year, transactions } = body;

  if (!period_month || !period_year || !Array.isArray(transactions)) {
    return NextResponse.json({ error: 'Datos requeridos faltantes' }, { status: 400 });
  }

  // Delete existing transactions for this period before inserting new ones
  await supabase.from('accounting_stripe_transactions')
    .delete()
    .eq('period_month', parseInt(period_month))
    .eq('period_year', parseInt(period_year));

  const rows = transactions.map((t: any) => ({
    file_id: file_id || null,
    period_month: parseInt(period_month),
    period_year: parseInt(period_year),
    charge_id: t.charge_id || null,
    transaction_date: t.transaction_date ? parseStripeDate(t.transaction_date) : null,
    amount: t.amount != null ? parseFloat(t.amount) : null,
    fee: t.fee != null ? parseFloat(t.fee) : null,
    taxes_on_fee: t.taxes_on_fee != null ? parseFloat(t.taxes_on_fee) : null,
    description: t.description || null,
    customer_email: t.customer_email || null,
    currency: t.currency || 'mxn',
  }));

  const { data, error } = await supabase.from('accounting_stripe_transactions').insert(rows).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ transactions: data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const user = await requireAdminOrContador(supabase);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  if (!month || !year) return NextResponse.json({ error: 'month y year requeridos' }, { status: 400 });

  await supabase.from('accounting_stripe_transactions')
    .delete()
    .eq('period_month', parseInt(month))
    .eq('period_year', parseInt(year));

  return NextResponse.json({ success: true });
}
