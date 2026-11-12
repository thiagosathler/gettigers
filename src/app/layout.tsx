import type { Metadata } from 'next';
import './globals.css';
import { I18nProvider } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'GetTigers.net — Florida\'s Local Services & Pros Marketplace',
  description: 'Find trusted local handymen, cleaning, painting and autonomous pros across Florida (Orlando, Miami, Tampa). Direct WhatsApp & SMS contact in EN, PT, ES.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <I18nProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
