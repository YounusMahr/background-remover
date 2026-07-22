<?php
require_once __DIR__ . '/config.php';

$pageTitle = "Remove Background from Image for Free - ClearBG Pro";
$pageDesc = "100% automatically and free. Remove image backgrounds in seconds with AI. Browser-based, 100% private, no file uploads, export HD transparent PNG, WebP, and JPG.";
$currentPage = "home";

include BASE_DIR . '/includes/header.php';
?>

<!-- Hero Section (remove.bg inspired split layout) -->
<section class="hero-section">
    <div class="container hero-grid">
        <div class="hero-content">
            <h1>Remove Image Background <span>100% Automatically and Free</span></h1>
            <p class="hero-lead">
                Transform photos instantly into crisp transparent PNG cutouts. ClearBG Pro uses AI that runs completely inside your web browser — your images stay 100% private and never leave your device.
            </p>
            
            <div class="hero-badges">
                <div class="hero-badge-item">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                    <span>100% Private (No Uploads)</span>
                </div>
                <div class="hero-badge-item">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                    <span>Full HD Export</span>
                </div>
                <div class="hero-badge-item">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                    <span>No Watermark or Sign-Up</span>
                </div>
            </div>
        </div>

        <!-- Interactive Tool / Upload Card -->
        <div class="hero-tool-container" id="tool-section">
            <div class="upload-card-wrapper" id="upload-section">
                <div id="dropzone">
                    <button type="button" class="upload-btn-main" id="upload-btn">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        <span>Upload Image</span>
                    </button>
                    <input type="file" id="file-input" accept="image/png, image/jpeg, image/webp" style="display: none;">
                    <p class="upload-drop-text">or drop a file here</p>
                </div>

                <div class="sample-images-section">
                    <div class="sample-title">No image? Try one of these sample photos:</div>
                    <div class="sample-grid">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80" class="sample-thumb" data-src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" alt="Sample Portrait Person">
                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=250&q=80" class="sample-thumb" data-src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" alt="Sample Product Sneaker">
                        <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80" class="sample-thumb" data-src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" alt="Sample Fashion Model">
                    </div>
                </div>
            </div>

            <!-- Processing Loader State -->
            <div class="processing-box" id="processing-box">
                <div class="spinner"></div>
                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.4rem;">Analyzing Image Pixels</h3>
                <p id="progress-text" style="color: var(--text-muted); font-size: 0.9rem;">Initializing neural network...</p>
                <div class="progress-track">
                    <div class="progress-bar" id="progress-bar"></div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- AdSense Header Banner -->
<div class="container">
    <?php echo render_adsense('home-top-banner', 'auto'); ?>
</div>

<!-- Editor Workspace (remove.bg Tabs & Controls) -->
<section class="container">
    <div class="editor-workspace" id="editor-workspace">
        <div class="editor-preview-card">
            <div class="editor-tabs">
                <button class="editor-tab-btn" id="tab-original">Original</button>
                <button class="editor-tab-btn active" id="tab-result">Removed Background</button>
                <button class="editor-tab-btn" id="tab-slider">Comparison Slider</button>
            </div>

            <div class="viewport-container bg-checkered" id="viewport-container">
                <!-- Original Image View -->
                <img id="original-preview-img" class="preview-img" style="display: none;" alt="Original Image">
                
                <!-- Processed Cutout View -->
                <img id="result-preview-img" class="preview-img" alt="Background Removed Result">

                <!-- Comparison Slider View -->
                <div id="slider-box" class="comparison-slider-box" style="display: none;">
                    <img id="slider-result-img" class="slider-img" alt="Result Cutout">
                    <div class="slider-overlay">
                        <img id="slider-original-img" class="slider-img" alt="Original Photo">
                    </div>
                    <div class="slider-handle">↔</div>
                </div>
            </div>
        </div>

        <!-- Sidebar Options & Download Controls -->
        <div class="editor-sidebar">
            <h3 class="sidebar-title">Background Options</h3>

            <div class="control-group">
                <label class="control-label">Preset Colors & Gradients</label>
                <div class="bg-picker-options">
                    <button class="bg-option-btn bg-checkered active" data-type="transparent" title="Transparent"></button>
                    <button class="bg-option-btn" data-type="solid" data-value="#ffffff" style="background: #ffffff;" title="White"></button>
                    <button class="bg-option-btn" data-type="solid" data-value="#0f172a" style="background: #0f172a;" title="Dark Navy"></button>
                    <button class="bg-option-btn" data-type="solid" data-value="#ef4444" style="background: #ef4444;" title="Red"></button>
                    <button class="bg-option-btn" data-type="solid" data-value="#10b981" style="background: #10b981;" title="Green"></button>
                    <button class="bg-option-btn" data-type="gradient" data-value="#2f6beb,#00d2ff" style="background: linear-gradient(135deg, #2f6beb, #00d2ff);" title="Ocean Blue"></button>
                    <button class="bg-option-btn" data-type="gradient" data-value="#a78bfa,#ec4899" style="background: linear-gradient(135deg, #a78bfa, #ec4899);" title="Sunset Purple"></button>
                    <button class="bg-option-btn" data-type="gradient" data-value="#f59e0b,#ee4678" style="background: linear-gradient(135deg, #f59e0b, #ee4678);" title="Warm Ember"></button>
                </div>
            </div>

            <div class="control-group">
                <label class="control-label" for="export-format">Export Format</label>
                <select id="export-format" class="form-control">
                    <option value="png">PNG (Transparent)</option>
                    <option value="webp">WebP (Compressed)</option>
                    <option value="jpeg">JPEG (White Background)</option>
                </select>
            </div>

            <div class="control-group">
                <label class="control-label" for="export-res">Output Quality</label>
                <select id="export-res" class="form-control">
                    <option value="hd">Full HD (Original Dimensions)</option>
                    <option value="medium">Medium HD (1200px Max)</option>
                </select>
            </div>

            <div class="download-section">
                <button id="btn-download" class="btn-download">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span>Download Image</span>
                </button>
                <button id="btn-restart" class="btn-restart">Upload Another Image</button>
            </div>
        </div>
    </div>
