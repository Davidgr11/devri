/**
 * Subscription Management Page
 * Displays subscription details and allows plan management
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CreditCard, Calendar, Package, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { getUserSubscription, getSubscriptionPlans } from '@/lib/supabase/queries';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Loading } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { SubscriptionWithPlan, SubscriptionPlan } from '@/types';

export default function SubscriptionPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<SubscriptionWithPlan | null>(null);
  const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPortal, setIsCreatingPortal] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showCanceledMessage, setShowCanceledMessage] = useState(false);

  useEffect(() => {
    if (user) {
      Promise.all([
        getUserSubscription(user.id),
        getSubscriptionPlans(),
      ]).then(([subData, plansData]) => {
        setSubscription(subData as any);
        setAllPlans(plansData);
        setIsLoading(false);
      });
    }
  }, [user]);

  useEffect(() => {
    // Check for success or canceled payment
    if (searchParams.get('success') === 'true') {
      setShowSuccessMessage(true);
      // Auto-hide after 10 seconds
      setTimeout(() => setShowSuccessMessage(false), 10000);
    }
    if (searchParams.get('canceled') === 'true') {
      setShowCanceledMessage(true);
      // Auto-hide after 8 seconds
      setTimeout(() => setShowCanceledMessage(false), 8000);
    }
  }, [searchParams]);

  const handleOpenPortal = async () => {
    if (!subscription?.stripe_customer_id) return;

    setIsCreatingPortal(true);
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: subscription.stripe_customer_id,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening portal:', error);
      alert('Error al abrir el portal de pagos');
    } finally {
      setIsCreatingPortal(false);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!plan.stripe_price_id) {
      alert('Este plan no está disponible para compra en línea. Por favor contacta a soporte.');
      return;
    }

    setIsCreatingCheckout(plan.id);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.stripe_price_id,
          planId: plan.id,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert('Error al crear la sesión de pago: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error al procesar el pago');
    } finally {
      setIsCreatingCheckout(null);
    }
  };

  if (isLoading) {
    return <Loading text="Cargando información de suscripción..." />;
  }

  const hasActiveSubscription = subscription && subscription.status === 'active';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Suscripción</h1>
        <p className="text-gray-600 mt-1">
          {hasActiveSubscription
            ? 'Administra tu plan y pagos'
            : 'Activa un plan para comenzar'}
        </p>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-1">
                  ¡Pago exitoso!
                </h3>
                <p className="text-sm text-green-800">
                  Tu suscripción ha sido activada correctamente. Recibirás un correo de confirmación en breve.
                </p>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="text-green-600 hover:text-green-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Canceled Message */}
      {showCanceledMessage && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Pago cancelado
                </h3>
                <p className="text-sm text-gray-800">
                  No se realizó ningún cargo. Puedes intentar nuevamente cuando lo desees.
                </p>
              </div>
              <button
                onClick={() => setShowCanceledMessage(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Subscription */}
      {hasActiveSubscription && subscription.plan ? (
        <>
          {/* Current Plan Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Plan Actual</CardTitle>
                <Badge variant="success">Activo</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Name & Price */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {subscription.plan.name}
                </h3>
                <p className="text-3xl font-bold text-accent mb-2">
                  {formatCurrency(subscription.plan.price_mxn)}
                  <span className="text-lg text-gray-600 font-normal">/mes</span>
                </p>
              </div>

              {/* Billing Info */}
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Inicio del periodo
                  </label>
                  <p className="text-gray-900">
                    {subscription.current_period_start &&
                      new Date(subscription.current_period_start).toLocaleDateString('es-MX')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Próxima renovación
                  </label>
                  <p className="text-gray-900">
                    {subscription.current_period_end &&
                      new Date(subscription.current_period_end).toLocaleDateString('es-MX')}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Incluye:
                </label>
                <ul className="space-y-2">
                  {subscription.plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-600 mt-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Manage Button */}
              <div className="pt-4">
                <Button
                  onClick={handleOpenPortal}
                  isLoading={isCreatingPortal}
                  className="flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Administrar suscripción y pagos
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Actualiza tu método de pago, cambia de plan o cancela tu suscripción
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Other Plans */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Otros planes disponibles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {allPlans
                .filter((plan) => plan.id !== subscription.plan_id && plan.is_active)
                .map((plan) => (
                  <Card key={plan.id} hover>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-2xl font-bold text-accent mb-4">
                        {formatCurrency(plan.price_mxn)}
                        <span className="text-sm text-gray-600 font-normal">/mes</span>
                      </p>
                      <ul className="space-y-2 mb-6">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-600 mt-0.5">✓</span>
                            {feature}
                          </li>
                        ))}
                        {plan.features.length > 3 && (
                          <li className="text-sm text-gray-500">
                            +{plan.features.length - 3} más...
                          </li>
                        )}
                      </ul>
                      <Button
                        variant="secondary"
                        size="sm"
                        fullWidth
                        onClick={handleOpenPortal}
                      >
                        Cambiar a este plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </>
      ) : (
        /* No Active Subscription */
        <>
          {/* Info Alert */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    No tienes un plan activo
                  </h3>
                  <p className="text-sm text-blue-800">
                    Para activar tu mantenimiento mensual, elige uno de los planes disponibles.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Planes disponibles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {allPlans
                .filter((plan) => plan.is_active)
                .map((plan) => (
                  <Card key={plan.id} hover>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-3xl font-bold text-accent mb-4">
                        {formatCurrency(plan.price_mxn)}
                        <span className="text-sm text-gray-600 font-normal">/mes</span>
                      </p>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-green-600 mt-0.5">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="text-center pt-4 border-t border-gray-200">
                        <Button
                          size="sm"
                          fullWidth
                          className="flex items-center justify-center gap-2"
                          onClick={() => handleSubscribe(plan)}
                          isLoading={isCreatingCheckout === plan.id}
                          disabled={!plan.stripe_price_id}
                        >
                          <CreditCard className="w-4 h-4" />
                          {plan.stripe_price_id ? 'Suscribirse ahora' : 'No disponible'}
                        </Button>
                        {!plan.stripe_price_id && (
                          <p className="text-xs text-gray-500 mt-2">
                            Contáctanos para este plan
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
