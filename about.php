<?php
require_once __DIR__ . '/config.php';

$pageTitle = "About Us - ClearBG Pro | Free Private AI Background Remover";
$pageDesc = "Learn about ClearBG Pro, the 100% private, browser-based AI background removal tool. Discover our technology, mission, and why privacy matters.";
$currentPage = "about";

include BASE_DIR . '/includes/header.php';
?>

<div class="container article-container" style="padding-top: 3rem; padding-bottom: 4rem;">
    <header class="article-header" style="text-align: center; margin-bottom: 3rem;">
        <span class="blog-tag">About ClearBG Pro</span>
        <h1 class="article-title" style="margin-top: 0.8rem;">100% Private, Automated Background Removal</h1>
        <p class="section-subtitle" style="margin-bottom: 0;">Empowering creators, e-commerce stores, and photographers with browser-based AI.</p>
    </header>

    <main class="article-body">
        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 2rem; border: 1px solid var(--border-color); margin-bottom: 2.5rem;">
            <h2 style="margin-top: 0;">Our Mission</h2>
            <p>At <strong>ClearBG Pro</strong>, we believe graphic editing tools should be fast, accessible, and above all, <strong>completely private</strong>. Traditional background removal tools force users to upload their sensitive personal photos, product shots, and document graphics to remote cloud datacenters. We built ClearBG Pro to eliminate this privacy risk.</p>
        </div>

        <h2>How Our Technology Works</h2>
        <p>ClearBG Pro utilizes state-of-the-art WebAssembly (WASM) neural networks that run directly inside your web browser thread. When you select an image, our client-side machine learning engine segments the foreground subject from the background using your device's GPU/CPU compute power.</p>

        <ul>
            <li><strong>Zero Server Uploads:</strong> Your images are loaded into local browser memory and never leave your device.</li>
            <li><strong>Instant Performance:</strong> No queue times or cloud rendering latency.</li>
            <li><strong>Full HD Quality:</strong> Edge defringing algorithms ensure clean cutouts for e-commerce, print, and design.</li>
        </ul>

        <h2>Who Uses ClearBG Pro?</h2>
        <div class="features-grid" style="margin: 2rem 0; grid-template-columns: repeat(2, 1fr);">
            <div class="feature-card">
                <h3>🛍️ E-commerce Merchants</h3>
                <p>Create clean white background listings for Amazon, Shopify, and eBay in seconds.</p>
            </div>
            <div class="feature-card">
                <h3>🎨 Graphic Designers</h3>
                <p>Isolate subjects, produce transparent PNG assets, and compose promotional banners.</p>
            </div>
            <div class="feature-card">
                <h3>📸 Photographers</h3>
                <p>Prepare headshots and portrait cutouts quickly without subscription fees.</p>
            </div>
            <div class="feature-card">
                <h3>🔒 Privacy Advocates</h3>
                <p>Edit personal identification or proprietary graphics with 100% data confidentiality.</p>
            </div>
        </div>

        <h2>Get in Touch</h2>
        <p>We are constantly improving our background removal models and web performance. If you have feedback, feature requests, or business inquiry, please visit our <a href="/contact" style="font-weight: 600;">Contact Us</a> page.</p>
    </main>
</div>

<?php include BASE_DIR . '/includes/footer.php'; ?>
