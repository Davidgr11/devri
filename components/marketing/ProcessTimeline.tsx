'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Palette, Code, TestTube, Wrench, ChevronDown } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Descubrimiento',
    description: 'Entendemos tu negocio y objetivos.',
    details: 'Nos reunimos para entender a fondo tu visión, público objetivo y los problemas que quieres resolver. Analizamos tu mercado e identificamos oportunidades únicas.',
    color: 'from-violet-500 to-purple-600',
    textColor: 'text-violet-400',
    borderColor: 'border-violet-500/30',
  },
  {
    icon: FileText,
    number: '02',
    title: 'Definición',
    description: 'Alcance, funcionalidades y cronograma.',
    details: 'Creamos un documento detallado con todas las funcionalidades, tecnologías y un cronograma realista. Propuesta transparente con tiempos y costos claros.',
    color: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  {
    icon: Palette,
    number: '03',
    title: 'Diseño',
    description: 'Prototipos y diseños que reflejan tu marca.',
    details: 'Nuestro equipo diseña wireframes y mockups de alta fidelidad. Identidad visual, colores, tipografías y elementos que representen tu marca de forma profesional.',
    color: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  {
    icon: Code,
    number: '04',
    title: 'Desarrollo',
    description: 'Código limpio, rápido y escalable.',
    details: 'Usamos las mejores prácticas y tecnologías modernas. Código optimizado para rendimiento e implementamos todo lo definido. Sin sorpresas en esta fase.',
    color: 'from-amber-500 to-orange-600',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
  {
    icon: TestTube,
    number: '05',
    title: 'Pruebas',
    description: 'Todo funciona antes del lanzamiento.',
    details: 'Pruebas exhaustivas en múltiples dispositivos y navegadores. Verificamos velocidad, formularios, pagos y experiencia de usuario. Zero defectos al lanzar.',
    color: 'from-pink-500 to-rose-600',
    textColor: 'text-pink-400',
    borderColor: 'border-pink-500/30',
  },
  {
    icon: Wrench,
    number: '06',
    title: 'Soporte',
    description: 'Acompañamiento continuo post-lanzamiento.',
    details: 'Actualizaciones de seguridad, respaldos regulares y cambios de contenido según tu plan. Estamos aquí cuando nos necesitas.',
    color: 'from-cyan-500 to-blue-600',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
  },
];

export function ProcessTimeline() {
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    <section id="proceso" className="py-20 md:py-28 bg-[#080A10] relative scroll-mt-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-400 text-xs font-medium mb-4 uppercase tracking-wider">
            Nuestro Proceso
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            De la idea al
            <span className="gradient-text"> lanzamiento</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Un proceso probado en 50+ proyectos para entregarte resultados rápidos y confiables.
          </p>
        </motion.div>

        {/* Desktop: horizontal grid */}
        <div className="hidden md:block">
          <div className="grid grid-cols-6 gap-4 relative">
            {/* Connecting line */}
            <div className="absolute top-8 left-[calc(100%/12)] right-[calc(100%/12)] h-px bg-gradient-to-r from-violet-500/50 via-emerald-500/50 to-cyan-500/50" />

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  {/* Circle */}
                  <button
                    onClick={() => setOpenStep(openStep === i ? null : i)}
                    className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </button>

                  <span className={`text-xs font-bold ${step.textColor} mb-1`}>{step.number}</span>
                  <h4 className="text-white font-semibold text-sm mb-1">{step.title}</h4>
                  <p className="text-gray-500 text-xs">{step.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Step detail */}
          <AnimatePresence>
            {openStep !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-6"
              >
                <div className={`rounded-2xl border ${steps[openStep].borderColor} bg-white/3 p-6`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${steps[openStep].color} flex items-center justify-center flex-shrink-0`}>
                      {(() => { const Icon = steps[openStep].icon; return <Icon className="w-5 h-5 text-white" />; })()}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-2">
                        {steps[openStep].number} — {steps[openStep].title}
                      </h4>
                      <p className="text-gray-400 leading-relaxed">{steps[openStep].details}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile: accordion list */}
        <div className="md:hidden space-y-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isOpen = openStep === i;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`rounded-2xl border ${isOpen ? step.borderColor : 'border-white/7'} bg-white/2 overflow-hidden`}
              >
                <button
                  onClick={() => setOpenStep(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-bold ${step.textColor}`}>{step.number}</span>
                    <h4 className="text-white font-semibold">{step.title}</h4>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-gray-400 text-sm leading-relaxed">{step.details}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
