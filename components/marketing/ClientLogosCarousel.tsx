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

  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden">
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0B0D14] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0B0D14] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-[scroll_15s_linear_infinite] hover:[animation-play-state:paused]">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="flex-shrink-0 mx-6 md:mx-10 flex items-center justify-center"
            >
              <div className="relative w-32 h-14 sm:w-40 sm:h-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-50 hover:opacity-80">
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
