'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { ClientLogosCarousel } from './ClientLogosCarousel';

const stats = [
  { value: '50+', label: 'Proyectos entregados' },
  { value: '3+', label: 'Años de experiencia' },
  { value: '100%', label: 'Clientes satisfechos' },
  { value: '5★', label: 'Calificación promedio' },
];

const words = ['un gran sitio web', 'una gran tienda online', 'un gran sistema a medida', 'una gran presencia digital', 'una gran app personalizada'];

export function HeroSection() {
  const [videoUrl, setVideoUrl] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVideoUrl(
      process.env.NEXT_PUBLIC_HERO_VIDEO_URL || '/videos/hero-background.mp4'
    );
  }, []);

  useEffect(() => {
    const current = words[wordIndex];
    if (!isDeleting && displayed === current) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed === '') {
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    } else {
      const speed = isDeleting ? 40 : 80;
      timeoutRef.current = setTimeout(() => {
        setDisplayed(isDeleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1));
      }, speed);
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayed, isDeleting, wordIndex]);

  const scrollToServices = () => {
    document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0B0D14]">
      {/* Video Background */}
      {videoUrl && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-[#0B0D14]/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D14]/30 via-transparent to-[#0B0D14]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D14]/40 via-transparent to-[#0B0D14]/40" />
        </div>
      )}

      {/* Grid pattern overlay */}
      {!videoUrl && (
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent-dark/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent-light text-sm font-medium"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-soft" />
          Agencia digital en México
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Tu negocio necesita
          <br />
          <span className="relative">
            <span className="gradient-text min-w-[280px] sm:min-w-[420px] inline-block text-left">
              {displayed}
              <span className="animate-pulse text-accent-light">|</span>
            </span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Desarrollamos software, marketing digital y soluciones tecnológicas
          a medida para que tu marca destaque y crezca.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/#contacto" onClick={(e) => {
            e.preventDefault();
            document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent-dark text-white font-semibold text-base shadow-lg shadow-accent-dark/30 hover:bg-accent transition-all duration-200"
            >
              Habla con nosotros
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <button
            onClick={scrollToServices}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/5 font-medium text-base transition-all duration-200"
          >
            <Play className="w-4 h-4 text-accent-light" />
            Ver nuestros servicios
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="flex flex-col items-center p-4 rounded-xl border border-white/5 bg-white/3 backdrop-blur-sm"
            >
              <span className="text-2xl sm:text-3xl font-bold gradient-text-purple">{stat.value}</span>
              <span className="text-xs sm:text-sm text-gray-500 mt-1 text-center">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Client Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-4">Empresas que confían en nosotros</p>
          <ClientLogosCarousel />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-gray-600 hover:text-gray-400 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
}
