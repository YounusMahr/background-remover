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
            <a href="/#tool-section" class="nav-cta">Upload Image</a>
        </nav>

        <button class="mobile-toggle" onclick="document.querySelector('.site-nav').classList.toggle('mobile-open')" aria-label="Toggle navigation">
            ☰
        </button>
    </div>
</header>
