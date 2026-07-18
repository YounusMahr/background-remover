'use client';

import React, { useState, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { ComparisonSlider } from './ComparisonSlider';
import { EditorPanel } from './EditorPanel';
import { AdUnit } from './AdUnit';
import initialSettings from '../data/settings.json';

const applyEdgeDefringe = async (blob: Blob): Promise<Blob> => {
  try {
    const img = new Image();
    const blobUrl = URL.createObjectURL(blob);
    img.src = blobUrl;
    await img.decode();
    
    const canvas = document.createElement('canvas');
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(blobUrl);
      return blob;
    }
    
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    
    const alphaMap = new Uint8Array(width * height);
    for (let i = 0; i < data.length; i += 4) {
      alphaMap[i / 4] = data[i + 3];
    }
    
    const isNearTransparent = (x: number, y: number, radius: number): boolean => {
      const minX = Math.max(0, x - radius);
      const maxX = Math.min(width - 1, x + radius);
      const minY = Math.max(0, y - radius);
      const maxY = Math.min(height - 1, y + radius);
      
      for (let ny = minY; ny <= maxY; ny++) {
        const rowOffset = ny * width;
        for (let nx = minX; nx <= maxX; nx++) {
          if (alphaMap[rowOffset + nx] === 0) {
            return true;
          }
        }
      }
      return false;
    };
    
    for (let y = 0; y < height; y++) {
      const rowOffset = y * width;
      for (let x = 0; x < width; x++) {
        const i = (rowOffset + x) * 4;
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const a = data[i+3];
        
        if (a > 0 && a < 255) {
          if (isNearTransparent(x, y, 3)) {
            let newA = a;
            if (a < 185) {
              newA = Math.max(0, a - 35);
            }
            const brightness = (r + g + b) / 3;
            if (brightness > 200) {
              const factor = (brightness - 200) / 55;
              newA = Math.max(0, newA * (1 - factor * 0.85));
            }
            data[i+3] = Math.round(newA);
          }
        }
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
    URL.revokeObjectURL(blobUrl);
    
    return new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || blob), 'image/png');
    });
  } catch (e) {
    console.error("Edge defringing failed, using raw cutout", e);
    return blob;
  }
};

