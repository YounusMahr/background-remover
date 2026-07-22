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
                <div class="feature-icon-badge">
                    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <h3>E-commerce Merchants</h3>
                <p>Create clean white background listings for Amazon, Shopify, and eBay in seconds.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon-badge">
                    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                </div>
                <h3>Graphic Designers</h3>
                <p>Isolate subjects, produce transparent PNG assets, and compose promotional banners.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon-badge">
                    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <h3>Photographers</h3>
                <p>Prepare headshots and portrait cutouts quickly without subscription fees.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon-badge">
                    <svg width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h3>Privacy Advocates</h3>
                <p>Edit personal identification or proprietary graphics with 100% data confidentiality.</p>
            </div>
        </div>

        <h2>Get in Touch</h2>
        <p>We are constantly improving our background removal models and web performance. If you have feedback, feature requests, or business inquiry, please visit our <a href="/contact" style="font-weight: 600;">Contact Us</a> page.</p>
    </main>
</div>

<?php include BASE_DIR . '/includes/footer.php'; ?>
