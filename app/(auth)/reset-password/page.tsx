/**
 * Reset Password Page
 * Password recovery page
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/schemas';
import { createClient } from '@/lib/supabase/client';
import { Button, Input } from '@/components/ui';
import { Check } from 'lucide-react';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (resetError) throw resetError;

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el enlace');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Revisa tu email
            </h2>
            <p className="text-gray-600 mb-6">
              Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.
            </p>
            <Link href="/login">
              <Button fullWidth>Volver a iniciar sesión</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl md:text-2xl font-bold text-white hover:text-accent transition-colors group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 relative transition-transform group-hover:scale-105">
              <Image
                src="/devri-logo-light.svg"
                alt="Devri Solutions Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:inline text-gray-900">DEVRI</span>
            <span className="sm:hidden text-gray-900">DEVRI</span>
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Recupera tu contraseña</h1>
          <p className="text-gray-600 mt-2">Te enviaremos un enlace de recuperación</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register('email')}
              label="Email"
              type="email"
              error={errors.email?.message}
              fullWidth
              autoComplete="email"
              placeholder="tu@email.com"
            />

            <Button type="submit" fullWidth isLoading={isLoading}>
              Enviar enlace de recuperación
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <Link href="/login" className="text-accent font-medium hover:underline">
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
