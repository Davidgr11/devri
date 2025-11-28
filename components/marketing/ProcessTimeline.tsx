/**
 * Process Timeline
 * Interactive timeline showing our process
 */

'use client';

import { Search, FileText, Palette, Code, TestTube, Wrench } from 'lucide-react';
import { useState } from 'react';

const steps = [
  {
    icon: Search,
    title: 'Descubrimiento',
    description: 'Conocemos tu negocio, objetivos y necesidades específicas.',
    details: 'En esta fase inicial, nos reunimos contigo para entender a fondo tu visión, tu público objetivo y los problemas que quieres resolver. Realizamos un análisis de tus competidores y del mercado para identificar oportunidades.',
  },
  {
    icon: FileText,
    title: 'Definición',
    description: 'Definimos alcance, funcionalidades y cronograma del proyecto.',
    details: 'Creamos un documento detallado del proyecto que incluye todas las funcionalidades, tecnologías a utilizar, y un cronograma realista. Te presentamos una propuesta clara con tiempos y costos transparentes.',
  },
  {
    icon: Palette,
    title: 'Diseño',
    description: 'Creamos prototipos y diseños que reflejan tu marca.',
    details: 'Nuestro equipo de diseño crea wireframes y mockups de alta fidelidad. Trabajamos en la identidad visual, selección de colores, tipografías y elementos gráficos que representen tu marca de forma profesional.',
  },
  {
    icon: Code,
    title: 'Desarrollo',
    description: 'Construimos tu sitio con código limpio y escalable.',
    details: 'Utilizamos las mejores prácticas y tecnologías modernas para desarrollar tu sitio. El código es limpio, bien documentado y optimizado para rendimiento. Implementamos todas las funcionalidades definidas en la fase de planificación.',
  },
  {
    icon: TestTube,
    title: 'Pruebas',
    description: 'Verificamos que todo funcione perfectamente antes del lanzamiento.',
    details: 'Realizamos pruebas exhaustivas en múltiples dispositivos y navegadores. Verificamos la velocidad de carga, funcionalidad de formularios, integración de pagos si aplica, y la experiencia general del usuario.',
  },
  {
    icon: Wrench,
    title: 'Mantenimiento',
    description: 'Soporte continuo para mantener tu sitio siempre actualizado.',
    details: 'Una vez lanzado, te brindamos soporte continuo. Realizamos actualizaciones de seguridad, respaldos regulares, y los cambios de contenido que necesites según tu plan de suscripción.',
  },
];

export function ProcessTimeline() {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  return (
    <>
      {/* Desktop - Horizontal Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Line */}
          <div className="absolute top-16 left-0 right-0 h-0.5 bg-gray-200" />

          {/* Steps */}
          <div className="grid grid-cols-6 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Circle */}
                  <div
                    className="relative z-10 w-16 h-16 mx-auto bg-white border-4 border-accent rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setSelectedStep(selectedStep === index ? null : index)}
                  >
                    <Icon className="w-7 h-7 text-accent" />
                  </div>

                  {/* Label */}
                  <div className="text-center mt-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details Modal */}
        {selectedStep !== null && (
          <div className="mt-8 bg-accent/5 border-2 border-accent rounded-xl p-6 animate-slide-up">
            <div className="flex items-start gap-4">
              {(() => {
                const Icon = steps[selectedStep].icon;
                return <Icon className="w-8 h-8 text-accent flex-shrink-0 mt-1" />;
              })()}
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {steps[selectedStep].title}
                </h4>
                <p className="text-gray-700">{steps[selectedStep].details}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile - Horizontal Scroll */}
      <div className="md:hidden -mx-4 px-4">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="flex-shrink-0 w-[280px] snap-center bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100"
              >
                {/* Step Number */}
                <div className="text-accent/20 text-3xl font-bold mb-3">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Scroll Hint */}
        <p className="text-center text-sm text-gray-500 mt-2">
          Desliza para ver más →
        </p>
      </div>
    </>
  );
}
