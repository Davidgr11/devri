'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FileText, Plus, X, Edit2, Trash2, Send, Eye,
  CheckCircle, Clock, XCircle, Search,
  List, Bold, Italic, Paperclip, Download,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { ProposalStatus } from '@/types';

const statusLabels: Record<ProposalStatus, string> = {
  draft: 'Borrador', sent: 'Enviada', signed: 'Firmada', rejected: 'Rechazada',
};
const statusColors: Record<ProposalStatus, string> = {
  draft: 'bg-gray-100 text-gray-600', sent: 'bg-blue-100 text-blue-700',
  signed: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700',
};
const statusIcons: Record<ProposalStatus, any> = {
  draft: Clock, sent: Send, signed: CheckCircle, rejected: XCircle,
};

interface Client { id: string; full_name: string; email: string; }

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewProposal, setViewProposal] = useState<any | null>(null);
  const [editingProposal, setEditingProposal] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    client_user_id: '', title: '', amount_mxn: '',
    valid_until: '', notes: '', status: 'draft' as ProposalStatus,
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    if (!showForm || !editorRef.current) return;
    const content = editingProposal?.content || '';
    if (content.trim().startsWith('<')) {
      editorRef.current.innerHTML = content;
    } else if (content) {
      editorRef.current.innerHTML = content
        .split('\n\n')
        .map((p: string) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
        .join('');
    } else {
      editorRef.current.innerHTML = '';
    }
  }, [showForm, editingProposal?.id]);

  const execFormat = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  };

  const loadAll = async () => {
    setIsLoading(true);
    const [propRes, clientsRes] = await Promise.all([
      fetch('/api/admin/proposals'),
      fetch('/api/admin/clients'),
    ]);
    const propData = await propRes.json();
    const clientsData = await clientsRes.json();
    setProposals(propData.proposals || []);
    setClients(clientsData.clients || []);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    const content = editorRef.current?.innerHTML?.trim() || '';
    if (!form.client_user_id || !form.title || !content) {
      setFormError('Cliente, título y contenido son requeridos');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const method = editingProposal ? 'PATCH' : 'POST';
      const body = editingProposal
        ? {
            id: editingProposal.id, title: form.title, content,
            amount_mxn: form.amount_mxn ? parseFloat(form.amount_mxn) : null,
            valid_until: form.valid_until || null,
            notes: form.notes || null, status: form.status,
          }
        : {
            client_user_id: form.client_user_id,
            title: form.title, content,
            amount_mxn: form.amount_mxn ? parseFloat(form.amount_mxn) : null,
            valid_until: form.valid_until || null,
            notes: form.notes || null,
          };

      const res = await fetch('/api/admin/proposals', {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar');
      const saved = await res.json();
      const proposalId = saved.proposal?.id;

      // Upload attachment if selected
      if (attachmentFile && proposalId) {
        const supabase = createClient();
        const ext = attachmentFile.name.split('.').pop();
        const path = `${proposalId}/${attachmentFile.name}`;
        const { error: uploadErr } = await supabase.storage
          .from('proposals')
          .upload(path, attachmentFile, { upsert: true });
        if (!uploadErr) {
          await fetch('/api/admin/proposals', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: proposalId,
              attachment_url: path,
              attachment_name: attachmentFile.name,
            }),
          });
        }
      }

      setShowForm(false);
      setEditingProposal(null);
      setAttachmentFile(null);
      resetForm();
      await loadAll();
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar la propuesta');
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async (id: string) => {
    await fetch('/api/admin/proposals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'sent' }),
    });
    await loadAll();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/proposals?id=${id}`, { method: 'DELETE' });
    await loadAll();
  };

  const handleDownloadAttachment = async (proposal: any) => {
    if (!proposal.attachment_url) return;
    const supabase = createClient();
    const { data } = await supabase.storage
      .from('proposals')
      .createSignedUrl(proposal.attachment_url, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const openEdit = (p: any) => {
    setEditingProposal(p);
    setAttachmentFile(null);
    setForm({
      client_user_id: p.client_user_id,
      title: p.title,
      amount_mxn: p.amount_mxn ? String(p.amount_mxn) : '',
      valid_until: p.valid_until || '',
      notes: p.notes || '',
      status: p.status,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ client_user_id: '', title: '', amount_mxn: '', valid_until: '', notes: '', status: 'draft' });
    setAttachmentFile(null);
  };

  const filtered = proposals.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.title?.toLowerCase().includes(q) || p.client?.full_name?.toLowerCase().includes(q);
  });

  const isHtml = (c: string) => (c || '').trim().startsWith('<');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propuestas</h1>
          <p className="text-gray-500 text-sm mt-0.5">Crea y envía propuestas a clientes para firma digital</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingProposal(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-dark text-white font-medium text-sm hover:bg-accent transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Propuesta
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar propuestas..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Sin propuestas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const StatusIcon = statusIcons[p.status as ProposalStatus];
            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{p.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status as ProposalStatus]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusLabels[p.status as ProposalStatus]}
                      </span>
                      {p.attachment_name && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          <Paperclip className="w-3 h-3" />
                          Adjunto
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                      <span>Cliente: <span className="text-gray-700 font-medium">{p.client?.full_name || '—'}</span></span>
                      {p.amount_mxn && <span>{formatCurrency(p.amount_mxn)}</span>}
                      {p.valid_until && <span>Válida hasta: {formatDate(p.valid_until)}</span>}
                      <span className="text-gray-400">{formatDate(p.created_at)}</span>
                    </div>
                    {p.status === 'signed' && p.signature_data && (
                      <div className="mt-2 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Firmada por <strong>{p.signature_data.name}</strong> el {formatDate(p.signed_at)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => setViewProposal(p)} className="p-1.5 text-gray-400 hover:text-accent rounded-lg hover:bg-gray-100" title="Ver">
                      <Eye className="w-4 h-4" />
                    </button>
                    {p.attachment_name && (
                      <button onClick={() => handleDownloadAttachment(p)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100" title="Descargar adjunto">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    {p.status === 'draft' && (
                      <>
                        <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleSend(p.id)} className="p-1.5 text-blue-400 hover:text-blue-600 rounded-lg hover:bg-blue-50" title="Enviar">
                          <Send className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 !mt-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProposal ? 'Editar Propuesta' : 'Nueva Propuesta'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingProposal(null); setAttachmentFile(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {!editingProposal && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                  <select
                    value={form.client_user_id}
                    onChange={(e) => setForm({ ...form, client_user_id: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    <option value="">Selecciona un cliente</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.full_name} — {c.email}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="ej. Propuesta de Desarrollo Web - Mayo 2026"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>

              {/* Rich text editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenido * <span className="text-gray-400 font-normal">(describe servicios, alcance, términos)</span>
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-accent/30">
                  <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 bg-gray-50 flex-wrap">
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormat('bold'); }} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Negrita"><Bold className="w-3.5 h-3.5" /></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormat('italic'); }} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Itálica"><Italic className="w-3.5 h-3.5" /></button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormat('formatBlock', 'h2'); }} className="px-2 py-1 rounded hover:bg-gray-200 text-xs font-semibold text-gray-600">Título</button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormat('formatBlock', 'h3'); }} className="px-2 py-1 rounded hover:bg-gray-200 text-xs font-medium text-gray-600">Subtítulo</button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormat('formatBlock', 'p'); }} className="px-2 py-1 rounded hover:bg-gray-200 text-xs text-gray-600">Párrafo</button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormat('insertUnorderedList'); }} className="p-1.5 rounded hover:bg-gray-200 text-gray-600"><List className="w-3.5 h-3.5" /></button>
                  </div>
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="proposal-editor min-h-[220px] p-3 text-sm text-gray-800 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto total MXN</label>
                  <input
                    type="number"
                    value={form.amount_mxn}
                    onChange={(e) => setForm({ ...form, amount_mxn: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Válida hasta</label>
                  <input
                    type="date"
                    value={form.valid_until}
                    onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>

              {editingProposal && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as ProposalStatus })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    <option value="draft">Borrador</option>
                    <option value="sent">Enviada</option>
                    <option value="rejected">Rechazada</option>
                  </select>
                </div>
              )}

              {/* File attachment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Archivo adjunto (opcional)</label>
                <div
                  className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {attachmentFile ? (
                      <p className="text-sm text-gray-700 truncate font-medium">{attachmentFile.name}</p>
                    ) : editingProposal?.attachment_name ? (
                      <p className="text-sm text-gray-500 truncate">Actual: {editingProposal.attachment_name} <span className="text-gray-400">(clic para cambiar)</span></p>
                    ) : (
                      <p className="text-sm text-gray-400">Clic para seleccionar un archivo (PDF, Word, imagen...)</p>
                    )}
                  </div>
                  {attachmentFile && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setAttachmentFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas internas</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  placeholder="Notas privadas..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                />
              </div>
            </div>
            {formError && (
              <div className="mx-6 mb-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {formError}
              </div>
            )}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => { setShowForm(false); setEditingProposal(null); setFormError(''); setAttachmentFile(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-accent-dark text-white font-medium text-sm hover:bg-accent disabled:opacity-50 transition-colors"
              >
                {saving ? 'Guardando...' : editingProposal ? 'Actualizar' : 'Crear Propuesta'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewProposal && (
        <div className="fixed inset-0 !mt-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{viewProposal.title}</h2>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${statusColors[viewProposal.status as ProposalStatus]}`}>
                  {statusLabels[viewProposal.status as ProposalStatus]}
                </span>
              </div>
              <button onClick={() => setViewProposal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 flex-wrap">
                <span>Cliente: <strong className="text-gray-800">{viewProposal.client?.full_name}</strong></span>
                {viewProposal.amount_mxn && <span>Monto: <strong className="text-gray-800">{formatCurrency(viewProposal.amount_mxn)}</strong></span>}
                {viewProposal.valid_until && <span>Vigencia: {formatDate(viewProposal.valid_until)}</span>}
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-4">
                {isHtml(viewProposal.content)
                  ? <div className="prose-content text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: viewProposal.content }} />
                  : <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{viewProposal.content}</pre>
                }
              </div>
              {viewProposal.attachment_name && (
                <button
                  onClick={() => handleDownloadAttachment(viewProposal)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 mb-4 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                  {viewProposal.attachment_name}
                  <Download className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
              {viewProposal.status === 'signed' && viewProposal.signature_data && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-800 text-sm">Propuesta firmada digitalmente</span>
                  </div>
                  <p className="text-sm text-green-700">Firmada por: <strong>{viewProposal.signature_data.name}</strong></p>
                  <p className="text-sm text-green-700">Fecha: {formatDate(viewProposal.signed_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
