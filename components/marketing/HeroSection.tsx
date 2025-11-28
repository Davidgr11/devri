/**
 * Hero Section
 * Landing page hero with video background and client logos carousel
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { ClientLogosCarousel } from './ClientLogosCarousel';
import { TypingText } from './TypingText';

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
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 break-words max-w-full px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <TypingText
            text="Acelera tu negocio con tecnología y"
            speed={8}
            delay={100}
          />
          <br />
          <motion.span
            className="text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.3 }}
          >
            <TypingText
              text="soluciones innovadoras"
              speed={8}
              delay={200}
              showCursor={false}
            />
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto break-words px-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
        >
          Agencia de desarrollo de software, marketing y consultoría digital.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.3, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="#servicios">
            <Button size="lg" className="shadow-2xl hover:shadow-accent/50 transition-all duration-300">
              Ver Servicios
            </Button>
          </Link>
        </motion.div>

        {/* Client Logos Carousel */}
        <motion.div
          className="mt-16 md:mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
        >
          <ClientLogosCarousel />
        </motion.div>
      </div>

      
    </section>
  );
}
