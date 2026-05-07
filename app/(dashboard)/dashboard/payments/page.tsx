'use client';

import { useEffect, useState } from 'react';
import {
  ExternalLink, CreditCard, ShoppingBag, Repeat, DollarSign,
  Link as LinkIcon, BanknoteIcon, Check, Clock, AlertCircle, Settings,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { ClientPaymentLink, PaymentLinkType, PaymentStatus } from '@/types';

const STRIPE_PORTAL = 'https://billing.stripe.com/p/login/3cs6p5cmA3xFbT23cc';

const typeLabels: Record<PaymentLinkType, string> = {
  subscription: 'Suscripción', one_time: 'Pago único',
  advance: 'Anticipo', other: 'Otro', transfer: 'Transferencia',
};
const typeColors: Record<PaymentLinkType, string> = {
  subscription: 'bg-violet-100 text-violet-700 border-violet-200',
  one_time: 'bg-blue-100 text-blue-700 border-blue-200',
  advance: 'bg-amber-100 text-amber-700 border-amber-200',
  other: 'bg-gray-100 text-gray-600 border-gray-200',
  transfer: 'bg-teal-100 text-teal-700 border-teal-200',
};
const typeIcons: Record<PaymentLinkType, any> = {
  subscription: Repeat, one_time: ShoppingBag,
  advance: DollarSign, other: CreditCard, transfer: BanknoteIcon,
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendiente de pago', color: 'bg-amber-100 text-amber-700', icon: Clock },
  processing: { label: 'En proceso de verificación', color: 'bg-blue-100 text-blue-700', icon: Clock },
  paid: { label: 'Pagado', color: 'bg-green-100 text-green-700', icon: Check },
  active_subscription: { label: 'Suscripción activa', color: 'bg-violet-100 text-violet-700', icon: Check },
  inactive: { label: 'Inactivo', color: 'bg-gray-100 text-gray-500', icon: AlertCircle },
};

const STATUS_ORDER: Record<string, number> = {
  pending: 0, processing: 1, active_subscription: 2, paid: 3, inactive: 4,
};

export default function PaymentsPage() {
  const [links, setLinks] = useState<ClientPaymentLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reporting, setReporting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => { loadLinks(); }, []);

  const loadLinks = async () => {
    const res = await fetch('/api/client/payment-links');
    const d = await res.json();
    setLinks(d.links || []);
    setIsLoading(false);
  };

  const handleReportPayment = async (id: string) => {
    setReporting(id);
    try {
      const res = await fetch('/api/client/payment-links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setLinks((prev) =>
          prev.map((l) => l.id === id ? { ...l, payment_status: 'processing' as PaymentStatus } : l)
        );
      }
    } finally {
      setReporting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sorted = [...links].sort((a, b) => {
    const sa = STATUS_ORDER[(a.payment_status || 'pending') as string] ?? 5;
    const sb = STATUS_ORDER[(b.payment_status || 'pending') as string] ?? 5;
    if (sa !== sb) return sa - sb;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
        <p className="text-gray-500 text-sm mt-0.5">Tus pagos y suscripciones activas</p>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          <LinkIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Sin pagos asignados</p>
          <p className="text-gray-400 text-sm mt-1">Cuando tengas pagos pendientes aparecerán aquí</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((link) => (
            <PaymentCard
              key={link.id}
              link={link}
              reporting={reporting === link.id}
              onReportPayment={(id) => setConfirmId(id)}
            />
          ))}
        </div>
      )}

      {/* Stripe portal */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
        <div className="flex items-start gap-3">
          <Settings className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Administrar suscripción en Stripe</p>
            <p className="text-xs text-gray-400 mt-0.5">Gestiona tu método de pago, facturas y cancela cuando quieras.</p>
          </div>
          <a
            href={STRIPE_PORTAL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-white transition-colors flex-shrink-0"
          >
            Portal
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Confirm payment report modal */}
      {confirmId && (
        <div className="fixed inset-0 !mt-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">¿Ya realizaste el pago?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Al confirmar, notificaremos a nuestro equipo para que verifique y actualice el estado de tu pago.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { handleReportPayment(confirmId); setConfirmId(null); }}
                disabled={!!reporting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Sí, confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentCard({
  link, reporting, onReportPayment,
}: {
  link: ClientPaymentLink;
  reporting: boolean;
  onReportPayment: (id: string) => void;
}) {
  const TypeIcon = typeIcons[link.type];
  const status = (link.payment_status || 'pending') as PaymentStatus;
  const { label: statusLabel, color: statusColor, icon: StatusIcon } = paymentStatusConfig[status];
  const isPaid = status === 'paid' || status === 'active_subscription';
  const isPending = status === 'pending';
  const isProcessing = status === 'processing';
  const isInactive = status === 'inactive';

  return (
    <div className={`bg-white rounded-xl border p-4 transition-colors ${
      isPaid ? 'border-green-200' : isProcessing ? 'border-blue-200' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isPaid ? 'bg-green-100' : isProcessing ? 'bg-blue-50' : 'bg-accent/10'
        }`}>
          <TypeIcon className={`w-5 h-5 ${isPaid ? 'text-green-600' : isProcessing ? 'text-blue-500' : 'text-accent'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-900">{link.label}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${typeColors[link.type]}`}>
              {typeLabels[link.type]}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
              <StatusIcon className="w-3 h-3" />
              {statusLabel}
            </span>
          </div>
          {link.description && <p className="text-sm text-gray-500 mb-2">{link.description}</p>}
          {link.amount_mxn && (
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(link.amount_mxn)} <span className="text-sm font-normal text-gray-400">MXN</span>
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">Asignado el {formatDate(link.created_at)}</p>

          {/* Transfer details */}
          {link.type === 'transfer' && link.transfer_details && (
            <div className="mt-3 bg-teal-50 border border-teal-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-teal-700 mb-1.5">Datos para transferencia</p>
              <pre className="text-xs text-teal-800 whitespace-pre-wrap font-mono leading-relaxed">{link.transfer_details}</pre>
            </div>
          )}

          {/* Processing notice */}
          {isProcessing && (
            <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Pago en proceso de verificación. Te notificaremos cuando se confirme.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {/* Pagar button */}
          {!isPaid && !isInactive && !isProcessing && link.type !== 'transfer' && link.stripe_url && (
            <a
              href={link.stripe_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-dark text-white text-sm font-medium hover:bg-accent transition-colors"
            >
              Pagar
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Ya realicé el pago button */}
          {isPending && (
            <button
              onClick={() => onReportPayment(link.id)}
              disabled={reporting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-300 bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
            >
              {reporting ? (
                <div className="w-3 h-3 border border-green-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              Ya realicé el pago
            </button>
          )}

          {isPaid && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
              <Check className="w-3.5 h-3.5" />
              Listo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
