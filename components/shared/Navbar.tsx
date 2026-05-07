'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useUser } from '@/hooks/useUser';

const navLinks = [
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#por-que-elegirnos', label: '¿Por qué nosotros?' },
  { href: '/#faqs', label: 'FAQs' },
  { href: '/#contacto', label: 'Contacto' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const { isAuthenticated, role } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setIsScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-300',
        isScrolled
          ? 'bg-[#0B0D14]/95 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
          : 'bg-transparent',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 relative transition-transform group-hover:scale-105">
              <Image
                src="/devri-logo-dark.svg"
                alt="DEVRI"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-white font-bold text-lg tracking-tight group-hover:text-accent-light transition-colors">
              DEVRI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleHashClick(e, link.href)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  'text-gray-400 hover:text-white hover:bg-white/5',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link href={role === 'admin' || role === 'contador' ? '/admin' : '/dashboard'}>
                <Button size="sm" className="gap-1.5">
                  {role === 'admin' ? 'Admin' : role === 'contador' ? 'Contabilidad' : 'Mi Cuenta'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-all font-medium px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/5">
                  Iniciar Sesión
                </Link>
                <Link href="/#contacto" onClick={(e) => handleHashClick(e, '/#contacto')}>
                  <Button size="sm" className="gap-1.5">
                    Empieza ahora
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden fixed top-16 left-0 right-0',
          'bg-[#0B0D14] border-t border-white/5 shadow-2xl',
          'transition-all duration-300 ease-in-out',
          isOpen
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 -translate-y-2 invisible pointer-events-none'
        )}
      >
        <div className="px-4 py-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleHashClick(e, link.href)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all font-medium"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t border-white/5 flex flex-col gap-3">
            {isAuthenticated ? (
              <Link href={role === 'admin' || role === 'contador' ? '/admin' : '/dashboard'}>
                <Button fullWidth className="gap-1.5">
                  {role === 'admin' ? 'Panel Admin' : role === 'contador' ? 'Contabilidad' : 'Mi Cuenta'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button fullWidth variant="ghost" className="border border-white/30 text-white bg-white/5 hover:bg-white/10">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/#contacto" onClick={(e) => handleHashClick(e, '/#contacto')}>
                  <Button fullWidth className="gap-1.5">
                    Empieza ahora
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
