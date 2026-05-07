'use client';

import { useEffect, useState } from 'react';
import {
  Link as LinkIcon, Plus, X, Trash2, ExternalLink, Edit2,
  Search, Check, BanknoteIcon
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { ClientPaymentLink, PaymentLinkType, PaymentStatus } from '@/types';

const typeLabels: Record<PaymentLinkType, string> = {
  subscription: 'Suscripción', one_time: 'Pago único',
  advance: 'Anticipo', other: 'Otro', transfer: 'Transferencia',
};
const typeColors: Record<PaymentLinkType, string> = {
  subscription: 'bg-violet-100 text-violet-700',
  one_time: 'bg-blue-100 text-blue-700',
  advance: 'bg-amber-100 text-amber-700',
  other: 'bg-gray-100 text-gray-600',
  transfer: 'bg-teal-100 text-teal-700',
};
const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'Pendiente', processing: 'En proceso', paid: 'Pagado',
  active_subscription: 'Suscripción activa', inactive: 'Inactivo',
};
const paymentStatusColors: Record<PaymentStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  active_subscription: 'bg-violet-100 text-violet-700',
  inactive: 'bg-gray-100 text-gray-500',
};

interface Client { id: string; full_name: string; email: string; }
interface LinkWithClient extends ClientPaymentLink {
  user_profiles?: { full_name: string };
}

