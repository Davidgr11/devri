/**
 * Hero Section
 * Landing page hero with video background and client logos carousel
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ClientLogosCarousel } from './ClientLogosCarousel';

export function HeroSection() {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    setVideoUrl(
      process.env.NEXT_PUBLIC_HERO_VIDEO_URL ||
      process.env.HERO_VIDEO_URL ||
      '/videos/hero-background.mp4'
    );
  }, []);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Video Background */}
      {videoUrl && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in break-words max-w-full px-2">
          Transforma tu marca y negocio con 
          <br />
          <span className="text-accent">tecnología profesional</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto animate-slide-up break-words px-2">
          Agencia de desarrollo de software, marketing y consultoría digital.
        </p>

        <Link href="#contacto">
          <Button size="lg" className="animate-scale-in shadow-2xl">
            Comienza tu proyecto
          </Button>
        </Link>

        {/* Client Logos Carousel */}
        <div className="mt-16 md:mt-20">
          <ClientLogosCarousel />
        </div>
      </div>

      
    </section>
  );
}