export default function MainTool() {
  const [settings, setSettings] = useState<any>(initialSettings);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string>('');
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'only-processed'>('slider');

  const [backgroundType, setBackgroundType] = useState<'transparent' | 'solid' | 'gradient' | 'image'>('transparent');
  const [backgroundValue, setBackgroundValue] = useState<string>('');

  const [resolution, setResolution] = useState<'medium' | 'hd'>('hd');
  const [format, setFormat] = useState<'png' | 'webp' | 'jpeg'>('png');
  const [compressionEnabled, setCompressionEnabled] = useState<boolean>(false);
  const [quality, setQuality] = useState<number>(0.8);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (e) {
        console.log('Using static settings fallback configuration');
      }
    };
    loadSettings();
  }, []);

  const getFileSizeText = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePresetSelected = async (url: string) => {
    try {
      setIsProcessing(true);
      setProgress(15);
      setProgressMessage("Fetching sample image...");
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network error loading preset");
      
      const blob = await response.blob();
      const filename = url.split('/').pop()?.split('?')[0] || 'sample.jpg';
      const file = new File([blob], filename, { type: blob.type });
      
      handleImageSelected(file);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch preset image. Please check your internet connection.");
      setIsProcessing(false);
    }
  };

  const handleImageSelected = (fileOrUrl: File | string) => {
    setError('');
    
    if (typeof fileOrUrl === 'string') {
      handlePresetSelected(fileOrUrl);
      return;
    }

    const file = fileOrUrl;
    setOriginalFile(file);
    
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    
    const localUrl = URL.createObjectURL(file);
    setOriginalUrl(localUrl);
    setProcessedUrl('');
    
    processImageBackground(file);
  };

  const processImageBackground = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setProgressMessage("Downloading AI model (~8MB on first run)...");
    
    try {
      const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
      const config = {
        model: (isMobile ? 'isnet_quint8' : 'isnet_fp16') as any,
        progress: (key: string, current: number, total: number) => {
          const percentage = Math.round((current / total) * 100);
          setProgress(percentage);
          
          if (key.includes('fetch')) {
            setProgressMessage(`Downloading AI model resources (${percentage}%)`);
          } else if (key.includes('onnx')) {
            setProgressMessage(`Loading neural network modules (${percentage}%)`);
          } else {
            setProgressMessage(`Removing background... (${percentage}%)`);
          }
        }
      };

      const resultBlob = await removeBackground(file, config);
      setProgressMessage("Defringing edges for HD quality...");
      const defringedBlob = await applyEdgeDefringe(resultBlob);
      const localResultUrl = URL.createObjectURL(defringedBlob);
      
      setProcessedUrl(localResultUrl);
      setIsProcessing(false);
    } catch (err: any) {
      console.error("Background removal error:", err);
      let errorMessage = err?.message || "An unexpected error occurred while processing the image.";
      
      if (!window.crossOriginIsolated) {
        errorMessage = "Security Error: Cross-Origin Isolation is disabled. This browser application runs client-side AI using WebAssembly, which requires a secure context (HTTPS or localhost). If you are accessing this over a local network IP, please use localhost, or host the site with HTTPS to enable WebAssembly support.";
      } else if (errorMessage.toLowerCase().includes("fetch") || errorMessage.toLowerCase().includes("failed to fetch")) {
        errorMessage = "Download Error: Failed to fetch AI model weights. Please check your internet connection and reload the page.";
      }
      
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!processedUrl || !originalFile) return;
    setIsDownloading(true);

    try {
      const img = new Image();
      img.src = processedUrl;
      await img.decode();

      let exportW = img.naturalWidth;
      let exportH = img.naturalHeight;

      if (resolution === 'medium') {
        const maxDim = 1200;
        if (exportW > maxDim || exportH > maxDim) {
          if (exportW > exportH) {
            exportH = Math.round((exportH * maxDim) / exportW);
            exportW = maxDim;
          } else {
            exportW = Math.round((exportW * maxDim) / exportH);
            exportH = maxDim;
          }
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = exportW;
      canvas.height = exportH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not construct 2D rendering canvas context");

      if (backgroundType === 'solid') {
        ctx.fillStyle = backgroundValue;
        ctx.fillRect(0, 0, exportW, exportH);
      } else if (backgroundType === 'gradient') {
        const gradientMap: Record<string, string[]> = {
          'linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)': ['#f59e0b', '#e11d48'],
          'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)': ['#06b6d4', '#3b82f6'],
          'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)': ['#a78bfa', '#ec4899'],
          'linear-gradient(135deg, #115e59 0%, #4ade80 100%)': ['#115e59', '#4ade80'],
          'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)': ['#0f172a', '#1e1b4b'],
          'linear-gradient(135deg, #f472b6 0%, #1e3a8a 100%)': ['#f472b6', '#1e3a8a'],
        };
        const stops = gradientMap[backgroundValue] || ['#6366f1', '#a5b4fc'];
        const gradient = ctx.createLinearGradient(0, 0, exportW, exportH);
        gradient.addColorStop(0, stops[0]);
        gradient.addColorStop(1, stops[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, exportW, exportH);
      } else if (backgroundType === 'image') {
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = backgroundValue;
        await bgImg.decode();

        const bgAspect = bgImg.naturalWidth / bgImg.naturalHeight;
        const canvasAspect = exportW / exportH;
        let drawW = exportW;
        let drawH = exportH;
        let drawX = 0;
        let drawY = 0;

        if (bgAspect > canvasAspect) {
          drawW = exportH * bgAspect;
          drawX = (exportW - drawW) / 2;
        } else {
          drawH = exportW / bgAspect;
          drawY = (exportH - drawH) / 2;
        }
        ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
      } else {
        if (format === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, exportW, exportH);
        }
      }

      ctx.drawImage(img, 0, 0, exportW, exportH);

      const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const compressionQuality = compressionEnabled && format !== 'png' ? quality : 1.0;

      canvas.toBlob((blob) => {
        if (!blob) {
          setError("Canvas rendering failed. Please try again.");
          setIsDownloading(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        const originalName = originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) || originalFile.name;
        const extension = format === 'jpeg' ? 'jpg' : format === 'webp' ? 'webp' : 'png';
        
        a.href = url;
        a.download = `${originalName}_no_bg.${extension}`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsDownloading(false);
        }, 100);
      }, mimeType, compressionQuality);

    } catch (err: any) {
      console.error(err);
      setError("Failed to export image: " + err.message);
      setIsDownloading(false);
    }
  };

  const handleRestart = () => {
    setOriginalFile(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setOriginalUrl('');
    setProcessedUrl('');
    setError('');
  };

  const getBackgroundStyle = () => {
    if (backgroundType === 'transparent') {
      return {
        backgroundImage: `
          linear-gradient(45deg, #1d202b 25%, transparent 25%), 
          linear-gradient(-45deg, #1d202b 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, #1d202b 75%), 
          linear-gradient(-45deg, transparent 75%, #1d202b 75%)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        backgroundColor: '#14161f'
      };
    }
    if (backgroundType === 'solid') {
      return { backgroundColor: backgroundValue };
    }
    if (backgroundType === 'gradient') {
      return { background: backgroundValue };
    }
    if (backgroundType === 'image') {
      return { 
        backgroundImage: `url(${backgroundValue})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    return {};
  };

  return (
    <>
      {error && (
        <div style={{ padding: '1rem 1rem 0' }}>
          <div className="error-banner">
            <AlertTriangle size={20} />
            <div>
              <p className="error-banner-title">Processing Error</p>
              <p className="error-banner-desc">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 1. Loading/Processing State */}
      {isProcessing && (
        <div className="processing-container">
          <div className="processing-card">
            <div className="scanner-preview-box">
              {originalUrl ? (
                <img src={originalUrl} alt="Original uploading file preview" />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <HelpCircle size={48} />
                </div>
              )}
              <div className="scanner-line" />
            </div>
            
            <div className="processing-info">
              <p className="processing-title">Analyzing Image Structure</p>
              <p className="processing-subtitle">{progressMessage}</p>
            </div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-percent">{progress}%</span>
          </div>
        </div>
      )}

      {/* 2. Upload Prompt State */}
      {!isProcessing && !processedUrl && (
        <>
          <ImageUploader onImageSelected={handleImageSelected} />
          <div style={{ maxWidth: '640px', width: '100%', margin: '2rem auto 0' }}>
            <AdUnit client={settings.googleAdsenseClientId} slot="home-bottom" format="auto" />
          </div>
        </>
      )}

      {/* 3. Editing Workspace State */}
      {!isProcessing && processedUrl && originalFile && (
        <div className="workspace-editor">
          <div className="editor-viewport">
            <ComparisonSlider 
              originalUrl={originalUrl} 
              processedUrl={processedUrl} 
              backgroundStyle={getBackgroundStyle()}
              viewMode={viewMode}
            />
            
            <div className="preview-controls-row">
              <button 
                className={`preview-action-btn ${viewMode === 'slider' ? 'active' : ''}`}
                onClick={() => setViewMode('slider')}
              >
                Slider Compare
              </button>
              <button 
                className={`preview-action-btn ${viewMode === 'side-by-side' ? 'active' : ''}`}
                onClick={() => setViewMode('side-by-side')}
              >
                Side by Side
              </button>
              <button 
                className={`preview-action-btn ${viewMode === 'only-processed' ? 'active' : ''}`}
                onClick={() => setViewMode('only-processed')}
              >
                Isolated Result
              </button>
            </div>
          </div>

          <EditorPanel 
            resolution={resolution}
            setResolution={setResolution}
            format={format}
            setFormat={setFormat}
            compressionEnabled={compressionEnabled}
            setCompressionEnabled={setCompressionEnabled}
            quality={quality}
            setQuality={setQuality}
            backgroundType={backgroundType}
            setBackgroundType={setBackgroundType}
            backgroundValue={backgroundValue}
            setBackgroundValue={setBackgroundValue}
            onDownload={handleDownload}
            onRestart={handleRestart}
            originalFileName={originalFile.name}
            originalSizeText={getFileSizeText(originalFile.size)}
            isDownloading={isDownloading}
          />
        </div>
      )}
    </>
  );
}
