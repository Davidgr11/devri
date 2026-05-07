'use client';

import { useEffect, useState } from 'react';
import { Mail, Calendar, Check, Trash2, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { ContactForm } from '@/types';

const statusLabels = { new: 'Nuevo', in_progress: 'En proceso', completed: 'Completado' };
const statusColors = {
  new: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

export default function AdminContactFormsPage() {
  const [forms, setForms] = useState<ContactForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'completed'>('all');
  const [selectedForm, setSelectedForm] = useState<ContactForm | null>(null);

  useEffect(() => { loadForms(); }, []);

  const loadForms = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('contact_forms')
      .select('*')
      .order('created_at', { ascending: false });
    setForms((data as unknown as ContactForm[]) || []);
    setIsLoading(false);
  };

  const updateStatus = async (id: string, status: 'new' | 'in_progress' | 'completed') => {
    const supabase = createClient();
    await supabase.from('contact_forms').update({ status }).eq('id', id);
    setForms((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
    if (selectedForm?.id === id) setSelectedForm((prev) => prev ? { ...prev, status } : null);
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from('contact_forms').delete().eq('id', id);
    setForms((prev) => prev.filter((f) => f.id !== id));
    if (selectedForm?.id === id) setSelectedForm(null);
  };

  const filtered = forms.filter((f) => filter === 'all' || f.status === filter);

  const counts = {
    new: forms.filter((f) => f.status === 'new').length,
    in_progress: forms.filter((f) => f.status === 'in_progress').length,
    completed: forms.filter((f) => f.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Formularios de Contacto</h1>
        <p className="text-gray-500 text-sm mt-0.5">Gestiona las solicitudes recibidas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Nuevos</p>
          <p className="text-2xl font-bold text-amber-700">{counts.new}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">En proceso</p>
          <p className="text-2xl font-bold text-blue-700">{counts.in_progress}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Completados</p>
          <p className="text-2xl font-bold text-green-700">{counts.completed}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'new', 'in_progress', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? `Todos (${forms.length})` : f === 'new' ? `Nuevos (${counts.new})` : f === 'in_progress' ? `En proceso (${counts.in_progress})` : `Completados (${counts.completed})`}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Sin formularios</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Negocio</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((form) => (
                  <tr
                    key={form.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedForm(form)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">{form.name}</p>
                      <p className="text-xs text-gray-400">{form.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{form.business_type || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-500">
                        {new Date(form.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${statusColors[form.status]}`}>
                        {statusLabels[form.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDelete(form.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          title="Eliminar"
                        >
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

      {/* Detail Modal */}
      {selectedForm && (
        <div className="fixed inset-0 !mt-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedForm.name}</h2>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium mt-1 ${statusColors[selectedForm.status]}`}>
                  {statusLabels[selectedForm.status]}
                </span>
              </div>
              <button onClick={() => setSelectedForm(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Contact info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Email</p>
                  <p className="text-sm text-gray-800">{selectedForm.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Teléfono</p>
                  <p className="text-sm text-gray-800">{selectedForm.phone || '—'}</p>
                </div>
                {selectedForm.business_type && (
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Tipo de negocio</p>
                    <p className="text-sm text-gray-800">{selectedForm.business_type}</p>
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Mensaje</p>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap border border-gray-100">
                  {selectedForm.message || 'Sin mensaje'}
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(selectedForm.created_at).toLocaleDateString('es-MX', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </div>

              {/* Status actions */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Cambiar estado</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedForm.status !== 'new' && (
                    <button
                      onClick={() => updateStatus(selectedForm.id, 'new')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Nuevo
                    </button>
                  )}
                  {selectedForm.status !== 'in_progress' && (
                    <button
                      onClick={() => updateStatus(selectedForm.id, 'in_progress')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      En proceso
                    </button>
                  )}
                  {selectedForm.status !== 'completed' && (
                    <button
                      onClick={() => updateStatus(selectedForm.id, 'completed')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Completado
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => handleDelete(selectedForm.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-medium text-sm hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
              <button
                onClick={() => setSelectedForm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
