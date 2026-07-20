<?php
require_once __DIR__ . '/config.php';

$adminPassword = $_ENV['ADMIN_PASSWORD'] ?? getenv('ADMIN_PASSWORD') ?: 'admin123';
$message = '';
$loginError = '';

// Handle Login / Logout Actions
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    unset($_SESSION['admin_logged_in']);
    header('Location: /admin.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    $pass = $_POST['password'] ?? '';
    if ($pass === $adminPassword) {
        $_SESSION['admin_logged_in'] = true;
        header('Location: /admin.php');
        exit;
    } else {
        $loginError = "Incorrect admin password. Please try again.";
    }
}

// Show Login Screen if not authenticated
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Login - ClearBG Pro</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/admin.css">
    <link rel="icon" type="image/svg+xml" href="/public/favicon.svg">
</head>
<body class="admin-body" style="align-items: center; justify-content: center; background: #0f172a; min-height: 100vh;">

<div style="max-width: 400px; width: 100%; padding: 2rem; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); text-align: center;">
    <div style="width: 54px; height: 54px; background: #2f6beb; color: white; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.4rem; margin-bottom: 1rem;">
        BG
    </div>
    
    <h1 style="font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">
        Admin Dashboard
    </h1>
    <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 2rem;">
        Enter your password to access site &amp; blog management.
    </p>

    <?php if (!empty($loginError)): ?>
        <div style="background: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; padding: 0.75rem; border-radius: 8px; font-size: 0.88rem; margin-bottom: 1.25rem;">
            ⚠️ <?php echo htmlspecialchars($loginError); ?>
        </div>
    <?php endif; ?>

    <form method="POST" action="/admin.php">
        <input type="hidden" name="action" value="login">
        
        <div class="form-group" style="text-align: left;">
            <label for="admin-pass">Admin Password</label>
            <input type="password" id="admin-pass" name="password" class="form-control" placeholder="Enter password" required autofocus>
            <small style="color: #94a3b8; font-size: 0.78rem; display: block; margin-top: 0.4rem;">
                Default password: <code>admin123</code> (Configurable in <code>.env</code>)
            </small>
        </div>

        <button type="submit" class="btn-admin" style="width: 100%; padding: 0.9rem; font-size: 1rem; border-radius: 8px; margin-top: 0.5rem;">
            Sign In to Dashboard
        </button>
    </form>
</div>

</body>
</html>
<?php
    exit;
}

// Authenticated Admin Dashboard Code
$activeTab = $_GET['tab'] ?? 'dashboard';
$settings = get_settings();
$posts = get_posts();
$contacts = get_contacts();

