'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Mail, LogOut, Menu, X,
  Layers, MessageSquare, Star, Image as ImageIcon,
  BarChart3, FileText, Link as LinkIcon, ChevronDown, ChevronRight, Globe
} from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { Loading } from '@/components/ui';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type NavItem = {
  name: string;
  href: string;
  icon: any;
  adminOnly?: boolean;
  children?: { name: string; href: string; icon: any }[];
};

const navigation: NavItem[] = [
  { name: 'Contabilidad', href: '/admin/accounting', icon: BarChart3 },
  { name: 'Links de Pago', href: '/admin/payment-links', icon: LinkIcon, adminOnly: true },
  { name: 'Propuestas', href: '/admin/proposals', icon: FileText, adminOnly: true },
  { name: 'Sitios Web', href: '/admin/sites', icon: Globe, adminOnly: true },
  { name: 'Formularios', href: '/admin/contact-forms', icon: Mail, adminOnly: true },
  {
    name: 'Contenido',
    href: '/admin/content',
    icon: Layers,
    adminOnly: true,
    children: [
      { name: 'FAQs', href: '/admin/content/faqs', icon: MessageSquare },
      { name: 'Testimonios', href: '/admin/content/testimonials', icon: Star },
      { name: 'Logos', href: '/admin/content/logos', icon: ImageIcon },
    ],
  },
];

function NavLink({
  item,
  pathname,
  role,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  role: string;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  if (item.adminOnly && role !== 'admin') return null;

  const isActive =
    pathname === item.href ||
    (item.children && item.children.some((c) => pathname.startsWith(c.href)));

  useEffect(() => {
    if (isActive && item.children) setOpen(true);
  }, [isActive]);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left',
            isActive
              ? 'bg-accent/15 text-accent-light'
              : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
          )}
        >
          <Icon className="w-4 h-4" />
          <span className="font-medium text-sm flex-1">{item.name}</span>
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {open && (
          <div className="ml-3 mt-1 space-y-0.5">
            {item.children.map((child) => {
              const ChildIcon = child.icon;
              const isChildActive = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-sm',
                    isChildActive
                      ? 'bg-accent text-white'
                      : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                  )}
                >
                  <ChildIcon className="w-4 h-4" />
                  {child.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all',
        isActive
          ? 'bg-accent text-white shadow-lg shadow-accent/20'
          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium text-sm">{item.name}</span>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, isLoading, isAuthenticated } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (role !== 'admin' && role !== 'contador') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, role, router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading || !user || (role !== 'admin' && role !== 'contador')) {
    return <Loading fullScreen text="Cargando..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 w-64 bg-[#0F1117] border-r border-white/5 text-white z-50 transition-transform duration-300 flex flex-col',
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
              <p className="text-gray-500 text-xs mt-0.5">
                {role === 'admin' ? 'Admin Panel' : 'Contabilidad'}
              </p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              role={role || ''}
              onClose={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent-light text-sm font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.email}</p>
              <p className="text-gray-500 text-xs capitalize">{role}</p>
            </div>
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
            <span className="font-bold text-gray-900 text-sm">DEVRI Admin</span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-4 md:p-8 text-gray-900 admin-panel">
          {children}
        </main>
      </div>
    </div>
  );
}
