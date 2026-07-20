/**
 * Main ClearBG Pro Frontend UI Controller (remove.bg flow)
 */

import { processBackgroundRemoval, exportCompositeImage } from './bg-remover.js';
import { initComparisonSlider } from './slider.js';

document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const uploadBtn = document.getElementById('upload-btn');
  const sampleThumbs = document.querySelectorAll('.sample-thumb');
  
  const processingBox = document.getElementById('processing-box');
  const progressText = document.getElementById('progress-text');
  const progressBar = document.getElementById('progress-bar');
  
  const uploadSection = document.getElementById('upload-section');
  const editorWorkspace = document.getElementById('editor-workspace');
  
  const originalPreviewImg = document.getElementById('original-preview-img');
  const resultPreviewImg = document.getElementById('result-preview-img');
  const sliderResultImg = document.getElementById('slider-result-img');
  const sliderOriginalImg = document.getElementById('slider-original-img');
  const sliderBox = document.getElementById('slider-box');
  
  const tabOriginal = document.getElementById('tab-original');
  const tabResult = document.getElementById('tab-result');
  const tabSlider = document.getElementById('tab-slider');
  
  const viewportContainer = document.getElementById('viewport-container');
  const bgOptionBtns = document.querySelectorAll('.bg-option-btn');
  
  const btnDownload = document.getElementById('btn-download');
  const btnRestart = document.getElementById('btn-restart');
  const exportFormatSelect = document.getElementById('export-format');
  const exportResSelect = document.getElementById('export-res');

  let currentFile = null;
  let originalUrl = '';
  let processedBlobUrl = '';
  let selectedBgType = 'transparent';
  let selectedBgValue = '';

  // 1. Drag & Drop events
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        handleImageUpload(files[0]);
      }
    });
  }

  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleImageUpload(e.target.files[0]);
      }
    });
  }

  // 2. Sample image clicks
  sampleThumbs.forEach(thumb => {
    thumb.addEventListener('click', async () => {
      const src = thumb.getAttribute('data-src');
      if (!src) return;
      
      try {
        startProcessingState();
        updateProgress(15, "Fetching sample image...");
        const res = await fetch(src);
        const blob = await res.blob();
        const file = new File([blob], 'sample.jpg', { type: blob.type });
        handleImageUpload(file);
      } catch (err) {
        alert("Failed to load sample image. Please try uploading a local image.");
        stopProcessingState();
      }
    });
  });

  // 3. Process Uploaded Image
  async function handleImageUpload(file) {
    currentFile = file;
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (processedBlobUrl) URL.revokeObjectURL(processedBlobUrl);
    
    originalUrl = URL.createObjectURL(file);
    originalPreviewImg.src = originalUrl;
    sliderOriginalImg.src = originalUrl;
    
    startProcessingState();

    try {
      const resultBlob = await processBackgroundRemoval(file, (percent, msg) => {
        updateProgress(percent, msg);
      });

      processedBlobUrl = URL.createObjectURL(resultBlob);
      resultPreviewImg.src = processedBlobUrl;
      sliderResultImg.src = processedBlobUrl;

      stopProcessingState();
      showEditorWorkspace();
      initComparisonSlider(sliderBox);
    } catch (err) {
      console.error(err);
      alert("Error removing background: " + (err.message || "Please try a different image."));
      stopProcessingState();
    }
  }

  function startProcessingState() {
    uploadSection.style.display = 'none';
    processingBox.classList.add('active');
  }

  function stopProcessingState() {
    processingBox.classList.remove('active');
  }

  function updateProgress(percent, text) {
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressText) progressText.innerText = text;
  }

  function showEditorWorkspace() {
    editorWorkspace.classList.add('active');
    switchTab('result'); // remove.bg defaults to removed background tab
  }

  // 4. Tab Switching (remove.bg style)
  if (tabOriginal) tabOriginal.addEventListener('click', () => switchTab('original'));
  if (tabResult) tabResult.addEventListener('click', () => switchTab('result'));
  if (tabSlider) tabSlider.addEventListener('click', () => switchTab('slider'));

  function switchTab(mode) {
    [tabOriginal, tabResult, tabSlider].forEach(t => t && t.classList.remove('active'));
    originalPreviewImg.style.display = 'none';
    resultPreviewImg.style.display = 'none';
    sliderBox.style.display = 'none';

    if (mode === 'original') {
      tabOriginal.classList.add('active');
      originalPreviewImg.style.display = 'block';
    } else if (mode === 'result') {
      tabResult.classList.add('active');
      resultPreviewImg.style.display = 'block';
    } else if (mode === 'slider') {
      tabSlider.classList.add('active');
      sliderBox.style.display = 'block';
    }
  }

  // 5. Background Color Options
  bgOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bgOptionBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const type = btn.getAttribute('data-type');
      const val = btn.getAttribute('data-value');
      selectedBgType = type;
      selectedBgValue = val;

      if (type === 'transparent') {
        viewportContainer.className = 'viewport-container bg-checkered';
        viewportContainer.style.background = '';
      } else if (type === 'solid') {
        viewportContainer.className = 'viewport-container';
        viewportContainer.style.background = val;
      } else if (type === 'gradient') {
        viewportContainer.className = 'viewport-container';
        const stops = val.split(',');
        viewportContainer.style.background = `linear-gradient(135deg, ${stops[0]}, ${stops[1]})`;
      }
    });
  });

  // 6. Download Action
  if (btnDownload) {
    btnDownload.addEventListener('click', async () => {
      if (!processedBlobUrl) return;
      const format = exportFormatSelect ? exportFormatSelect.value : 'png';
      const resolution = exportResSelect ? exportResSelect.value : 'hd';
      
      btnDownload.innerText = 'Exporting...';
      btnDownload.disabled = true;

      await exportCompositeImage(
        processedBlobUrl,
        currentFile ? currentFile.name : 'image.png',
        selectedBgType,
        selectedBgValue,
        format,
        resolution
      );

      btnDownload.innerText = 'Download Image';
      btnDownload.disabled = false;
    });
  }

  // 7. Restart Action
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      editorWorkspace.classList.remove('active');
      uploadSection.style.display = 'block';
      if (fileInput) fileInput.value = '';
    });
  }
});
