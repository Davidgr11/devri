/**
 * Admin Subscriptions Page
 * View and manage all subscriptions
 */

'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Calendar, DollarSign, User, ExternalLink, Edit2, Save, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Loading, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { SubscriptionWithPlan } from '@/types';

interface SubscriptionWithClient extends SubscriptionWithPlan {
  client_name: string;
  client_email: string;
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'canceled'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editNote, setEditNote] = useState<string>('');

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const response = await fetch('/api/admin/subscriptions');

      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }

      const data = await response.json();
      setSubscriptions(data.subscriptions);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (sub: SubscriptionWithClient) => {
    setEditingId(sub.id);
    setEditPrice(sub.actual_monthly_price ?? sub.plan?.price_mxn ?? 0);
    setEditNote(sub.note || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditPrice(0);
    setEditNote('');
  };

  const handleSaveEdit = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actual_monthly_price: editPrice,
          note: editNote || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      // Reload subscriptions
      await loadSubscriptions();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Error al actualizar la suscripción');
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (filter === 'all') return true;
    return sub.status === filter;
  });

  const totalRevenue = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, sub) => {
      // Use actual_monthly_price if available, otherwise fallback to plan price
      const price = sub.actual_monthly_price ?? sub.plan?.price_mxn ?? 0;
      return sum + price;
    }, 0);

  if (isLoading) {
    return <Loading text="Cargando suscripciones..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Suscripciones</h1>
        <p className="text-gray-600 mt-1">Administra todas las suscripciones activas y canceladas</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Suscripciones Activas</p>
            <p className="text-3xl font-bold text-green-600">
              {subscriptions.filter((s) => s.status === 'active').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Ingresos Mensuales</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Canceladas</p>
            <p className="text-3xl font-bold text-red-600">
              {subscriptions.filter((s) => s.status === 'canceled').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({subscriptions.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Activas ({subscriptions.filter((s) => s.status === 'active').length})
            </button>
            <button
              onClick={() => setFilter('canceled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'canceled'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Canceladas ({subscriptions.filter((s) => s.status === 'canceled').length})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>Suscripciones ({filteredSubscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubscriptions.length > 0 ? (
            <div className="space-y-4">
              {filteredSubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <p className="font-semibold text-gray-900">{sub.client_name}</p>
                        <Badge
                          variant={
                            sub.status === 'active'
                              ? 'success'
                              : sub.status === 'canceled'
                              ? 'error'
                              : 'default'
                          }
                        >
                          {sub.status === 'active'
                            ? 'Activa'
                            : sub.status === 'canceled'
                            ? 'Cancelada'
                            : sub.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{sub.client_email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent">
                        {formatCurrency(sub.actual_monthly_price ?? sub.plan?.price_mxn ?? 0)}
                      </p>
                      <p className="text-sm text-gray-600">/mes</p>
                      {sub.actual_monthly_price !== null &&
                       sub.actual_monthly_price !== sub.plan?.price_mxn && (
                        <p className="text-xs text-gray-500 mt-1">
                          Plan: {formatCurrency(sub.plan?.price_mxn || 0)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Plan</p>
                      <p className="text-sm text-gray-900">{sub.plan?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Próxima renovación
                      </p>
                      <p className="text-sm text-gray-900">
                        {sub.current_period_end
                          ? new Date(sub.current_period_end).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Edit Section */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {editingId === sub.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Precio mensual real
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">$</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent w-32"
                              step="0.01"
                              min="0"
                            />
                            <span className="text-gray-600">MXN/mes</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Nota
                          </label>
                          <input
                            type="text"
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            placeholder='Ej: "50% descuento hasta 18/01/2026" o "1 mes gratis"'
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(sub.id)}
                            className="flex items-center gap-1"
                          >
                            <Save className="w-4 h-4" />
                            Guardar
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {sub.note && (
                          <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                            📝 {sub.note}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          {sub.stripe_customer_id && (
                            <a
                              href={`https://dashboard.stripe.com/customers/${sub.stripe_customer_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-accent hover:underline flex items-center gap-1"
                            >
                              Ver en Stripe
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <button
                            onClick={() => handleEdit(sub)}
                            className="text-sm text-gray-600 hover:text-accent flex items-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            Editar precio/nota
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              {filter === 'all' ? 'No hay suscripciones aún' : `No hay suscripciones ${filter}`}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
