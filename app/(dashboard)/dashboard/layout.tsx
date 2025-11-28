/**
 * Dashboard Layout
 * Layout for client portal
 */

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Globe, CreditCard, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { Loading } from '@/components/ui';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navigation = [
  { name: 'Inicio', href: '/dashboard', icon: Home },
  { name: 'Mi Sitio Web', href: '/dashboard/website', icon: Globe },
  { name: 'Suscripción', href: '/dashboard/subscription', icon: CreditCard },
  { name: 'Perfil', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, isLoading, isAuthenticated } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading || !user) {
    return <Loading fullScreen text="Cargando..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 transition-transform duration-300',
          'md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
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
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto md:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <p className="font-semibold text-gray-900">{profile?.full_name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
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
            </div>
            <div className="w-10" />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
