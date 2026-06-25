import React, { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File | string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Unsplash presets that look premium and have distinct backgrounds
  const presets = [
    {
      id: 'portrait',
      label: 'Portrait',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'product',
      label: 'Product',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'pet',
      label: 'Pet',
      url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
    }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onImageSelected(file);
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  // Enable clipboard paste for instant uploads
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          onImageSelected(file);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [onImageSelected]);

  return (
    <div className="uploader-screen">
      <div className="hero-section">
        <h1 className="hero-title">Remove Image Backgrounds Instantly</h1>
        <p className="hero-subtitle" style={{ maxWidth: '700px', margin: '0 auto', opacity: 0.85 }}>
          100% Automatic and Free, AI-Powered BG Remover. Download pictures in Full HD / 4K. custom backdrops, vibrant gradients, and compress images features.

        </p>
      </div>

      <div
        className={`upload-box ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileBrowser}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />

        <div className="upload-icon-wrapper">
          <Upload size={36} />
        </div>

        <button type="button" className="upload-button">
          Upload Image
        </button>

        <div className="upload-hint">
          <p>Drag and drop your image here</p>
          <p style={{ marginTop: '0.25rem', opacity: 0.7, fontSize: '0.8rem' }}>
            Supports PNG, JPEG, WEBP. You can also paste <kbd style={{ background: '#2e303a', padding: '1px 4px', borderRadius: '4px' }}>Ctrl + V</kbd> anywhere!
          </p>
        </div>
      </div>

      <div className="presets-section">
        <p className="presets-title">No image? Try one of these presets</p>
        <div className="presets-grid">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="preset-card"
              onClick={(e) => {
                e.stopPropagation();
                onImageSelected(preset.url);
              }}
            >
              <img src={preset.url} alt={preset.label} loading="lazy" />
              <div className="preset-label">
                <Sparkles size={8} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
                {preset.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
