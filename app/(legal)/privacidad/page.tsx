'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function PrivacidadPage() {
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

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Política de Privacidad</h1>
      <p className="text-gray-500 text-sm mb-10">Última actualización: mayo 2026</p>

      <div className="space-y-8 text-gray-400 leading-relaxed text-sm">
        <section>
          <h2 className="text-base font-semibold text-white mb-3">1. Responsable del tratamiento</h2>
          <p>DEVRI DESARROLLO VANGUARDISTA, RADICAL E INNOVADOR S.A.P.I. DE C.V. ("DEVRI"), con domicilio en Ciudad de México, es el responsable del tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">2. Datos que recopilamos</h2>
          <p>Recopilamos los siguientes datos personales:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
            <li>Nombre completo y dirección de correo electrónico</li>
            <li>Número de teléfono y datos de contacto</li>
            <li>Información de su negocio o empresa</li>
            <li>Dirección IP y datos de uso del portal (logs de acceso)</li>
            <li>Información de pagos (procesada por Stripe, no almacenamos datos de tarjeta)</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">3. Finalidad del tratamiento</h2>
          <p>Sus datos son utilizados para:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
            <li>Prestación de los servicios contratados</li>
            <li>Gestión del portal de clientes y comunicación</li>
            <li>Facturación y registros contables</li>
            <li>Mejora de nuestros servicios y atención al cliente</li>
            <li>Cumplimiento de obligaciones legales</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">4. Transferencia de datos</h2>
          <p>DEVRI no vende ni renta sus datos personales a terceros. Podemos compartirlos con proveedores de servicios tecnológicos (Supabase, Stripe, servicios de email) únicamente para la prestación de los servicios, bajo estrictos acuerdos de confidencialidad.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">5. Derechos ARCO</h2>
          <p>Usted tiene derecho de Acceso, Rectificación, Cancelación y Oposición (derechos ARCO) respecto a sus datos personales. Para ejercerlos, envíe una solicitud a{' '}
            <a href="mailto:privacidad@devri.mx" className="text-accent-light hover:text-white transition-colors">privacidad@devri.mx</a>{' '}
            indicando su nombre, datos de contacto y el derecho que desea ejercer.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">6. Cookies y tecnologías de seguimiento</h2>
          <p>El portal de clientes utiliza cookies de sesión necesarias para su funcionamiento. No utilizamos cookies de rastreo publicitario. Puede configurar su navegador para bloquear cookies, aunque esto puede afectar la funcionalidad del portal.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">7. Seguridad de los datos</h2>
          <p>Implementamos medidas técnicas y organizativas para proteger sus datos: cifrado en tránsito (HTTPS/TLS), autenticación segura mediante Supabase Auth, y acceso restringido a la información por rol de usuario.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">8. Retención de datos</h2>
          <p>Conservamos sus datos durante la vigencia de la relación comercial y por el período que exijan las obligaciones legales y fiscales aplicables (mínimo 5 años para efectos fiscales).</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">9. Cambios a esta política</h2>
          <p>DEVRI puede actualizar esta política periódicamente. Notificaremos cambios significativos a través del portal o por correo electrónico.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-white mb-3">10. Contacto</h2>
          <p>Para consultas sobre privacidad, escríbenos a{' '}
            <a href="mailto:privacidad@devri.mx" className="text-accent-light hover:text-white transition-colors">privacidad@devri.mx</a>
          </p>
        </section>
      </div>
    </div>
  );
}
