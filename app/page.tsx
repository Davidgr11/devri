/**
 * Home Page - Landing Page
 * Main landing page with all sections
 */

import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { PageLoader } from '@/components/shared/PageLoader';
import { HeroSection } from '@/components/marketing/HeroSection';
import { ServicesSection } from '@/components/marketing/ServicesSection';
import { WhyChooseUsSection } from '@/components/marketing/WhyChooseUsSection';
import { FAQsSection } from '@/components/marketing/FAQsSection';
import { ContactSection } from '@/components/marketing/ContactSection';

export default function HomePage() {
  return (
    <>
      <PageLoader />
      <Navbar />
      <main className="min-h-screen pt-16 md:pt-20">
        <HeroSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <FAQsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
