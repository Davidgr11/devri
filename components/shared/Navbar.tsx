/**
 * Navbar Component
 * Main navigation with scroll behavior and mobile menu
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useUser } from '@/hooks/useUser';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#por-que-elegirnos', label: 'Por qué elegirnos' },
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

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Add background when scrolled
      setIsScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle smooth scroll for hash links
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
        'fixed top-0 left-0 right-0 z-40',
        'transition-all duration-300',
        'bg-gray-900/95 backdrop-blur-md',
        isVisible ? 'translate-y-0' : '-translate-y-full',
        isScrolled && 'shadow-lg shadow-black/20'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-xl md:text-2xl font-bold text-white hover:text-accent transition-colors group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 relative transition-transform group-hover:scale-105">
              <Image
                src="/devri-logo-dark.svg"
                alt="Devri Solutions Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:inline">DEVRI</span>
            <span className="sm:hidden">DEVRI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleHashClick(e, link.href)}
                className={cn(
                  'text-gray-300 hover:text-white transition-colors font-medium relative',
                  'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:scale-x-0 after:transition-transform after:origin-left hover:after:scale-x-100',
                  pathname === link.href && 'text-white after:scale-x-100'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <Link href={role === 'admin' ? '/admin' : '/dashboard'}>
                <Button size="sm">
                  {role === 'admin' ? 'Admin' : 'Mi Cuenta'}
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm">Iniciar Sesión</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden absolute top-full left-0 right-0',
          'bg-gray-900 border-t border-gray-800',
          'transition-all duration-300 ease-in-out',
          isOpen
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 -translate-y-4 invisible'
        )}
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleHashClick(e, link.href)}
              className={cn(
                'block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium',
                pathname === link.href && 'bg-accent/20 text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-800">
            {isAuthenticated ? (
              <Link href={role === 'admin' ? '/admin' : '/dashboard'}>
                <Button fullWidth>
                  {role === 'admin' ? 'Panel Admin' : 'Mi Cuenta'}
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button fullWidth>Iniciar Sesión</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
