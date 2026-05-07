'use client';

import { useEffect } from 'react';
import { HeroSection } from '@/components/marketing/HeroSection';
import { ServicesSection } from '@/components/marketing/ServicesSection';
import { ProjectsSection } from '@/components/marketing/ProjectsSection';
import { WhyChooseUsSection } from '@/components/marketing/WhyChooseUsSection';
import { ProcessTimeline } from '@/components/marketing/ProcessTimeline';
import { FAQsSection } from '@/components/marketing/FAQsSection';
import { ContactSection } from '@/components/marketing/ContactSection';

export default function HomePage() {
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProjectsSection />
      <WhyChooseUsSection />
      <ProcessTimeline />
      <FAQsSection />
      <ContactSection />
    </>
  );
}
