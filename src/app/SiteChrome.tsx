'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { CookieConsent } from '../components/CookieConsent';

interface SiteChromeProps {
  children: React.ReactNode;
  footerTagline: string;
  siteName: string;
}

/**
 * Wraps page content with the public site header, footer, and cookie banner.
 * On admin routes it renders the children bare so the dashboard gets its own
 * full-screen shell with no marketing chrome.
 */
export function SiteChrome({ children, footerTagline, siteName }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
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
        <p>© {new Date().getFullYear()} {siteName}. {footerTagline}</p>
      </footer>

      <CookieConsent />
    </div>
  );
}
