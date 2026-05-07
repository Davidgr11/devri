'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/schemas';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, ArrowLeft, Send } from 'lucide-react';
import Image from 'next/image';

const inputClass = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all';

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      });
      if (resetError) throw resetError;
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el enlace');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0D14] px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent-dark/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group mb-6">
            <div className="w-10 h-10 relative group-hover:scale-105 transition-transform">
              <Image src="/devri-logo-dark.svg" alt="DEVRI" fill className="object-contain" priority />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">DEVRI</span>
          </Link>
          {!isSuccess ? (
            <>
              <h1 className="text-3xl font-bold text-white">Recupera tu acceso</h1>
              <p className="text-gray-500 mt-2 text-sm text-center">Te enviamos un enlace para restablecer tu contraseña</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white">¡Revisa tu email!</h1>
              <p className="text-gray-500 mt-2 text-sm text-center">El enlace fue enviado a tu bandeja</p>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-8">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Si existe una cuenta con ese email recibirás un enlace. Revisa también tu carpeta de spam.
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 text-accent-light hover:text-white transition-colors text-sm font-medium">
                <ArrowLeft className="w-4 h-4" />
                Volver a iniciar sesión
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                  <input {...register('email')} type="email" placeholder="tu@email.com" autoComplete="email" className={inputClass} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-dark text-white font-semibold text-sm hover:bg-accent disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <><Send className="w-4 h-4" />Enviar enlace de recuperación</>
                  )}
                </button>
              </form>
              <div className="mt-5 text-center">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver a iniciar sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
