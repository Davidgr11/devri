/**
 * Root Layout
 * Global layout and metadata configuration
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DEVRI - Desarrollo de Software, Marketing y Consultoría digital',
  description:
    'Agencia de desarrollo de software, marketing y consultoría digital. Soluciones tecnológicas a medida para impulsar tu negocio o marca en línea.',
  keywords: [
    'desarrollo web',
    'diseño web',
    'páginas web',
    'sitios web profesionales',
    'desarrollo web méxico',
    'diseño web méxico',
    'desarrollo de software',
    'marketing digital',
    'consultoría digital',
    'agencia digital',
    'soluciones tecnológicas',
    'presencia en línea',
    'mantenimiento web',
    'emprendedores',
    'negocios en línea',
    'redes sociales',
    'SEO',
    'optimización para motores de búsqueda',
    'branding digital',
    'estrategias digitales',
    'comercio electrónico',
    'tiendas en línea',
    'aplicaciones web',
    'experiencia de usuario',
    'UX/UI',
    'transformación digital',
    'tecnología para negocios',
    'innovación digital',
  ],
  authors: [{ name: 'DEVRI' }],
  creator: 'DEVRI',
  publisher: 'DEVRI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: '/',
    siteName: 'DEVRI',
    title: 'DEVRI - Desarrollo de Software, Marketing y Consultoría digital',
    description:
      'Agencia de desarrollo de software, marketing y consultoría digital. Soluciones tecnológicas a medida para impulsar tu negocio o marca en línea.',
    images: [
      {
        url: '/devri-logo-color.avif',
        width: 1200,
        height: 630,
        alt: 'DEVRI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Devri Solutions - Desarrollo Web Profesional',
    description:
      'Creamos sitios web profesionales para emprendedores y negocios. Presencia digital de calidad con mantenimiento incluido.',
    images: ['/devri-logo-color.avif'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/devri-logo-dark.svg', type: 'image/svg+xml' },
      { url: '/devri-logo-color.avif', sizes: '192x192', type: 'image/avif' },
    ],
    apple: [
      { url: '/devri-logo-color.avif', sizes: '180x180', type: 'image/avif' },
    ],
    shortcut: '/devri-logo-dark.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DEVRI',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111827" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Devri" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
