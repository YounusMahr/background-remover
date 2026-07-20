<?php
/**
 * Configuration, Environment Loader (.env) & Core Helpers for ClearBG Pro (Vanilla PHP)
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('BASE_DIR', __DIR__);
define('ENV_FILE', BASE_DIR . '/.env');
define('DATA_DIR', BASE_DIR . '/data');
define('SETTINGS_FILE', DATA_DIR . '/settings.json');
define('POSTS_FILE', DATA_DIR . '/posts.json');
define('CONTACTS_FILE', DATA_DIR . '/contacts.json');

// Ensure data directory exists on hostinger
if (!is_dir(DATA_DIR)) {
    @mkdir(DATA_DIR, 0755, true);
}

/**
 * Pure PHP .env File Parser & Loader
 */
function load_env($file = ENV_FILE) {
    if (!file_exists($file)) return;
    
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;
        
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            $value = trim($value, '"\'');
            
            if (!array_key_exists($key, $_SERVER) && !array_key_exists($key, $_ENV)) {
                putenv("{$key}={$value}");
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }
}

// Automatically load .env configuration
load_env();

/**
 * PDO Database Connection Helper (MySQL / MariaDB / SQLite)
 */
function get_db_connection() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $driver = $_ENV['DB_DRIVER'] ?? getenv('DB_DRIVER') ?: 'mysql';
    $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: '127.0.0.1';
    $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
    $dbName = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'bgremover_db';
    $user = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'root';
    $pass = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: '';

    try {
        if ($driver === 'sqlite') {
            $pdo = new PDO("sqlite:" . DATA_DIR . "/database.sqlite");
        } else {
            $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";
            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        }
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}

/**
 * Get Site Settings
 */
function get_settings() {
    $envSiteName = $_ENV['SITE_NAME'] ?? getenv('SITE_NAME');
    $envSiteUrl = $_ENV['SITE_URL'] ?? getenv('SITE_URL');
    $envAdsense = $_ENV['GOOGLE_ADSENSE_CLIENT_ID'] ?? getenv('GOOGLE_ADSENSE_CLIENT_ID');
    $envAnalytics = $_ENV['GOOGLE_ANALYTICS_ID'] ?? getenv('GOOGLE_ANALYTICS_ID');

    $fileSettings = [];
    if (file_exists(SETTINGS_FILE)) {
        $json = @file_get_contents(SETTINGS_FILE);
        $fileSettings = json_decode($json, true) ?: [];
    }

    $defaultScheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
    $defaultHost = $_SERVER['HTTP_HOST'] ?? 'localhost:8000';

    return [
        'siteName' => $envSiteName ?: ($fileSettings['siteName'] ?? 'ClearBG Pro'),
        'siteTagline' => $fileSettings['siteTagline'] ?? 'Remove Image Backgrounds 100% Automatically and Free',
        'footerTagline' => $fileSettings['footerTagline'] ?? '100% Private client-side background removal. No server uploads.',
        'siteUrl' => $envSiteUrl ?: ($fileSettings['siteUrl'] ?? "{$defaultScheme}://{$defaultHost}"),
        'googleAnalyticsId' => $envAnalytics ?: ($fileSettings['googleAnalyticsId'] ?? ''),
        'googleAdsenseClientId' => $envAdsense ?: ($fileSettings['googleAdsenseClientId'] ?? ''),
        'robotsTxt' => $fileSettings['robotsTxt'] ?? "User-agent: *\nDisallow: /admin.php\nSitemap: /sitemap.xml"
    ];
}

/**
 * Save Site Settings
 */
function save_settings($settings) {
    $current = get_settings();
    $merged = array_merge($current, $settings);
    @file_put_contents(SETTINGS_FILE, json_encode($merged, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    return $merged;
}

/**
 * Get All Blog Posts
 */
function get_posts() {
    if (!file_exists(POSTS_FILE)) {
        return [];
    }
    $json = @file_get_contents(POSTS_FILE);
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
}

/**
 * Get Single Blog Post by Slug or ID
 */
function get_post_by_slug($slug) {
    $posts = get_posts();
    foreach ($posts as $post) {
        if (($post['slug'] ?? '') === $slug || ($post['id'] ?? '') === $slug) {
            return $post;
        }
    }
    return null;
}

/**
 * Save Blog Posts Array
 */
function save_posts($posts) {
    @file_put_contents(POSTS_FILE, json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

/**
 * Get All Contact Submissions
 */
function get_contacts() {
    if (!file_exists(CONTACTS_FILE)) {
        return [];
    }
    $json = @file_get_contents(CONTACTS_FILE);
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
}

/**
 * Add New Contact Submission
 */
function add_contact($name, $email, $subject, $message) {
    $contacts = get_contacts();
    $newEntry = [
        'id' => uniqid('msg_'),
        'name' => $name,
        'email' => $email,
        'subject' => $subject ?: 'No Subject',
        'message' => $message,
        'date' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
    ];
    array_unshift($contacts, $newEntry);
    @file_put_contents(CONTACTS_FILE, json_encode($contacts, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    return $newEntry;
}

/**
 * Delete Contact Submission
 */
function delete_contact($id) {
    $contacts = get_contacts();
    $filtered = array_values(array_filter($contacts, function($c) use ($id) {
        return $c['id'] !== $id;
    }));
    @file_put_contents(CONTACTS_FILE, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

/**
 * Helper to build clean post URLs: /blog/{slug}
 */
function post_url($slug) {
    return '/blog/' . ltrim($slug, '/');
}

/**
 * Helper to build clean site URLs
 */
function site_url($path = '') {
    $settings = get_settings();
    $baseUrl = rtrim($settings['siteUrl'] ?? '', '/');
    if (empty($baseUrl)) {
        $scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8000';
        $baseUrl = $scheme . '://' . $host;
    }
    return $baseUrl . '/' . ltrim($path, '/');
}

/**
 * AdSense Component Renderer (Disabled for now)
 */
function render_adsense($slot = 'default', $format = 'auto') {
    return '';
}

/**
 * AdSense Header Loader (Disabled for now)
 */
function render_adsense_head() {
    return '';
}
