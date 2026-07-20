<?php
/**
 * Router script for PHP built-in CLI server (php -S localhost:8000 router.php)
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 1. Sitemap XML
if ($uri === '/sitemap.xml') {
    require __DIR__ . '/sitemap.php';
    exit;
}

// 2. Blog Index
if ($uri === '/blog' || $uri === '/blog/') {
    require __DIR__ . '/blog.php';
    exit;
}

// 3. Single Blog Post: /blog/{slug}
if (preg_match('#^/blog/([a-zA-Z0-9\-]+)/?$#', $uri, $matches)) {
    $_GET['slug'] = $matches[1];
    require __DIR__ . '/post.php';
    exit;
}

// 4. Standalone Pages & Admin Panel
$pages = ['admin', 'about', 'contact', 'privacy', 'terms', 'cookies', 'disclaimer'];
foreach ($pages as $p) {
    if ($uri === "/{$p}" || $uri === "/{$p}/") {
        require __DIR__ . "/{$p}.php";
        exit;
    }
}

// Serve existing static files directly
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// 5. Default fallback to 404
require __DIR__ . '/404.php';
