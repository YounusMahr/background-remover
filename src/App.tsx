import { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ComparisonSlider } from './components/ComparisonSlider';
import { EditorPanel } from './components/EditorPanel';
import { removeBackground } from '@imgly/background-removal';
import { AlertTriangle, HelpCircle } from 'lucide-react';

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
    
    // Create a 1D mapping of the original alpha values for quick lookup
    const alphaMap = new Uint8Array(width * height);
    for (let i = 0; i < data.length; i += 4) {
      alphaMap[i / 4] = data[i + 3];
    }
    
    // Helper to determine if a pixel is within a search radius of a fully transparent pixel
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
    
    // Process pixels to remove background color bleed halos ONLY on the actual outer boundary
    for (let y = 0; y < height; y++) {
      const rowOffset = y * width;
      for (let x = 0; x < width; x++) {
        const i = (rowOffset + x) * 4;
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const a = data[i+3];
        
        // Only touch semi-transparent pixels that are directly on the outer border edge
        if (a > 0 && a < 255) {
          // A radius of 3 (7x7 box) matches the fringe width
          if (isNearTransparent(x, y, 3)) {
            let newA = a;
            
            // 1. Erode outer low-opacity edge pixels
            if (a < 185) {
              newA = Math.max(0, a - 35);
            }
            
            // 2. Reduce opacity of edge pixels that are bright (white halo suppression)
            const brightness = (r + g + b) / 3;
            if (brightness > 200) {
              const factor = (brightness - 200) / 55; // 0.0 to 1.0
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

function App() {
  // File states
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string>('');
  
  // App workflow states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side' | 'only-processed'>('slider');

  // Background configurations
  const [backgroundType, setBackgroundType] = useState<'transparent' | 'solid' | 'gradient' | 'image'>('transparent');
  const [backgroundValue, setBackgroundValue] = useState<string>('');

  // Export configurations
  const [resolution, setResolution] = useState<'medium' | 'hd'>('hd');
  const [format, setFormat] = useState<'png' | 'webp' | 'jpeg'>('png');
  const [compressionEnabled, setCompressionEnabled] = useState<boolean>(false);
  const [quality, setQuality] = useState<number>(0.8);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // File metadata helpers
  const getFileSizeText = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Convert URLs (presets) to local Files for single unified flow
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
    
    // Revoke previous URLs to avoid memory leaks
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    
    const localUrl = URL.createObjectURL(file);
    setOriginalUrl(localUrl);
    setProcessedUrl('');
    
    // Trigger the background removal immediately
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
        errorMessage = "Security Error: Cross-Origin Isolation is disabled. Since this app runs completely inside your browser using WebAssembly AI, it requires a secure context (HTTPS) and specific headers. Please make sure you are accessing the secure 'https://' version of your link (e.g. ngrok HTTPS link) and that your browser supports SharedArrayBuffer.";
      } else if (errorMessage.toLowerCase().includes("fetch") || errorMessage.toLowerCase().includes("failed to fetch")) {
        errorMessage = "Download Error: Failed to fetch the AI model files. This usually happens if your connection is slow, blocks CDN assets, or if the server had a timeout. Please reload the page and try again on a stable connection.";
      }
      
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!processedUrl || !originalFile) return;
    setIsDownloading(true);

    try {
      // 1. Create helper image to get dimensions
      const img = new Image();
      img.src = processedUrl;
      await img.decode();

      let exportW = img.naturalWidth;
      let exportH = img.naturalHeight;

      // 2. Resize if Medium quality is selected
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

      // 3. Setup canvas
      const canvas = document.createElement('canvas');
      canvas.width = exportW;
      canvas.height = exportH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not construct 2D rendering canvas context");

      // 4. Fill background based on selection
      if (backgroundType === 'solid') {
        ctx.fillStyle = backgroundValue;
        ctx.fillRect(0, 0, exportW, exportH);
      } else if (backgroundType === 'gradient') {
        // Map common CSS gradient values to simple linear colors
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
        // Load background image cover-style
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous'; // CORS config for presets
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
        // Transparent background
        if (format === 'jpeg') {
          // JPEG requires white fill as it does not support alpha channel
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, exportW, exportH);
        }
      }

      // 5. Draw transparent foreground image
      ctx.drawImage(img, 0, 0, exportW, exportH);

      // 6. Generate output format blob and trigger download
      const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const compressionQuality = compressionEnabled && format !== 'png' ? quality : 1.0;

      canvas.toBlob((blob) => {
        if (!blob) {
          setError("Canvas rendering failed. Please try again.");
          setIsDownloading(false);
          return;
        }

        const outUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const originalName = originalFile.name || 'image';
        const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        const extension = format === 'jpeg' ? 'jpg' : format;
        
        link.download = `${baseName}_no_bg.${extension}`;
        link.href = outUrl;
        link.click();
        
        // Cleanup URL reference
        setTimeout(() => {
          URL.revokeObjectURL(outUrl);
          setIsDownloading(false);
        }, 100);

      }, mimeType, compressionQuality);

    } catch (err: any) {
      console.error("Composition error:", err);
      setError("Failed to construct download package. Please try again.");
      setIsDownloading(false);
    }
  };

  const handleRestart = () => {
    setOriginalFile(null);
    setOriginalUrl('');
    setProcessedUrl('');
    setError('');
    setBackgroundType('transparent');
    setBackgroundValue('');
    setFormat('png');
    setResolution('hd');
    setCompressionEnabled(false);
  };

  // Compose the CSS background preview styling
  const getBackgroundStyle = (): React.CSSProperties => {
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
    <div className={`app-container ${processedUrl || isProcessing ? 'editor-active' : ''}`}>
      {/* Premium Header */}
      <header className="app-header">
        <div className="logo-container">
          <svg className="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="m14 10-4 4"/>
            <path d="m10 10 4 4"/>
          </svg>
          <span className="logo-text">ClearBG</span>
          <span className="logo-badge">Pro</span>
        </div>
        <div className="privacy-badge">
          <div className="privacy-dot" />
          <span>AI-Powered</span>
        </div>
      </header>

      {/* Main workspace routing */}
      <main className="main-workspace">
        {/* Error Banner */}
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
          <ImageUploader onImageSelected={handleImageSelected} />
        )}

        {/* 3. Editing Workspace State */}
        {!isProcessing && processedUrl && originalFile && (
          <div className="workspace-editor">
            {/* Viewport for slider comparison */}
            <div className="editor-viewport">
              <ComparisonSlider 
                originalUrl={originalUrl} 
                processedUrl={processedUrl} 
                backgroundStyle={getBackgroundStyle()}
                viewMode={viewMode}
              />
              
              {/* Bottom toggle actions */}
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

            {/* Sidebar controls */}
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
      </main>

      {/* Footer info */}
      {!processedUrl && !isProcessing && (
        <footer className="app-footer">
          <p>ClearBG Pro — Completely Private client-side background removal. Supported formats: PNG, JPEG, WEBP.</p>
        </footer>
      )}
    </div>
  );
}

export default App;
