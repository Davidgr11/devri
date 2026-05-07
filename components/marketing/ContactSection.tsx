'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { contactFormSchema, type ContactFormData } from '@/lib/validations/schemas';
import { Button } from '@/components/ui';

const steps = [
  { id: 'name', label: '¿Cómo te llamas?', placeholder: 'Tu nombre completo', type: 'text' },
  { id: 'email', label: '¿Cuál es tu email?', placeholder: 'tu@email.com', type: 'email' },
  { id: 'phone', label: '¿Y tu teléfono?', placeholder: '55 1234 5678', type: 'tel' },
  { id: 'business_type', label: '¿Cómo describes tu negocio?', placeholder: '', type: 'select' },
  { id: 'message', label: '¿Qué necesitas?', placeholder: 'Cuéntanos tu proyecto con el mayor detalle posible...', type: 'textarea' },
];

const businessOptions = [
  { value: 'negocio-local', label: 'Tengo un negocio local' },
  { value: 'profesional-independiente', label: 'Soy profesional independiente' },
  { value: 'empresa', label: 'Tengo una empresa' },
  { value: 'startup', label: 'Tengo una startup' },
];

const inputClass = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all';

export function ContactSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const currentField = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    const isValid = await trigger(currentField.id as keyof ContactFormData);
    if (isValid && !isLastStep) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: ContactFormData) => {
    if (!isLastStep) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error al enviar');
      }
      setIsSuccess(true);
    } catch (error: any) {
      setSubmitError(error.message || 'Error al enviar el formulario. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setCurrentStep(0);
    setSubmitError('');
    reset();
  };

  if (isSuccess) {
    return (
      <section id="contacto" className="py-20 md:py-28 bg-[#080A10] scroll-mt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-secondary-dark/30 bg-secondary-dark/5 p-10 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary-dark/20 border border-secondary-dark/30 flex items-center justify-center mx-auto mb-5">
              <Check className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">¡Listo, recibimos tu mensaje!</h3>
            <p className="text-gray-400 mb-8">
              Te respondemos dentro de las próximas 24 horas. ¡Estamos emocionados de conocer tu proyecto!
            </p>
            <Button onClick={handleReset} variant="ghost" className="border border-white/10 text-gray-300 hover:text-white">
              Enviar otro mensaje
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="py-20 md:py-28 bg-[#080A10] relative scroll-mt-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-dark/6 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent-light text-xs font-medium mb-5 uppercase tracking-wider">
            Contacto
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Cuéntanos sobre
            <br />
            <span className="gradient-text">tu proyecto</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Responde unas preguntas rápidas y te contactamos en menos de 24 horas.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
              <span>Paso {currentStep + 1} de {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-dark to-accent rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/3 p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="mb-8"
                >
                  <h3 className="text-white font-semibold text-lg mb-4">{currentField.label}</h3>

                  {currentField.type === 'textarea' ? (
                    <div>
                      <textarea
                        {...register(currentField.id as keyof ContactFormData)}
                        rows={5}
                        placeholder={currentField.placeholder}
                        className={`${inputClass} resize-none`}
                      />
                      {errors[currentField.id as keyof ContactFormData] && (
                        <p className="text-red-400 text-xs mt-1.5">{errors[currentField.id as keyof ContactFormData]?.message}</p>
                      )}
                    </div>
                  ) : currentField.type === 'select' ? (
                    <div>
                      <select
                        {...register(currentField.id as keyof ContactFormData)}
                        className={`${inputClass} appearance-none`}
                        defaultValue=""
                      >
                        <option value="" disabled className="bg-[#111827] text-gray-400">Selecciona una opción</option>
                        {businessOptions.map((o) => (
                          <option key={o.value} value={o.value} className="bg-[#111827] text-white">{o.label}</option>
                        ))}
                      </select>
                      {errors[currentField.id as keyof ContactFormData] && (
                        <p className="text-red-400 text-xs mt-1.5">{errors[currentField.id as keyof ContactFormData]?.message}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        {...register(currentField.id as keyof ContactFormData)}
                        type={currentField.type}
                        placeholder={currentField.placeholder}
                        autoComplete={currentField.type === 'email' ? 'email' : undefined}
                        className={inputClass}
                      />
                      {errors[currentField.id as keyof ContactFormData] && (
                        <p className="text-red-400 text-xs mt-1.5">{errors[currentField.id as keyof ContactFormData]?.message}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {submitError && (
                <p className="text-red-400 text-sm mb-4">{submitError}</p>
              )}

              {/* Navigation */}
              <div className="flex items-center gap-3">
                {!isFirstStep && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePrevious}
                    className="border border-white/10 text-gray-400 hover:text-white gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Atrás
                  </Button>
                )}
                <div className="flex-1" />
                {isLastStep ? (
                  <Button type="submit" isLoading={isSubmitting} className="gap-2">
                    Enviar mensaje
                    <Check className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext} className="gap-2">
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
