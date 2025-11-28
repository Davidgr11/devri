/**
 * Home Page - Landing Page
 * Main landing page with all sections
 */

'use client';

import { useEffect } from 'react';
import { HeroSection } from '@/components/marketing/HeroSection';
import { ServicesSection } from '@/components/marketing/ServicesSection';
import { WhyChooseUsSection } from '@/components/marketing/WhyChooseUsSection';
import { FAQsSection } from '@/components/marketing/FAQsSection';
import { ContactSection } from '@/components/marketing/ContactSection';

export default function HomePage() {
  // Prevent auto-scroll on page load
  useEffect(() => {
    // Only scroll to top if there's no hash in the URL
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <FAQsSection />
      <ContactSection />
    </>
  );
}