// Handle Admin POST Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'save_settings') {
        $updated = [
            'siteName' => trim($_POST['siteName'] ?? ''),
            'siteTagline' => trim($_POST['siteTagline'] ?? ''),
            'footerTagline' => trim($_POST['footerTagline'] ?? ''),
            'siteUrl' => trim($_POST['siteUrl'] ?? ''),
            'googleAnalyticsId' => trim($_POST['googleAnalyticsId'] ?? ''),
            'googleAdsenseClientId' => trim($_POST['googleAdsenseClientId'] ?? ''),
            'robotsTxt' => trim($_POST['robotsTxt'] ?? '')
        ];
        $settings = save_settings($updated);
        if (!empty($updated['robotsTxt'])) {
            file_put_contents(BASE_DIR . '/robots.txt', $updated['robotsTxt']);
        }
        $message = "Site, Robots.txt & Monetization settings updated successfully!";
        $activeTab = 'settings';
    } elseif ($action === 'save_post') {
        $id = trim($_POST['id'] ?? '');
        $title = trim($_POST['title'] ?? '');
        $slug = trim($_POST['slug'] ?? '');
        $metaTitle = trim($_POST['metaTitle'] ?? '');
        $metaDescription = trim($_POST['metaDescription'] ?? '');
        $excerpt = trim($_POST['excerpt'] ?? '');
        $content = trim($_POST['content'] ?? '');
        $tags = array_map('trim', explode(',', $_POST['tags'] ?? ''));

        if (!empty($title) && !empty($content)) {
            if (empty($slug)) {
                $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $title));
            }
            if (empty($metaTitle)) {
                $metaTitle = $title . ' - ClearBG Pro';
            }
            if (empty($metaDescription)) {
                $metaDescription = substr(strip_tags($excerpt ?: $content), 0, 160);
            }
            if (empty($excerpt)) {
                $excerpt = substr(strip_tags($content), 0, 200);
            }

            if (!empty($id)) {
                foreach ($posts as &$p) {
                    if ($p['id'] === $id) {
                        $p['title'] = $title;
                        $p['slug'] = $slug;
                        $p['metaTitle'] = $metaTitle;
                        $p['metaDescription'] = $metaDescription;
                        $p['excerpt'] = $excerpt;
                        $p['summary'] = $excerpt;
                        $p['content'] = $content;
                        $p['tags'] = $tags;
                        break;
                    }
                }
            } else {
                $newPost = [
                    'id' => (string)(count($posts) + 1),
                    'title' => $title,
                    'slug' => $slug,
                    'metaTitle' => $metaTitle,
                    'metaDescription' => $metaDescription,
                    'excerpt' => $excerpt,
                    'summary' => $excerpt,
                    'content' => $content,
                    'createdAt' => date('Y-m-d'),
                    'author' => $settings['siteName'] . ' Team',
                    'readTime' => '8 min read',
                    'tags' => $tags
                ];
                array_unshift($posts, $newPost);
            }
            save_posts($posts);
            $message = "Blog article saved successfully with all SEO metadata fields!";
            $activeTab = 'blog';
        }
    } elseif ($action === 'delete_post') {
        $deleteId = $_POST['delete_id'] ?? '';
        $posts = array_values(array_filter($posts, function($p) use ($deleteId) {
            return $p['id'] !== $deleteId;
        }));
        save_posts($posts);
        $message = "Article deleted successfully!";
        $activeTab = 'blog';
    } elseif ($action === 'delete_contact') {
        $contactId = $_POST['contact_id'] ?? '';
        delete_contact($contactId);
        $contacts = get_contacts();
        $message = "Contact message deleted successfully!";
        $activeTab = 'contacts';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard - <?php echo htmlspecialchars($settings['siteName']); ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/admin.css">
    <link rel="icon" type="image/svg+xml" href="/public/favicon.svg">
</head>
<body class="admin-body">

<div class="admin-layout">
    <!-- Sidebar Navigation -->
    <aside class="admin-sidebar">
        <a href="/admin.php" class="admin-brand">
            <div class="admin-brand-badge">BG</div>
            <span>Admin Dashboard</span>
        </a>

        <ul class="sidebar-menu">
            <li class="sidebar-item <?php echo $activeTab === 'dashboard' ? 'active' : ''; ?>">
                <a href="#" onclick="switchTab('dashboard'); return false;">
                    <span>📊</span>
                    <span>Dashboard</span>
                </a>
            </li>
            <li class="sidebar-item <?php echo $activeTab === 'contacts' ? 'active' : ''; ?>">
                <a href="#" onclick="switchTab('contacts'); return false;">
                    <span>📩</span>
                    <span>Contact Messages (<?php echo count($contacts); ?>)</span>
                </a>
            </li>
            <li class="sidebar-item <?php echo $activeTab === 'blog' ? 'active' : ''; ?>">
                <a href="#" onclick="switchTab('blog'); return false;">
                    <span>📝</span>
                    <span>Blog Articles (<?php echo count($posts); ?>)</span>
                </a>
            </li>
            <li class="sidebar-item <?php echo $activeTab === 'settings' ? 'active' : ''; ?>">
                <a href="#" onclick="switchTab('settings'); return false;">
                    <span>⚙️</span>
                    <span>Site &amp; Monetization</span>
                </a>
            </li>
        </ul>

        <div class="sidebar-footer">
            <a href="/" target="_blank" class="btn-sidebar-view" style="margin-bottom: 0.5rem;">
                <span>View Live Site</span>
                <span>↗</span>
            </a>
            <a href="/admin.php?action=logout" class="btn-sidebar-view" style="background: #dc2626;">
                <span>Sign Out</span>
                <span>🚪</span>
            </a>
        </div>
    </aside>

    <!-- Main Content Area -->
    <main class="admin-main">
        <?php if (!empty($message)): ?>
            <div class="alert-success">✅ <?php echo htmlspecialchars($message); ?></div>
        <?php endif; ?>

        <!-- SECTION 1: DASHBOARD OVERVIEW -->
        <section id="section-dashboard" style="<?php echo $activeTab !== 'dashboard' ? 'display: none;' : ''; ?>">
            <div class="admin-top-bar">
                <h1>Overview &amp; Stat Cards</h1>
                <div style="font-size: 0.9rem; color: #64748b;">
                    Server Time: <strong><?php echo date('M d, Y H:i'); ?></strong>
                </div>
            </div>

            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-header">
                        <span>Blog Articles</span>
                        <div class="metric-icon">📝</div>
                    </div>
                    <div class="metric-value"><?php echo count($posts); ?></div>
                    <div class="metric-footer">Published SEO guides</div>
                </div>

                <div class="metric-card">
                    <div class="metric-header">
                        <span>Contact Messages</span>
                        <div class="metric-icon">📩</div>
                    </div>
                    <div class="metric-value"><?php echo count($contacts); ?></div>
                    <div class="metric-footer">Submissions from contact.php</div>
                </div>

                <div class="metric-card">
                    <div class="metric-header">
                        <span>AdSense Status</span>
                        <div class="metric-icon">💰</div>
                    </div>
                    <div class="metric-value" style="font-size: 1.5rem; margin: 0.8rem 0;">
                        <?php if (!empty($settings['googleAdsenseClientId'])): ?>
                            <span class="status-pill active">Configured</span>
                        <?php else: ?>
                            <span class="status-pill pending">Pending Client ID</span>
                        <?php endif; ?>
                    </div>
                    <div class="metric-footer"><?php echo !empty($settings['googleAdsenseClientId']) ? htmlspecialchars($settings['googleAdsenseClientId']) : 'Ad placeholders active'; ?></div>
                </div>

                <div class="metric-card">
                    <div class="metric-header">
                        <span>Analytics</span>
                        <div class="metric-icon">📈</div>
                    </div>
                    <div class="metric-value" style="font-size: 1.5rem; margin: 0.8rem 0;">
                        <?php if (!empty($settings['googleAnalyticsId'])): ?>
                            <span class="status-pill active">Tracking Active</span>
                        <?php else: ?>
                            <span class="status-pill pending">Not Configured</span>
                        <?php endif; ?>
                    </div>
                    <div class="metric-footer"><?php echo !empty($settings['googleAnalyticsId']) ? htmlspecialchars($settings['googleAnalyticsId']) : 'Add ID in settings'; ?></div>
                </div>
            </div>

            <!-- Recent Submissions Table Preview -->
            <div class="admin-card">
                <div class="admin-card-header">
                    <h2>Recent Contact Submissions</h2>
                    <a href="#" onclick="switchTab('contacts'); return false;" style="color: var(--admin-primary); font-weight: 600; text-decoration: none;">View All Submissions →</a>
                </div>

                <?php if (empty($contacts)): ?>
                    <p style="color: #64748b; padding: 1rem 0;">No contact form submissions received yet. Test by submitting a message on <a href="/contact" target="_blank">/contact</a>.</p>
                <?php else: ?>
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach (array_slice($contacts, 0, 5) as $c): ?>
                            <tr>
                                <td><strong><?php echo htmlspecialchars($c['name']); ?></strong></td>
                                <td><a href="mailto:<?php echo htmlspecialchars($c['email']); ?>"><?php echo htmlspecialchars($c['email']); ?></a></td>
                                <td><?php echo htmlspecialchars($c['subject']); ?></td>
                                <td><?php echo htmlspecialchars($c['date']); ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>
        </section>

        <!-- SECTION 2: CONTACT MESSAGES -->
        <section id="section-contacts" style="<?php echo $activeTab !== 'contacts' ? 'display: none;' : ''; ?>">
            <div class="admin-top-bar">
                <h1>Submitted Contact Messages</h1>
            </div>

            <div class="admin-card">
                <div class="admin-card-header">
                    <h2>Messages from Frontend (<?php echo count($contacts); ?>)</h2>
                </div>

                <?php if (empty($contacts)): ?>
                    <p style="color: #64748b; padding: 2rem 0; text-align: center;">No contact form messages found.</p>
                <?php else: ?>
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Sender</th>
                                <th>Subject &amp; Message</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($contacts as $c): ?>
                            <tr>
                                <td style="width: 220px;">
                                    <strong><?php echo htmlspecialchars($c['name']); ?></strong><br>
                                    <a href="mailto:<?php echo htmlspecialchars($c['email']); ?>" style="font-size: 0.88rem;"><?php echo htmlspecialchars($c['email']); ?></a>
                                </td>
                                <td>
                                    <div style="font-weight: 700; margin-bottom: 0.4rem;"><?php echo htmlspecialchars($c['subject']); ?></div>
                                    <div class="msg-box"><?php echo htmlspecialchars($c['message']); ?></div>
                                </td>
                                <td style="width: 140px; font-size: 0.85rem; color: #64748b;"><?php echo htmlspecialchars($c['date']); ?></td>
                                <td style="width: 90px;">
                                    <form method="POST" style="display: inline;" onsubmit="return confirm('Delete this contact message?');">
                                        <input type="hidden" name="action" value="delete_contact">
                                        <input type="hidden" name="contact_id" value="<?php echo $c['id']; ?>">
                                        <button type="submit" class="btn-action-delete">Delete</button>
                                    </form>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>
        </section>

        <!-- SECTION 3: BLOG CRUD -->
        <section id="section-blog" style="<?php echo $activeTab !== 'blog' ? 'display: none;' : ''; ?>">
            <div class="admin-top-bar">
                <h1>Blog Article Management (15 Articles &amp; SEO Meta Fields)</h1>
            </div>

            <div class="admin-card">
                <div class="admin-card-header">
                    <h2 id="blog-form-title">Create / Edit Blog Article</h2>
                    <button type="button" onclick="resetBlogForm()" style="background: none; border: 1px solid #cbd5e1; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">+ New Article</button>
                </div>

                <form method="POST" id="blog-form">
                    <input type="hidden" name="action" value="save_post">
                    <input type="hidden" name="id" id="blog-id" value="">

                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label for="blog-title">Article Title *</label>
                            <input type="text" id="blog-title" name="title" class="form-control" placeholder="e.g. How to Capture Studio Quality Photos" required>
                        </div>
                        <div class="form-group">
                            <label for="blog-slug">Slug URL (Auto-generated if blank)</label>
                            <input type="text" id="blog-slug" name="slug" class="form-control" placeholder="e.g. studio-quality-photos">
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label for="blog-metaTitle">SEO Meta Title</label>
                            <input type="text" id="blog-metaTitle" name="metaTitle" class="form-control" placeholder="SEO Title tag (e.g. DIY Product Photography Guide)">
                        </div>
                        <div class="form-group">
                            <label for="blog-tags">Tags (Comma-separated)</label>
                            <input type="text" id="blog-tags" name="tags" class="form-control" placeholder="AI Technology, Web Performance, E-commerce">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="blog-metaDescription">SEO Meta Description</label>
                        <input type="text" id="blog-metaDescription" name="metaDescription" class="form-control" placeholder="150-160 character description for Google Search snippet">
                    </div>

                    <div class="form-group">
                        <label for="blog-excerpt">Excerpt / Summary *</label>
                        <input type="text" id="blog-excerpt" name="excerpt" class="form-control" placeholder="Short summary displayed on blog card listing" required>
                    </div>

                    <div class="form-group">
                        <label for="blog-content">Article Body (HTML Supported, 850-900+ words) *</label>
                        <textarea id="blog-content" name="content" class="form-control" rows="12" placeholder="<h1>Title</h1><p>Write detailed article content here...</p>" required></textarea>
                    </div>

                    <button type="submit" class="btn-admin">Save Blog Article</button>
                </form>
            </div>

            <div class="admin-card">
                <div class="admin-card-header">
                    <h2>Existing Published Articles (<?php echo count($posts); ?>)</h2>
                </div>

                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Title, Slug &amp; Meta Title</th>
                            <th>Excerpt</th>
                            <th>Tags</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($posts as $p): ?>
                        <tr>
                            <td style="width: 350px;">
                                <strong><?php echo htmlspecialchars($p['title']); ?></strong><br>
                                <span style="font-size: 0.8rem; color: #2f6beb;">Meta Title: <?php echo htmlspecialchars($p['metaTitle'] ?? $p['title']); ?></span><br>
                                <a href="/blog/<?php echo urlencode($p['slug'] ?? $p['id']); ?>" target="_blank" style="font-size: 0.8rem; color: #64748b;">/blog/<?php echo htmlspecialchars($p['slug'] ?? $p['id']); ?> ↗</a>
                            </td>
                            <td style="font-size: 0.88rem; color: #64748b;">
                                <?php echo htmlspecialchars(substr($p['excerpt'] ?? $p['summary'] ?? '', 0, 100)); ?>...
                            </td>
                            <td style="width: 180px;">
                                <?php foreach ($p['tags'] ?? [] as $t): ?>
                                    <span class="status-pill active" style="font-size: 0.7rem; padding: 0.15rem 0.5rem; margin-right: 0.2rem; text-transform: none;"><?php echo htmlspecialchars($t); ?></span>
                                <?php endforeach; ?>
                            </td>
                            <td style="width: 120px;">
                                <a href="#" class="btn-action-edit" onclick="editBlogPost(<?php echo htmlspecialchars(json_encode($p)); ?>); return false;">Edit</a>
                                <form method="POST" style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this article?');">
                                    <input type="hidden" name="action" value="delete_post">
                                    <input type="hidden" name="delete_id" value="<?php echo $p['id']; ?>">
                                    <button type="submit" class="btn-action-delete">Delete</button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- SECTION 4: SETTINGS -->
        <section id="section-settings" style="<?php echo $activeTab !== 'settings' ? 'display: none;' : ''; ?>">
            <div class="admin-top-bar">
                <h1>Site, SEO &amp; Monetization Settings</h1>
            </div>

            <form method="POST">
                <input type="hidden" name="action" value="save_settings">

                <div class="admin-card">
                    <div class="admin-card-header">
                        <h2>General Information &amp; Canonical URL</h2>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div class="form-group">
                            <label for="siteName">Site Name</label>
                            <input type="text" id="siteName" name="siteName" class="form-control" value="<?php echo htmlspecialchars($settings['siteName'] ?? ''); ?>" required>
                        </div>
                        <div class="form-group">
                            <label for="siteUrl">Canonical Site URL</label>
                            <input type="text" id="siteUrl" name="siteUrl" class="form-control" value="<?php echo htmlspecialchars($settings['siteUrl'] ?? ''); ?>" placeholder="https://bgcleaner.online">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="footerTagline">Footer Tagline</label>
                        <input type="text" id="footerTagline" name="footerTagline" class="form-control" value="<?php echo htmlspecialchars($settings['footerTagline'] ?? ''); ?>">
                    </div>
                </div>

                <div class="admin-card">
                    <div class="admin-card-header">
                        <h2>Monetization &amp; Analytics Integration</h2>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div class="form-group">
                            <label for="googleAdsenseClientId">Google AdSense Publisher Client ID</label>
                            <input type="text" id="googleAdsenseClientId" name="googleAdsenseClientId" class="form-control" value="<?php echo htmlspecialchars($settings['googleAdsenseClientId'] ?? ''); ?>" placeholder="ca-pub-XXXXXXXXXXXXXXXX">
                        </div>

                        <div class="form-group">
                            <label for="googleAnalyticsId">Google Analytics Measurement ID</label>
                            <input type="text" id="googleAnalyticsId" name="googleAnalyticsId" class="form-control" value="<?php echo htmlspecialchars($settings['googleAnalyticsId'] ?? ''); ?>" placeholder="G-XXXXXXXXXX">
                        </div>
                    </div>
                </div>

                <div class="admin-card">
                    <div class="admin-card-header">
                        <h2>Robots.txt &amp; XML Sitemap</h2>
                    </div>

                    <div class="form-group">
                        <label>Dynamic XML Sitemap Status</label>
                        <div style="background: #f1f5f9; padding: 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>URL:</strong> <a href="/sitemap.xml" target="_blank">/sitemap.xml</a>
                            </div>
                            <a href="/sitemap.xml" target="_blank" class="btn-sidebar-view" style="background: var(--admin-primary);">Test Sitemap ↗</a>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="robotsTxt">Robots.txt Content</label>
                        <textarea id="robotsTxt" name="robotsTxt" class="form-control" rows="6"><?php echo htmlspecialchars($settings['robotsTxt'] ?? ''); ?></textarea>
                    </div>

                    <button type="submit" class="btn-admin" style="font-size: 1.05rem; padding: 0.85rem 2.5rem;">Save All Settings</button>
                </div>
            </form>
        </section>
    </main>
</div>

<script>
function switchTab(tabName) {
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    document.getElementById('section-dashboard').style.display = 'none';
    document.getElementById('section-contacts').style.display = 'none';
    document.getElementById('section-blog').style.display = 'none';
    document.getElementById('section-settings').style.display = 'none';

    if (tabName === 'dashboard') {
        document.querySelectorAll('.sidebar-item')[0].classList.add('active');
        document.getElementById('section-dashboard').style.display = 'block';
    } else if (tabName === 'contacts') {
        document.querySelectorAll('.sidebar-item')[1].classList.add('active');
        document.getElementById('section-contacts').style.display = 'block';
    } else if (tabName === 'blog') {
        document.querySelectorAll('.sidebar-item')[2].classList.add('active');
        document.getElementById('section-blog').style.display = 'block';
    } else if (tabName === 'settings') {
        document.querySelectorAll('.sidebar-item')[3].classList.add('active');
        document.getElementById('section-settings').style.display = 'block';
    }
}

function editBlogPost(post) {
    switchTab('blog');
    document.getElementById('blog-form-title').innerText = 'Edit Article: ' + post.title;
    document.getElementById('blog-id').value = post.id;
    document.getElementById('blog-title').value = post.title;
    document.getElementById('blog-slug').value = post.slug || '';
    document.getElementById('blog-metaTitle').value = post.metaTitle || post.title || '';
    document.getElementById('blog-metaDescription').value = post.metaDescription || '';
    document.getElementById('blog-excerpt').value = post.excerpt || post.summary || '';
    document.getElementById('blog-tags').value = (post.tags || []).join(', ');
    document.getElementById('blog-content').value = post.content || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetBlogForm() {
    document.getElementById('blog-form-title').innerText = 'Create New Blog Article';
    document.getElementById('blog-form').reset();
    document.getElementById('blog-id').value = '';
}
</script>

</body>
</html>
