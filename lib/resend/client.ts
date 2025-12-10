/**
 * Resend Client for sending emails
 * Use this in API routes and Server Actions
 */

import { Resend } from 'resend';

// Only initialize Resend if API key is available
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_placeholder';
export const resend = new Resend(RESEND_API_KEY);

// Check if Resend is properly configured
const isResendConfigured = () => {
  return process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder';
};

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(params: {
  to: string;
  name: string;
}) {
  if (!isResendConfigured()) {
    console.warn('Resend not configured. Skipping welcome email.');
    return { id: 'skipped' };
  }

  return await resend.emails.send({
    from: 'DEVRI <hola@devri.com.mx>',
    to: params.to,
    subject: '¡Bienvenido a DEVRI!',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a DEVRI</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

                <!-- Header con gradiente -->
                <tr>
                  <td style="background: linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 2px;">DEVRI</h1>
                    <p style="margin: 10px 0 0 0; color: #DDD6FE; font-size: 14px; font-weight: 500;">Desarrollo · Marketing · Consultoría</p>
                  </td>
                </tr>

                <!-- Contenido -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 600;">¡Hola ${params.name}! 👋</h2>

                    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                      Bienvenido a <strong style="color: #A78BFA;">DEVRI</strong>. Estamos emocionados de tenerte con nosotros en esta nueva etapa de transformación digital.
                    </p>

                    <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                      Tu cuenta ha sido creada exitosamente. Ahora puedes explorar nuestros servicios y comenzar a construir tu presencia digital con las mejores herramientas.
                    </p>

                    <!-- Botón CTA -->
                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://devri.com.mx'}/dashboard" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(167, 139, 250, 0.3);">
                            Ir a mi panel
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0 0 16px 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                      Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. Estamos aquí para ayudarte a alcanzar tus objetivos.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #111827; padding: 30px; text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #9CA3AF; font-size: 14px;">
                      <strong style="color: #A78BFA;">DEVRI</strong> - Agencia Digital
                    </p>
                    <p style="margin: 0 0 15px 0; color: #6B7280; font-size: 13px;">
                      Desarrollo de Software · Marketing Digital · Consultoría
                    </p>
                    <p style="margin: 0; color: #6B7280; font-size: 12px;">
                      📧 <a href="mailto:info@devri.com.mx" style="color: #A78BFA; text-decoration: none;">info@devri.com.mx</a>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}

/**
 * Send website published notification
 */
export async function sendWebsitePublishedEmail(params: {
  to: string;
  name: string;
  websiteUrl: string;
}) {
  if (!isResendConfigured()) {
    console.warn('Resend not configured. Skipping website published email.');
    return { id: 'skipped' };
  }

  return await resend.emails.send({
    from: 'DEVRI <avisos@devri.com.mx>',
    to: params.to,
    subject: '🎉 ¡Tu sitio web está listo!',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tu sitio web está listo</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

                <!-- Header con gradiente verde -->
                <tr>
                  <td style="background: linear-gradient(135deg, #6EE7B7 0%, #10B981 100%); padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">¡Tu sitio web está publicado!</h1>
                  </td>
                </tr>

                <!-- Contenido -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                      Hola <strong style="color: #111827;">${params.name}</strong>,
                    </p>

                    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                      Nos complace informarte que tu sitio web ha sido publicado exitosamente y ya está disponible en línea para el mundo entero. 🚀
                    </p>

                    <!-- URL destacada -->
                    <table role="presentation" style="width: 100%; margin: 25px 0; background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%); border-radius: 12px; border: 2px solid #E5E7EB;">
                      <tr>
                        <td style="padding: 20px; text-align: center;">
                          <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Tu sitio web</p>
                          <a href="${params.websiteUrl}" style="color: #A78BFA; font-size: 18px; font-weight: 600; text-decoration: none; word-break: break-all;">
                            ${params.websiteUrl}
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Botón CTA -->
                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${params.websiteUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #6EE7B7 0%, #10B981 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                            🌐 Visitar mi sitio
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Info box -->
                    <table role="presentation" style="width: 100%; margin: 25px 0; background-color: #EEF2FF; border-radius: 8px; border-left: 4px solid #A78BFA;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0 0 10px 0; color: #5B21B6; font-size: 14px; font-weight: 600;">💡 Próximos pasos:</p>
                          <ul style="margin: 0; padding-left: 20px; color: #4B5563; font-size: 14px; line-height: 1.8;">
                            <li>Comparte tu sitio en redes sociales</li>
                            <li>Accede a tu panel para ver estadísticas</li>
                            <li>Gestiona tu contenido cuando lo necesites</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                      Si necesitas realizar algún cambio o tienes preguntas, estamos aquí para ayudarte en todo momento.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #111827; padding: 30px; text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #9CA3AF; font-size: 14px;">
                      <strong style="color: #6EE7B7;">DEVRI</strong> - Agencia Digital
                    </p>
                    <p style="margin: 0 0 15px 0; color: #6B7280; font-size: 13px;">
                      Desarrollo de Software · Marketing Digital · Consultoría
                    </p>
                    <p style="margin: 0; color: #6B7280; font-size: 12px;">
                      📧 <a href="mailto:info@devri.com.mx" style="color: #6EE7B7; text-decoration: none;">info@devri.com.mx</a>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}

/**
 * Send contact form notification to admin
 */
export async function sendContactFormNotification(params: {
  name: string;
  email: string;
  phone: string;
  businessType: string;
  message: string;
}) {
  if (!isResendConfigured()) {
    console.warn('Resend not configured. Skipping contact form notification.');
    return { id: 'skipped' };
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@devrisolutions.com';

  return await resend.emails.send({
    from: 'DEVRI Contacto <contacto@devri.com.mx>',
    to: adminEmail,
    subject: `🔔 Nuevo contacto de ${params.name}`,
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nuevo formulario de contacto</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%); padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">🔔</div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">Nuevo Formulario de Contacto</h1>
                    <p style="margin: 10px 0 0 0; color: #FEF3C7; font-size: 14px;">Alguien está interesado en tus servicios</p>
                  </td>
                </tr>

                <!-- Contenido -->
                <tr>
                  <td style="padding: 40px 30px;">

                    <!-- Información del cliente -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                      <tr>
                        <td colspan="2" style="padding-bottom: 15px;">
                          <h2 style="margin: 0; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 2px solid #A78BFA; padding-bottom: 10px;">
                            👤 Información del Cliente
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 15px; background-color: #F9FAFB; border-bottom: 1px solid #E5E7EB; width: 35%; font-weight: 600; color: #4B5563; font-size: 14px;">
                          Nombre:
                        </td>
                        <td style="padding: 12px 15px; background-color: #ffffff; border-bottom: 1px solid #E5E7EB; color: #111827; font-size: 14px;">
                          ${params.name}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 15px; background-color: #F9FAFB; border-bottom: 1px solid #E5E7EB; font-weight: 600; color: #4B5563; font-size: 14px;">
                          Email:
                        </td>
                        <td style="padding: 12px 15px; background-color: #ffffff; border-bottom: 1px solid #E5E7EB; color: #111827; font-size: 14px;">
                          <a href="mailto:${params.email}" style="color: #A78BFA; text-decoration: none; font-weight: 500;">
                            ${params.email}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 15px; background-color: #F9FAFB; border-bottom: 1px solid #E5E7EB; font-weight: 600; color: #4B5563; font-size: 14px;">
                          Teléfono:
                        </td>
                        <td style="padding: 12px 15px; background-color: #ffffff; border-bottom: 1px solid #E5E7EB; color: #111827; font-size: 14px;">
                          <a href="tel:${params.phone}" style="color: #10B981; text-decoration: none; font-weight: 500;">
                            ${params.phone}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 15px; background-color: #F9FAFB; font-weight: 600; color: #4B5563; font-size: 14px;">
                          Tipo de negocio:
                        </td>
                        <td style="padding: 12px 15px; background-color: #ffffff; color: #111827; font-size: 14px;">
                          <span style="display: inline-block; padding: 4px 12px; background-color: #EEF2FF; color: #5B21B6; border-radius: 6px; font-size: 13px; font-weight: 500;">
                            ${params.businessType}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- Mensaje -->
                    <table role="presentation" style="width: 100%; margin-bottom: 25px;">
                      <tr>
                        <td style="padding-bottom: 15px;">
                          <h2 style="margin: 0; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 2px solid #A78BFA; padding-bottom: 10px;">
                            💬 Mensaje
                          </h2>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px; background-color: #F9FAFB; border-left: 4px solid #A78BFA; border-radius: 8px;">
                          <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">
${params.message}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Botones de acción -->
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <table role="presentation">
                            <tr>
                              <td style="padding: 0 10px;">
                                <a href="https://wa.me/52${params.phone}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(37, 211, 102, 0.3);">
                                  💬 WhatsApp
                                </a>
                              </td>
                              <td style="padding: 0 10px;">
                                <a href="mailto:${params.email}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(167, 139, 250, 0.3);">
                                  ✉️ Email
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Nota de tiempo -->
                    <p style="margin: 25px 0 0 0; padding: 15px; background-color: #FEF3C7; border-radius: 8px; color: #92400E; font-size: 13px; text-align: center;">
                      ⏰ Responder pronto aumenta las conversiones en un 391%
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #111827; padding: 25px; text-align: center;">
                    <p style="margin: 0; color: #9CA3AF; font-size: 13px;">
                      Este email fue generado automáticamente desde el formulario de contacto de tu sitio web
                    </p>
                    <p style="margin: 10px 0 0 0; color: #6B7280; font-size: 12px;">
                      <strong style="color: #FCD34D;">DEVRI</strong> - Sistema de Gestión
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail(params: {
  to: string;
  name: string;
  planName: string;
  amount: number;
}) {
  if (!isResendConfigured()) {
    console.warn('Resend not configured. Skipping subscription confirmation email.');
    return { id: 'skipped' };
  }

  return await resend.emails.send({
    from: 'DEVRI Pagos <avisos@devri.com.mx>',
    to: params.to,
    subject: `✅ Suscripción confirmada - Plan ${params.planName}`,
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Suscripción confirmada</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">¡Suscripción Confirmada!</h1>
                    <p style="margin: 10px 0 0 0; color: #D1FAE5; font-size: 14px;">Gracias por confiar en DEVRI</p>
                  </td>
                </tr>

                <!-- Contenido -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                      Hola <strong style="color: #111827;">${params.name}</strong>,
                    </p>

                    <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                      Tu suscripción ha sido procesada exitosamente. ¡Bienvenido a bordo! 🎉
                    </p>

                    <!-- Detalles de la suscripción -->
                    <table role="presentation" style="width: 100%; margin: 25px 0; background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%); border-radius: 12px; border: 2px solid #10B981; overflow: hidden;">
                      <tr>
                        <td style="padding: 25px; text-align: center;">
                          <p style="margin: 0 0 5px 0; color: #6B7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Tu Plan</p>
                          <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 24px; font-weight: 700;">
                            ${params.planName}
                          </h2>
                          <div style="display: inline-block; padding: 10px 20px; background-color: #10B981; border-radius: 8px;">
                            <p style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                              $${params.amount.toLocaleString('es-MX')} <span style="font-size: 16px; font-weight: 500;">MXN/mes</span>
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Info importante -->
                    <table role="presentation" style="width: 100%; margin: 25px 0; background-color: #EEF2FF; border-radius: 8px; border-left: 4px solid #A78BFA;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0 0 10px 0; color: #5B21B6; font-size: 14px; font-weight: 600;">📋 Detalles importantes:</p>
                          <ul style="margin: 0; padding-left: 20px; color: #4B5563; font-size: 14px; line-height: 1.8;">
                            <li>Tu suscripción se renovará automáticamente cada mes</li>
                            <li>El próximo cargo será el mismo día del próximo mes</li>
                            <li>Puedes gestionar tu suscripción desde tu panel</li>
                            <li>Puedes cancelar en cualquier momento sin penalización</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    <!-- Botón CTA -->
                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://devri.com.mx'}/dashboard/subscription" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(167, 139, 250, 0.3);">
                            Ver mi suscripción
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 25px 0 0 0; color: #6B7280; font-size: 14px; line-height: 1.6; text-align: center;">
                      ¿Preguntas sobre tu suscripción? Contáctanos en cualquier momento.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #111827; padding: 30px; text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #9CA3AF; font-size: 14px;">
                      <strong style="color: #10B981;">DEVRI</strong> - Agencia Digital
                    </p>
                    <p style="margin: 0 0 15px 0; color: #6B7280; font-size: 13px;">
                      Facturación y Suscripciones
                    </p>
                    <p style="margin: 0; color: #6B7280; font-size: 12px;">
                      📧 <a href="mailto:info@devri.com.mx" style="color: #10B981; text-decoration: none;">info@devri.com.mx</a>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(params: {
  to: string;
  resetLink: string;
}) {
  if (!isResendConfigured()) {
    console.warn('Resend not configured. Skipping password reset email.');
    return { id: 'skipped' };
  }

  return await resend.emails.send({
    from: 'DEVRI Seguridad <seguridad@devri.com.mx>',
    to: params.to,
    subject: '🔐 Restablece tu contraseña - DEVRI',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecer contraseña</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">🔐</div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">Restablece tu Contraseña</h1>
                    <p style="margin: 10px 0 0 0; color: #FEE2E2; font-size: 14px;">Solicitud de cambio de contraseña</p>
                  </td>
                </tr>

                <!-- Contenido -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                      Hola,
                    </p>

                    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                      Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong style="color: #A78BFA;">DEVRI</strong>.
                    </p>

                    <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                      Haz clic en el botón de abajo para crear una nueva contraseña segura:
                    </p>

                    <!-- Botón CTA -->
                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${params.resetLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(167, 139, 250, 0.3);">
                            🔑 Restablecer contraseña
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Seguridad Info -->
                    <table role="presentation" style="width: 100%; margin: 25px 0; background-color: #FEF2F2; border-radius: 8px; border-left: 4px solid #EF4444;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0 0 10px 0; color: #991B1B; font-size: 14px; font-weight: 600;">🛡️ Información de seguridad:</p>
                          <ul style="margin: 0; padding-left: 20px; color: #7F1D1D; font-size: 14px; line-height: 1.8;">
                            <li>Este enlace expirará en <strong>24 horas</strong></li>
                            <li>Solo se puede usar una vez</li>
                            <li>Si no solicitaste este cambio, ignora este email</li>
                            <li>Tu contraseña actual no ha cambiado todavía</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    <!-- Alternative link -->
                    <p style="margin: 25px 0 0 0; padding: 15px; background-color: #F9FAFB; border-radius: 8px; color: #6B7280; font-size: 13px; line-height: 1.6;">
                      <strong style="color: #111827;">¿El botón no funciona?</strong><br>
                      Copia y pega este enlace en tu navegador:<br>
                      <a href="${params.resetLink}" style="color: #A78BFA; word-break: break-all; text-decoration: none;">
                        ${params.resetLink}
                      </a>
                    </p>

                    <p style="margin: 25px 0 0 0; color: #9CA3AF; font-size: 13px; line-height: 1.6; text-align: center;">
                      Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #111827; padding: 30px; text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #9CA3AF; font-size: 14px;">
                      <strong style="color: #EF4444;">DEVRI</strong> - Agencia Digital
                    </p>
                    <p style="margin: 0 0 15px 0; color: #6B7280; font-size: 13px;">
                      Equipo de Seguridad
                    </p>
                    <p style="margin: 0; color: #6B7280; font-size: 12px;">
                      📧 <a href="mailto:seguridad@devri.com.mx" style="color: #EF4444; text-decoration: none;">seguridad@devri.com.mx</a>
                    </p>
                    <p style="margin: 15px 0 0 0; color: #4B5563; font-size: 11px;">
                      Este es un correo automático, por favor no respondas a este mensaje.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}
