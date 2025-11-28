/**
 * Zod Validation Schemas
 * Used for form validation across the application
 */

import { z } from 'zod';

// ========== AUTH SCHEMAS ==========

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  remember: z.boolean().optional(),
});

export const signupSchema = z.object({
  full_name: z
    .string()
    .min(1, 'El nombre completo es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña'),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
});

// ========== CONTACT FORM SCHEMAS ==========

export const phoneRegex = /^(\+52|52)?[ -]?([0-9]{2})[ -]?([0-9]{4})[ -]?([0-9]{4})$/;

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(phoneRegex, 'Formato de teléfono inválido. Ejemplo: 55 1234 5678'),
  business_type: z
    .string()
    .min(1, 'Selecciona un tipo de negocio'),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje es demasiado largo')
    .optional()
    .or(z.literal('')),
});

// ========== ONBOARDING SCHEMAS ==========

export const onboardingSchema = z.object({
  business_type: z
    .string()
    .min(1, 'Selecciona un tipo de emprendedor'),
  business_subsector: z
    .string()
    .min(1, 'Selecciona una opción'),
  business_description: z
    .string()
    .max(500, 'La descripción es demasiado larga')
    .optional(),
});

// ========== PROFILE SCHEMAS ==========

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(1, 'El nombre completo es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  phone: z
    .string()
    .regex(phoneRegex, 'Formato de teléfono inválido')
    .optional()
    .or(z.literal('')),
  business_type: z
    .string()
    .optional(),
  business_subsector: z
    .string()
    .optional(),
  business_description: z
    .string()
    .max(500, 'La descripción es demasiado larga')
    .optional()
    .or(z.literal('')),
});

// ========== ADMIN SCHEMAS ==========

export const serviceCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre es demasiado largo'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  description: z
    .string()
    .max(500, 'La descripción es demasiado larga')
    .optional()
    .or(z.literal('')),
  type: z.enum(['primary', 'secondary']),
  parent_id: z
    .string()
    .uuid()
    .optional()
    .or(z.literal('')),
  order_index: z
    .number()
    .int()
    .min(0),
  demo_slug: z
    .string()
    .optional()
    .or(z.literal('')),
  status: z.enum(['active', 'inactive']),
});

export const subscriptionPlanSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre es demasiado largo'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  price_mxn: z
    .number()
    .int()
    .min(0, 'El precio debe ser mayor o igual a 0'),
  stripe_price_id: z
    .string()
    .optional()
    .or(z.literal('')),
  features: z
    .array(z.string())
    .min(1, 'Agrega al menos una característica'),
  is_active: z.boolean(),
  order_index: z
    .number()
    .int()
    .min(0),
});

export const faqSchema = z.object({
  question: z
    .string()
    .min(1, 'La pregunta es requerida')
    .max(200, 'La pregunta es demasiado larga'),
  answer: z
    .string()
    .min(1, 'La respuesta es requerida')
    .max(1000, 'La respuesta es demasiado larga'),
  order_index: z
    .number()
    .int()
    .min(0),
  is_active: z.boolean(),
});

export const testimonialSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre es demasiado largo'),
  business_name: z
    .string()
    .max(100, 'El nombre del negocio es demasiado largo')
    .optional()
    .or(z.literal('')),
  rating: z
    .number()
    .int()
    .min(1, 'El rating mínimo es 1')
    .max(5, 'El rating máximo es 5'),
  quote: z
    .string()
    .min(1, 'El testimonio es requerido')
    .max(300, 'El testimonio es demasiado largo'),
  image_url: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean(),
  order_index: z
    .number()
    .int()
    .min(0),
});

export const clientLogoSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre es demasiado largo'),
  logo_url: z
    .string()
    .url('URL inválida')
    .min(1, 'La URL del logo es requerida'),
  is_active: z.boolean(),
  order_index: z
    .number()
    .int()
    .min(0),
});

export const clientWebsiteSchema = z.object({
  url: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  status: z.enum(['pending', 'development', 'published']),
});

// ========== TYPE INFERENCE ==========

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ServiceCategoryFormData = z.infer<typeof serviceCategorySchema>;
export type SubscriptionPlanFormData = z.infer<typeof subscriptionPlanSchema>;
export type FAQFormData = z.infer<typeof faqSchema>;
export type TestimonialFormData = z.infer<typeof testimonialSchema>;
export type ClientLogoFormData = z.infer<typeof clientLogoSchema>;
export type ClientWebsiteFormData = z.infer<typeof clientWebsiteSchema>;
