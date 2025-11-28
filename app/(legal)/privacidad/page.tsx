/**
 * Política de Privacidad
 * Legal page for privacy policy
 */

import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad | DEVRI',
  description: 'Política de privacidad y protección de datos de DEVRI',
};

export default function PrivacidadPage() {
  const lastUpdated = 'Diciembre 2025';

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 md:pt-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Política de Privacidad
            </h1>
            <p className="text-gray-600">
              Última actualización: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Información que Recopilamos</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                DEVRI DESARROLLO VANGUARDISTA, RADICAL E INNOVADOR S.A.P.I. DE C.V. (en adelante "DEVRI") recopila los siguientes tipos de información:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Información de contacto:</strong> nombre, email, teléfono, dirección</li>
                <li><strong>Información empresarial:</strong> nombre del negocio, giro, tipo de empresa</li>
                <li><strong>Información de navegación:</strong> dirección IP, navegador, cookies</li>
                <li><strong>Información de pago:</strong> datos procesados a través de Stripe (no almacenamos información de tarjetas)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Uso de la Información</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                Utilizamos su información para:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Comunicarnos con usted sobre proyectos y servicios</li>
                <li>Procesar pagos y facturación</li>
                <li>Enviar actualizaciones y promociones (con su consentimiento)</li>
                <li>Cumplir con obligaciones legales y fiscales</li>
                <li>Analizar el uso del sitio web y mejorar la experiencia del usuario</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Protección de Datos</h2>
              <p className="text-gray-700 leading-relaxed">
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, pérdida o alteración. Sin embargo, ningún sistema de transmisión por Internet es 100% seguro. Hacemos nuestro mejor esfuerzo pero no podemos garantizar seguridad absoluta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Compartir Información</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                No vendemos ni compartimos su información personal con terceros, excepto en los siguientes casos:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Proveedores de servicios:</strong> Stripe para procesamiento de pagos, servicios de hosting</li>
                <li><strong>Obligaciones legales:</strong> cuando sea requerido por ley o autoridades</li>
                <li><strong>Con su consentimiento:</strong> cuando usted autorice expresamente</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Cookies y Tecnologías Similares</h2>
              <p className="text-gray-700 leading-relaxed">
                Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web, analizar el tráfico y personalizar contenido. Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Sus Derechos (LFPDPPP)</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                De acuerdo con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Acceso:</strong> conocer qué datos personales tenemos sobre usted</li>
                <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos</li>
                <li><strong>Cancelación:</strong> solicitar la eliminación de sus datos</li>
                <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos</li>
                <li><strong>Revocación:</strong> revocar el consentimiento otorgado</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                Para ejercer estos derechos, contacte a{' '}
                <a href="mailto:privacidad@devri.mx" className="text-accent hover:underline">
                  info@devri.com.mx
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Retención de Datos</h2>
              <p className="text-gray-700 leading-relaxed">
                Conservamos su información personal durante el tiempo necesario para cumplir con los fines descritos en esta política y para cumplir con nuestras obligaciones legales y fiscales (generalmente 5 años mínimo según la legislación mexicana).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Menores de Edad</h2>
              <p className="text-gray-700 leading-relaxed">
                Nuestros servicios están dirigidos a empresas y profesionales mayores de 18 años. No recopilamos intencionalmente información de menores de edad. Si detectamos que hemos recopilado datos de un menor, procederemos a eliminarlos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Transferencias Internacionales</h2>
              <p className="text-gray-700 leading-relaxed">
                Algunos de nuestros proveedores de servicios (como servicios de hosting y procesamiento de pagos) pueden estar ubicados fuera de México. Al utilizar nuestros servicios, usted consiente la transferencia de su información a estos proveedores, quienes están obligados a proteger su información conforme a estándares similares.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Cambios a esta Política</h2>
              <p className="text-gray-700 leading-relaxed">
                Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Los cambios serán efectivos inmediatamente después de su publicación en el sitio web. Le notificaremos sobre cambios importantes por email si es posible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Contacto</h2>
              <p className="text-gray-700 leading-relaxed">
                Para preguntas sobre esta Política de Privacidad o el tratamiento de sus datos personales, contacte a:
              </p>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700"><strong>DEVRI DESARROLLO VANGUARDISTA, RADICAL E INNOVADOR S.A.P.I. DE C.V.</strong></p>
                <p className="text-gray-700">Email: <a href="mailto:privacidad@devri.mx" className="text-accent hover:underline">info@devri.com.mx</a></p>
                <p className="text-gray-700">WhatsApp: +52 55 4061 9810</p>
              </div>
            </section>

            <section className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Nota importante:</strong> Esta política cumple con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México. Si tiene preocupaciones sobre el manejo de sus datos personales, puede contactar al INAI (Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales).
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
