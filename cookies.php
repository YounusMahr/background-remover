<?php
require_once __DIR__ . '/config.php';

$pageTitle = "Cookie Policy - ClearBG Pro | Browser Storage & AdSense Cookies";
$pageDesc = "Understand how ClearBG Pro uses cookies, local browser storage, and third-party advertising cookies to deliver WebAssembly AI tools.";
$currentPage = "cookies";

include BASE_DIR . '/includes/header.php';
?>

<div class="container article-container" style="padding-top: 3rem; padding-bottom: 4rem;">
    <header class="article-header">
        <span class="blog-tag">Legal &amp; Cookies</span>
        <h1 class="article-title" style="margin-top: 0.8rem;">Cookie Policy</h1>
        <div class="blog-meta" style="color: var(--text-muted);">
            <span>Effective Date: July 2026</span>
        </div>
    </header>

    <main class="article-body">
        <p>This is the Cookie Policy for <strong>ClearBG Pro</strong>, accessible from <a href="https://bgcleaner.online">https://bgcleaner.online</a>.</p>

        <h2>What Are Cookies?</h2>
        <p>As is common practice with almost all professional websites, this site uses cookies—small files downloaded to your computer—to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.</p>

        <h2>How ClearBG Pro Uses Storage &amp; Cookies</h2>
        <p>We use cookies and browser storage for the following purposes:</p>

        <h3>1. Essential WebAssembly Model Caching (LocalStorage / IndexedDB)</h3>
        <p>To enable fast client-side AI background removal, your browser caches neural network model weights (~8MB to 15MB) in local browser memory (IndexedDB/LocalStorage). This allows subsequent image processing requests to run instantly without re-downloading model files, saving your bandwidth.</p>

        <h3>2. Third-Party Advertising Cookies (Google AdSense)</h3>
        <p>We use third-party vendors, including Google AdSense, to serve advertisements when you visit our website. These companies may use cookies to serve ads based on your prior visits to our website or other sites on the Internet.</p>

        <h2>Disabling &amp; Managing Cookies</h2>
        <p>You can prevent the setting of cookies by adjusting the settings on your web browser (see your browser Help section for instructions). Be aware that disabling cookies may affect the performance or functionality of certain features of this and other websites.</p>

        <h2>More Information</h2>
        <p>If you are looking for more information, you can contact us through our preferred contact method at <a href="mailto:support@bgcleaner.online">support@bgcleaner.online</a>.</p>
    </main>
</div>

<?php include BASE_DIR . '/includes/footer.php'; ?>
