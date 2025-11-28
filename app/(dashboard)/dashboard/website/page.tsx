/**
 * Website Details Page
 * Displays client's website information and status
 */

'use client';

import { useEffect, useState } from 'react';
import { Globe, ExternalLink, Calendar, Package, CheckCircle, Clock } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { getUserWebsite, getUserSubscription } from '@/lib/supabase/queries';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Loading } from '@/components/ui';
import type { ClientWebsite, SubscriptionWithPlan } from '@/types';

export default function WebsitePage() {
  const { user } = useUser();
  const [website, setWebsite] = useState<ClientWebsite | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionWithPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        getUserWebsite(user.id),
        getUserSubscription(user.id),
      ]).then(([websiteData, subData]) => {
        setWebsite(websiteData);
        setSubscription(subData as any);
        setIsLoading(false);
      });
    }
  }, [user]);

  if (isLoading) {
    return <Loading text="Cargando información del sitio..." />;
  }

  const hasWebsite = website && website.status === 'published' && website.url;
  const hasActiveSubscription = subscription && subscription.status === 'active';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Sitio Web</h1>
        <p className="text-gray-600 mt-1">
          {hasWebsite ? 'Tu sitio web está publicado y activo' : 'Información sobre tu proyecto web'}
        </p>
      </div>

      {/* Published Website */}
      {hasWebsite ? (
        <>
          {/* Main Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Información del Sitio</CardTitle>
                <Badge variant="success">Publicado</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* URL */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  URL del sitio
                </label>
                <a
                  href={website.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-accent hover:underline text-lg font-semibold"
                >
                  {website.url}
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>

              {/* Publication Date */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de publicación
                </label>
                <p className="text-gray-900">
                  {website.published_at &&
                    new Date(website.published_at).toLocaleDateString('es-MX', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                </p>
              </div>

              {/* Plan */}
              {subscription?.plan && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Plan actual
                  </label>
                  <p className="text-gray-900 font-semibold">{subscription.plan.name}</p>
                </div>
              )}

              {/* Visit Button */}
              <div className="pt-4">
                <a href={website.url || '#'} target="_blank" rel="noopener noreferrer">
                  <Button className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Visitar mi sitio web
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          {subscription?.plan && (
            <Card>
              <CardHeader>
                <CardTitle>Características incluidas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {subscription.plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* In Development State */
        <>
          <Card>
            <CardHeader>
              <CardTitle>Estado del Proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {/* Step 1: Registration */}
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Registro completado</p>
                    <p className="text-sm text-gray-600">Tu cuenta ha sido creada exitosamente</p>
                  </div>
                </div>

                {/* Step 2: Payment */}
                <div className="flex items-start gap-3">
                  {hasActiveSubscription ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Clock className="w-6 h-6 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">Pago confirmado</p>
                    {hasActiveSubscription ? (
                      <p className="text-sm text-gray-600">
                        Plan {subscription.plan?.name} activo
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Esperando confirmación de pago
                      </p>
                    )}
                  </div>
                </div>

                {/* Step 3: Development */}
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Sitio en desarrollo</p>
                    <p className="text-sm text-gray-600">
                      Nuestro equipo está trabajando en tu sitio web
                    </p>
                  </div>
                </div>

                {/* Step 4: Publication */}
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Sitio publicado</p>
                    <p className="text-sm text-gray-600">
                      Te notificaremos cuando tu sitio esté en línea
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  ¿Cuánto tiempo tomará?
                </p>
                <p className="text-sm text-blue-800">
                  El desarrollo de tu sitio web toma aproximadamente 2-4 semanas dependiendo de la
                  complejidad. Te mantendremos informado del progreso por email.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-2">¿Tienes dudas sobre tu proyecto?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Estamos disponibles para resolver cualquier pregunta sobre el desarrollo de tu sitio web.
              </p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '5215512345678'}?text=Hola, tengo dudas sobre el desarrollo de mi sitio web`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm">Contactar por WhatsApp</Button>
              </a>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
