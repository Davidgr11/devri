'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Plus, X, FileText, Banknote, CreditCard, ChevronDown, ChevronUp,
  Eye, Download, Trash2, Upload, Check, AlertCircle, ExternalLink,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { formatCurrencyDecimal, formatDate } from '@/lib/utils';
import type { AccountingFile, AccountingStripeTransaction } from '@/types';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
} from 'recharts';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function fmtMXN(n: number | null | undefined): string {
  if (n == null) return '—';
  return `${formatCurrencyDecimal(n)} MXN`;
}

interface ParsedRow {
  charge_id: string; transaction_date: string; amount: number;
  fee: number; taxes_on_fee: number; description: string;
  customer_email: string; currency: string;
}

function parseStripeCSV(text: string): ParsedRow[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());
  const idx = (names: string[]) => {
    for (const n of names) {
      const i = headers.findIndex((h) => h.includes(n.toLowerCase()));
      if (i >= 0) return i;
    }
    return -1;
  };
  const iId = idx(['id']); const iDate = idx(['created date', 'date']);
  const iAmount = idx(['amount']); const iFee = idx(['fee']);
  const iTaxes = idx(['taxes on fee', 'tax']); const iStatus = idx(['status']);
  const iDesc = idx(['description', 'customer description']);
  const iEmail = idx(['customer email', 'email']); const iCurrency = idx(['currency']);
  const parseAmt = (v: string) => { const n = parseFloat(v.replace(/[^0-9.-]/g, '')); return isNaN(n) ? 0 : n; };
  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
    if (!cols[0]) continue;
    if (iStatus >= 0 && cols[iStatus]?.toLowerCase() !== 'paid') continue;
    rows.push({
      charge_id: iId >= 0 ? cols[iId] : '',
      transaction_date: iDate >= 0 ? cols[iDate] : '',
      amount: iAmount >= 0 ? parseAmt(cols[iAmount]) : 0,
      fee: iFee >= 0 ? parseAmt(cols[iFee]) : 0,
      taxes_on_fee: iTaxes >= 0 ? parseAmt(cols[iTaxes]) : 0,
      description: iDesc >= 0 ? cols[iDesc] : '',
      customer_email: iEmail >= 0 ? cols[iEmail] : '',
      currency: iCurrency >= 0 ? cols[iCurrency] : 'mxn',
    });
  }
  return rows;
}

interface MonthData {
  month: number;
  bankFile: AccountingFile | null;
  otherFiles: AccountingFile[];
  stripeFile: AccountingFile | null;
  stripeTransactions: AccountingStripeTransaction[];
}

type DocType = 'bank_statement' | 'stripe_export' | 'other';