</section>

<!-- How to Use Section -->
<section class="section-padding" id="how-to-use" style="background: var(--bg-secondary);">
    <div class="container">
        <h2 class="section-title">How to Remove Background in 3 Simple Steps</h2>
        <p class="section-subtitle">Effortless image background removal directly in your browser with zero file uploads.</p>

        <div class="steps-grid">
            <div class="step-card">
                <div class="step-number">01</div>
                <h3>Upload Your Photo</h3>
                <p>Drag and drop your PNG, JPEG, or WebP photo into the upload box or select a file from your phone or computer.</p>
            </div>

            <div class="step-card">
                <div class="step-number">02</div>
                <h3>AI Automatic Cutout</h3>
                <p>Our browser WebAssembly AI model scans your photo, isolates the subject, and removes the background in seconds.</p>
            </div>

            <div class="step-card">
                <div class="step-number">03</div>
                <h3>Customize &amp; Download</h3>
                <p>Choose transparent background or swap solid colors/gradients, then export in crisp Full HD resolution.</p>
            </div>
        </div>
    </div>
</section>

<!-- Features Grid -->
<section class="section-padding" id="features">
    <div class="container">
        <h2 class="section-title">Why ClearBG Pro is the Best Choice</h2>
        <p class="section-subtitle">Designed for designers, e-commerce sellers, and privacy-conscious users.</p>

        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon-badge">
                    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3>100% Private &amp; Secure</h3>
                <p>Images are processed locally inside your web browser. Nothing is ever sent to external cloud servers, guaranteeing absolute privacy for sensitive photos.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon-badge">
                    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3>Sub-Second Speed</h3>
                <p>No waiting in queue for cloud server renders. WebAssembly utilizes your CPU/GPU hardware to segment photos instantly.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon-badge">
                    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                </div>
                <h3>Full HD Export Quality</h3>
                <p>Preserve high-resolution details without downscaling or mandatory paid upgrades. Download transparent PNGs ready for commercial printing.</p>
            </div>
        </div>
    </div>
</section>

<!-- AdSense Mid Content Banner -->
<div class="container">
    <?php echo render_adsense('home-mid-banner', 'auto'); ?>
</div>

<!-- FAQ Section -->
<section class="section-padding" id="faq" style="background: var(--bg-secondary);">
    <div class="container">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <p class="section-subtitle">Everything you need to know about our free background remover tool.</p>

        <div class="faq-grid">
            <div class="faq-item">
                <h3>Is ClearBG Pro really 100% free?</h3>
                <p>Yes! ClearBG Pro is completely free with no subscriptions, watermarks, or artificial resolution caps.</p>
            </div>
            <div class="faq-item">
                <h3>Do I need to create an account?</h3>
                <p>No account creation or login is required. Simply visit the site, upload your image, and download your result instantly.</p>
            </div>
            <div class="faq-item">
                <h3>Are my photos uploaded to your server?</h3>
                <p>Never. All AI image segmentation runs client-side using WebAssembly. Your photos remain on your personal device at all times.</p>
            </div>
            <div class="faq-item">
                <h3>What image file formats can I process?</h3>
                <p>You can process PNG, JPEG, and WebP images. Results can be downloaded as transparent PNG, WebP, or JPEG with solid colors.</p>
            </div>
        </div>
    </div>
</section>

<!-- Script Bundle -->
<script type="module" src="/js/app.js"></script>

<?php include BASE_DIR . '/includes/footer.php'; ?>
