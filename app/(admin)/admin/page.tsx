/**
 * Admin Dashboard Page
 * Main admin overview with KPIs and statistics
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CreditCard,
  DollarSign,
  Globe,
  TrendingUp,
  Mail,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Loading } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  totalClients: number;
  activeSubscriptions: number;
  totalRevenue: number;
  publishedWebsites: number;
  pendingForms: number;
  newClientsThisMonth: number;
}

interface RecentClient {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    publishedWebsites: 0,
    pendingForms: 0,
    newClientsThisMonth: 0,
  });
  const [recentClients, setRecentClients] = useState<RecentClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/stats');

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();

      setStats(data.stats);
      setRecentClients(data.recentClients);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading text="Cargando dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Vista general de la plataforma</p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clients */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              {stats.newClientsThisMonth > 0 && (
                <Badge variant="success">+{stats.newClientsThisMonth} este mes</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">Total de Clientes</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Suscripciones Activas</p>
            <p className="text-3xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Ingresos Mensuales</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(stats.totalRevenue)}
            </p>
          </CardContent>
        </Card>

        {/* Published Websites */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Sitios Publicados</p>
            <p className="text-3xl font-bold text-gray-900">{stats.publishedWebsites}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Clientes Recientes</CardTitle>
              <Link href="/admin/clients" className="text-sm text-accent hover:underline">
                Ver todos
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentClients.length > 0 ? (
              <div className="space-y-4">
                {recentClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{client.full_name}</p>
                      <p className="text-sm text-gray-600">{client.email}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(client.created_at).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay clientes aún</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                href="/admin/clients"
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Gestionar Clientes</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>

              <Link
                href="/admin/subscriptions"
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Ver Suscripciones</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>

              <Link
                href="/admin/contact-forms"
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <span className="font-medium text-gray-900">Formularios de Contacto</span>
                    {stats.pendingForms > 0 && (
                      <Badge variant="warning" className="ml-2">
                        {stats.pendingForms} pendientes
                      </Badge>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>

              <Link
                href="/admin/content"
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Gestionar Contenido</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
