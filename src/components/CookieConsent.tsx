import React, { useState, useEffect } from 'react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('bgcleaner-cookie-consent');
    if (!consent) {
      // Small delay before sliding in
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice: 'accepted' | 'declined') => {
    localStorage.setItem('bgcleaner-cookie-consent', choice);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-consent-body">
        <p>
          We use cookies to personalize content and ads, analyze traffic, and improve our services. By clicking "Accept All", you consent to our use of functional and advertising cookies. You can read details in our <a href="/cookies">Cookie Policy</a>.
        </p>
        <div className="cookie-consent-actions">
          <button onClick={() => handleConsent('accepted')} className="cookie-btn accept">Accept All</button>
          <button onClick={() => handleConsent('declined')} className="cookie-btn decline">Decline</button>
        </div>
      </div>
    </div>
  );
};
