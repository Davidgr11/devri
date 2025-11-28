/**
 * Testimonials Carousel
 * Auto-scrolling carousel with testimonials
 */

'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, User } from 'lucide-react';
import Image from 'next/image';
import type { Testimonial } from '@/types';

interface Props {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  if (!currentTestimonial) return null;

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Testimonial Card */}
      <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-center">
        {/* Stars */}
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < currentTestimonial.rating
                  ? 'text-accent fill-accent'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-md md:text-xl text-gray-200 mb-6 italic">
          "{currentTestimonial.quote}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center justify-center gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {currentTestimonial.image_url ? (
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-tertiary-light">
                <Image
                  src={currentTestimonial.image_url}
                  alt={currentTestimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-tertiary-light/20 border-2 border-tertiary-light flex items-center justify-center">
                <User className="w-7 h-7 text-tertiary-light" />
              </div>
            )}
          </div>

          {/* Name and Business */}
          <div className="text-left">
            <p className="font-semibold text-tertiary-light">{currentTestimonial.name}</p>
            {currentTestimonial.business_name && (
              <p className="text-sm text-gray-300">{currentTestimonial.business_name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>

      {/* Dots Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-accent w-8' : 'bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
