import '../index.css';
import dbConnect from '../lib/mongodb';
import SettingsModel from '../models/Settings';
import Link from 'next/link';

const Settings = SettingsModel as any;

import { Header } from './Header';
import { CookieConsent } from '../components/CookieConsent';
import initialSettings from '../data/settings.json';

import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bgcleaner.online';
const SITE_NAME = 'ClearBG Pro';
const DEFAULT_TITLE = 'ClearBG Pro - Free Private Background Remover';
const DEFAULT_DESCRIPTION =
  'ClearBG Pro removes backgrounds from images instantly and automatically. 100% private, processing entirely in the browser using WebAssembly. Export in Full HD, WebP, JPEG, PNG.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Child pages set their own full title (e.g. "About Us - ClearBG Pro"),
  // so we use a plain default rather than a template to avoid a doubled suffix.
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function getSettings() {
  try {
    await dbConnect();
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create(initialSettings);
    }
    return settings.toObject();
  } catch (error) {
    console.error('Failed to load settings in layout:', error);
    return initialSettings;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <head>
        {/* Google Analytics Script */}
        {settings.googleAnalyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}

        {/* Google AdSense verification + script */}
        {settings.googleAdsenseClientId && (
          <>
            <meta name="google-adsense-account" content={settings.googleAdsenseClientId} />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.googleAdsenseClientId}`}
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body>
        <div className="app-container">
          <Header />
          <main className="main-workspace">{children}</main>
          
          <footer className="app-footer">
            <nav className="footer-nav">
              <Link href="/about" className="footer-nav-link">About Us</Link>
              <Link href="/contact" className="footer-nav-link">Contact Us</Link>
              <Link href="/privacy" className="footer-nav-link">Privacy Policy</Link>
              <Link href="/terms" className="footer-nav-link">Terms of Service</Link>
              <Link href="/disclaimer" className="footer-nav-link">Disclaimer</Link>
              <Link href="/cookies" className="footer-nav-link">Cookie Policy</Link>
            </nav>
            <p>© 2026 ClearBG Pro (bgcleaner.online). Completely Private client-side background removal. Supported formats: PNG, JPEG, WEBP.</p>
          </footer>
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}
