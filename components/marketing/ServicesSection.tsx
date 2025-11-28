/**
 * Services Section
 * Complex tabs system - Primary and Secondary categories
 * THE MOST IMPORTANT SECTION
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { getServiceCategories } from '@/lib/supabase/queries';
import { Button } from '@/components/ui';
import type { ServiceCategoryWithChildren } from '@/types';

// Dynamic icon component
function DynamicIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null;

  const Icon = (Icons as any)[name];
  if (!Icon) return null;

  return <Icon className={className} />;
}

export function ServicesSection() {
  const [categories, setCategories] = useState<ServiceCategoryWithChildren[]>([]);
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getServiceCategories()
      .then((data) => {
        setCategories(data);
        // Auto-select first active primary and its first child
        if (data.length > 0) {
          setSelectedPrimary(data[0].id);
          if (data[0].children && data[0].children.length > 0) {
            setSelectedSecondary(data[0].children[0].id);
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading categories:', error);
        setIsLoading(false);
      });
  }, []);

  const currentPrimaryCategory = categories.find((c) => c.id === selectedPrimary);
  const secondaryCategories = currentPrimaryCategory?.children || [];
  const currentSecondaryCategory = secondaryCategories.find((c) => c.id === selectedSecondary);

  const handlePrimaryChange = (primaryId: string) => {
    setSelectedPrimary(primaryId);
    const newPrimary = categories.find((c) => c.id === primaryId);
    if (newPrimary?.children && newPrimary.children.length > 0) {
      setSelectedSecondary(newPrimary.children[0].id);
    } else {
      setSelectedSecondary(null);
    }
  };

  if (isLoading) {
    return (
      <section id="servicios" className="py-16 md:py-24 bg-gray-50 scroll-mt-16 md:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">Cargando servicios...</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section id="servicios" className="py-16 md:py-24 bg-gray-50 scroll-mt-16 md:scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Soluciones diseñadas para ti
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            ¿Con cuál te identificas?
          </p>
        </div>

        {/* Primary Tabs - Horizontal buttons on both mobile and desktop */}
        <div className="mb-8">
          {/* Desktop */}
          <div className="hidden md:flex justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handlePrimaryChange(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedPrimary === category.id
                    ? 'bg-accent text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-secondary'
                }`}
              >
                <DynamicIcon name={category.icon || 'Code'} className="w-5 h-5" />
                {category.name}
              </button>
            ))}
          </div>

          {/* Mobile - Buttons Grid */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handlePrimaryChange(category.id)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedPrimary === category.id
                    ? 'bg-accent text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-secondary'
                }`}
              >
                <DynamicIcon name={category.icon || 'Code'} className="w-5 h-5" />
                <span className="text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {currentPrimaryCategory && (
          <div className="grid md:grid-cols-12 gap-6 md:gap-8">
            {/* Secondary Tabs - Desktop: Vertical Left, Mobile: Vertical Right Sticky */}
            {secondaryCategories.length > 0 ? (
              <>
                {/* Desktop - Vertical Tabs with Icons */}
                <div className="hidden md:block md:col-span-4 lg:col-span-3">
                  <div className="space-y-2">
                    {secondaryCategories.map((secondary) => (
                      <button
                        key={secondary.id}
                        onClick={() => setSelectedSecondary(secondary.id)}
                        className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                          selectedSecondary === secondary.id
                            ? 'bg-accent text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-secondary'
                        }`}
                      >
                        <DynamicIcon name={secondary.icon || 'Code'} className="w-5 h-5 flex-shrink-0" />
                        <span>{secondary.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Panel with Mobile Secondary Tabs */}
                <div className="md:col-span-8 lg:col-span-9 relative">
                  {/* Mobile - Vertical Icon-Only Tabs (Sticky Right) */}
                  <div className="md:hidden absolute right-0 top-0 bottom-0 flex flex-col gap-2 z-10 pr-2">
                    {secondaryCategories.map((secondary) => (
                      <button
                        key={secondary.id}
                        onClick={() => setSelectedSecondary(secondary.id)}
                        className={`p-3 rounded-lg transition-all duration-300 ${
                          selectedSecondary === secondary.id
                            ? 'bg-accent text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-secondary'
                        }`}
                        title={secondary.name}
                      >
                        <DynamicIcon name={secondary.icon || 'Code'} className="w-5 h-5" />
                      </button>
                    ))}
                  </div>

                  {/* Content Panel */}
                  <AnimatePresence mode="wait">
                    {currentSecondaryCategory && (
                      <motion.div
                        key={currentSecondaryCategory.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl p-6 md:p-8 shadow-lg pr-16 md:pr-8"
                      >
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                          {currentSecondaryCategory.name}
                        </h3>

                        {currentSecondaryCategory.callout && (
                          <div className="mb-4 p-4 bg-accent/10 border-l-4 border-accent rounded-r-lg">
                            <p className="text-lg font-semibold text-accent-dark">
                              {currentSecondaryCategory.callout}
                            </p>
                          </div>
                        )}

                        <div className="prose prose-lg max-w-none mb-6">
                          <p className="text-gray-600">
                            {currentSecondaryCategory.description}
                          </p>
                        </div>

                        {currentSecondaryCategory.demo_slug && (
                          <Link href={`/demos/${currentSecondaryCategory.demo_slug}`}>
                            <Button className='bg-secondary text-dark hover:bg-accent-light'>Ver Demo</Button>
                          </Link>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="col-span-12 bg-white rounded-xl p-8 text-center">
                <p className="text-gray-600 text-lg">
                  Próximamente nuevas soluciones para esta categoría.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
