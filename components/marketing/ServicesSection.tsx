'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Globe, Database, Smartphone, Share2, Sparkles, ShoppingCart,
  ArrowRight, Check
} from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Sitios Web',
    description: 'Páginas web modernas, rápidas y responsivas que reflejan la esencia de tu marca y convierten visitantes en clientes.',
    gradient: 'from-violet-600/20 to-indigo-600/10',
    color: 'text-violet-400',
    borderHover: 'hover:border-violet-500/30',
    features: ['Diseño personalizado', 'SEO incluido', 'Mobile-first'],
    href: '/#contacto',
  },
  {
    icon: Database,
    title: 'Sistemas de Gestión',
    description: 'Plataformas completas para administrar operaciones, ventas, inventarios y equipos. Automatiza lo que te quita tiempo.',
    gradient: 'from-blue-600/20 to-cyan-600/10',
    color: 'text-blue-400',
    borderHover: 'hover:border-blue-500/30',
    features: ['A tu medida', 'Dashboard en tiempo real', 'Multi-usuario'],
    href: '/#contacto',
  },
  {
    icon: Smartphone,
    title: 'Aplicaciones Web',
    description: 'Soluciones digitales avanzadas para negocios que necesitan funcionalidades complejas, integraciones y escalabilidad.',
    gradient: 'from-emerald-600/20 to-teal-600/10',
    color: 'text-emerald-400',
    borderHover: 'hover:border-emerald-500/30',
    features: ['React / Next.js', 'APIs e integraciones', 'Alta disponibilidad'],
    href: '/#contacto',
  },
  {
    icon: Share2,
    title: 'Redes Sociales',
    description: 'Estrategia de contenido, gestión de comunidades y campañas pagadas para conectar con tu audiencia y crecer online.',
    gradient: 'from-pink-600/20 to-rose-600/10',
    color: 'text-pink-400',
    borderHover: 'hover:border-pink-500/30',
    features: ['Contenido mensual', 'Análisis y reportes', 'Gestión de campañas'],
    href: '/#contacto',
  },
  {
    icon: Sparkles,
    title: 'Estrategia de Marca',
    description: 'Identidad visual, posicionamiento y branding digital que hace que tu negocio sea memorable e inconfundible.',
    gradient: 'from-amber-600/20 to-orange-600/10',
    color: 'text-amber-400',
    borderHover: 'hover:border-amber-500/30',
    features: ['Identidad visual', 'Manual de marca', 'Activos digitales'],
    href: '/#contacto',
  },
  {
    icon: ShoppingCart,
    title: 'Tiendas en Línea',
    description: 'E-commerce completo con carrito, pasarelas de pago, gestión de inventario y panel de administración intuitivo.',
    gradient: 'from-fuchsia-600/20 to-purple-600/10',
    color: 'text-fuchsia-400',
    borderHover: 'hover:border-fuchsia-500/30',
    features: ['Catálogo ilimitado', 'Pago en línea', 'Panel de ventas'],
    href: '/#contacto',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ServicesSection() {
  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="servicios" className="py-20 md:py-28 bg-[#0B0D14] relative scroll-mt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent-light text-xs font-medium mb-4 uppercase tracking-wider">
            Nuestros Servicios
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Todo lo que tu negocio
            <br />
            <span className="gradient-text">necesita en un solo lugar</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Desde una landing page hasta un sistema completo a medida. Diseñamos, desarrollamos y escalamos junto a ti.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className={`group relative rounded-2xl border border-white/7 bg-white/2 p-6 cursor-pointer overflow-hidden transition-all duration-300 ${service.borderHover} hover:bg-white/4`}
                whileHover={{ y: -4 }}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${service.color}`} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5 text-justify">{service.description}</p>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-6">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                        <Check className={`w-3.5 h-3.5 ${service.color} flex-shrink-0`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={service.href}
                    onClick={handleContactClick}
                    className={`inline-flex items-center gap-1.5 text-sm font-medium ${service.color} hover:gap-2.5 transition-all duration-200`}
                  >
                    Cotizar ahora
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-500 text-sm mb-4">
            ¿Necesitas algo más específico? Hablemos de tu proyecto.
          </p>
          <Link href="/#contacto" onClick={handleContactClick}>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-dark text-white font-semibold text-sm shadow-lg shadow-accent-dark/20 hover:bg-accent transition-colors duration-200"
            >
              Habla con un especialista
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
