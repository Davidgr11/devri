'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFAQs } from '@/lib/supabase/queries';
import type { FAQ } from '@/types';

export function FAQsSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    getFAQs().then(setFaqs).catch(console.error);
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (faqs.length === 0) return null;

  const whatsappNumber = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '';

  return (
    <section id="faqs" className="py-20 md:py-28 bg-[#0B0D14] relative scroll-mt-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary-dark/20 bg-secondary-dark/5 text-secondary text-xs font-medium mb-4 uppercase tracking-wider">
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-400 text-lg">
            Todo lo que necesitas saber antes de empezar
          </p>
        </motion.div>

        {/* FAQs List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'border-accent/30 bg-accent/5' : 'border-white/7 bg-white/2 hover:border-white/12'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 group"
              >
                <span className={`font-semibold text-base leading-snug transition-colors ${openIndex === index ? 'text-accent-light' : 'text-white group-hover:text-gray-200'}`}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className={`w-5 h-5 transition-colors ${openIndex === index ? 'text-accent' : 'text-gray-500'}`} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-400 leading-relaxed text-sm border-t border-white/5 pt-4 text-justify">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-500 text-sm mb-4">¿Tu pregunta no está aquí?</p>
          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hola,%20tengo%20una%20pregunta%20sobre%20sus%20servicios`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-whatsapp/10 border border-whatsapp/20 text-whatsapp hover:bg-whatsapp/15 transition-colors font-medium text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Pregúntanos por WhatsApp
            </a>
          ) : (
            <button
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-colors font-medium text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Escríbenos directo
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
