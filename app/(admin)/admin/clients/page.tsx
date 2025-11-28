/**
 * Admin Clients Page
 * List and manage all clients
 */

'use client';

import { useEffect, useState } from 'react';
import { Search, Mail, Calendar, Package, Globe, Edit2, Check, X, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Input, Badge, Loading, Button } from '@/components/ui';
import type { UserProfile } from '@/types';

interface ClientWithDetails extends UserProfile {
  email: string;
  subscription_status?: string;
  plan_name?: string;
  website_url?: string;
  website_status?: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientWithDetails[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingWebsite, setEditingWebsite] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredClients(
        clients.filter(
          (client) =>
            client.full_name?.toLowerCase().includes(query) ||
            client.email.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredClients(clients);
    }
  }, [searchQuery, clients]);

  const loadClients = async () => {
    try {
      // Fetch clients from API route (server-side with admin access)
      const response = await fetch('/api/admin/clients');

      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const data = await response.json();

      setClients(data.clients || []);
      setFilteredClients(data.clients || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditWebsite = (clientId: string, currentUrl?: string) => {
    setEditingWebsite(clientId);
    setEditUrl(currentUrl || '');
  };

  const handleCancelEdit = () => {
    setEditingWebsite(null);
    setEditUrl('');
  };

  const handleSaveWebsite = async (userId: string) => {
    if (!editUrl.trim()) {
      alert('Por favor ingresa una URL válida');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/websites/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: editUrl,
          status: 'published',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update website');
      }

      await loadClients();
      setEditingWebsite(null);
      setEditUrl('');
    } catch (error) {
      console.error('Error updating website:', error);
      alert('Error al actualizar el sitio web');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading text="Cargando clientes..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <p className="text-gray-600 mt-1">Administra todos los usuarios de la plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total de Clientes</p>
            <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Con Suscripción Activa</p>
            <p className="text-3xl font-bold text-green-600">
              {clients.filter((c) => c.subscription_status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Sin Suscripción</p>
            <p className="text-3xl font-bold text-gray-500">
              {clients.filter((c) => !c.subscription_status).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los Clientes ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Cliente
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Contacto
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Suscripción
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Sitio Web
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Registro
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{client.full_name}</p>
                        {client.business_type && (
                          <p className="text-sm text-gray-600">{client.business_type}</p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="w-4 h-4" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <p className="text-sm text-gray-600 mt-1">{client.phone}</p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {client.subscription_status === 'active' ? (
                          <div>
                            <Badge variant="success">Activa</Badge>
                            {client.plan_name && (
                              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                {client.plan_name}
                              </p>
                            )}
                          </div>
                        ) : (
                          <Badge variant="default">Sin suscripción</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {editingWebsite === client.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="url"
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              placeholder="https://ejemplo.com"
                              className="text-sm"
                              disabled={isSaving}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSaveWebsite(client.id)}
                              disabled={isSaving}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : client.website_url && client.website_status === 'published' ? (
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="success">Publicado</Badge>
                              <button
                                onClick={() => handleEditWebsite(client.id, client.website_url)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                            <a
                              href={client.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-accent hover:underline flex items-center gap-1"
                            >
                              {client.website_url.replace(/^https?:\/\//, '')}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEditWebsite(client.id)}
                            disabled={client.subscription_status !== 'active'}
                          >
                            <Globe className="w-4 h-4 mr-1" />
                            Asignar sitio
                          </Button>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(client.created_at).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              {searchQuery ? 'No se encontraron clientes' : 'No hay clientes registrados'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
