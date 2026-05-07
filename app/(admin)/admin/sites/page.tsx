'use client';

import { useEffect, useState } from 'react';
import {
  Globe, Plus, X, Edit2, Trash2, ExternalLink, Search,
  CheckCircle, Clock, Code2
} from 'lucide-react';
import type { WebsiteStatus } from '@/types';

const statusLabels: Record<WebsiteStatus, string> = {
  pending: 'Pendiente', development: 'En desarrollo', published: 'Publicado',
};
const statusColors: Record<WebsiteStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  development: 'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
};
const statusIcons: Record<WebsiteStatus, any> = {
  pending: Clock, development: Code2, published: CheckCircle,
};

interface Client { id: string; full_name: string; email: string; }
interface SiteWithClient {
  id: string; user_id: string; url: string | null; title: string | null;
  status: WebsiteStatus; instructions: string | null; admin_notes: string | null;
  published_at: string | null; created_at: string;
  user_profiles?: { full_name: string };
}

export default function AdminSitesPage() {
  const [sites, setSites] = useState<SiteWithClient[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSite, setEditingSite] = useState<SiteWithClient | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    user_id: '', url: '', title: '', status: 'pending' as WebsiteStatus,
    instructions: '', admin_notes: '',
  });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setIsLoading(true);
    const [sitesRes, clientsRes] = await Promise.all([
      fetch('/api/admin/sites'),
      fetch('/api/admin/clients'),
    ]);
    const sitesData = await sitesRes.json();
    const clientsData = await clientsRes.json();
    setSites(sitesData.sites || []);
    setClients(clientsData.clients || []);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.user_id) {
      setFormError('Selecciona un cliente');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const method = editingSite ? 'PATCH' : 'POST';
      const body = editingSite
        ? { id: editingSite.id, url: form.url || null, title: form.title || null, status: form.status, instructions: form.instructions || null, admin_notes: form.admin_notes || null }
        : { user_id: form.user_id, url: form.url || null, title: form.title || null, status: form.status, instructions: form.instructions || null, admin_notes: form.admin_notes || null };

      const res = await fetch('/api/admin/sites', {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar');
      setShowForm(false);
      setEditingSite(null);
      resetForm();
      await loadAll();
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/sites?id=${id}`, { method: 'DELETE' });
    await loadAll();
  };

  const openEdit = (site: SiteWithClient) => {
    setEditingSite(site);
    setForm({
      user_id: site.user_id, url: site.url || '', title: site.title || '',
      status: site.status, instructions: site.instructions || '',
      admin_notes: site.admin_notes || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ user_id: '', url: '', title: '', status: 'pending', instructions: '', admin_notes: '' });
  };

  const filtered = sites.filter((s) => {
    const q = search.toLowerCase();
    const name = s.user_profiles?.full_name?.toLowerCase() || '';
    return !q || name.includes(q) || (s.title || '').toLowerCase().includes(q) || (s.url || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sitios Web</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gestiona y asigna sitios web a tus clientes</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingSite(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-dark text-white font-medium text-sm hover:bg-accent transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Sitio
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente o sitio..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          <Globe className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Sin sitios web asignados</p>
          <p className="text-gray-400 text-sm">Crea el primer sitio web para un cliente</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Cliente', 'Proyecto', 'URL', 'Estado', 'Instrucciones', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((site) => {
                  const StatusIcon = statusIcons[site.status];
                  return (
                    <tr key={site.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 text-sm">{site.user_profiles?.full_name || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{site.title || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        {site.url ? (
                          <a href={site.url} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-accent hover:underline flex items-center gap-1 max-w-[200px] truncate">
                            {site.url}
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium ${statusColors[site.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusLabels[site.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {site.instructions ? (
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{site.instructions}</p>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openEdit(site)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(site.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                {editingSite ? 'Editar Sitio Web' : 'Nuevo Sitio Web'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingSite(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {!editingSite && (
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del proyecto</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="ej. Sitio Web Restaurant La Paloma"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL del sitio</label>
                <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://www.ejemplo.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as WebsiteStatus })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30">
                  <option value="pending">Pendiente</option>
                  <option value="development">En desarrollo</option>
                  <option value="published">Publicado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instrucciones para el cliente</label>
                <textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                  rows={4} placeholder="Indicaciones visibles para el cliente: credenciales de acceso, guía de uso, próximos pasos..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas internas</label>
                <textarea value={form.admin_notes} onChange={(e) => setForm({ ...form, admin_notes: e.target.value })}
                  rows={2} placeholder="Solo visibles para el admin..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
              </div>
            </div>
            {formError && (
              <div className="mx-6 mb-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{formError}</div>
            )}
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => { setShowForm(false); setEditingSite(null); setFormError(''); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-accent-dark text-white font-medium text-sm hover:bg-accent disabled:opacity-50 transition-colors">
                {saving ? 'Guardando...' : editingSite ? 'Actualizar' : 'Crear Sitio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
