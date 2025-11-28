/**
 * Login Page
 * User authentication page
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validations/schemas';
import { createClient } from '@/lib/supabase/client';
import { Button, Input } from '@/components/ui';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Check user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authData.user.id)
          .single();

        // Redirect based on role
        if (!roleError && (roleData as any)?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
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
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Bienvenido de vuelta</h1>
          <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
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
            />

            <div className="relative">
              <Input
                {...register('password')}
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                error={errors.password?.message}
                fullWidth
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-sm text-accent hover:underline"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('remember')}
                  className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <span className="text-sm text-gray-600">Recordarme</span>
              </label>

              <Link
                href="/reset-password"
                className="text-sm text-accent hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/signup" className="text-accent font-medium hover:underline">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
