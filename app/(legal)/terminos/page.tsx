'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function TerminosPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 md:py-32">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-10 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Regresar
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Términos y Condiciones</h1>
      <p className="text-gray-500 text-sm mb-10">Última actualización: mayo 2026</p>

      <div className="space-y-8 text-gray-400 leading-relaxed text-sm">
        <section>
          <h2 className="text-base font-semibold text-white mb-3">1. Aceptación de los términos</h2>
          <p>Al acceder y utilizar los servicios de DEVRI DESARROLLO VANGUARDISTA, RADICAL E INNOVADOR S.A.P.I. DE C.V. ("DEVRI"), usted acepta estos términos en su totalidad. Si no está de acuerdo con alguna parte, le recomendamos no utilizarlos.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">2. Descripción de los servicios</h2>
          <p>DEVRI ofrece servicios de desarrollo de software, diseño web, marketing digital y consultoría tecnológica. Los servicios específicos se detallan en cada propuesta o contrato individual firmado entre las partes.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">3. Uso del portal de clientes</h2>
          <p>El portal de clientes es de uso exclusivo de los clientes registrados de DEVRI. Usted es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas desde su cuenta.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">4. Propiedad intelectual</h2>
          <p>Todo el contenido entregado por DEVRI pasará a ser propiedad del cliente una vez liquidado el pago total acordado. DEVRI se reserva el derecho de mostrar el trabajo realizado en su portafolio, salvo acuerdo de confidencialidad.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">5. Pagos y facturación</h2>
          <p>Los pagos se realizan conforme a lo acordado en cada propuesta. DEVRI emite facturas electrónicas (CFDI) conforme a la legislación fiscal mexicana vigente. Los pagos realizados no son reembolsables salvo causas imputables a DEVRI.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">6. Firma digital</h2>
          <p>Al firmar una propuesta mediante el portal ingresando su nombre completo, usted otorga su consentimiento expreso y vinculante a los términos de dicha propuesta. La firma digital incluye registro de fecha, hora y dirección IP, con validez legal conforme a la legislación mexicana aplicable.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">7. Limitación de responsabilidad</h2>
          <p>DEVRI no será responsable por daños indirectos, incidentales o consecuentes. La responsabilidad máxima se limita al monto pagado por el cliente en los últimos tres meses.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">8. Modificaciones</h2>
          <p>DEVRI se reserva el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor a los 30 días de su publicación.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">9. Ley aplicable</h2>
          <p>Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia se someterá a la jurisdicción de los tribunales competentes de la Ciudad de México.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">10. Contacto</h2>
          <p>Para cualquier duda, escríbenos a{' '}
            <a href="mailto:contacto@devri.mx" className="text-accent-light hover:text-white transition-colors">contacto@devri.mx</a>
          </p>
        </section>
      </div>
    </div>
  );
}