export default function AccountingPage() {
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [yearFiles, setYearFiles] = useState<AccountingFile[]>([]);
  const [yearStripe, setYearStripe] = useState<AccountingStripeTransaction[]>([]);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [stripePreview, setStripePreview] = useState<{ month: number; transactions: AccountingStripeTransaction[] } | null>(null);

  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState<'period' | 'type' | 'form'>('period');
  const [addMonth, setAddMonth] = useState(new Date().getMonth() + 1);
  const [addYear, setAddYear] = useState(new Date().getFullYear());
  const [addType, setAddType] = useState<DocType | null>(null);
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addInitial, setAddInitial] = useState('');
  const [addFinal, setAddFinal] = useState('');
  const [addNote, setAddNote] = useState('');
  const [parsedStripe, setParsedStripe] = useState<ParsedRow[]>([]);
  const [stripeParseError, setStripeParseError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; storagePath: string | null; type: string; period_month: number; period_year: number } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Viewer
  const [viewer, setViewer] = useState<{ url: string; name: string } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const reload = useCallback(async () => {
    const [allRes, yearRes, stripeRes] = await Promise.all([
      fetch('/api/admin/accounting'),
      fetch(`/api/admin/accounting?year=${selectedYear}`),
      fetch(`/api/admin/accounting/stripe-import?year=${selectedYear}`),
    ]);
    const [allData, yearData, stripeData] = await Promise.all([
      allRes.json(), yearRes.json(), stripeRes.json(),
    ]);
    const allFiles: AccountingFile[] = allData.files || [];
    const years = [...new Set(allFiles.map((f) => f.period_year))].sort((a, b) => b - a);
    setAvailableYears(years);
    setYearFiles(yearData.files || []);
    setYearStripe(stripeData.transactions || []);
  }, [selectedYear]);

  useEffect(() => { reload(); }, [reload]);

  const monthsData = useMemo<MonthData[]>(() => {
    const months = new Set([
      ...yearFiles.map((f) => f.period_month),
      ...yearStripe.map((t) => t.period_month),
    ]);
    return [...months].sort((a, b) => b - a).map((month) => ({
      month,
      bankFile: yearFiles.find((f) => f.type === 'bank_statement' && f.period_month === month) || null,
      otherFiles: yearFiles.filter((f) => f.type === 'other' && f.period_month === month),
      stripeFile: yearFiles.find((f) => f.type === 'stripe_export' && f.period_month === month) || null,
      stripeTransactions: yearStripe.filter((t) => t.period_month === month),
    }));
  }, [yearFiles, yearStripe]);

  const chartData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const md = monthsData.find((m) => m.month === month);
      const saldoFinal = md?.bankFile?.final_balance ?? null;
      const brutoStripe = md?.stripeTransactions.length
        ? md.stripeTransactions.reduce((s, t) => s + (t.amount || 0), 0)
        : null;
      return {
        mes: MONTHS[i].slice(0, 3),
        saldoFinal,
        brutoStripe,
      };
    });
  }, [monthsData]);

  const getSignedUrl = async (storagePath: string) => {
    const supabase = createClient();
    const { data } = await supabase.storage.from('accounting').createSignedUrl(storagePath, 3600);
    return data?.signedUrl || null;
  };

  const openViewer = async (file: AccountingFile) => {
    if (!file.storage_path) return;
    const url = await getSignedUrl(file.storage_path);
    if (url) setViewer({ url, name: file.file_name });
  };

  const doDownload = async (file: AccountingFile) => {
    if (!file.storage_path) return;
    const url = await getSignedUrl(file.storage_path);
    if (!url) return;
    const a = document.createElement('a'); a.href = url; a.download = file.file_name; a.click();
  };

  const confirmDelete = (file: AccountingFile) => {
    setDeleteTarget({
      id: file.id, name: file.file_name, storagePath: file.storage_path,
      type: file.type, period_month: file.period_month, period_year: file.period_year,
    });
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    // Remove from storage
    if (deleteTarget.storagePath) {
      const supabase = createClient();
      await supabase.storage.from('accounting').remove([deleteTarget.storagePath]);
    }
    // If it's a stripe file, also delete the parsed transactions
    if (deleteTarget.type === 'stripe_export') {
      await fetch(
        `/api/admin/accounting/stripe-import?month=${deleteTarget.period_month}&year=${deleteTarget.period_year}`,
        { method: 'DELETE' }
      );
    }
    await fetch(`/api/admin/accounting?id=${deleteTarget.id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    setDeleting(false);
    await reload();
  };

  const uploadToStorage = async (file: File, type: string, month: number, year: number) => {
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const storagePath = `${year}-${String(month).padStart(2, '0')}-${type}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('accounting').upload(storagePath, file, { upsert: false });
    if (error) throw new Error(error.message);
    const { data: { publicUrl } } = supabase.storage.from('accounting').getPublicUrl(storagePath);
    return { storagePath, publicUrl };
  };

  const handleFileSelect = (file: File) => {
    setAddFile(file);
    if (addType === 'stripe_export') {
      setStripeParseError(''); setParsedStripe([]);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const rows = parseStripeCSV(e.target?.result as string);
          if (!rows.length) { setStripeParseError('No se encontraron transacciones con estado "Paid"'); return; }
          setParsedStripe(rows);
        } catch { setStripeParseError('Error al parsear el archivo'); }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    if (!addFile || !addType) return;
    setUploading(true); setUploadError('');
    try {
      // For bank_statement and stripe_export, only one per period is allowed.
      // Find and remove any existing file of the same type for this period first.
      if (addType !== 'other') {
        const checkRes = await fetch(`/api/admin/accounting?month=${addMonth}&year=${addYear}`);
        const checkData = await checkRes.json();
        const existing: AccountingFile | undefined = (checkData.files || []).find(
          (f: AccountingFile) => f.type === addType
        );
        if (existing) {
          const supabase = createClient();
          if (existing.storage_path) {
            await supabase.storage.from('accounting').remove([existing.storage_path]);
          }
          if (addType === 'stripe_export') {
            await fetch(
              `/api/admin/accounting/stripe-import?month=${addMonth}&year=${addYear}`,
              { method: 'DELETE' }
            );
          }
          await fetch(`/api/admin/accounting?id=${existing.id}`, { method: 'DELETE' });
        }
      }

      const { storagePath, publicUrl } = await uploadToStorage(addFile, addType, addMonth, addYear);
      const body: any = {
        type: addType, period_month: addMonth, period_year: addYear,
        file_url: publicUrl, file_name: addFile.name,
        storage_path: storagePath, file_size_bytes: addFile.size,
      };
      if (addType === 'bank_statement') {
        body.initial_balance = addInitial ? parseFloat(addInitial) : null;
        body.final_balance = addFinal ? parseFloat(addFinal) : null;
      }
      if (addType === 'other' && addNote.trim()) body.notes = addNote.trim();
      const fileRes = await fetch('/api/admin/accounting', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      if (!fileRes.ok) throw new Error('Error al guardar archivo');
      if (addType === 'stripe_export' && parsedStripe.length > 0) {
        const fData = await fileRes.json();
        await fetch('/api/admin/accounting/stripe-import', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file_id: fData.file?.id || null, period_month: addMonth, period_year: addYear, transactions: parsedStripe }),
        });
      }
      closeAdd();
      setSelectedYear(addYear);
      await reload();
    } catch (err: any) {
      setUploadError(err.message || 'Error al subir');
    } finally {
      setUploading(false);
    }
  };

  const closeAdd = () => {
    setShowAdd(false); setAddStep('period'); setAddType(null);
    setAddFile(null); setAddInitial(''); setAddFinal(''); setAddNote('');
    setParsedStripe([]); setStripeParseError(''); setUploadError('');
  };

  const canSubmit = () => {
    if (!addFile) return false;
    if (addType === 'stripe_export') return parsedStripe.length > 0;
    return true;
  };

  const downloadStripeCSV = (transactions: AccountingStripeTransaction[], month: number, year: number) => {
    const headers = ['Fecha', 'ID Cobro', 'Email Cliente', 'Monto', 'Fee', 'IVA Fee', 'Neto'];
    const rows = transactions.map((t) => [
      t.transaction_date ? formatDate(t.transaction_date) : '',
      t.charge_id || '',
      t.customer_email || t.description || '',
      (t.amount ?? 0).toFixed(2),
      (t.fee ?? 0).toFixed(2),
      (t.taxes_on_fee ?? 0).toFixed(2),
      ((t.amount ?? 0) - (t.fee ?? 0) - (t.taxes_on_fee ?? 0)).toFixed(2),
    ]);
    const totals = [
      'Total', '', '',
      transactions.reduce((s, t) => s + (t.amount ?? 0), 0).toFixed(2),
      transactions.reduce((s, t) => s + (t.fee ?? 0), 0).toFixed(2),
      transactions.reduce((s, t) => s + (t.taxes_on_fee ?? 0), 0).toFixed(2),
      transactions.reduce((s, t) => s + (t.amount ?? 0) - (t.fee ?? 0) - (t.taxes_on_fee ?? 0), 0).toFixed(2),
    ];
    const csv = [headers, ...rows, totals]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Stripe_${MONTHS[month - 1]}_${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stepIndex = addStep === 'period' ? 0 : addStep === 'type' ? 1 : 2;
  const stepLabels = ['Período', 'Tipo', 'Detalles'];

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contabilidad</h1>
          <p className="text-gray-500 text-sm mt-0.5">Documentos y registros financieros</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-dark text-white font-medium text-sm hover:bg-accent transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Documento
        </button>
      </div>

      {/* ── Year tabs ──────────────────────────────────────── */}
      {availableYears.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => { setSelectedYear(year); setExpandedMonth(null); }}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                selectedYear === year
                  ? 'bg-accent-dark text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Sin documentos</p>
          <p className="text-gray-400 text-sm mt-1">Agrega tu primer documento para comenzar</p>
        </div>
      )}

      {/* ── Chart ──────────────────────────────────────────── */}
      {availableYears.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Resumen {selectedYear}
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                width={72}
                tickFormatter={(v) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                }
              />
              <Tooltip
                formatter={(value, name) => [
                  fmtMXN(typeof value === 'number' ? value : null),
                  name === 'saldoFinal' ? 'Saldo Final Cheques' : 'Bruto Stripe',
                ]}
                labelStyle={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}
                contentStyle={{
                  borderRadius: 12, border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12,
                }}
              />
              <Legend
                formatter={(value) => value === 'saldoFinal' ? 'Saldo Final Cheques' : 'Bruto Stripe'}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              />
              <Line
                type="monotone"
                dataKey="saldoFinal"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="brutoStripe"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={{ r: 3, fill: '#7c3aed', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Month accordions ───────────────────────────────── */}
      {monthsData.length > 0 && (
        <div className="space-y-2">
          {monthsData.map((md) => {
            const isOpen = expandedMonth === md.month;
            const stripeGross = md.stripeTransactions.reduce((s, t) => s + (t.amount || 0), 0);
            const stripeNet = md.stripeTransactions.reduce(
              (s, t) => s + (t.amount || 0) - (t.fee || 0) - (t.taxes_on_fee || 0), 0
            );

            // Flat docs list: bank → stripe → others
            const allDocs: { file: AccountingFile; isStripe: boolean }[] = [
              ...(md.bankFile ? [{ file: md.bankFile, isStripe: false }] : []),
              ...(md.stripeFile ? [{ file: md.stripeFile, isStripe: true }] : []),
              ...md.otherFiles.map((f) => ({ file: f, isStripe: false })),
            ];

            return (
              <div key={md.month} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Month header */}
                <button
                  onClick={() => setExpandedMonth(isOpen ? null : md.month)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/80 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{MONTHS[md.month - 1]}</span>
                  {isOpen
                    ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  }
                </button>

                {/* Month detail */}
                {isOpen && (
                  <div className="border-t border-gray-100 p-5 space-y-5">
                    {/* ── Stats ─── */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Saldo inicial cheques</p>
                        <p className="font-semibold text-gray-900 text-sm">{fmtMXN(md.bankFile?.initial_balance)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Saldo final cheques</p>
                        <p className="font-semibold text-gray-900 text-sm">{fmtMXN(md.bankFile?.final_balance)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Bruto Stripe</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {md.stripeTransactions.length ? fmtMXN(stripeGross) : '—'}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Neto Stripe</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {md.stripeTransactions.length ? fmtMXN(stripeNet) : '—'}
                        </p>
                      </div>
                    </div>

                    {/* ── Documents ─── */}
                    {allDocs.length > 0 && (
                      <div className="space-y-2">
                        {allDocs.map(({ file, isStripe }) => {
                          const isBank = file.type === 'bank_statement';
                          const iconColor = isBank ? 'text-blue-500' : isStripe ? 'text-violet-500' : 'text-gray-400';
                          const rowBg = isBank ? 'bg-blue-50 border-blue-100' : isStripe ? 'bg-violet-50 border-violet-100' : 'bg-gray-100 border-gray-200';
                          const eyeColor = isBank ? 'text-blue-600 hover:bg-blue-100' : isStripe ? 'text-violet-600 hover:bg-violet-100' : 'text-gray-500 hover:bg-gray-200';
                          return (
                            <div key={file.id} className={`flex items-center gap-3 p-3 rounded-xl border ${rowBg}`}>
                              {isBank ? <Banknote className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
                                : isStripe ? <CreditCard className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
                                : <FileText className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
                              }
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{file.file_name}</p>
                                {file.notes && <p className="text-xs text-gray-400 truncate">{file.notes}</p>}
                              </div>
                              <button
                                onClick={() => isStripe
                                  ? setStripePreview({ month: md.month, transactions: md.stripeTransactions })
                                  : openViewer(file)
                                }
                                className={`p-1.5 rounded-lg transition-colors ${eyeColor}`}
                                title="Ver"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => confirmDelete(file)}
                                className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add Document Modal ─────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 !mt-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto admin-panel">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Agregar Documento</h2>
                <div className="flex items-center gap-1 mt-1">
                  {stepLabels.map((label, i) => (
                    <span key={i} className={`text-xs ${i === stepIndex ? 'text-accent-dark font-semibold' : i < stepIndex ? 'text-gray-400' : 'text-gray-300'}`}>
                      {i > 0 && <span className="mx-1">›</span>}{label}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={closeAdd} className="text-gray-400 hover:text-gray-600 flex-shrink-0"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6">
              {/* Step 1 — Period */}
              {addStep === 'period' && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Año</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setAddYear((y) => y - 1)} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="flex-1 text-center text-2xl font-bold text-gray-900">{addYear}</span>
                      <button onClick={() => setAddYear((y) => y + 1)} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Mes</p>
                    <div className="grid grid-cols-3 gap-2">
                      {MONTHS.map((name, i) => (
                        <button
                          key={i}
                          onClick={() => setAddMonth(i + 1)}
                          className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            addMonth === i + 1
                              ? 'bg-accent-dark text-white shadow-sm'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          {name.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setAddStep('type')}
                    className="w-full py-2.5 rounded-xl bg-accent-dark text-white font-semibold text-sm hover:bg-accent transition-colors"
                  >
                    Continuar →
                  </button>
                </div>
              )}

              {/* Step 2 — Type */}
              {addStep === 'type' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 mb-5">
                    Período: <strong className="text-gray-900">{MONTHS[addMonth - 1]} {addYear}</strong>
                  </p>
                  {([
                    { type: 'bank_statement' as DocType, Icon: Banknote, label: 'Estado de Cuenta', desc: 'Archivo bancario con saldo inicial y final', accent: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50/60', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
                    { type: 'stripe_export' as DocType, Icon: CreditCard, label: 'Pagos Stripe', desc: 'Exportación CSV de Stripe (solo pagos)', accent: 'border-violet-200 hover:border-violet-400 hover:bg-violet-50/60', iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
                    { type: 'other' as DocType, Icon: FileText, label: 'Otro Documento', desc: 'Factura, contrato u otro archivo', accent: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50', iconBg: 'bg-gray-100', iconColor: 'text-gray-500' },
                  ] as const).map(({ type, Icon, label, desc, accent, iconBg, iconColor }) => (
                    <button
                      key={type}
                      onClick={() => { setAddType(type); setAddStep('form'); }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${accent}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </button>
                  ))}
                  <button onClick={() => setAddStep('period')} className="w-full pt-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                    ← Regresar
                  </button>
                </div>
              )}

              {/* Step 3 — Form */}
              {addStep === 'form' && addType && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    {MONTHS[addMonth - 1]} {addYear} ·{' '}
                    <strong className="text-gray-800">
                      {addType === 'bank_statement' ? 'Estado de Cuenta' : addType === 'stripe_export' ? 'Pagos Stripe' : 'Otro Documento'}
                    </strong>
                  </p>

                  {/* Dropzone */}
                  <div
                    onClick={() => fileRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      addFile ? 'border-accent/60 bg-accent/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      ref={fileRef} type="file" className="hidden"
                      accept={addType === 'stripe_export' ? '.csv,.tsv,.txt' : '.pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.doc,.docx'}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                    />
                    {addFile ? (
                      <>
                        <FileText className="w-8 h-8 text-accent mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">{addFile.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{(addFile.size / 1024).toFixed(0)} KB · click para cambiar</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          {addType === 'stripe_export' ? 'Seleccionar CSV de Stripe' : 'Seleccionar archivo'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {addType === 'stripe_export' ? 'CSV o TSV exportado de Stripe' : 'PDF, Excel, imagen u otro'}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Stripe feedback */}
                  {addType === 'stripe_export' && stripeParseError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />{stripeParseError}
                    </div>
                  )}
                  {addType === 'stripe_export' && parsedStripe.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3.5">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-800">{parsedStripe.length} transacciones encontradas</span>
                      </div>
                      <div className="flex gap-5 text-xs text-green-700">
                        <span>Total: <strong>{formatCurrencyDecimal(parsedStripe.reduce((s, r) => s + r.amount, 0))}</strong></span>
                        <span>Neto: <strong>{formatCurrencyDecimal(parsedStripe.reduce((s, r) => s + r.amount - r.fee - r.taxes_on_fee, 0))}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Bank balances */}
                  {addType === 'bank_statement' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Saldo inicial</label>
                        <input
                          type="number" value={addInitial} onChange={(e) => setAddInitial(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        {addInitial && !isNaN(parseFloat(addInitial)) && (
                          <p className="text-xs text-gray-400 mt-1">{fmtMXN(parseFloat(addInitial))}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Saldo final</label>
                        <input
                          type="number" value={addFinal} onChange={(e) => setAddFinal(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        {addFinal && !isNaN(parseFloat(addFinal)) && (
                          <p className="text-xs text-gray-400 mt-1">{fmtMXN(parseFloat(addFinal))}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Other doc note */}
                  {addType === 'other' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Nota <span className="font-normal text-gray-400">(opcional)</span>
                      </label>
                      <textarea
                        value={addNote} onChange={(e) => setAddNote(e.target.value)} rows={2}
                        placeholder="Descripción del documento..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                      />
                    </div>
                  )}

                  {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}

                  <div className="flex gap-3 pt-1">
                    <button onClick={() => setAddStep('type')} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                      ← Atrás
                    </button>
                    <button
                      onClick={handleSubmit} disabled={!canSubmit() || uploading}
                      className="flex-1 py-2.5 rounded-xl bg-accent-dark text-white text-sm font-semibold hover:bg-accent disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                    >
                      {uploading ? 'Subiendo...' : <><Upload className="w-4 h-4" />Subir</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ──────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 !mt-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Eliminar archivo</h2>
                <p className="text-sm text-gray-500 mt-1">
                  ¿Eliminar <strong className="text-gray-800">"{deleteTarget.name}"</strong>? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={executeDelete} disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Stripe Transactions Preview Modal ─────────────── */}
      {stripePreview && (
        <div className="fixed inset-0 !mt-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-violet-500" />
                <h2 className="font-bold text-gray-900">
                  Pagos Stripe — {MONTHS[stripePreview.month - 1]} {selectedYear}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadStripeCSV(stripePreview.transactions, stripePreview.month, selectedYear)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar Excel
                </button>
                <button onClick={() => setStripePreview(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-auto flex-1 admin-panel">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500">Fecha</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500">Cliente</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-500">Monto</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-500">Fee</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-500">IVA Fee</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-500">Neto</th>
                  </tr>
                </thead>
                <tbody>
                  {stripePreview.transactions.map((t) => (
                    <tr key={t.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                      <td className="px-4 py-2.5 text-gray-400 whitespace-nowrap">{t.transaction_date ? formatDate(t.transaction_date) : '—'}</td>
                      <td className="px-4 py-2.5 text-gray-600 max-w-[140px] truncate">{t.customer_email || t.description || '—'}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-gray-900">{formatCurrencyDecimal(t.amount || 0)}</td>
                      <td className="px-4 py-2.5 text-right text-red-500">{formatCurrencyDecimal(t.fee || 0)}</td>
                      <td className="px-4 py-2.5 text-right text-red-400">{formatCurrencyDecimal(t.taxes_on_fee || 0)}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-green-600">
                        {formatCurrencyDecimal((t.amount || 0) - (t.fee || 0) - (t.taxes_on_fee || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <td colSpan={2} className="px-4 py-3 font-semibold text-gray-700">
                      Total ({stripePreview.transactions.length} transacciones)
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      {formatCurrencyDecimal(stripePreview.transactions.reduce((s, t) => s + (t.amount || 0), 0))}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-red-500">
                      {formatCurrencyDecimal(stripePreview.transactions.reduce((s, t) => s + (t.fee || 0), 0))}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-red-400">
                      {formatCurrencyDecimal(stripePreview.transactions.reduce((s, t) => s + (t.taxes_on_fee || 0), 0))}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">
                      {formatCurrencyDecimal(stripePreview.transactions.reduce((s, t) => s + (t.amount || 0) - (t.fee || 0) - (t.taxes_on_fee || 0), 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── File Viewer Modal ──────────────────────────────── */}
      {viewer && (
        <div className="fixed inset-0 !mt-0 bg-black/80 z-50 flex flex-col p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium text-sm truncate max-w-xs">{viewer.name}</span>
            <div className="flex items-center gap-2">
              <a href={viewer.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />Abrir
              </a>
              <button onClick={() => setViewer(null)} className="p-1.5 text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 bg-white rounded-xl overflow-hidden">
            {/\.(png|jpg|jpeg|gif|webp)$/i.test(viewer.name)
              ? <img src={viewer.url} alt={viewer.name} className="w-full h-full object-contain" />
              : <iframe src={viewer.url} className="w-full h-full border-0" title={viewer.name} />
            }
          </div>
        </div>
      )}
    </div>
  );
}
