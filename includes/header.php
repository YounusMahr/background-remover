<?php
/**
 * Header & Navbar Component (remove.bg style)
 */
$settings = get_settings();
$siteName = $settings['siteName'] ?? 'ClearBG Pro';
$currentPage = $currentPage ?? 'home';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <?php include BASE_DIR . '/includes/seo.php'; ?>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="icon" type="image/svg+xml" href="/public/favicon.svg">
    
    <!-- Unregister old/cached Service Workers from previous React/Next.js builds -->
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for (let registration of registrations) {
                    registration.unregister().then(function(boolean) {
                        if (boolean) {
                            console.log('Unregistered old Service Worker successfully.');
                            window.location.reload();
                        }
                    });
                }
            });
        }
    </script>
    
    <!-- Popunder Ad for bgcleaner.online -->
    <script src="https://pl30873277.effectivecpmnetwork.com/59/88/a8/5988a819869c47db3397f7f54f228b77.js"></script>
</head>
<body>

<header class="site-header">
    <div class="container header-inner">
        <a href="/" class="site-logo">
            <div class="logo-badge">BG</div>
            <span><?php echo htmlspecialchars($siteName); ?></span>
        </a>

        <nav class="site-nav">
            <a href="/" class="nav-link <?php echo $currentPage === 'home' ? 'active' : ''; ?>">Remove Background</a>
            <a href="/about" class="nav-link <?php echo $currentPage === 'about' ? 'active' : ''; ?>">About Us</a>
            <a href="/blog" class="nav-link <?php echo $currentPage === 'blog' ? 'active' : ''; ?>">Blog &amp; Guides</a>
            <a href="/contact" class="nav-link <?php echo $currentPage === 'contact' ? 'active' : ''; ?>">Contact</a>
            <a href="https://www.effectivecpmnetwork.com/gsyrzt51ha?key=e5f730e78662f544ed4d9d52a201d8e9" target="_blank" rel="noopener sponsored" class="nav-link nav-link-premium">★ Premium HD Editor</a>
            <a href="/#tool-section" class="nav-cta">Upload Image</a>
        </nav>

        <button class="mobile-toggle" onclick="document.querySelector('.site-nav').classList.toggle('mobile-open')" aria-label="Toggle navigation">
            ☰
        </button>
    </div>
</header>

<!-- Global Top Horizontal Banner Ad -->
<div class="container top-global-ad" style="margin-top: 1.5rem; margin-bottom: 0.5rem; text-align: center;">
    <?php echo render_cpm_responsive_banner(); ?>
</div>
