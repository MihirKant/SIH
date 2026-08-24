import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'JanSamadhan AI - SIH Societal Innovation & University Routing Engine',
  description: 'AI-driven crowdsourcing platform for societal challenges, HEI department matchmaking, CSR sponsorship, and district analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-cyan-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        
        {/* Sleek Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-300">JanSamadhan AI</span>
              <span>• Smart India Hackathon 2026</span>
            </div>
            <p>Empowering Jharkhand & Pan-India Communities through HEI R&D and Industry Partnerships.</p>
            <div className="flex items-center space-x-4 text-slate-400 font-medium">
              <span>Citizens</span>
              <span>•</span>
              <span>Universities</span>
              <span>•</span>
              <span>CSR Grants</span>
              <span>•</span>
              <span>NEP 2020</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
