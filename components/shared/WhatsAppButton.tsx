/**
 * WhatsApp Floating Button
 * Fixed position button for quick WhatsApp contact
 */

'use client';

import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
  className?: string;
}

export function WhatsAppButton({
  phone,
  message = 'Hola, me interesa saber más sobre sus servicios',
  className,
}: WhatsAppButtonProps) {
  // Get phone from env or use provided
  const whatsappPhone = phone || process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '525540619810';

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'bg-whatsapp text-white',
        'w-14 h-14 rounded-full',
        'flex items-center justify-center',
        'shadow-lg hover:shadow-xl',
        'transition-all duration-300',
        'hover:scale-110',
        'animate-pulse-soft',
        // Mobile adjustments
        'md:w-16 md:h-16',
        className
      )}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
    </a>
  );
}
