/**
 * Contact Section
 * Wizard-style contact form (one question at a time)
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { contactFormSchema, type ContactFormData } from '@/lib/validations/schemas';
import { Button, Input, Textarea, Select } from '@/components/ui';

const steps = [
  { id: 'name', label: 'Nombre completo', type: 'text' },
  { id: 'email', label: 'Email', type: 'email' },
  { id: 'phone', label: 'Teléfono', type: 'tel' },
  { id: 'business_type', label: 'Tipo de negocio', type: 'select' },
  { id: 'message', label: 'Cuéntanos qué necesitas', type: 'textarea' },
];

export function ContactSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const currentField = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    const fieldName = currentField.id as keyof ContactFormData;
    const isValid = await trigger(fieldName);

    if (isValid && !isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    // Only submit if we're on the last step
    if (!isLastStep) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit via API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          business_type: data.business_type,
          message: data.message || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar el formulario');
      }

      setIsSuccess(true);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Hubo un error al enviar el formulario. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setCurrentStep(0);
    reset();
  };

  if (isSuccess) {
    return (
      <section id="contacto" className="py-16 md:py-24 bg-gray-50 scroll-mt-16 md:scroll-mt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-lg"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              ¡Mensaje enviado!
            </h3>
            <p className="text-gray-600 mb-8">
              Gracias por contactarnos. Te responderemos muy pronto.
            </p>
            <Button onClick={handleReset}>Enviar otro mensaje</Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="py-16 md:py-24 bg-gray-50 scroll-mt-16 md:scroll-mt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Cuéntanos sobre tu proyecto
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Responde unas preguntas y te contactamos
          </motion.p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pregunta {currentStep + 1} de {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-accent h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentField.type === 'text' || currentField.type === 'email' || currentField.type === 'tel' ? (
                <Input
                  {...register(currentField.id as keyof ContactFormData)}
                  label={currentField.label}
                  type={currentField.type}
                  error={errors[currentField.id as keyof ContactFormData]?.message}
                  fullWidth
                  placeholder={
                    currentField.type === 'tel'
                      ? 'Ejemplo: 55 1234 5678'
                      : undefined
                  }
                />
              ) : currentField.type === 'select' ? (
                <Select
                  {...register(currentField.id as keyof ContactFormData)}
                  label={currentField.label}
                  options={[
                    { value: 'negocio-local', label: 'Tengo un negocio local' },
                    { value: 'profesional-independiente', label: 'Soy profesional independiente' },
                    { value: 'empresa', label: 'Tengo una empresa' },
                    { value: 'startup', label: 'Tengo una startup' },
                  ]}
                  error={errors[currentField.id as keyof ContactFormData]?.message}
                  fullWidth
                  placeholder="Selecciona una opción"
                />
              ) : (
                <Textarea
                  {...register(currentField.id as keyof ContactFormData)}
                  label={currentField.label}
                  error={errors[currentField.id as keyof ContactFormData]?.message}
                  fullWidth
                  rows={6}
                  placeholder="Describe brevemente qué necesitas..."
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            className="flex gap-4 mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {!isFirstStep && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
              </motion.div>
            )}

            <div className="flex-1" />

            {isLastStep ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button type="submit" isLoading={isSubmitting} className="flex items-center gap-2">
                  Enviar mensaje
                  <Check className="w-4 h-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button type="button" onClick={handleNext} className="flex items-center gap-2">
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}
