/**
 * Admin Contact Forms Page
 * View and manage contact form submissions
 */

'use client';

import { useEffect, useState } from 'react';
import { Mail, Calendar, Check, X, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Loading } from '@/components/ui';
import type { ContactForm } from '@/types';

export default function AdminContactFormsPage() {
  const [forms, setForms] = useState<ContactForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'completed'>('all');
  const [selectedForm, setSelectedForm] = useState<ContactForm | null>(null);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    const supabase = createClient();

    try {
      const { data } = await supabase
        .from('contact_forms')
        .select('*')
        .order('created_at', { ascending: false });

      setForms(data || []);
    } catch (error) {
      console.error('Error loading contact forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormStatus = async (
    formId: string,
    status: 'new' | 'in_progress' | 'completed'
  ) => {
    const supabase = createClient();

    try {
      await supabase.from('contact_forms').update({ status }).eq('id', formId);

      setForms((prev) =>
        prev.map((form) => (form.id === formId ? { ...form, status } : form))
      );

      if (selectedForm?.id === formId) {
        setSelectedForm((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (error) {
      console.error('Error updating form status:', error);
      alert('Error al actualizar el estado');
    }
  };

  const filteredForms = forms.filter((form) => {
    if (filter === 'all') return true;
    return form.status === filter;
  });

  if (isLoading) {
    return <Loading text="Cargando formularios..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Formularios de Contacto</h1>
        <p className="text-gray-600 mt-1">Gestiona las solicitudes de información</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Nuevos</p>
            <p className="text-3xl font-bold text-orange-600">
              {forms.filter((f) => f.status === 'new').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">En Progreso</p>
            <p className="text-3xl font-bold text-blue-600">
              {forms.filter((f) => f.status === 'in_progress').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Completados</p>
            <p className="text-3xl font-bold text-green-600">
              {forms.filter((f) => f.status === 'completed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({forms.length})
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'new'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Nuevos ({forms.filter((f) => f.status === 'new').length})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'in_progress'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En Progreso ({forms.filter((f) => f.status === 'in_progress').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completados ({forms.filter((f) => f.status === 'completed').length})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Forms List */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Formularios ({filteredForms.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredForms.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredForms.map((form) => (
                  <div
                    key={form.id}
                    onClick={() => setSelectedForm(form)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedForm?.id === form.id
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-accent/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{form.name}</p>
                        <p className="text-sm text-gray-600">{form.email}</p>
                      </div>
                      <Badge
                        variant={
                          form.status === 'new'
                            ? 'warning'
                            : form.status === 'in_progress'
                            ? 'default'
                            : 'success'
                        }
                      >
                        {form.status === 'new'
                          ? 'Nuevo'
                          : form.status === 'in_progress'
                          ? 'En Progreso'
                          : 'Completado'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(form.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay formularios</p>
            )}
          </CardContent>
        </Card>

        {/* Form Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedForm ? 'Detalles del Formulario' : 'Selecciona un formulario'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedForm ? (
              <div className="space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Información de Contacto</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nombre</label>
                      <p className="text-gray-900">{selectedForm.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedForm.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Teléfono</label>
                      <p className="text-gray-900">{selectedForm.phone}</p>
                    </div>
                    {selectedForm.business_type && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Tipo de negocio
                        </label>
                        <p className="text-gray-900">{selectedForm.business_type}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Mensaje</h3>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                    {selectedForm.message || 'Sin mensaje'}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">Cambiar Estado</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedForm.status !== 'in_progress' && (
                      <Button
                        size="sm"
                        onClick={() => updateFormStatus(selectedForm.id, 'in_progress')}
                        className="flex items-center gap-2"
                      >
                        En Progreso
                      </Button>
                    )}
                    {selectedForm.status !== 'completed' && (
                      <Button
                        size="sm"
                        onClick={() => updateFormStatus(selectedForm.id, 'completed')}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Completar
                      </Button>
                    )}
                    {selectedForm.status !== 'new' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateFormStatus(selectedForm.id, 'new')}
                        className="flex items-center gap-2"
                      >
                        Marcar como Nuevo
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Selecciona un formulario para ver los detalles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
