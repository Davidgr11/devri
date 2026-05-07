'use client';

import { useEffect, useState } from 'react';
import { Globe, ExternalLink, CheckCircle, Clock, Code2, BookOpen } from 'lucide-react';
import type { ClientWebsite, WebsiteStatus } from '@/types';

const statusLabels: Record<WebsiteStatus, string> = {
  pending: 'Pendiente', development: 'En desarrollo', published: 'Publicado',
};
const statusColors: Record<WebsiteStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  development: 'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
};
const statusIcons: Record<WebsiteStatus, any> = {
  pending: Clock, development: Code2, published: CheckCircle,
};

export default function WebsitesPage() {
  const [sites, setSites] = useState<ClientWebsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/client/websites')
      .then((r) => r.json())
      .then((d) => { setSites(d.sites || []); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Sitios</h1>
        <p className="text-gray-500 text-sm mt-0.5">Proyectos web asignados a tu cuenta</p>
      </div>

      {sites.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          <Globe className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Sin sitios asignados</p>
          <p className="text-gray-400 text-sm mt-1">Cuando tu proyecto esté listo aparecerá aquí</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sites.map((site) => {
            const StatusIcon = statusIcons[site.status];
            return (
              <div key={site.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900">{site.title || 'Mi Sitio Web'}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium ${statusColors[site.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusLabels[site.status]}
                        </span>
                      </div>
                      {site.url ? (
                        <a href={site.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-accent hover:underline text-sm font-medium">
                          {site.url}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <p className="text-sm text-gray-400">URL pendiente de asignación</p>
                      )}
                    </div>
                    {site.url && site.status === 'published' && (
                      <a href={site.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-dark text-white text-sm font-medium hover:bg-accent transition-colors flex-shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Visitar
                      </a>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                {site.instructions && (
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-accent" />
                      <h4 className="text-sm font-semibold text-gray-700">Instrucciones</h4>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100">
                      {site.instructions}
                    </div>
                  </div>
                )}

                {/* Progress steps when not published */}
                {site.status !== 'published' && (
                  <div className="px-5 pb-5">
                    <div className="space-y-2">
                      <Step done label="Registro completado" />
                      <Step done={site.status !== 'pending'} label="Desarrollo iniciado" />
                      <Step done={false} label="Sitio publicado" sub="Te notificaremos cuando tu sitio esté en línea" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Step({ done, label, sub }: { done: boolean; label: string; sub?: string }) {
  return (
    <div className="flex items-start gap-3">
      {done
        ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
        : <Clock className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
      }
      <div>
        <p className={`text-sm font-medium ${done ? 'text-gray-800' : 'text-gray-400'}`}>{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}
