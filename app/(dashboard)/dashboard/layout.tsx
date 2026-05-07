'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Globe, FileText, Link as LinkIcon, Settings, LogOut, Menu, X } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { Loading } from '@/components/ui';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navigation = [
  { name: 'Mis Sitios', href: '/dashboard/websites', icon: Globe },
  { name: 'Pagos', href: '/dashboard/payments', icon: LinkIcon },
  { name: 'Propuestas', href: '/dashboard/proposals', icon: FileText },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, isLoading, isAuthenticated } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 w-64 bg-[#0F1117] border-r border-white/5 z-50 transition-transform duration-300 flex flex-col',
          'md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 relative group-hover:scale-105 transition-transform">
              <Image src="/devri-logo-dark.svg" alt="DEVRI" fill className="object-contain" priority />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">DEVRI</p>
              <p className="text-gray-500 text-xs mt-0.5">Portal Cliente</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm',
                  isActive
                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User area + Settings + Logout */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          {/* User info row with settings button */}
          <div className="flex items-center gap-2 px-2 py-2 rounded-xl group">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent-light text-sm font-bold flex-shrink-0">
              {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{profile?.full_name || user.email}</p>
              <p className="text-gray-500 text-xs truncate">{user.email}</p>
            </div>
            <Link
              href="/dashboard/profile"
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              title="Configuración"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="md:ml-64 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 relative">
              <Image src="/devri-logo-light.svg" alt="DEVRI" fill className="object-contain" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Mi Portal</span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-4 md:p-8 client-panel">
          {children}
        </main>
      </div>
    </div>
  );
}
