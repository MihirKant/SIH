import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/MobileBottomNav';
import PwaInstallBanner from '@/components/PwaInstallBanner';
import { AuthProvider } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

export const viewport: Viewport = {
  themeColor: '#166534',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'JanSamadhan | जन समाधान — Jharkhand Societal Innovation Portal',
  description:
    'A unified AI-driven platform connecting citizens with universities and industry to crowdsource, research, and solve societal challenges across Jharkhand.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'JanSamadhan',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-green-200 selection:text-green-900 pb-16 lg:pb-0">
        <AuthProvider>
          <PwaInstallBanner />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <AuthModal />
          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}

