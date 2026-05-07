'use client';

import { useEffect, useState } from 'react';
import {
  FileText, CheckCircle, Clock, XCircle, Send,
  X, AlertCircle, PenLine, Paperclip, Download,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Proposal, ProposalStatus } from '@/types';

const statusLabels: Record<ProposalStatus, string> = {
  draft: 'Borrador',
  sent: 'Pendiente de firma',
  signed: 'Firmada',
  rejected: 'Rechazada',
};

const statusColors: Record<ProposalStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-700',
  signed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewProposal, setViewProposal] = useState<Proposal | null>(null);
  const [signing, setSigning] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [signError, setSignError] = useState('');

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    const res = await fetch('/api/client/proposals');
    const data = await res.json();
    setProposals(data.proposals || []);
    setIsLoading(false);
  };

  const handleDownloadAttachment = async (proposal: Proposal) => {
    if (!proposal.attachment_url) return;
    const res = await fetch(`/api/client/proposals/attachment?id=${proposal.id}`);
    const data = await res.json();
    if (data.url) window.open(data.url, '_blank');
  };

  const handleSign = async () => {
    if (!viewProposal) return;
    if (!signatureName.trim() || signatureName.trim().length < 3) {
      setSignError('Por favor ingresa tu nombre completo');
      return;
    }

    setSigning(true);
    setSignError('');
    try {
      const res = await fetch('/api/client/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_id: viewProposal.id, signature_name: signatureName.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al firmar');
      }

      setViewProposal(null);
      setSignatureName('');
      await loadProposals();
    } catch (err: any) {
      setSignError(err.message);
    } finally {
      setSigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pending = proposals.filter((p) => p.status === 'sent');
  const signed = proposals.filter((p) => p.status === 'signed');
  const others = proposals.filter((p) => p.status !== 'sent' && p.status !== 'signed');

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Propuestas</h1>
        <p className="text-gray-500 text-sm mt-0.5">Revisa y firma tus propuestas</p>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Sin propuestas</p>
          <p className="text-gray-400 text-sm mt-1">Aquí aparecerán las propuestas que te enviemos</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pendientes de firma</h2>
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">{pending.length}</span>
              </div>
              <div className="space-y-3">
                {pending.map((p) => <ProposalCard key={p.id} proposal={p} onView={setViewProposal} />)}
              </div>
            </div>
          )}
          {signed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Firmadas</h2>
              <div className="space-y-3">
                {signed.map((p) => <ProposalCard key={p.id} proposal={p} onView={setViewProposal} />)}
              </div>
            </div>
          )}
          {others.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Otras</h2>
              <div className="space-y-3">
                {others.map((p) => <ProposalCard key={p.id} proposal={p} onView={setViewProposal} />)}
              </div>
            </div>
          )}
        </>
      )}

      {/* View & Sign Modal */}
      {viewProposal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto client-panel">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{viewProposal.title}</h2>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${statusColors[viewProposal.status]}`}>
                  {statusLabels[viewProposal.status]}
                </span>
              </div>
              <button onClick={() => { setViewProposal(null); setSignatureName(''); setSignError(''); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Metadata */}
              <div className="flex flex-wrap gap-4 mb-5 text-sm text-gray-500">
                {viewProposal.amount_mxn && (
                  <span className="font-semibold text-gray-800 text-base">{formatCurrency(viewProposal.amount_mxn)} MXN</span>
                )}
                {viewProposal.valid_until && (
                  <span>Vigente hasta: <strong>{formatDate(viewProposal.valid_until)}</strong></span>
                )}
                <span>Enviada el {formatDate(viewProposal.created_at)}</span>
              </div>

              {/* Content */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-5 max-h-80 overflow-y-auto client-panel">
                {(viewProposal.content || '').trim().startsWith('<')
                  ? <div className="prose-content text-sm text-gray-700 text-justify [&_*]:text-justify" dangerouslySetInnerHTML={{ __html: viewProposal.content }} />
                  : <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed text-justify">{viewProposal.content}</p>
                }
              </div>

              {/* Attachment */}
              {viewProposal.attachment_name && (
                <button
                  onClick={() => handleDownloadAttachment(viewProposal)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 mb-4 transition-colors w-full"
                >
                  <Paperclip className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left truncate">{viewProposal.attachment_name}</span>
                  <Download className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                </button>
              )}

              {/* Signed indicator */}
              {viewProposal.status === 'signed' && viewProposal.signature_data && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Firmada digitalmente</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Firmante: <strong>{viewProposal.signature_data.name}</strong>
                  </p>
                  <p className="text-sm text-green-700">Fecha: {formatDate(viewProposal.signed_at!)}</p>
                </div>
              )}

              {/* Sign form */}
              {viewProposal.status === 'sent' && (
                <div className="border-t border-gray-100 pt-5 mt-5">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700">
                        Al firmar confirmas que has leído y aceptas todos los términos de esta propuesta.
                      </p>
                    </div>
                  </div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Escribe tu nombre completo para firmar
                  </label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => { setSignatureName(e.target.value); setSignError(''); }}
                    placeholder="Tu nombre completo tal como aparece en tu identificación"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 mb-2"
                  />
                  {signError && (
                    <p className="text-red-500 text-xs mb-3">{signError}</p>
                  )}
                  <button
                    onClick={handleSign}
                    disabled={signing || !signatureName.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent-dark text-white font-semibold text-sm hover:bg-accent disabled:opacity-50 transition-colors"
                  >
                    {signing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Firmando...
                      </span>
                    ) : (
                      <>
                        <PenLine className="w-4 h-4" />
                        Firmar Propuesta
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProposalCard({ proposal, onView }: { proposal: Proposal; onView: (p: Proposal) => void }) {
  return (
    <div
      className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-sm transition-all ${
        proposal.status === 'sent' ? 'border-blue-200 hover:border-blue-300' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onView(proposal)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-900">{proposal.title}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[proposal.status]}`}>
              {statusLabels[proposal.status]}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
            {proposal.amount_mxn && <span className="font-semibold text-gray-600">{formatCurrency(proposal.amount_mxn)}</span>}
            {proposal.valid_until && <span>Vigente hasta {formatDate(proposal.valid_until)}</span>}
            <span>{formatDate(proposal.created_at)}</span>
          </div>
          {proposal.status === 'signed' && proposal.signature_data && (
            <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Firmada por {proposal.signature_data.name}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          {proposal.status === 'sent' && (
            <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              <PenLine className="w-3.5 h-3.5" />
              Firmar
            </span>
          )}
          {proposal.status === 'signed' && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>
      </div>
    </div>
  );
}
