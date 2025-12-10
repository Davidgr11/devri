/**
 * 404 Not Found Page
 * Custom error page with auto-redirect to home
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Handle redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      router.push('/');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          <h1 className="text-[150px] sm:text-[200px] md:text-[250px] font-bold leading-none">
            <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent animate-pulse-soft">
              404
            </span>
          </h1>
        </motion.div>

        {/* Search Icon Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <Search className="w-16 h-16 text-accent" />
            <motion.div
              className="absolute inset-0 bg-accent/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            ¡Ups! Página no encontrada
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-2">
            Parece que esta página se fue de vacaciones sin avisar.
          </p>
          <p className="text-base sm:text-lg text-gray-400">
            No te preocupes, te llevaremos de vuelta al inicio.
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-12"
        >
          <div className="inline-block bg-gray-800/50 backdrop-blur-sm border border-accent/30 rounded-2xl px-8 py-4">
            <p className="text-gray-300 text-sm sm:text-base mb-2">
              Redireccionando al inicio en:
            </p>
            <div className="flex items-center justify-center gap-3">
              <motion.div
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent"
              >
                {countdown}
              </motion.div>
              <span className="text-2xl sm:text-3xl text-gray-400">
                {countdown === 1 ? 'segundo' : 'segundos'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/">
            <Button
              size="lg"
              className="group bg-accent hover:bg-accent-dark transition-all duration-300 shadow-lg hover:shadow-accent/50 min-w-[200px]"
            >
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Volver al Inicio
            </Button>
          </Link>

          <button
            onClick={() => router.back()}
            className="group px-6 py-3 text-white border border-gray-600 hover:border-secondary hover:bg-secondary/10 rounded-lg transition-all duration-300 min-w-[200px]"
          >
            <ArrowLeft className="w-5 h-5 inline mr-2 group-hover:-translate-x-1 transition-transform" />
            Página Anterior
          </button>
        </motion.div>

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 text-gray-500 text-sm"
        >
          ¿Necesitas ayuda? Contáctanos en{' '}
          <a
            href="mailto:info@devri.com.mx"
            className="text-accent hover:text-accent-dark underline transition-colors"
          >
            info@devri.com.mx
          </a>
        </motion.p>
      </div>
    </div>
  );
}
