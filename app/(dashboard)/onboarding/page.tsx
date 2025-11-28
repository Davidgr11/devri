/**
 * Onboarding Page
 * 4-step wizard for new users
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { onboardingSchema, type OnboardingFormData } from '@/lib/validations/schemas';
import { getServiceCategories } from '@/lib/supabase/queries';
import { updateUserProfile } from '@/lib/supabase/queries';
import { useUser } from '@/hooks/useUser';
import { Button, Select, Textarea } from '@/components/ui';
import { Loading } from '@/components/ui';
import type { ServiceCategoryWithChildren } from '@/types';

const STEPS = [
  { id: 1, title: 'Bienvenida' },
  { id: 2, title: 'Tipo de emprendedor' },
  { id: 3, title: 'Subsector' },
  { id: 4, title: 'Descripción' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState<ServiceCategoryWithChildren[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
  });

  const selectedPrimaryId = watch('business_type');
  const selectedPrimary = categories.find((c) => c.id === selectedPrimaryId);
  const secondaryOptions = selectedPrimary?.children || [];

  useEffect(() => {
    getServiceCategories().then(setCategories).catch(console.error);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  // Reset secondary when primary changes
  useEffect(() => {
    setValue('business_subsector', '');
  }, [selectedPrimaryId, setValue]);

  const onSubmit = async (data: OnboardingFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await updateUserProfile(user.id, {
        business_type: data.business_type,
        business_subsector: data.business_subsector,
        business_description: data.business_description || null,
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      alert('Error al guardar. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading || !user) {
    return <Loading fullScreen text="Cargando..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step.id
                      ? 'bg-accent text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.id ? 'bg-accent' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            Paso {currentStep} de {STEPS.length}
          </p>
        </div>

        {/* Steps Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1: Welcome */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    ¡Hola {user.user_metadata?.full_name?.split(' ')[0]}!
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Vamos a personalizar tu experiencia en 3 simples pasos
                  </p>
                  <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <span className="text-6xl">👋</span>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Primary Category */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    ¿Con cuál te identificas?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Selecciona la opción que mejor te describa
                  </p>

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
                </motion.div>
              )}

              {/* Step 3: Secondary Category */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedPrimary?.name === 'Tengo un negocio local' && '¿Qué tipo de negocio?'}
                    {selectedPrimary?.name === 'Soy profesional independiente' && '¿Qué tipo de profesional?'}
                    {selectedPrimary?.name === 'Tengo una empresa' && '¿Qué tipo de empresa?'}
                    {selectedPrimary?.name === 'Tengo una startup' && '¿Qué tipo de startup?'}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Esto nos ayuda a personalizar tu experiencia
                  </p>

                  {secondaryOptions.length > 0 ? (
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
                  ) : (
                    <p className="text-gray-500 text-center p-8 bg-gray-50 rounded-lg">
                      Por favor, selecciona un tipo de emprendedor en el paso anterior
                    </p>
                  )}
                </motion.div>
              )}

              {/* Step 4: Description */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Cuéntanos sobre tu negocio
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Opcional: Comparte más detalles sobre lo que haces
                  </p>

                  <Textarea
                    {...register('business_description')}
                    label="Descripción"
                    placeholder="Describe brevemente tu negocio, servicios, o productos..."
                    error={errors.business_description?.message}
                    fullWidth
                    rows={6}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
              )}

              <div className="flex-1" />

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="flex items-center gap-2"
                  disabled={currentStep === 3 && secondaryOptions.length === 0}
                >
                  {currentStep === 1 ? 'Comenzar' : 'Siguiente'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="flex items-center gap-2"
                >
                  Finalizar
                  <Check className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Skip button for last step */}
            {currentStep === 4 && (
              <div className="text-center mt-4">
                <button
                  type="submit"
                  onClick={() => setValue('business_description', '')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Omitir este paso
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
