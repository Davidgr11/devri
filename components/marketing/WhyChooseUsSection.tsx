/**
 * Why Choose Us Section
 * Benefits grid + YouTube video + Testimonials + Process Timeline
 */

'use client';

import { useEffect, useState } from 'react';
import { Zap, Shield, Headphones, Sparkles, DollarSign, CheckCircle, Play } from 'lucide-react';
import { getTestimonials } from '@/lib/supabase/queries';
import { TestimonialsCarousel } from './TestimonialsCarousel';
import { ProcessTimeline } from './ProcessTimeline';
import type { Testimonial } from '@/types';

const benefits = [
  {
    icon: Zap,
    title: 'Desarrollo rápido',
    description: 'Entregamos en días, no meses.',
  },
  {
    icon: Sparkles,
    title: 'Diseño personalizado',
    description: 'Olvídate de las plantillas básicas.',
  },
  {
    icon: Headphones,
    title: 'Soporte y atención',
    description: 'Dudas, actualizaciones y comunidad por Whatsapp.',
  },
  {
    icon: CheckCircle,
    title: 'Efectividad comprobada',
    description: 'Soluciones que realmente funcionan.',
  },
  {
    icon: DollarSign,
    title: 'Precios accesibles',
    description: 'Planes mensuales para cada presupuesto.',
  },
  {
    icon: Shield,
    title: 'Sin sorpresas',
    description: 'Transparencia total en costos y procesos.',
  },
];

export function WhyChooseUsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    getTestimonials().then(setTestimonials).catch(console.error);
    setVideoUrl(
      process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_URL ||
      process.env.YOUTUBE_VIDEO_URL ||
      'https://www.youtube.com/embed/aAtGJzqY0qg?si=1a6plAuw9te1ZvPt'
    );
  }, []);

  return (
    <section id="por-que-elegirnos" className="py-16 md:py-24 bg-white scroll-mt-16 md:scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            ¿Por qué elegirnos?
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-secondary group-hover:text-gray-900 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-50 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* YouTube Video */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Somos tu aliado digital
          </h3>
          <div className="max-w-4xl mx-auto">
            {!showVideo ? (
              <div
                className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setShowVideo(true)}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
              Lo que dicen nuestros clientes
            </h3>
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        )}

        {/* Process Timeline */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Nuestro proceso
          </h3>
          <ProcessTimeline />
        </div>
      </div>
    </section>
  );
}
