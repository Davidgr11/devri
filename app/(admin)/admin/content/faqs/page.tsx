/**
 * Admin FAQs Page
 * Manage frequently asked questions
 */

'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea, Badge } from '@/components/ui';
import type { FAQ } from '@/types';

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    is_active: true,
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const response = await fetch('/api/admin/faqs');
      if (!response.ok) throw new Error('Error loading FAQs');

      const data = await response.json();
      setFaqs(data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const method = editingFAQ ? 'PUT' : 'POST';
      const body = editingFAQ
        ? { id: editingFAQ.id, ...formData }
        : formData;

      const response = await fetch('/api/admin/faqs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar');
      }

      loadFAQs();
      handleCancel();
    } catch (error: any) {
      console.error('Error saving FAQ:', error);
      alert(error.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta pregunta?')) return;

    try {
      const response = await fetch(`/api/admin/faqs?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar');
      }

      loadFAQs();
    } catch (error: any) {
      console.error('Error deleting FAQ:', error);
      alert(error.message || 'Error al eliminar');
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      is_active: faq.is_active,
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingFAQ(null);
    setIsCreating(false);
    setFormData({
      question: '',
      answer: '',
      is_active: true,
    });
  };

  if (isLoading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de FAQs</h1>
          <p className="text-gray-600 mt-1">Administra las preguntas frecuentes</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva FAQ
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total de FAQs</p>
            <p className="text-3xl font-bold text-gray-900">{faqs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">FAQs Activas</p>
            <p className="text-3xl font-bold text-green-600">
              {faqs.filter((f) => f.is_active).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle>{editingFAQ ? 'Editar FAQ' : 'Nueva FAQ'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Pregunta"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                fullWidth
                placeholder="¿Cuánto tiempo toma desarrollar un sitio web?"
              />
              <Textarea
                label="Respuesta"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                fullWidth
                rows={4}
                placeholder="El tiempo de desarrollo depende de..."
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">FAQ activa</span>
              </label>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Guardar
                </Button>
                <Button variant="ghost" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQs List */}
      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
                    <Badge variant={faq.is_active ? 'success' : 'default'}>
                      {faq.is_active ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="p-2 text-gray-600 hover:text-accent hover:bg-accent/10 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {faqs.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                No hay FAQs creadas. Haz clic en "Nueva FAQ" para empezar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
