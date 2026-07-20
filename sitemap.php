<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/xml; charset=utf-8');

$settings = get_settings();
$posts = get_posts();
$baseUrl = rtrim($settings['siteUrl'] ?? site_url(''), '/');

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Home Page -->
    <url>
        <loc><?php echo htmlspecialchars($baseUrl); ?>/</loc>
        <lastmod><?php echo date('Y-m-d'); ?></lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>

    <!-- Blog Index Page -->
    <url>
        <loc><?php echo htmlspecialchars($baseUrl); ?>/blog</loc>
        <lastmod><?php echo date('Y-m-d'); ?></lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- Blog Posts (/blog/{slug}) -->
    <?php foreach ($posts as $post): ?>
    <url>
        <loc><?php echo htmlspecialchars($baseUrl); ?>/blog/<?php echo urlencode($post['slug'] ?? $post['id']); ?></loc>
        <lastmod><?php echo htmlspecialchars($post['createdAt'] ?? date('Y-m-d')); ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <?php endforeach; ?>

    <!-- Legal & Information Pages -->
    <?php 
    $pages = ['about', 'contact', 'privacy', 'terms', 'cookies', 'disclaimer'];
    foreach ($pages as $p): 
    ?>
    <url>
        <loc><?php echo htmlspecialchars($baseUrl); ?>/<?php echo $p; ?></loc>
        <lastmod>2026-07-18</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>
    <?php endforeach; ?>
</urlset>
