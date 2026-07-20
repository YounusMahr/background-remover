<?php
require_once __DIR__ . '/config.php';

$slug = trim($_GET['slug'] ?? '');
$post = get_post_by_slug($slug);

if (!$post) {
    include BASE_DIR . '/404.php';
    exit;
}

$pageTitle = htmlspecialchars($post['metaTitle'] ?? ($post['title'] . " - ClearBG Pro"));
$pageDesc = htmlspecialchars($post['metaDescription'] ?? ($post['excerpt'] ?? $post['summary']));
$canonicalUrl = site_url('blog/' . urlencode($post['slug'] ?? $post['id']));
$ogType = "article";
$currentPage = "blog";

$customSchema = [
    '@context' => 'https://schema.org',
    '@type' => 'BlogPosting',
    'headline' => $post['title'],
    'description' => $post['metaDescription'] ?? ($post['excerpt'] ?? $post['summary']),
    'author' => [
        '@type' => 'Person',
        'name' => $post['author'] ?? 'ClearBG Pro Team'
    ],
    'datePublished' => $post['createdAt'] ?? '2026-07-18',
    'mainEntityOfPage' => [
        '@type' => 'WebPage',
        '@id' => $canonicalUrl
    ]
];

include BASE_DIR . '/includes/header.php';
?>

<div class="container article-container">
    <header class="article-header">
        <?php if (!empty($post['tags'])): ?>
            <div style="margin-bottom: 1rem;">
                <?php foreach ($post['tags'] as $tag): ?>
                    <a href="/blog?tag=<?php echo urlencode($tag); ?>" class="blog-tag">
                        <?php echo htmlspecialchars($tag); ?>
                    </a>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <h1 class="article-title"><?php echo htmlspecialchars($post['title']); ?></h1>

        <div class="blog-meta" style="font-size: 0.95rem; color: var(--text-muted);">
            <span>Published on <?php echo htmlspecialchars($post['createdAt'] ?? '2026-07-18'); ?> by <strong><?php echo htmlspecialchars($post['author'] ?? 'ClearBG Pro Team'); ?></strong></span>
            <span>⏱️ <?php echo htmlspecialchars($post['readTime'] ?? '8 min read'); ?></span>
        </div>
    </header>

    <!-- Top Article AdSense Slot -->
    <?php echo render_adsense('post-header-slot', 'auto'); ?>

    <main class="article-body">
        <?php echo $post['content']; ?>
    </main>

    <!-- Bottom Article AdSense Slot -->
    <?php echo render_adsense('post-footer-slot', 'auto'); ?>

    <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
        <a href="/blog" style="font-weight: 600;">← Back to all articles</a>
        <a href="/#tool-section" class="nav-cta">Try Background Remover Free</a>
    </div>
</div>

<?php include BASE_DIR . '/includes/footer.php'; ?>
