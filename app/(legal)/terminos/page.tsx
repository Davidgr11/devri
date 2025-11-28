/**
 * Términos y Condiciones
 * Legal page for terms of service
 */

import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Términos y Condiciones | DEVRI',
  description: 'Términos y condiciones de uso de los servicios de DEVRI',
};

export default function TerminosPage() {
  const lastUpdated = 'Diciembre 2025';

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 md:pt-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Términos y Condiciones
            </h1>
            <p className="text-gray-600">
              Última actualización: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Aceptación de Términos</h2>
              <p className="text-gray-700 leading-relaxed">
                Al acceder y utilizar los servicios de DEVRI DESARROLLO VANGUARDISTA, RADICAL E INNOVADOR S.A.P.I. DE C.V. (en adelante "DEVRI"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le recomendamos no utilizar nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Descripción de Servicios</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                DEVRI ofrece servicios de desarrollo web, diseño digital y soluciones tecnológicas personalizadas. Los servicios específicos incluyen:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Desarrollo y diseño de sitios web</li>
                <li>Sistemas de gestión empresarial</li>
                <li>Consultoría tecnológica</li>
                <li>Mantenimiento y soporte técnico</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Uso de Servicios</h2>
              <p className="text-gray-700 leading-relaxed">
                Usted se compromete a utilizar nuestros servicios de manera legal y apropiada. No debe usar nuestros servicios para fines ilícitos, infringir derechos de terceros, o distribuir contenido ofensivo, difamatorio o malicioso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Propiedad Intelectual</h2>
              <p className="text-gray-700 leading-relaxed">
                Todos los derechos de propiedad intelectual sobre los trabajos desarrollados serán transferidos al cliente una vez completado el pago total del proyecto, salvo que se especifique lo contrario en el contrato individual. DEVRI se reserva el derecho de utilizar los proyectos completados en su portafolio con fines promocionales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Pagos y Facturación</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                Los términos de pago se establecerán en el contrato individual de cada proyecto. Generalmente:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Se requiere un anticipo del 50% para iniciar el proyecto</li>
                <li>El 50% restante se paga al finalizar el proyecto</li>
                <li>Los pagos son no reembolsables salvo incumplimiento de DEVRI</li>
                <li>Servicios de suscripción se cobran mensualmente por adelantado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Garantías y Limitación de Responsabilidad</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                DEVRI se compromete a realizar trabajos de calidad profesional. Sin embargo:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>No garantizamos resultados específicos de negocio (ventas, tráfico, conversiones)</li>
                <li>No somos responsables por contenido proporcionado por el cliente</li>
                <li>No nos responsabilizamos por daños indirectos o pérdidas de beneficios</li>
                <li>Nuestra responsabilidad máxima está limitada al monto pagado por el servicio</li>
                <li>Ofrecemos garantía de 30 días contra defectos en el código desarrollado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Cancelación y Reembolsos</h2>
              <p className="text-gray-700 leading-relaxed">
                El cliente puede cancelar el proyecto en cualquier momento. En caso de cancelación, DEVRI facturará el trabajo completado hasta la fecha según el porcentaje de avance. Los anticipos no son reembolsables. Los servicios de suscripción pueden cancelarse con 30 días de anticipación.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Modificaciones</h2>
              <p className="text-gray-700 leading-relaxed">
                DEVRI se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. El uso continuado de nuestros servicios constituye la aceptación de los términos modificados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Ley Aplicable</h2>
              <p className="text-gray-700 leading-relaxed">
                Estos términos se regirán e interpretarán de acuerdo con las leyes de los Estados Unidos Mexicanos. Cualquier disputa se resolverá en los tribunales competentes de Ciudad de México.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Contacto</h2>
              <p className="text-gray-700 leading-relaxed">
                Para preguntas sobre estos Términos y Condiciones, puede contactarnos en{' '}
                <a href="mailto:contacto@devri.mx" className="text-accent hover:underline">
                  info@devri.com.mx
                </a>
              </p>
            </section>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block text-accent hover:text-accent-dark font-medium"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
