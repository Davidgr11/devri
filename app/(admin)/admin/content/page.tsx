/**
 * Content Hub Page
 * Landing page for content management sections
 */

'use client';

import Link from 'next/link';
import { Layers, MessageSquare, Star, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';

const contentSections = [
  {
    name: 'Servicios',
    description: 'Gestiona las categorías de servicios y subcategorías',
    href: '/admin/content/services',
    icon: Layers,
    color: 'blue',
  },
  {
    name: 'FAQs',
    description: 'Administra las preguntas frecuentes',
    href: '/admin/content/faqs',
    icon: MessageSquare,
    color: 'green',
  },
  {
    name: 'Testimonios',
    description: 'Gestiona los testimonios de clientes',
    href: '/admin/content/testimonials',
    icon: Star,
    color: 'yellow',
  },
  {
    name: 'Logos de Clientes',
    description: 'Administra los logos que aparecen en la landing',
    href: '/admin/content/logos',
    icon: ImageIcon,
    color: 'purple',
  },
];

export default function ContentHubPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenido</h1>
        <p className="text-gray-600 mt-1">
          Administra todo el contenido que aparece en la landing page
        </p>
      </div>

      {/* Content Sections Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {contentSections.map((section) => {
          const Icon = section.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            purple: 'bg-purple-100 text-purple-600',
          }[section.color];

          return (
            <Link key={section.href} href={section.href}>
              <Card hover className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${colorClasses} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{section.name}</h3>
                  <p className="text-gray-600">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
