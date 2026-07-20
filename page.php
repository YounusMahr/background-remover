<?php
/**
 * Legacy router — kept only to 301-redirect old ?type= URLs to the single
 * canonical clean URL. The rich, canonical content lives in the dedicated
 * files (about.php, privacy.php, ...), served at clean URLs via .htaccess,
 * so we consolidate all link equity there and avoid duplicate content.
 */
require_once __DIR__ . '/config.php';

$type = trim($_GET['type'] ?? '');

$map = [
    'about'      => '/about',
    'privacy'    => '/privacy',
    'terms'      => '/terms',
    'cookies'    => '/cookies',
    'disclaimer' => '/disclaimer',
    'contact'    => '/contact',
];

$target = $map[$type] ?? '/';

header('Location: ' . $target, true, 301);
exit;
