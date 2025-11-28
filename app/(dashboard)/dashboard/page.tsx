/**
 * Dashboard Home Page
 * Main dashboard view with overview cards
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, Globe, CreditCard, ExternalLink, TrendingUp, Zap } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { getUserWebsite, getUserSubscription } from '@/lib/supabase/queries';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Loading } from '@/components/ui';
import type { ClientWebsite, SubscriptionWithPlan } from '@/types';

export default function DashboardPage() {
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
    return <Loading text="Cargando dashboard..." />;
  }

  const hasWebsite = website && website.status === 'published' && website.url;
  const hasActiveSubscription = subscription && subscription.status === 'active';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bienvenido</h1>
        <p className="text-gray-600 mt-1">Panel de control</p>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Subscription Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <CardTitle>Suscripción</CardTitle>
              </div>
              <Badge variant={hasActiveSubscription ? 'success' : 'default'}>
                {hasActiveSubscription ? 'Activa' : 'Inactiva'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {hasActiveSubscription && subscription.plan ? (
              <>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {subscription.plan.name}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Próxima renovación:{' '}
                  {subscription.current_period_end &&
                    new Date(subscription.current_period_end).toLocaleDateString('es-MX')}
                </p>
                <Link href="/dashboard/subscription">
                  <Button size="sm" variant="secondary">
                    Gestionar suscripción
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  No tienes una suscripción activa
                </p>
                <Link href="/dashboard/subscription">
                  <Button size="sm">Ver planes</Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* Website Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <CardTitle>Mi Sitio Web</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {hasWebsite ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Sitio publicado</span>
                </div>
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center gap-1 mb-4"
                >
                  {website.url}
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Link href="/dashboard/website">
                  <Button size="sm" variant="secondary">
                    Ver detalles
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Registro completado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasActiveSubscription ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-sm">Pago confirmado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">Sitio publicado</span>
                  </div>
                </div>
                {hasActiveSubscription ? (
                  <p className="text-sm text-gray-600">
                    Tu suscripción está activa. Pronto asignaremos la URL de tu sitio.
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Activa tu suscripción para comenzar.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards (fake data if website is published) */}
      {hasWebsite && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mt-8">Estadísticas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Uptime</p>
                    <p className="text-2xl font-bold text-green-600">99.9%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Tu sitio funciona perfectamente 24/7</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Velocidad</p>
                    <p className="text-2xl font-bold text-accent">&lt;2s</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Tiempo de carga promedio</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Visitas del mes</p>
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">+12% vs mes anterior</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Help Card */}
      {!hasWebsite && (
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-2">¿Tienes dudas?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Nuestro equipo está listo para ayudarte. Contáctanos por WhatsApp.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '5215512345678'}?text=Hola, tengo dudas sobre mi proyecto`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm">Contactar por WhatsApp</Button>
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
