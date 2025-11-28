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
    from: 'Devri Solutions <onboarding@resend.dev>',
    to: params.to,
    subject: '¡Bienvenido a Devri Solutions!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #A78BFA;">¡Hola ${params.name}!</h1>
        <p>Bienvenido a Devri Solutions. Estamos emocionados de tenerte con nosotros.</p>
        <p>Tu cuenta ha sido creada exitosamente. Ahora puedes explorar nuestros servicios y comenzar a construir tu presencia digital.</p>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <br />
        <p>Saludos,<br />El equipo de Devri Solutions</p>
      </div>
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
    from: 'Devri Solutions <notifications@resend.dev>',
    to: params.to,
    subject: '¡Tu sitio web está listo!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6EE7B7;">¡Tu sitio web está publicado!</h1>
        <p>Hola ${params.name},</p>
        <p>Nos complace informarte que tu sitio web ha sido publicado y ya está disponible en:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${params.websiteUrl}" style="background: #A78BFA; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Visitar mi sitio
          </a>
        </p>
        <p>Puedes acceder a tu panel de control en cualquier momento para ver estadísticas y gestionar tu sitio.</p>
        <p>Si necesitas algún cambio o tienes preguntas, estamos aquí para ayudarte.</p>
        <br />
        <p>Saludos,<br />El equipo de Devri Solutions</p>
      </div>
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
    from: 'Devri Solutions <forms@resend.dev>',
    to: adminEmail,
    subject: `Nuevo formulario de contacto de ${params.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Nuevo formulario de contacto</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Nombre:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${params.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${params.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${params.phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Tipo de negocio:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${params.businessType}</td>
          </tr>
          <tr>
            <td style="padding: 10px; vertical-align: top;"><strong>Mensaje:</strong></td>
            <td style="padding: 10px;">${params.message}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">
          <a href="https://wa.me/52${params.phone}" style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Contactar por WhatsApp
          </a>
        </p>
      </div>
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
    from: 'Devri Solutions <billing@resend.dev>',
    to: params.to,
    subject: `Suscripción confirmada - Plan ${params.planName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6EE7B7;">¡Suscripción confirmada!</h1>
        <p>Hola ${params.name},</p>
        <p>Tu suscripción al plan <strong>${params.planName}</strong> ha sido confirmada.</p>
        <p>Monto: <strong>$${params.amount} MXN/mes</strong></p>
        <p>Tu próximo pago se procesará automáticamente cada mes. Puedes gestionar tu suscripción desde tu panel de control.</p>
        <br />
        <p>Saludos,<br />El equipo de Devri Solutions</p>
      </div>
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
    from: 'Devri Solutions <security@resend.dev>',
    to: params.to,
    subject: 'Restablece tu contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Restablece tu contraseña</h1>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${params.resetLink}" style="background: #A78BFA; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Restablecer contraseña
          </a>
        </p>
        <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
        <p style="color: #999; font-size: 12px;">Este enlace expirará en 24 horas.</p>
      </div>
    `,
  });
}
