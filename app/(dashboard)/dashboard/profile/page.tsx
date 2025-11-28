/**
 * Profile Page
 * User profile editing and information
 */

'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Briefcase, Save } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { updateUserProfile, getServiceCategories } from '@/lib/supabase/queries';
import { updateProfileSchema, type UpdateProfileFormData } from '@/lib/validations/schemas';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select, Textarea, Loading } from '@/components/ui';
import type { ServiceCategoryWithChildren } from '@/types';

export default function ProfilePage() {
  const { user, profile } = useUser();
  const [categories, setCategories] = useState<ServiceCategoryWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  });

  const selectedPrimaryId = watch('business_type');
  const selectedPrimary = categories.find((c) => c.id === selectedPrimaryId);
  const secondaryOptions = selectedPrimary?.children || [];

  useEffect(() => {
    Promise.all([getServiceCategories()]).then(([categoriesData]) => {
      setCategories(categoriesData);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        business_type: profile.business_type || '',
        business_subsector: profile.business_subsector || '',
        business_description: profile.business_description || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    if (!user) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateUserProfile(user.id, {
        full_name: data.full_name,
        phone: data.phone || null,
        business_type: data.business_type || null,
        business_subsector: data.business_subsector || null,
        business_description: data.business_description || null,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al guardar. Por favor intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profile) {
    return <Loading text="Cargando perfil..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-1">Actualiza tu información personal y de negocio</p>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <Input
              {...register('full_name')}
              label="Nombre completo"
              type="text"
              error={errors.full_name?.message}
              fullWidth
              icon={<User className="w-5 h-5" />}
            />

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                El email no se puede modificar. Contacta soporte si necesitas cambiarlo.
              </p>
            </div>

            {/* Phone */}
            <Input
              {...register('phone')}
              label="Teléfono (opcional)"
              type="tel"
              error={errors.phone?.message}
              fullWidth
              icon={<Phone className="w-5 h-5" />}
              placeholder="55 1234 5678"
            />

            {/* Divider */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Información del Negocio
              </h3>
            </div>

            {/* Business Type */}
            <Select
              {...register('business_type')}
              label="Tipo de emprendedor"
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              placeholder="Selecciona una opción"
              error={errors.business_type?.message}
              fullWidth
            />

            {/* Business Subsector */}
            {selectedPrimary && secondaryOptions.length > 0 && (
              <Select
                {...register('business_subsector')}
                label="Subsector"
                options={secondaryOptions.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
                placeholder="Selecciona una opción"
                error={errors.business_subsector?.message}
                fullWidth
              />
            )}

            {/* Business Description */}
            <Textarea
              {...register('business_description')}
              label="Descripción del negocio (opcional)"
              placeholder="Describe brevemente tu negocio, servicios o productos..."
              error={errors.business_description?.message}
              fullWidth
              rows={4}
            />

            {/* Success Message */}
            {saveSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                ¡Perfil actualizado exitosamente!
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                isLoading={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <label className="font-medium text-gray-700">Cuenta creada</label>
              <p className="text-gray-600">
                {user?.created_at &&
                  new Date(user.created_at).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
              </p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Última actualización</label>
              <p className="text-gray-600">
                {profile.updated_at &&
                  new Date(profile.updated_at).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
