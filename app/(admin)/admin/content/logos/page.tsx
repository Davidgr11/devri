/**
 * Admin Client Logos Page
 * Manage client logos displayed on landing page
 */

'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Upload } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui';
import type { ClientLogo } from '@/types';

export default function AdminLogosPage() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    is_active: true,
  });

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    try {
      const response = await fetch('/api/admin/logos');
      if (!response.ok) throw new Error('Error loading logos');

      const data = await response.json();
      setLogos(data || []);
    } catch (error) {
      console.error('Error loading logos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const method = editingLogo ? 'PUT' : 'POST';
      const body = editingLogo
        ? { id: editingLogo.id, ...formData }
        : formData;

      const response = await fetch('/api/admin/logos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar');
      }

      loadLogos();
      handleCancel();
    } catch (error: any) {
      console.error('Error saving logo:', error);
      alert(error.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este logo?')) return;

    try {
      const response = await fetch(`/api/admin/logos?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar');
      }

      loadLogos();
    } catch (error: any) {
      console.error('Error deleting logo:', error);
      alert(error.message || 'Error al eliminar');
    }
  };

  const handleEdit = (logo: ClientLogo) => {
    setEditingLogo(logo);
    setFormData({
      name: logo.name,
      logo_url: logo.logo_url,
      is_active: logo.is_active,
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingLogo(null);
    setIsCreating(false);
    setFormData({
      name: '',
      logo_url: '',
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Logos</h1>
          <p className="text-gray-600 mt-1">
            Administra los logos que aparecen en el carrusel de la landing
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Logo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total de Logos</p>
            <p className="text-3xl font-bold text-gray-900">{logos.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Logos Activos</p>
            <p className="text-3xl font-bold text-green-600">
              {logos.filter((l) => l.is_active).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle>{editingLogo ? 'Editar Logo' : 'Nuevo Logo'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Nombre del Cliente"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                placeholder="Acme Corp"
              />
              <Input
                label="URL del Logo"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                fullWidth
                placeholder="https://via.placeholder.com/150x50"
                helperText="Por ahora usa URLs externas. En producción, sube a Supabase Storage."
              />
              {formData.logo_url && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                  <img
                    src={formData.logo_url}
                    alt="Preview"
                    className="h-12 object-contain grayscale"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/150x50?text=Error';
                    }}
                  />
                </div>
              )}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Logo activo</span>
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

      {/* Logos Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {logos.map((logo) => (
          <Card key={logo.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-bold text-gray-900">{logo.name}</h3>
                    <Badge variant={logo.is_active ? 'success' : 'default'}>
                      {logo.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => handleEdit(logo)}
                    className="p-2 text-gray-600 hover:text-accent hover:bg-accent/10 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(logo.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center h-24">
                <img
                  src={logo.logo_url}
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/150x50?text=Error';
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {logos.length === 0 && (
          <Card className="md:col-span-3">
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                No hay logos creados. Haz clic en "Nuevo Logo" para empezar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
