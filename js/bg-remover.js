/**
 * Client-Side AI Background Remover Engine & Canvas Edge Defringer
 * Utilizes @imgly/background-removal WASM AI via CDN for 100% browser-based processing
 */

import { removeBackground } from 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.5/+esm';

export async function processBackgroundRemoval(fileOrUrl, onProgress) {
  try {
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    const config = {
      model: isMobile ? 'isnet_quint8' : 'isnet_fp16',
      progress: (key, current, total) => {
        const percent = Math.round((current / total) * 100);
        if (onProgress) {
          if (key.includes('fetch')) {
            onProgress(percent, `Downloading AI model resources (${percent}%)`);
          } else if (key.includes('onnx')) {
            onProgress(percent, `Loading neural network modules (${percent}%)`);
          } else {
            onProgress(percent, `Removing background... (${percent}%)`);
          }
        }
      }
    };

    // 1. Run AI WASM background removal
    const rawBlob = await removeBackground(fileOrUrl, config);
    if (onProgress) onProgress(95, "Refining edge details for HD export...");
    
    // 2. Apply Canvas edge defringing algorithm
    const defringedBlob = await applyEdgeDefringe(rawBlob);
    if (onProgress) onProgress(100, "Processing complete!");

    return defringedBlob;
  } catch (error) {
    console.error("AI Background Removal error:", error);
    throw error;
  }
}

/**
 * Edge Defringing algorithm using HTML5 2D Canvas
 */
async function applyEdgeDefringe(blob) {
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
    
    const isNearTransparent = (x, y, radius) => {
      const minX = Math.max(0, x - radius);
      const maxX = Math.min(width - 1, x + radius);
      const minY = Math.max(0, y - radius);
      const maxY = Math.min(height - 1, y + radius);
      
      for (let ny = minY; ny <= maxY; ny++) {
        const rowOffset = ny * width;
        for (let nx = minX; nx <= maxX; nx++) {
          if (alphaMap[rowOffset + nx] === 0) return true;
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
            if (a < 185) newA = Math.max(0, a - 35);
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
    
    return new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b || blob), 'image/png');
    });
  } catch (e) {
    console.warn("Edge defringing skipped:", e);
    return blob;
  }
}

/**
 * Composite & Export final image with custom background (solid/gradient/image)
 */
export async function exportCompositeImage(processedBlobUrl, originalFileName, bgType, bgValue, format = 'png', resolution = 'hd', quality = 0.9) {
  const img = new Image();
  img.src = processedBlobUrl;
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

  // Fill background
  if (bgType === 'solid') {
    ctx.fillStyle = bgValue;
    ctx.fillRect(0, 0, exportW, exportH);
  } else if (bgType === 'gradient') {
    const gradient = ctx.createLinearGradient(0, 0, exportW, exportH);
    const stops = bgValue.split(',');
    gradient.addColorStop(0, stops[0] || '#2f6beb');
    gradient.addColorStop(1, stops[1] || '#00d2ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, exportW, exportH);
  } else if (format === 'jpeg' && bgType === 'transparent') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exportW, exportH);
  }

  // Draw main subject
  ctx.drawImage(img, 0, 0, exportW, exportH);

  const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
  
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const baseName = originalFileName ? originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName : 'cutout';
    const ext = format === 'jpeg' ? 'jpg' : format;
    
    a.href = url;
    a.download = `${baseName}_no_bg.${ext}`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 150);
  }, mimeType, quality);
}
