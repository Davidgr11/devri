/**
 * Admin Services Page
 * Manage service categories and subcategories
 */

'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea, Select, Badge } from '@/components/ui';
import type { ServiceCategoryWithChildren } from '@/types';

export default function AdminServicesPage() {
  const [categories, setCategories] = useState<ServiceCategoryWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<ServiceCategoryWithChildren | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    callout: '',
    icon: '',
    parent_id: '',
    demo_url: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/services');
      if (!response.ok) throw new Error('Error loading categories');

      const data = await response.json();

      // Group categories by parent
      const categoriesMap = new Map();
      data.forEach((cat: any) => {
        if (!cat.parent_id) {
          if (!categoriesMap.has(cat.id)) {
            categoriesMap.set(cat.id, { ...cat, children: [] });
          }
        }
      });

      data.forEach((cat: any) => {
        if (cat.parent_id && categoriesMap.has(cat.parent_id)) {
          categoriesMap.get(cat.parent_id).children.push(cat);
        }
      });

      setCategories(Array.from(categoriesMap.values()));
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-');
      const body = editingCategory
        ? {
            id: editingCategory.id,
            name: formData.name,
            slug,
            description: formData.description || null,
            callout: formData.callout || null,
            icon: formData.icon || null,
            demo_url: formData.demo_url || null,
            status: formData.status,
            type: formData.parent_id ? 'secondary' : 'primary',
            parent_id: formData.parent_id || null,
          }
        : {
            name: formData.name,
            slug,
            description: formData.description || null,
            callout: formData.callout || null,
            icon: formData.icon || null,
            demo_url: formData.demo_url || null,
            status: formData.status,
            type: formData.parent_id ? 'secondary' : 'primary',
            parent_id: formData.parent_id || null,
          };

      const response = await fetch('/api/admin/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar');
      }

      loadCategories();
      handleCancel();
    } catch (error: any) {
      console.error('Error saving category:', error);
      alert(error.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar');
      }

      loadCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert(error.message || 'Error al eliminar');
    }
  };

  const handleEdit = (category: ServiceCategoryWithChildren) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      callout: category.callout || '',
      icon: category.icon || '',
      parent_id: category.parent_id || '',
      demo_url: category.demo_url || '',
      status: category.status,
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setIsCreating(false);
    setFormData({
      name: '',
      description: '',
      callout: '',
      icon: '',
      parent_id: '',
      demo_url: '',
      status: 'active' as 'active' | 'inactive',
    });
  };

  const primaryCategories = categories.filter((c) => !c.parent_id);

  if (isLoading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
          <p className="text-gray-600 mt-1">Administra las categorías y subcategorías</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle>
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
              />
              <Textarea
                label="Descripción (opcional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                rows={3}
                placeholder="Descripción detallada del servicio..."
              />
              <Textarea
                label="Callout - Mensaje llamativo (opcional)"
                value={formData.callout}
                onChange={(e) => setFormData({ ...formData, callout: e.target.value })}
                fullWidth
                rows={2}
                placeholder="Ej: ¿Tu negocio no aparece en Google? o ¿Necesitas más clientes?"
              />
              <Input
                label="URL del Demo/Sitio Web (opcional)"
                value={formData.demo_url}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                fullWidth
                type="url"
                placeholder="https://ejemplo.com"
              />
              <Select
                label="Ícono Lucide (opcional)"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                options={[
                  { value: '', label: 'Sin ícono' },
                  // Negocios y Comercio
                  { value: 'Store', label: 'Store - Tienda' },
                  { value: 'ShoppingBag', label: 'ShoppingBag - Comercio' },
                  { value: 'ShoppingCart', label: 'ShoppingCart - E-commerce' },
                  { value: 'Package', label: 'Package - Producto/Paquete' },
                  // Alimentos y Bebidas
                  { value: 'Coffee', label: 'Coffee - Café' },
                  { value: 'Utensils', label: 'Utensils - Restaurante' },
                  { value: 'UtensilsCrossed', label: 'UtensilsCrossed - Comida' },
                  { value: 'Pizza', label: 'Pizza - Pizzería' },
                  { value: 'Wine', label: 'Wine - Bar/Vinos' },
                  { value: 'IceCream', label: 'IceCream - Heladería/Postres' },
                  // Profesional y Corporativo
                  { value: 'Briefcase', label: 'Briefcase - Empresa/Negocio' },
                  { value: 'Building', label: 'Building - Edificio/Corporativo' },
                  { value: 'Building2', label: 'Building2 - Oficina' },
                  { value: 'Scale', label: 'Scale - Abogados/Legal' },
                  { value: 'Gavel', label: 'Gavel - Justicia/Legal' },
                  { value: 'Calculator', label: 'Calculator - Contabilidad' },
                  { value: 'PiggyBank', label: 'PiggyBank - Finanzas/Ahorro' },
                  { value: 'TrendingUp', label: 'TrendingUp - Inversiones/Crecimiento' },
                  // Personal y Servicios
                  { value: 'User', label: 'User - Personal/Individual' },
                  { value: 'Users', label: 'Users - Equipo/Grupo' },
                  { value: 'Home', label: 'Home - Casa/Hogar' },
                  { value: 'Sparkles', label: 'Sparkles - Belleza/Spa' },
                  { value: 'Scissors', label: 'Scissors - Peluquería/Barbería' },
                  { value: 'Shirt', label: 'Shirt - Ropa/Moda' },
                  { value: 'Watch', label: 'Watch - Joyería/Relojes' },
                  // Salud y Bienestar
                  { value: 'Heart', label: 'Heart - Salud/Bienestar' },
                  { value: 'HeartPulse', label: 'HeartPulse - Medicina/Salud' },
                  { value: 'Stethoscope', label: 'Stethoscope - Médico/Clínica' },
                  { value: 'Activity', label: 'Activity - Fitness/Gym' },
                  { value: 'Dumbbell', label: 'Dumbbell - Gimnasio/Fitness' },
                  { value: 'Bike', label: 'Bike - Ciclismo/Deportes' },
                  { value: 'Dog', label: 'Dog - Veterinaria/Mascotas' },
                  { value: 'Cat', label: 'Cat - Veterinaria/Mascotas' },
                  { value: 'Pill', label: 'Pill - Farmacia/Medicina' },
                  // Tecnología y Digital
                  { value: 'Laptop', label: 'Laptop - Tecnología' },
                  { value: 'Smartphone', label: 'Smartphone - Mobile' },
                  { value: 'Globe', label: 'Globe - Web/Global' },
                  { value: 'Code', label: 'Code - Desarrollo/Programación' },
                  { value: 'Rocket', label: 'Rocket - Startup/Innovación' },
                  { value: 'Zap', label: 'Zap - Energía/Velocidad' },
                  { value: 'CloudUpload', label: 'CloudUpload - Cloud/Hosting' },
                  { value: 'Database', label: 'Database - Datos/Software' },
                  // Educación y Cultura
                  { value: 'BookOpen', label: 'BookOpen - Educación' },
                  { value: 'GraduationCap', label: 'GraduationCap - Universidad/Educación' },
                  { value: 'School', label: 'School - Escuela/Academia' },
                  { value: 'Library', label: 'Library - Biblioteca/Libros' },
                  // Arte y Creatividad
                  { value: 'Palette', label: 'Palette - Arte/Diseño' },
                  { value: 'Paintbrush', label: 'Paintbrush - Pintura/Arte' },
                  { value: 'Camera', label: 'Camera - Fotografía' },
                  { value: 'Video', label: 'Video - Video/Multimedia' },
                  { value: 'Music', label: 'Music - Música' },
                  { value: 'Mic', label: 'Mic - Audio/Podcast' },
                  { value: 'Film', label: 'Film - Cine/Producción' },
                  // Construcción y Servicios
                  { value: 'Hammer', label: 'Hammer - Construcción/Reparación' },
                  { value: 'Wrench', label: 'Wrench - Mecánica/Mantenimiento' },
                  { value: 'HardHat', label: 'HardHat - Construcción/Obra' },
                  { value: 'Drill', label: 'Drill - Herramientas/Construcción' },
                  { value: 'PaintBucket', label: 'PaintBucket - Pintura/Renovación' },
                  // Transporte y Viajes
                  { value: 'Car', label: 'Car - Automotriz/Transporte' },
                  { value: 'Truck', label: 'Truck - Logística/Transporte' },
                  { value: 'Plane', label: 'Plane - Viajes/Turismo' },
                  { value: 'MapPin', label: 'MapPin - Ubicación/Local' },
                  { value: 'Navigation', label: 'Navigation - Navegación/Dirección' },
                  // Otros
                  { value: 'Leaf', label: 'Leaf - Ecología/Naturaleza' },
                  { value: 'Flower', label: 'Flower - Floristería/Jardín' },
                  { value: 'Sun', label: 'Sun - Energía Solar/Clima' },
                  { value: 'Moon', label: 'Moon - Noche/Eventos' },
                  { value: 'Star', label: 'Star - Destacado/Premium' },
                  { value: 'Award', label: 'Award - Premios/Reconocimientos' },
                  { value: 'Target', label: 'Target - Objetivos/Metas' },
                  { value: 'Gift', label: 'Gift - Regalos/Eventos' },
                ]}
                fullWidth
              />
              {!editingCategory?.parent_id && (
                <Select
                  label="Categoría Padre (opcional)"
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  options={[
                    { value: '', label: 'Ninguna (Categoría principal)' },
                    ...primaryCategories.map((c) => ({
                      value: c.id,
                      label: c.name,
                    })),
                  ]}
                  fullWidth
                />
              )}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Categoría activa</span>
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

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                    <Badge variant={category.status === 'active' ? 'success' : 'default'}>
                      {category.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-gray-600 hover:text-accent hover:bg-accent/10 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              {category.children && category.children.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Subcategorías ({category.children.length})
                  </p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {category.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-900">{child.name}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(child)}
                            className="p-1 text-gray-600 hover:text-accent rounded"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(child.id)}
                            className="p-1 text-gray-600 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
