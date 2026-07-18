import React, { useEffect } from 'react';

interface AdUnitProps {
  client?: string;
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  style?: React.CSSProperties;
}

export const AdUnit: React.FC<AdUnitProps> = ({
  client = '',
  slot = '',
  format = 'auto',
  style = { display: 'block', minHeight: '90px' }
}) => {
  useEffect(() => {
    // Fire adsbygoogle.push() after ad unit is rendered in production
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (e) {
        console.error('Google Adsense push initialization error', e);
      }
    }
  }, []);

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocal) {
    return (
      <div className="ad-placeholder-dev">
        <span className="ad-label">Programmatic Advertisement Slot</span>
        <span className="ad-sublabel">Formats: {format} | Slot ID: {slot || 'Auto'}</span>
      </div>
    );
  }

  return (
    <div className="ad-unit-container">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot || undefined}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};
