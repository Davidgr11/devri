'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Headphones, Sparkles, DollarSign, CheckCircle, Quote, Star } from 'lucide-react';
import { getTestimonials } from '@/lib/supabase/queries';
import type { Testimonial } from '@/types';
import Image from 'next/image';

const benefits = [
  {
    icon: Zap,
    title: 'Entrega rápida',
    description: 'Resultados en días, no meses. Proceso ágil sin sacrificar calidad.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
  },
  {
    icon: Sparkles,
    title: 'Diseño único',
    description: 'Nada de plantillas genéricas. Todo es diseñado específicamente para tu marca.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
  },
  {
    icon: Headphones,
    title: 'Soporte continuo',
    description: 'Respuesta rápida por WhatsApp, actualizaciones y comunidad activa.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
  {
    icon: CheckCircle,
    title: 'Resultados probados',
    description: '50+ proyectos entregados con impacto medible en el negocio del cliente.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  {
    icon: DollarSign,
    title: 'Precios accesibles',
    description: 'Inversión justa con planes mensuales flexibles según tu etapa de negocio.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
  },
  {
    icon: Shield,
    title: 'Transparencia total',
    description: 'Sin sorpresas ni costos ocultos. Sabes exactamente qué pagas y qué recibes.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
  },
];

const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos Martínez',
    business_name: 'Constructora CM',
    rating: 5,
    quote: 'En menos de una semana ya tenía mi sitio web funcionando y generando leads. El equipo de DEVRI realmente entiende lo que necesita un negocio.',
    image_url: null,
    is_active: true,
    order_index: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    name: 'Ana González',
    business_name: 'Clínica Dental AnaG',
    rating: 5,
    quote: 'Mi sistema de citas online redujo las llamadas en un 80%. Los pacientes reservan solos y yo me enfoco en lo importante: mi trabajo.',
    image_url: null,
    is_active: true,
    order_index: 2,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    name: 'Roberto Sánchez',
    business_name: 'Importadora RS',
    rating: 5,
    quote: 'Triplicamos las ventas online el primer trimestre. La tienda que hicieron convierte increíble y el soporte post-lanzamiento es excelente.',
    image_url: null,
    is_active: true,
    order_index: 3,
    created_at: '',
    updated_at: '',
  },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  const initials = t.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div
      className="relative p-6 rounded-2xl border border-white/7 bg-white/3 hover:border-white/15 hover:bg-white/5 transition-all duration-300 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -3 }}
    >
      <Quote className="w-7 h-7 text-accent/40 flex-shrink-0" />

      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
          />
        ))}
      </div>

      <p className="text-gray-300 text-sm leading-relaxed flex-1">"{t.quote}"</p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
        {t.image_url ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image src={t.image_url} alt={t.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-dark to-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {initials}
          </div>
        )}
        <div>
          <p className="text-white text-sm font-semibold">{t.name}</p>
          {t.business_name && <p className="text-gray-500 text-xs">{t.business_name}</p>}
        </div>
      </div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const doubled = [...testimonials, ...testimonials];
  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0B0D14] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0B0D14] to-transparent z-10 pointer-events-none" />
      <div className="flex gap-5 animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused] w-max">
        {doubled.map((t, i) => (
          <div key={`${t.id}-${i}`} className="w-[320px] flex-shrink-0">
            <TestimonialCard t={t} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhyChooseUsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    getTestimonials()
      .then((data) => setTestimonials(data.length > 0 ? data : fallbackTestimonials))
      .catch(() => setTestimonials(fallbackTestimonials));
  }, []);

  return (
    <section id="por-que-elegirnos" className="py-20 md:py-28 bg-[#0B0D14] relative scroll-mt-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[350px] h-[350px] bg-accent-dark/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[350px] h-[350px] bg-secondary-dark/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Benefits */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent-light text-xs font-medium mb-4 uppercase tracking-wider">
            ¿Por qué elegirnos?
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            No somos otra agencia
            <br />
            <span className="gradient-text">somos tu equipo digital</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprometidos con tu crecimiento, no solo con tu proyecto.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                variants={cardVariants}
                className={`group p-5 rounded-2xl border ${benefit.border} bg-white/2 hover:bg-white/4 transition-all duration-300`}
                whileHover={{ y: -3 }}
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${benefit.bg} border ${benefit.border} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${benefit.color}`} />
                </div>
                <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Testimonials */}
        <div>
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/20 bg-amber-400/5 text-amber-400 text-xs font-medium mb-4 uppercase tracking-wider">
              Testimonios
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Lo que dicen quienes ya confiaron
            </h3>
          </motion.div>

          {/* Auto-scroll carousel */}
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  );
}
