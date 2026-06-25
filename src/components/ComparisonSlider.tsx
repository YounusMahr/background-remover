import React, { useState, useRef, useEffect } from 'react';

interface ComparisonSliderProps {
  originalUrl: string;
  processedUrl: string;
  backgroundStyle: React.CSSProperties; // The active background (checkerboard, color, gradient, etc.)
  viewMode: 'slider' | 'side-by-side' | 'only-processed';
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalUrl,
  processedUrl,
  backgroundStyle,
  viewMode,
}) => {
  const [clipPosition, setClipPosition] = useState(50); // percentage (0 - 100)
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setClipPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleTouchStart = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  if (viewMode === 'only-processed') {
    return (
      <div className="preview-card-container">
        {/* Render active background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, ...backgroundStyle }} />
        
        <div className="slider-image-base" style={{ zIndex: 2 }}>
          <img src={processedUrl} alt="Processed result" draggable={false} />
        </div>
      </div>
    );
  }

  if (viewMode === 'side-by-side') {
    return (
      <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '960px', height: '100%' }}>
        <div className="preview-card-container" style={{ flex: 1, aspectRatio: 'auto' }}>
          <div className="bg-transparency-grid" />
          <div className="slider-image-base" style={{ zIndex: 2 }}>
            <img src={originalUrl} alt="Original" draggable={false} />
          </div>
          <div className="slider-label before">Original</div>
        </div>
        <div className="preview-card-container" style={{ flex: 1, aspectRatio: 'auto' }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, ...backgroundStyle }} />
          <div className="slider-image-base" style={{ zIndex: 2 }}>
            <img src={processedUrl} alt="Processed" draggable={false} />
          </div>
          <div className="slider-label after">Transparent</div>
        </div>
      </div>
    );
  }

  // Default: Slider view mode
  return (
    <div 
      className="preview-card-container" 
      ref={containerRef}
      style={{ '--clip-position': `${clipPosition}%` } as React.CSSProperties}
    >
      {/* 1. Base layer: The processed image with active custom background style */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, ...backgroundStyle }} />
      <div className="slider-image-base" style={{ zIndex: 2 }}>
        <img src={processedUrl} alt="Processed background removed" draggable={false} />
      </div>

      {/* 2. Overlay layer: The original image, visible on the left side of the divider */}
      {/* No active custom background on this side (keep standard solid/dark layout background) */}
      <div className="bg-transparency-grid" style={{ zIndex: 3, clipPath: `polygon(0 0, ${clipPosition}% 0, ${clipPosition}% 100%, 0 100%)` }} />
      <div 
        className="slider-image-overlay" 
        style={{ zIndex: 4, clipPath: `polygon(0 0, ${clipPosition}% 0, ${clipPosition}% 100%, 0 100%)` }}
      >
        <img src={originalUrl} alt="Original uploaded file" draggable={false} />
      </div>

      {/* 3. Slider Handle Divider Bar */}
      <div className="slider-handle-bar">
        <div 
          className="slider-handle-button"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 'bold' }}>◀</span>
            <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 'bold' }}>▶</span>
          </div>
        </div>
      </div>

      {/* 4. Labels */}
      {clipPosition > 10 && <div className="slider-label before">Original</div>}
      {clipPosition < 90 && <div className="slider-label after">Processed</div>}
    </div>
  );
};
