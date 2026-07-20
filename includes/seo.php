<?php
/**
 * Dynamic SEO & Schema.org JSON-LD Helper
 */

$settings = get_settings();
$siteName = htmlspecialchars($settings['siteName'] ?? 'ClearBG Pro');
$siteUrl = rtrim($settings['siteUrl'] ?? site_url(''), '/');

$pageTitle = $pageTitle ?? "ClearBG Pro - Remove Image Backgrounds 100% Automatically and Free";
$pageDesc = $pageDesc ?? "Remove image backgrounds instantly in your browser. 100% private, no uploads — ClearBG Pro processes photos locally with AI and exports transparent PNG, WebP, and JPEG in Full HD.";
$canonicalUrl = $canonicalUrl ?? (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . ($_SERVER['HTTP_HOST'] ?? 'localhost:8000') . ($_SERVER['REQUEST_URI'] ?? '');
$ogType = $ogType ?? "website";
$ogImage = $ogImage ?? site_url('assets/og-image.jpg');

// Schema.org WebApplication & FAQ schema for Home
$homeSchema = [
    '@context' => 'https://schema.org',
    '@graph' => [
        [
            '@type' => 'WebApplication',
            'name' => $siteName,
            'url' => $siteUrl,
            'applicationCategory' => 'MultimediaApplication',
            'operatingSystem' => 'Any (web browser)',
            'offers' => ['@type' => 'Offer', 'price' => '0', 'priceCurrency' => 'USD'],
            'description' => $pageDesc
        ],
        [
            '@type' => 'FAQPage',
            'mainEntity' => [
                [
                    '@type' => 'Question',
                    'name' => 'Is ClearBG Pro really free?',
                    'acceptedAnswer' => ['@type' => 'Answer', 'text' => 'Yes. ClearBG Pro is completely free to use with no sign-up, watermark, or usage limits.']
                ],
                [
                    '@type' => 'Question',
                    'name' => 'Are my images uploaded to a server?',
                    'acceptedAnswer' => ['@type' => 'Answer', 'text' => 'No. All processing happens locally in your browser using WebAssembly and AI. Your photos never leave your device.']
                ],
                [
                    '@type' => 'Question',
                    'name' => 'What image formats are supported?',
                    'acceptedAnswer' => ['@type' => 'Answer', 'text' => 'You can upload PNG, JPEG, and WebP images. Results can be exported as transparent PNG, WebP, or JPEG in Full HD.']
                ]
            ]
        ]
    ]
];
?>
<!-- SEO Meta Tags -->
<title><?php echo htmlspecialchars($pageTitle); ?></title>
<meta name="description" content="<?php echo htmlspecialchars($pageDesc); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="canonical" href="<?php echo htmlspecialchars($canonicalUrl); ?>">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="<?php echo htmlspecialchars($ogType); ?>">
<meta property="og:url" content="<?php echo htmlspecialchars($canonicalUrl); ?>">
<meta property="og:title" content="<?php echo htmlspecialchars($pageTitle); ?>">
<meta property="og:description" content="<?php echo htmlspecialchars($pageDesc); ?>">
<meta property="og:image" content="<?php echo htmlspecialchars($ogImage); ?>">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="<?php echo htmlspecialchars($canonicalUrl); ?>">
<meta name="twitter:title" content="<?php echo htmlspecialchars($pageTitle); ?>">
<meta name="twitter:description" content="<?php echo htmlspecialchars($pageDesc); ?>">
<meta name="twitter:image" content="<?php echo htmlspecialchars($ogImage); ?>">

<!-- Google Analytics -->
<?php if (!empty($settings['googleAnalyticsId'])): ?>
<script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo htmlspecialchars($settings['googleAnalyticsId']); ?>"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '<?php echo htmlspecialchars($settings['googleAnalyticsId']); ?>');
</script>
<?php endif; ?>

<!-- Schema.org JSON-LD -->
<?php if (isset($customSchema)): ?>
<script type="application/ld+json">
<?php echo json_encode($customSchema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES); ?>
</script>
<?php else: ?>
<script type="application/ld+json">
<?php echo json_encode($homeSchema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES); ?>
</script>
<?php endif; ?>
