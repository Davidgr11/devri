/**
 * Signup Page
 * User registration page
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/lib/validations/schemas';
import { createClient } from '@/lib/supabase/client';
import { sendWelcomeEmail } from '@/lib/resend/client';
import { Button, Input } from '@/components/ui';
import Image from 'next/image';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Check if email confirmation is required
        // When email confirmation is enabled, the session will be null
        const needsEmailConfirmation = !authData.session || authData.user.identities?.length === 0;

        if (needsEmailConfirmation) {
          // Show verification notice instead of redirecting
          setUserEmail(data.email);
          setShowVerificationNotice(true);
        } else {
          // Send welcome email
          try {
            await sendWelcomeEmail({
              to: data.email,
              name: data.full_name,
            });
          } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
          }

          // Redirect to onboarding if no email confirmation needed
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
          {!showVerificationNotice ? (
            <>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">Crea tu cuenta</h1>
              <p className="text-gray-600 mt-2">Comienza tu transformación digital</p>
            </>
          ) : (
            <>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">¡Revisa tu correo!</h1>
              <p className="text-gray-600 mt-2">Solo un paso más para comenzar</p>
            </>
          )}
        </div>

        {/* Verification Notice */}
        {showVerificationNotice ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center space-y-4">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  ¡Cuenta creada exitosamente!
                </h2>
                <p className="text-gray-600 mb-4">
                  Hemos enviado un correo de verificación a:
                </p>
                <p className="font-semibold text-accent mb-4">{userEmail}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-blue-900 mb-2">
                    <strong>Pasos para continuar:</strong>
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Revisa tu bandeja de entrada (y spam)</li>
                    <li>Abre el correo de verificación de DEVRI</li>
                    <li>Haz clic en el enlace de confirmación</li>
                    <li>Inicia sesión con tus credenciales</li>
                  </ol>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  ¿No recibiste el correo? Revisa tu carpeta de spam o{' '}
                  <button
                    onClick={() => {
                      setShowVerificationNotice(false);
                      setError(null);
                    }}
                    className="text-accent hover:underline"
                  >
                    intenta de nuevo
                  </button>
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/login"
                  className="block w-full bg-accent text-white py-3 px-4 rounded-lg font-medium hover:bg-accent-dark transition-colors"
                >
                  Ir a iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Form */
          <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register('full_name')}
              label="Nombre completo"
              type="text"
              error={errors.full_name?.message}
              fullWidth
              autoComplete="name"
            />

            <Input
              {...register('email')}
              label="Email"
              type="email"
              error={errors.email?.message}
              fullWidth
              autoComplete="email"
            />

            <div className="relative">
              <Input
                {...register('password')}
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                error={errors.password?.message}
                fullWidth
                autoComplete="new-password"
                helperText="Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-sm text-accent hover:underline"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <Input
              {...register('confirmPassword')}
              label="Confirmar contraseña"
              type={showPassword ? 'text' : 'password'}
              error={errors.confirmPassword?.message}
              fullWidth
              autoComplete="new-password"
            />

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                {...register('acceptTerms')}
                className="w-4 h-4 mt-1 text-accent border-gray-300 rounded focus:ring-accent"
              />
              <span className="text-sm text-gray-600">
                Acepto los{' '}
                <Link href="/terminos" className="text-accent hover:underline">
                  términos y condiciones
                </Link>{' '}
                y la{' '}
                <Link href="/privacidad" className="text-accent hover:underline">
                  política de privacidad
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-sm text-error -mt-4">{errors.acceptTerms.message}</p>
            )}

            <Button type="submit" fullWidth isLoading={isLoading}>
              Crear cuenta
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-accent font-medium hover:underline">
              Inicia sesión
            </Link>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