export default function PaymentLinksPage() {
  const [links, setLinks] = useState<LinkWithClient[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkWithClient | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    user_id: '', stripe_url: '', label: '', description: '',
    amount_mxn: '', type: 'subscription' as PaymentLinkType,
    notes: '', transfer_details: '', payment_status: 'pending' as PaymentStatus,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setIsLoading(true);
    const [linksRes, clientsRes] = await Promise.all([
      fetch('/api/admin/payment-links'),
      fetch('/api/admin/clients'),
    ]);
    const linksData = await linksRes.json();
    const clientsData = await clientsRes.json();
    setLinks(linksData.links || []);
    setClients(clientsData.clients || []);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.user_id || !form.label) {
      setFormError('Cliente y etiqueta son requeridos');
      return;
    }
    if (form.type !== 'transfer' && !form.stripe_url) {
      setFormError('URL de Stripe requerida para este tipo de pago');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const method = editingLink ? 'PATCH' : 'POST';
      const body = editingLink
        ? {
            id: editingLink.id, ...form,
            amount_mxn: form.amount_mxn ? parseFloat(form.amount_mxn) : null,
            stripe_url: form.type === 'transfer' ? null : form.stripe_url,
          }
        : {
            ...form,
            amount_mxn: form.amount_mxn ? parseFloat(form.amount_mxn) : null,
            stripe_url: form.type === 'transfer' ? null : form.stripe_url,
          };

      const res = await fetch('/api/admin/payment-links', {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar');
      setShowForm(false);
      setEditingLink(null);
      resetForm();
      await loadAll();
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/payment-links?id=${id}`, { method: 'DELETE' });
    await loadAll();
  };

  const handleToggleActive = async (link: LinkWithClient) => {
    await fetch('/api/admin/payment-links', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: link.id, is_active: !link.is_active }),
    });
    await loadAll();
  };

  const handlePaymentStatus = async (id: string, payment_status: string) => {
    await fetch('/api/admin/payment-links', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, payment_status }),
    });
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, payment_status: payment_status as PaymentStatus } : l));
  };

  const openEdit = (link: LinkWithClient) => {
    setEditingLink(link);
    setForm({
      user_id: link.user_id,
      stripe_url: link.stripe_url || '',
      label: link.label,
      description: link.description || '',
      amount_mxn: link.amount_mxn ? String(link.amount_mxn) : '',
      type: link.type,
      notes: link.notes || '',
      transfer_details: link.transfer_details || '',
      payment_status: (link.payment_status as PaymentStatus) || 'pending',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ user_id: '', stripe_url: '', label: '', description: '', amount_mxn: '', type: 'subscription', notes: '', transfer_details: '', payment_status: 'pending' });
  };

  const filtered = links.filter((l) => {
    const name = l.user_profiles?.full_name?.toLowerCase() || '';
    const q = search.toLowerCase();
    return !q || name.includes(q) || l.label.toLowerCase().includes(q);
  });

  const ps = (link: LinkWithClient) => (link.payment_status || 'pending') as PaymentStatus;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Links de Pago</h1>
          <p className="text-gray-500 text-sm mt-0.5">Asigna links y gestiona estados de pago de clientes</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingLink(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-dark text-white font-medium text-sm hover:bg-accent transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Link
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente o etiqueta..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          <LinkIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Sin links de pago</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Cliente', 'Etiqueta', 'Tipo', 'Monto', 'Estado pago', 'Visible', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">{link.user_profiles?.full_name || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 text-sm">{link.label}</p>
                      {link.description && <p className="text-xs text-gray-400 truncate max-w-[180px]">{link.description}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${typeColors[link.type]}`}>
                        {typeLabels[link.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{link.amount_mxn ? formatCurrency(link.amount_mxn) : '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={ps(link)}
                        onChange={(e) => handlePaymentStatus(link.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 ${paymentStatusColors[ps(link)]}`}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="processing">En proceso</option>
                        <option value="paid">Pagado</option>
                        <option value="active_subscription">Suscripción activa</option>
                        <option value="inactive">Inactivo</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(link)}
                        className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                          link.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {link.is_active ? <><Check className="w-3 h-3" />Sí</> : 'No'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {link.type !== 'transfer' && link.stripe_url && (
                          <a href={link.stripe_url} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 text-gray-400 hover:text-accent rounded-lg hover:bg-gray-100" title="Abrir en Stripe">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {link.type === 'transfer' && (
                          <span className="p-1.5 text-teal-400" title="Transferencia bancaria">
                            <BanknoteIcon className="w-4 h-4" />
                          </span>
                        )}
                        <button onClick={() => openEdit(link)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(link.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 !mt-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingLink ? 'Editar Link' : 'Nuevo Link de Pago'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingLink(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {!editingLink && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                  <select value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30">
                    <option value="">Selecciona un cliente</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.full_name} — {c.email}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta *</label>
                <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="ej. Suscripción Mayo 2026"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PaymentLinkType })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30">
                    <option value="subscription">Suscripción</option>
                    <option value="one_time">Pago único</option>
                    <option value="advance">Anticipo</option>
                    <option value="transfer">Transferencia</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto MXN</label>
                  <input type="number" value={form.amount_mxn} onChange={(e) => setForm({ ...form, amount_mxn: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
              </div>

              {form.type !== 'transfer' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de Stripe *</label>
                  <input type="url" value={form.stripe_url} onChange={(e) => setForm({ ...form, stripe_url: e.target.value })}
                    placeholder="https://buy.stripe.com/..."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Datos bancarios para transferencia</label>
                  <textarea value={form.transfer_details} onChange={(e) => setForm({ ...form, transfer_details: e.target.value })}
                    rows={3} placeholder="Banco: BBVA&#10;CLABE: 012345678901234567&#10;Titular: DEVRI Solutions SA de CV"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado de pago</label>
                <select value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value as PaymentStatus })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30">
                  <option value="pending">Pendiente</option>
                  <option value="processing">En proceso</option>
                  <option value="paid">Pagado</option>
                  <option value="active_subscription">Suscripción activa</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2} placeholder="Descripción visible para el cliente..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas internas</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2} placeholder="Solo visibles para el admin..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
              </div>
            </div>
            {formError && (
              <div className="mx-6 mb-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{formError}</div>
            )}
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => { setShowForm(false); setEditingLink(null); setFormError(''); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-accent-dark text-white font-medium text-sm hover:bg-accent disabled:opacity-50 transition-colors">
                {saving ? 'Guardando...' : editingLink ? 'Actualizar' : 'Crear Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
