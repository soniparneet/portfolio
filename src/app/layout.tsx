import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { publication } from '../lib/publication.mjs';
import { Header, Footer } from '../components/site';
import './globals.css';
import { profile } from '../content/profile';

const manrope = localFont({ src: '../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2', variable: '--font-manrope', display: 'swap', weight: '200 800' });
const settings = publication();
export const metadata: Metadata = {
  title: { default: 'Parneet Soni - Product & Strategy', template: '%s | Parneet Soni' },
  description: `${profile.headline} Explore Parneet Soni’s work at Uber, Oportun, and BYJU’S.`,
  ...(settings.origin ? { metadataBase: new URL(settings.origin) } : {}),
  robots: { index: settings.indexable, follow: settings.indexable },
  openGraph: { type: 'website', siteName: 'Parneet Soni', locale: 'en_US', ...(settings.origin ? { images: [{ url: `${settings.origin}/social-card.png`, width: 1200, height: 630, alt: `Parneet Soni - ${profile.headline}` }] } : {}) },
  twitter: { card: 'summary_large_image' },
};
export const viewport: Viewport = { themeColor: '#f7f7f0' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={manrope.variable}><body id="top"><a href="#main" className="skip-link">Skip to content</a><Header resumeAvailable={settings.resumeAvailable} />{children}<Footer /></body></html>;
}
