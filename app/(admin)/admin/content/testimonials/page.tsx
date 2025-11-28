/**
 * Admin Testimonials Page
 * Manage client testimonials
 */

'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea, Badge } from '@/components/ui';
import type { Testimonial } from '@/types';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    quote: '',
    rating: 5,
    image_url: '',
    is_active: true,
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials');
      if (!response.ok) throw new Error('Error loading testimonials');

      const data = await response.json();
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const method = editingTestimonial ? 'PUT' : 'POST';
      const body = editingTestimonial
        ? { id: editingTestimonial.id, ...formData }
        : formData;

      const response = await fetch('/api/admin/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar');
      }

      loadTestimonials();
      handleCancel();
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      alert(error.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este testimonio?')) return;

    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar');
      }

      loadTestimonials();
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      alert(error.message || 'Error al eliminar');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      business_name: testimonial.business_name || '',
      quote: testimonial.quote,
      image_url: testimonial.image_url || '',
      rating: testimonial.rating,
      is_active: testimonial.is_active,
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingTestimonial(null);
    setIsCreating(false);
    setFormData({
      name: '',
      business_name: '',
      quote: '',
      rating: 5,
      image_url: '',
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Testimonios</h1>
          <p className="text-gray-600 mt-1">Administra los testimonios de clientes</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Testimonio
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total de Testimonios</p>
            <p className="text-3xl font-bold text-gray-900">{testimonials.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Testimonios Activos</p>
            <p className="text-3xl font-bold text-green-600">
              {testimonials.filter((t) => t.is_active).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle>
              {editingTestimonial ? 'Editar Testimonio' : 'Nuevo Testimonio'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Nombre del Cliente"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                placeholder="Juan Pérez"
              />
              <Input
                label="Negocio/Empresa (opcional)"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                fullWidth
                placeholder="Café Central"
              />
              <Input
                label="URL de Imagen (opcional)"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                fullWidth
                placeholder="https://..."
              />
              <Textarea
                label="Testimonio"
                value={formData.quote}
                onChange={(e) =>
                  setFormData({ ...formData, quote: e.target.value })
                }
                fullWidth
                rows={4}
                placeholder="Excelente servicio, el sitio web superó mis expectativas..."
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className={`p-2 rounded-lg transition-colors ${
                        formData.rating >= rating
                          ? 'text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Testimonio activo</span>
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

      {/* Testimonials List */}
      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <Badge variant={testimonial.is_active ? 'success' : 'default'}>
                      {testimonial.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  {testimonial.business_name && (
                    <p className="text-sm text-gray-600 mb-2">{testimonial.business_name}</p>
                  )}
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="p-2 text-gray-600 hover:text-accent hover:bg-accent/10 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-700 italic">"{testimonial.quote}"</p>
            </CardContent>
          </Card>
        ))}

        {testimonials.length === 0 && (
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                No hay testimonios creados. Haz clic en "Nuevo Testimonio" para empezar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
