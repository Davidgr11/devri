'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const projects = [
  {
    name: 'Salud360',
    client: 'Clínica médica',
    category: 'Sistema de Gestión',
    description: 'Plataforma completa para gestión de citas, expedientes clínicos digitales y facturación para una clínica privada.',
    tags: ['Next.js', 'Supabase', 'Stripe'],
    gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    icon: '🏥',
    stats: { metric: '70%', label: 'menos tiempo admin.' },
  },
  {
    name: 'ModaHaus',
    client: 'Boutique de ropa',
    category: 'E-commerce',
    description: 'Tienda en línea con catálogo de 500+ productos, pasarela de pagos, gestión de inventario y panel de ventas en tiempo real.',
    tags: ['Next.js', 'Stripe', 'PostgreSQL'],
    gradient: 'from-rose-500 via-pink-600 to-fuchsia-700',
    icon: '👗',
    stats: { metric: '3×', label: 'aumento en ventas' },
  },
  {
    name: 'TalentFlow',
    client: 'Empresa de RRHH',
    category: 'Aplicación Web',
    description: 'Sistema de reclutamiento y onboarding con seguimiento de candidatos, evaluaciones y contratos digitales integrados.',
    tags: ['React', 'Node.js', 'AWS'],
    gradient: 'from-violet-500 via-purple-600 to-indigo-700',
    icon: '👥',
    stats: { metric: '60%', label: 'reducción en tiempo de contratación' },
  },
  {
    name: 'Sabores del Valle',
    client: 'Restaurante',
    category: 'Sitio Web',
    description: 'Landing page premium con reservaciones en línea, menú digital interactivo y sistema de pedidos para llevar.',
    tags: ['Next.js', 'Tailwind', 'Resend'],
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    icon: '🍽️',
    stats: { metric: '2×', label: 'reservaciones en línea' },
  },
  {
    name: 'InmoCorp',
    client: 'Inmobiliaria',
    category: 'Portal Web',
    description: 'Portal inmobiliario con búsqueda avanzada de propiedades, tours virtuales integrados y CRM para agentes de ventas.',
    tags: ['Next.js', 'Mapbox', 'Supabase'],
    gradient: 'from-sky-500 via-blue-600 to-indigo-700',
    icon: '🏢',
    stats: { metric: '5×', label: 'leads calificados mensuales' },
  },
  {
    name: 'FinTrack MX',
    client: 'Fintech startup',
    category: 'Aplicación Web',
    description: 'Dashboard de finanzas personales con conexión bancaria, análisis de gastos por IA y metas de ahorro inteligentes.',
    tags: ['React', 'Python', 'OpenAI'],
    gradient: 'from-green-500 via-emerald-600 to-teal-700',
    icon: '📊',
    stats: { metric: '10K+', label: 'usuarios activos' },
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

export function ProjectsSection() {
  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="proyectos" className="py-20 md:py-28 bg-[#080A10] relative scroll-mt-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-secondary-dark/5 rounded-full blur-[100px]" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary-dark/20 bg-secondary-dark/5 text-secondary text-xs font-medium mb-4 uppercase tracking-wider">
            Proyectos Destacados
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Soluciones reales para
            <br />
            <span className="gradient-text">negocios reales</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Cada proyecto tiene una historia. Aquí algunos de los que nos enorgullecen.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.name}
              variants={cardVariants}
              className="group rounded-2xl border border-white/7 bg-white/2 overflow-hidden hover:border-white/15 transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              {/* Project Image (Gradient placeholder) */}
              <div className={`relative h-48 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                {/* Grid decoration */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
                    {project.category}
                  </span>
                </div>
                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl drop-shadow-2xl">{project.icon}</span>
                </div>
                {/* Stat badge */}
                <div className="absolute bottom-4 right-4 text-right">
                  <div className="text-white font-bold text-xl leading-none">{project.stats.metric}</div>
                  <div className="text-white/70 text-xs mt-0.5">{project.stats.label}</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-semibold text-lg leading-tight">{project.name}</h3>
                    <p className="text-gray-500 text-sm">{project.client}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-accent-light transition-colors flex-shrink-0 mt-1" />
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-gray-400 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-500 text-sm mb-5">¿Listo para que tu proyecto sea el próximo?</p>
          <Link href="/#contacto" onClick={handleContactClick}>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors duration-200"
            >
              Cuéntanos tu idea
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
