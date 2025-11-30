/**
 * Why Choose Us Section
 * Benefits grid + YouTube video + Testimonials + Process Timeline
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            ¿Por qué elegirnos?
          </motion.h2>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                className="bg-gray-900 rounded-xl p-6 cursor-pointer group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="w-12 h-12 bg-accent/10 hover:bg-secondary rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="w-6 h-6 text-secondary hover:text-gray-900 transition-colors" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-50 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* YouTube Video Sample*/}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h3
            className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Somos tu aliado digital
          </motion.h3>
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {!showVideo ? (
              <motion.div
                className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => setShowVideo(true)}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <motion.div
                    className="w-20 h-20 bg-accent rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Play className="w-10 h-10 text-white ml-1" />
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="aspect-video rounded-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.h3
              className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Lo que dicen nuestros clientes
            </motion.h3>
            <TestimonialsCarousel testimonials={testimonials} />
          </motion.div>
        )}

        {/* Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h3
            className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Nuestro proceso
          </motion.h3>
          <ProcessTimeline />
        </motion.div>
      </div>
    </section>
  );
}
