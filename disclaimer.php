<?php
require_once __DIR__ . '/config.php';

$pageTitle = "Disclaimer - ClearBG Pro | Software & Monetization Disclosure";
$pageDesc = "Read the ClearBG Pro Disclaimer regarding AI image segmentation accuracy, advertising disclosures, and third-party links.";
$currentPage = "disclaimer";

include BASE_DIR . '/includes/header.php';
?>

<div class="container article-container" style="padding-top: 3rem; padding-bottom: 4rem;">
    <header class="article-header">
        <span class="blog-tag">Legal &amp; Disclosures</span>
        <h1 class="article-title" style="margin-top: 0.8rem;">Disclaimer</h1>
        <div class="blog-meta" style="color: var(--text-muted);">
            <span>Effective Date: July 2026</span>
        </div>
    </header>

    <main class="article-body">
        <p>The information and software tools provided on <strong>ClearBG Pro</strong> (<a href="https://bgcleaner.online">https://bgcleaner.online</a>) are for general graphical editing, educational, and utility purposes only.</p>

        <h2>1. AI Accuracy &amp; Image Segmentation</h2>
        <p>ClearBG Pro utilizes automated artificial intelligence and machine learning neural networks to detect foreground objects and remove background pixels. While our WebAssembly models are trained to deliver accurate cutouts across diverse photography styles, background removal results depend heavily on source photo quality, lighting contrast, and edge sharpness.</p>
        <p>ClearBG Pro does not guarantee 100% pixel-perfect separation for every photographic input, especially low-resolution, blurry, or low-contrast photos.</p>

        <h2>2. Advertising &amp; Google AdSense Monetization Disclosure</h2>
        <p>ClearBG Pro receives financial compensation through third-party advertising networks, including <strong>Google AdSense</strong>. Display advertisements may be shown on various pages across the website to support ongoing web hosting and software maintenance costs.</p>
        <p>Advertising content does not constitute an endorsement or recommendation by ClearBG Pro of any third-party product or service displayed in ad units.</p>

        <h2>3. External Links Disclaimer</h2>
        <p>ClearBG Pro may contain links to third-party websites or services that are not owned or controlled by ClearBG Pro. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web pages or services.</p>

        <h2>4. Contact Us</h2>
        <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at <a href="mailto:support@bgcleaner.online">support@bgcleaner.online</a>.</p>
    </main>
</div>

<?php include BASE_DIR . '/includes/footer.php'; ?>
