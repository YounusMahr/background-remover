<?php
require_once __DIR__ . '/config.php';

$pageTitle = "Background Removal & Image Editing Blog - ClearBG Pro";
$pageDesc = "In-depth guides, technical tutorials, and e-commerce optimization articles on AI image segmentation, transparent product photos, and web performance.";
$currentPage = "blog";

$posts = get_posts();
$selectedTag = trim($_GET['tag'] ?? '');

if (!empty($selectedTag)) {
    $posts = array_filter($posts, function($p) use ($selectedTag) {
        return in_array($selectedTag, $p['tags'] ?? []);
    });
}

include BASE_DIR . '/includes/header.php';
?>

<div class="blog-header">
    <div class="container">
        <h1 class="section-title">Blog &amp; Technical Guides</h1>
        <p class="section-subtitle">Learn about AI image segmentation, e-commerce conversion optimization, and web performance.</p>

        <?php if (!empty($selectedTag)): ?>
            <div style="margin-bottom: 2rem;">
                <span style="font-weight: 600;">Filtering by Tag:</span> 
                <span class="blog-tag"><?php echo htmlspecialchars($selectedTag); ?></span>
                <a href="/blog.php" style="margin-left: 0.8rem; font-size: 0.88rem; text-decoration: underline;">Clear Filter</a>
            </div>
        <?php endif; ?>
    </div>
</div>

<div class="container">
    <?php echo render_adsense('blog-top', 'auto'); ?>

    <div class="blog-grid">
        <?php foreach ($posts as $post): ?>
            <article class="blog-card">
                <div class="blog-card-body">
                    <?php if (!empty($post['tags'][0])): ?>
                        <a href="/blog.php?tag=<?php echo urlencode($post['tags'][0]); ?>" class="blog-tag">
                            <?php echo htmlspecialchars($post['tags'][0]); ?>
                        </a>
                    <?php endif; ?>

                    <h2>
                        <a href="/post.php?slug=<?php echo urlencode($post['slug'] ?? $post['id']); ?>">
                            <?php echo htmlspecialchars($post['title']); ?>
                        </a>
                    </h2>

                    <p><?php echo htmlspecialchars($post['summary']); ?></p>

                    <div class="blog-meta">
                        <span>By <?php echo htmlspecialchars($post['author'] ?? 'ClearBG Pro Team'); ?></span>
                        <span><?php echo htmlspecialchars($post['readTime'] ?? '5 min read'); ?></span>
                    </div>
                </div>
            </article>
        <?php endforeach; ?>
    </div>

    <?php echo render_adsense('blog-bottom', 'auto'); ?>
</div>

<?php include BASE_DIR . '/includes/footer.php'; ?>
