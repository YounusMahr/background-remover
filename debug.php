<?php
/**
 * Temporary Diagnostic Script for Hostinger Deployment Debugging
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>ClearBG Pro - Diagnostic Test</h1>";
echo "<p>PHP Version: " . phpversion() . "</p>";

echo "<h2>1. Checking Core Files</h2>";
$files = ['config.php', 'index.php', 'blog.php', 'post.php', '404.php', '.htaccess', '.env'];
foreach ($files as $f) {
    if (file_exists(__DIR__ . '/' . $f)) {
        echo "✅ Found: {$f}<br>";
    } else {
        echo "❌ Missing: {$f}<br>";
    }
}

echo "<h2>2. Checking Data Directory Permissions</h2>";
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    if (@mkdir($dataDir, 0755, true)) {
        echo "✅ Created directory: /data<br>";
    } else {
        echo "❌ Failed to create directory: /data (Permission issue)<br>";
    }
} else {
    echo "✅ Directory exists: /data<br>";
}

echo "<h2>3. Testing Config Include</h2>";
try {
    require_once __DIR__ . '/config.php';
    echo "✅ config.php loaded successfully<br>";
    $settings = get_settings();
    echo "✅ Site Name: " . htmlspecialchars($settings['siteName']) . "<br>";
    echo "✅ Posts Loaded: " . count(get_posts()) . "<br>";
} catch (Throwable $e) {
    echo "❌ Exception in config.php: " . htmlspecialchars($e->getMessage()) . "<br>";
}

echo "<hr><p>Delete debug.php after fixing Hostinger deployment.</p>";
