import React, { useState, useRef } from 'react';
import { Download, RefreshCw, Sliders, Image as ImageIcon, Palette } from 'lucide-react';

interface EditorPanelProps {
  resolution: 'medium' | 'hd';
  setResolution: (val: 'medium' | 'hd') => void;
  format: 'png' | 'webp' | 'jpeg';
  setFormat: (val: 'png' | 'webp' | 'jpeg') => void;
  compressionEnabled: boolean;
  setCompressionEnabled: (val: boolean) => void;
  quality: number;
  setQuality: (val: number) => void;
  
  backgroundType: 'transparent' | 'solid' | 'gradient' | 'image';
  setBackgroundType: (val: 'transparent' | 'solid' | 'gradient' | 'image') => void;
  backgroundValue: string;
  setBackgroundValue: (val: string) => void;
  
  onDownload: () => void;
  onRestart: () => void;
  originalFileName: string;
  originalSizeText: string;
  isDownloading: boolean;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  resolution,
  setResolution,
  format,
  setFormat,
  compressionEnabled,
  setCompressionEnabled,
  quality,
  setQuality,
  backgroundType,
  setBackgroundType,
  backgroundValue,
  setBackgroundValue,
  onDownload,
  onRestart,
  originalFileName,
  originalSizeText,
  isDownloading,
}) => {
  const [activeTab, setActiveTab] = useState<'bg' | 'export'>('bg');
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Background presets
  const solidColors = [
    '#ffffff', '#000000', '#f3f4f6', '#3b82f6', '#10b981', '#ef4444',
    '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#111827', '#4b5563'
  ];

  const gradients = [
    'linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)', // Sunset
    'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', // Ocean Blue
    'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)', // Pink Purple
    'linear-gradient(135deg, #115e59 0%, #4ade80 100%)', // Emerald Glow
    'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', // Dark Space
    'linear-gradient(135deg, #f472b6 0%, #1e3a8a 100%)'  // Lavender Sky
  ];

  const bgImages = [
    {
      name: 'Modern Office',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Creative Studio',
      url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Forest Blur',
      url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=300&q=80',
    }
  ];

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBackgroundType('image');
          setBackgroundValue(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getFormatLabel = () => {
    switch (format) {
      case 'png': return 'PNG';
      case 'webp': return 'WebP';
      case 'jpeg': return 'JPG';
    }
  };

  const handleBgSelect = (type: 'transparent' | 'solid' | 'gradient' | 'image', value: string) => {
    setBackgroundType(type);
    setBackgroundValue(value);
  };

  return (
    <div className="sidebar-panel">
      {/* Tab Selectors */}
      <div className="background-tabs" style={{ margin: '1rem' }}>
        <button 
          className={`tab-btn ${activeTab === 'bg' ? 'active' : ''}`}
          onClick={() => setActiveTab('bg')}
        >
          <Palette size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          Background
        </button>
        <button 
          className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          <Sliders size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          Export Settings
        </button>
      </div>

      <div className="sidebar-scrollable-content">
        {activeTab === 'bg' && (
          <>
            <div>
              <p className="sidebar-section-title">Background Style</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button 
                  className={`preview-action-btn ${backgroundType === 'transparent' ? 'active' : ''}`}
                  onClick={() => handleBgSelect('transparent', '')}
                  style={{ flex: 1 }}
                >
                  Transparent
                </button>
                <button 
                  className={`preview-action-btn ${backgroundType === 'solid' ? 'active' : ''}`}
                  onClick={() => handleBgSelect('solid', '#ffffff')}
                  style={{ flex: 1 }}
                >
                  Solid Color
                </button>
                <button 
                  className={`preview-action-btn ${backgroundType === 'gradient' ? 'active' : ''}`}
                  onClick={() => handleBgSelect('gradient', gradients[0])}
                  style={{ flex: 1 }}
                >
                  Gradient
                </button>
                <button 
                  className={`preview-action-btn ${backgroundType === 'image' ? 'active' : ''}`}
                  onClick={() => handleBgSelect('image', bgImages[0].url)}
                  style={{ flex: 1 }}
                >
                  Image
                </button>
              </div>
            </div>

            {/* Render conditional options based on selected type */}
            {backgroundType === 'transparent' && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1.25rem', 
                backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: '600', fontSize: '0.95rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                  <span>Transparent Cutout Active</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Your subject has been cleanly isolated with transparent edges. Ready for export.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-success)' }}>✓</span>
                    <span>Lossless alpha channel transparency</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-success)' }}>✓</span>
                    <span>Ready for web design, print, and branding</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-success)' }}>✓</span>
                    <span>Direct copy-paste to Figma, Canva & Photoshop</span>
                  </div>
                </div>
              </div>
            )}

            {backgroundType === 'solid' && (
              <div>
                <p className="sidebar-section-title">Solid Colors</p>
                <div className="color-picker-input-wrapper">
                  <label htmlFor="custom-color-picker">Choose custom color:</label>
                  <input 
                    type="color" 
                    id="custom-color-picker"
                    className="color-picker-input"
                    value={backgroundValue.startsWith('#') ? backgroundValue : '#ffffff'} 
                    onChange={(e) => handleBgSelect('solid', e.target.value)}
                  />
                </div>
                <div className="swatch-grid">
                  {solidColors.map((color) => (
                    <div 
                      key={color}
                      className={`swatch-item ${backgroundType === 'solid' && backgroundValue.toLowerCase() === color.toLowerCase() ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleBgSelect('solid', color)}
                    />
                  ))}
                </div>
              </div>
            )}

            {backgroundType === 'gradient' && (
              <div>
                <p className="sidebar-section-title">Linear Gradients</p>
                <div className="swatch-grid">
                  {gradients.map((grad, index) => (
                    <div 
                      key={index}
                      className={`swatch-item ${backgroundType === 'gradient' && backgroundValue === grad ? 'active' : ''}`}
                      style={{ background: grad }}
                      onClick={() => handleBgSelect('gradient', grad)}
                    />
                  ))}
                </div>
              </div>
            )}

            {backgroundType === 'image' && (
              <div style={{ display: 'flex', flex: 'col', gap: '1rem', flexDirection: 'column' }}>
                <div>
                  <p className="sidebar-section-title">Preset Landscapes</p>
                  <div className="presets-grid" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                    {bgImages.map((img, index) => (
                      <div 
                        key={index}
                        className={`preset-card ${backgroundType === 'image' && backgroundValue === img.url ? 'active-border' : ''}`}
                        onClick={() => handleBgSelect('image', img.url)}
                        style={{ 
                          width: '72px', 
                          height: '72px',
                          border: backgroundValue === img.url ? '2px solid var(--accent-primary)' : '2px solid transparent'
                        }}
                      >
                        <img src={img.url} alt={img.name} />
                        <div className="preset-label" style={{ fontSize: '0.55rem' }}>{img.name.split(' ')[1]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="sidebar-section-title">Upload Custom Backdrop</p>
                  <div className="bg-upload-card" onClick={() => bgInputRef.current?.click()}>
                    <input 
                      type="file" 
                      ref={bgInputRef} 
                      onChange={handleCustomBgUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <ImageIcon size={20} className="text-secondary" />
                    <span className="bg-upload-card-text">Select backdrop image</span>
                    <span className="bg-upload-card-subtext">JPEG, PNG, WEBP</span>
                  </div>
                </div>
              </div>
            )}

            {backgroundType !== 'transparent' && (
              <div>
                <p className="sidebar-section-title">Current Backdrop</p>
                <div className="bg-active-preview">
                  <div 
                    className="bg-active-thumbnail" 
                    style={{ 
                      background: backgroundType === 'solid' ? backgroundValue : backgroundType === 'gradient' ? backgroundValue : `url(${backgroundValue})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} 
                  />
                  <div className="bg-active-info">
                    <span className="bg-active-name">
                      {backgroundType === 'solid' ? 'Solid Color' : backgroundType === 'gradient' ? 'Gradient Fill' : 'Custom Image'}
                    </span>
                    <span className="bg-active-type">
                      {backgroundType === 'solid' ? backgroundValue : backgroundType === 'gradient' ? 'Linear Transition' : 'Cover Fit'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'export' && (
          <>
            {/* Resolution Selector */}
            <div>
              <p className="sidebar-section-title">Export Resolution</p>
              <div className="segmented-control">
                <button 
                  className={`segmented-btn ${resolution === 'medium' ? 'active' : ''}`}
                  onClick={() => setResolution('medium')}
                >
                  <span>Medium</span>
                  <span className="segmented-btn-sub">Max 1200px</span>
                </button>
                <button 
                  className={`segmented-btn ${resolution === 'hd' ? 'active' : ''}`}
                  onClick={() => setResolution('hd')}
                >
                  <span>Full HD</span>
                  <span className="segmented-btn-sub">Original Quality</span>
                </button>
              </div>
            </div>

            {/* Export Format */}
            <div>
              <p className="sidebar-section-title">Export Format</p>
              <div className="segmented-control">
                <button 
                  className={`segmented-btn ${format === 'png' ? 'active' : ''}`}
                  onClick={() => {
                    setFormat('png');
                    // PNG does not support canvas compression standardly in a useful way, disable or warn
                  }}
                >
                  <span>PNG</span>
                  <span className="segmented-btn-sub">Lossless</span>
                </button>
                <button 
                  className={`segmented-btn ${format === 'webp' ? 'active' : ''}`}
                  onClick={() => setFormat('webp')}
                >
                  <span>WebP</span>
                  <span className="segmented-btn-sub">Best Size</span>
                </button>
                <button 
                  className={`segmented-btn ${format === 'jpeg' ? 'active' : ''}`}
                  onClick={() => {
                    setFormat('jpeg');
                    if (backgroundType === 'transparent') {
                      // JPEG doesn't support transparency, auto switch background style or let canvas composite standard white
                    }
                  }}
                >
                  <span>JPEG</span>
                  <span className="segmented-btn-sub">Standard</span>
                </button>
              </div>
              
              {format === 'jpeg' && backgroundType === 'transparent' && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#f87171' }}>
                  ⚠️ JPEG does not support transparency. White background will be applied.
                </div>
              )}
            </div>

            {/* Compression Slider Toggle & Setting */}
            <div>
              <div className="control-row-toggle">
                <div className="toggle-label-wrapper">
                  <span className="toggle-title">Compress Image</span>
                  <span className="toggle-subtitle">Reduce file size at download</span>
                </div>
                <input 
                  type="checkbox"
                  checked={compressionEnabled}
                  onChange={(e) => setCompressionEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  disabled={format === 'png'} // PNG compression not supported natively by canvas.toBlob()
                />
              </div>

              {format === 'png' && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Note: Custom compression quality is not applicable for lossless PNG exports.
                </div>
              )}

              {compressionEnabled && format !== 'png' && (
                <div className="slider-group">
                  <div className="slider-group-header">
                    <span>Export Quality</span>
                    <span className="slider-group-value">{Math.round(quality * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="custom-range"
                  />
                  <div className="compression-info-savings">
                    {quality < 0.5 ? '⚡ Extreme compression (small file)' : quality < 0.85 ? '✓ Balanced quality and size' : '💎 Premium high-quality output'}
                  </div>
                </div>
              )}
            </div>

            {/* Metadata Summary */}
            <div style={{ backgroundColor: 'rgba(0,0,0,0.15)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
              <p style={{ fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Original Image Info:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', color: 'var(--text-muted)' }}>
                <div>File name: <span style={{ color: 'var(--text-secondary)' }}>{originalFileName}</span></div>
                <div>Original size: <span style={{ color: 'var(--text-secondary)' }}>{originalSizeText}</span></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action footer */}
      <div className="sidebar-actions">
        <button 
          className="btn-primary" 
          onClick={onDownload}
          disabled={isDownloading}
        >
          <Download size={18} />
          {isDownloading ? 'Compositing...' : `Download ${getFormatLabel()} (${resolution === 'hd' ? 'Full HD' : 'Medium'})`}
        </button>
        <button className="btn-secondary" onClick={onRestart}>
          <RefreshCw size={14} />
          Upload New Image
        </button>
      </div>
    </div>
  );
};
