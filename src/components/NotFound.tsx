import React from 'react';
import Link from 'next/link';

export const NotFound: React.FC = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <span className="error-code">404</span>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist, has been removed, or has had its name changed. Please use the navigation links below to return to our primary tools.</p>
        <div className="notfound-actions">
          <Link href="/" className="notfound-btn primary">Background Remover</Link>
          <Link href="/blog" className="notfound-btn secondary">Read the Blog</Link>
        </div>
      </div>
    </div>
  );
};
