/**
 * Client Logos Carousel
 * Infinite scrolling carousel of client logos
 */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getClientLogos } from '@/lib/supabase/queries';
import type { ClientLogo } from '@/types';

export function ClientLogosCarousel() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);

  useEffect(() => {
    getClientLogos().then(setLogos).catch(console.error);
  }, []);

  if (logos.length === 0) return null;

  // Duplicate logos for infinite scroll effect
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden">
      {/*<p className="text-sm text-gray-300 mb-4">Confían en nosotros:</p>*/}

      <div className="relative">
        <div className="flex animate-[scroll_10s_linear_infinite] md:animate-[scroll_20s_linear_infinite] hover:[animation-play-state:paused]">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="flex-shrink-0 mx-6 md:mx-8 flex items-center justify-center"
            >
              <div className="relative w-24 h-12 sm:w-32 sm:h-16 md:w-40 md:h-20 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <Image
                  src={logo.logo_url}
                  alt={logo.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
