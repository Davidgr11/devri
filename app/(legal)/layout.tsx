import { Navbar } from '@/components/shared/Navbar';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B0D14]">
        {children}
      </main>
    </>
  );
}
