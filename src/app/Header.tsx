'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="app-header">
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div className="logo-container">
          <svg className="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="m14 10-4 4"/>
            <path d="m10 10 4 4"/>
          </svg>
          <span className="logo-text">ClearBG</span>
          <span className="logo-badge">Pro</span>
        </div>
      </Link>
      
      <nav className="header-nav">
        <Link href="/" className={`header-nav-link ${pathname === '/' ? 'active' : ''}`}>
          Remover
        </Link>
        <Link href="/blog" className={`header-nav-link ${pathname.startsWith('/blog') ? 'active' : ''}`}>
          Resources
        </Link>
        <Link href="/contact" className={`header-nav-link ${pathname === '/contact' ? 'active' : ''}`}>
          Contact
        </Link>
      </nav>
      
      <div className="privacy-badge">
        <div className="privacy-dot" />
        <span>AI-Powered</span>
      </div>
    </header>
  );
}
