'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const services = [
  { label: 'Sitios Web', href: '/#servicios' },
  { label: 'Sistemas de Gestión', href: '/#servicios' },
  { label: 'Aplicaciones Web', href: '/#servicios' },
  { label: 'Redes Sociales', href: '/#servicios' },
  { label: 'Estrategia de Marca', href: '/#servicios' },
  { label: 'Tiendas en Línea', href: '/#servicios' },
];

const company = [
  { label: '¿Por qué nosotros?', href: '/#por-que-elegirnos' },
  { label: 'Preguntas Frecuentes', href: '/#faqs' },
  { label: 'Contacto', href: '/#contacto' },
  { label: 'Términos y Condiciones', href: '/terminos' },
  { label: 'Política de Privacidad', href: '/privacidad' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const contactInfo = {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@devri.mx',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+52 55 1234 5678',
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || 'Ciudad de México, México',
  };

  const socialMedia = {
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
  };

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#080A10] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 group mb-5">
              <div className="w-9 h-9 relative group-hover:scale-105 transition-transform">
                <Image src="/devri-logo-dark.svg" alt="DEVRI" fill className="object-contain" />
              </div>
              <span className="text-white font-bold text-lg">DEVRI</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Aceleramos tu negocio con tecnología y soluciones innovadoras. Desarrollo de software, marketing digital y consultoría.
            </p>
            <div className="flex items-center gap-2">
              {socialMedia.instagram && (
                <a
                  href={socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              )}
              {socialMedia.linkedin && (
                <a
                  href={socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Servicios</h4>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    onClick={(e) => handleHashClick(e, s.href)}
                    className="text-gray-500 text-sm hover:text-gray-300 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-accent transition-colors" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Empresa</h4>
            <ul className="space-y-3">
              {company.map((c) => (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    onClick={(e) => handleHashClick(e, c.href)}
                    className="text-gray-500 text-sm hover:text-gray-300 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-accent transition-colors" />
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-accent-light flex-shrink-0 mt-0.5" />
                <a href={`mailto:${contactInfo.email}`} className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-accent-light flex-shrink-0 mt-0.5" />
                <a href={`tel:${contactInfo.phone}`} className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent-light flex-shrink-0 mt-0.5" />
                <span className="text-gray-500 text-sm">{contactInfo.address}</span>
              </li>
            </ul>

            {/* CTA mini */}
            <div className="mt-6">
              <Link
                href="/#contacto"
                onClick={(e) => handleHashClick(e, '/#contacto')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-dark text-white text-xs font-semibold hover:bg-accent transition-colors"
              >
                Iniciar proyecto
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs text-center sm:text-left">
            © {currentYear} DEVRI DESARROLLO VANGUARDISTA, RADICAL E INNOVADOR S.A.P.I. DE C.V.
          </p>
          <p className="text-gray-700 text-xs">Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
