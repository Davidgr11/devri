'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/lib/validations/schemas';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const inputClass = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { full_name: data.full_name } },
      });
      if (authError) throw authError;
      if (authData.user) {
        const needsEmailConfirmation = !authData.session || authData.user.identities?.length === 0;
        if (needsEmailConfirmation) {
          setUserEmail(data.email);
          setShowVerificationNotice(true);
        } else {
          router.push('/onboarding');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0D14] px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent-dark/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group mb-6">
            <div className="w-10 h-10 relative group-hover:scale-105 transition-transform">
              <Image src="/devri-logo-dark.svg" alt="DEVRI" fill className="object-contain" priority />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">DEVRI</span>
          </Link>
          {!showVerificationNotice ? (
            <>
              <h1 className="text-3xl font-bold text-white">Crea tu cuenta</h1>
              <p className="text-gray-500 mt-2 text-sm">Comienza tu transformación digital</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white">¡Revisa tu correo!</h1>
              <p className="text-gray-500 mt-2 text-sm">Solo un paso más para comenzar</p>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-8">
          {/* Verification notice */}
          {showVerificationNotice ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-2">¡Cuenta creada!</h2>
                <p className="text-gray-400 text-sm mb-3">Enviamos un correo de verificación a:</p>
                <p className="font-semibold text-accent-light mb-4">{userEmail}</p>
                <div className="bg-white/5 border border-white/8 rounded-xl p-4 text-left">
                  <p className="text-sm text-gray-300 font-medium mb-2">Pasos para continuar:</p>
                  <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                    <li>Revisa tu bandeja de entrada (y spam)</li>
                    <li>Abre el correo de verificación de DEVRI</li>
                    <li>Haz clic en el enlace de confirmación</li>
                    <li>Inicia sesión con tus credenciales</li>
                  </ol>
                </div>
                <p className="text-xs text-gray-600 mt-4">
                  ¿No recibiste el correo?{' '}
                  <button onClick={() => { setShowVerificationNotice(false); setError(null); }} className="text-accent-light hover:text-white transition-colors">
                    Intenta de nuevo
                  </button>
                </p>
              </div>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-accent-dark text-white font-semibold text-sm hover:bg-accent transition-colors mt-2"
              >
                Ir a iniciar sesión
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre completo</label>
                  <input {...register('full_name')} type="text" placeholder="Tu nombre" autoComplete="name" className={inputClass} />
                  {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                  <input {...register('email')} type="email" placeholder="tu@email.com" autoComplete="email" className={inputClass} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                      className={`${inputClass} pr-10`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirmar contraseña</label>
                  <input
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repite tu contraseña"
                    autoComplete="new-password"
                    className={inputClass}
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...register('acceptTerms')} className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent/30 flex-shrink-0" />
                  <span className="text-sm text-gray-400">
                    Acepto los{' '}
                    <Link href="/terminos" className="text-accent-light hover:text-white transition-colors">términos y condiciones</Link>
                    {' '}y la{' '}
                    <Link href="/privacidad" className="text-accent-light hover:text-white transition-colors">política de privacidad</Link>
                  </span>
                </label>
                {errors.acceptTerms && <p className="text-red-400 text-xs -mt-2">{errors.acceptTerms.message}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-dark text-white font-semibold text-sm hover:bg-accent disabled:opacity-50 transition-colors mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creando cuenta...
                    </span>
                  ) : (
                    <>Crear cuenta <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
              <div className="mt-5 text-center text-sm text-gray-500">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-accent-light hover:text-white transition-colors font-medium">
                  Inicia sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
