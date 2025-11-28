/**
 * Footer Component
 * Site footer with links and contact information
 */

'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

// Custom SVG icons for social media (more reliable than lucide-react versions)
const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Get contact info from env with fallbacks
  const contactInfo = {
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || 'Ciudad de México, México',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@devri.mx',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+52 55 1234 5678',
    hours: process.env.NEXT_PUBLIC_CONTACT_HOURS || 'Lun - Vie: 9:00 - 18:00',
  };

  const socialMedia = {
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Column 1: About */}
          <div>
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
            <p className="text-gray-400 leading-relaxed mt-4 text-justify">
              Aceleramos tu negocio con tecnología y soluciones innovadoras. Agencia de desarrollo de software, marketing y consultoría digital.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#servicios" className="hover:text-accent transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-accent transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-accent transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-accent transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm">{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-sm hover:text-accent transition-colors"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-sm hover:text-accent transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm">{contactInfo.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Media */}
            <div className="flex items-center gap-4">
              {socialMedia.instagram && (
                <a
                  href={socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-accent transition-colors"
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
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              )}
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-400 text-center md:text-right">
              © {currentYear} DEVRI DESARROLLO VANGUARDISTA, RADICAL E INNOVADOR S.A.P.I. DE C.V. - Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
