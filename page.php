<?php
require_once __DIR__ . '/config.php';

$type = trim($_GET['type'] ?? 'about');

$titles = [
    'about' => 'About Us - ClearBG Pro',
    'privacy' => 'Privacy Policy - ClearBG Pro',
    'terms' => 'Terms of Service - ClearBG Pro',
    'cookies' => 'Cookie Policy - ClearBG Pro',
    'disclaimer' => 'Disclaimer - ClearBG Pro',
    'contact' => 'Contact Us - ClearBG Pro'
];

$pageTitle = $titles[$type] ?? 'Information - ClearBG Pro';
$pageDesc = "Legal and operational policy details for ClearBG Pro background remover.";

include BASE_DIR . '/includes/header.php';
?>

<div class="container article-container">
    <h1 class="article-title"><?php echo htmlspecialchars(explode(' - ', $pageTitle)[0]); ?></h1>

    <main class="article-body">
        <?php if ($type === 'about'): ?>
            <p>Welcome to <strong>ClearBG Pro</strong>, the web’s premier private and free AI-powered background remover utility.</p>
            <h2>Our Mission</h2>
            <p>Our goal is to democratize professional photo editing tools by providing instantaneous, high-definition background removal that operates 100% locally inside your browser thread.</p>
            <h2>Why Local WebAssembly AI Matters</h2>
            <p>Traditional image editing web apps upload your private photographs to remote cloud servers. At ClearBG Pro, we compile advanced neural networks into WebAssembly binaries. This means your files never upload to our servers, keeping your graphics completely private and secure.</p>

        <?php elseif ($type === 'privacy'): ?>
            <p>Last updated: July 2026</p>
            <h2>1. Zero Image File Upload Policy</h2>
            <p>ClearBG Pro operates using client-side WebAssembly technology. When you select or drag-and-drop an image into our application, the image is processed entirely within your web browser’s sandboxed runtime memory. No images or cutout binary files are ever transmitted to or stored on our servers.</p>
            <h2>2. Web Analytics &amp; Cookies</h2>
            <p>We may collect non-personally identifiable browser information (such as browser version, country, and screen resolution) to optimize website performance. Third-party vendors, including Google AdSense, use cookies to serve ads based on prior visits to our site or other websites.</p>

        <?php elseif ($type === 'terms'): ?>
            <p>By using ClearBG Pro, you agree to the following terms and conditions:</p>
            <h2>1. Usage License</h2>
            <p>ClearBG Pro is free to use for both personal and commercial image processing purposes. You retain full copyright ownership of all images processed using our service.</p>
            <h2>2. No Warranty</h2>
            <p>The software is provided "as is" without warranties of any kind. We are not liable for any damages or image loss arising from browser incompatibility or processing errors.</p>

        <?php elseif ($type === 'cookies'): ?>
            <h2>Cookie Policy</h2>
            <p>ClearBG Pro uses essential browser storage (such as LocalStorage and IndexedDB) to cache WebAssembly neural network weights locally on your device. We may also use Google AdSense cookies to display relevant advertisements.</p>

        <?php elseif ($type === 'disclaimer'): ?>
            <h2>Disclaimer</h2>
            <p>The information and utilities provided on ClearBG Pro are for general graphical editing purposes. While our AI models strive for accuracy, edge separation results may vary based on photo lighting and contrast.</p>

        <?php elseif ($type === 'contact'): ?>
            <h2>Contact Us</h2>
            <p>Have questions, feedback, or business inquiries regarding ClearBG Pro?</p>
            <p>Email us at: <strong>support@bgcleaner.online</strong></p>
        <?php endif; ?>
    </main>
</div>

<?php include BASE_DIR . '/includes/footer.php'; ?>
