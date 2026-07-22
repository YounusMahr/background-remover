<?php
require_once __DIR__ . '/config.php';

http_response_code(404);

$pageTitle = "404 - Page Not Found | ClearBG Pro";
$pageDesc = "The page you are looking for does not exist or has been removed. Return to ClearBG Pro home page or try our free background remover tool.";
$currentPage = "404";

include BASE_DIR . '/includes/header.php';
?>

<div class="container" style="padding: 5rem 1.5rem 6rem; text-align: center;">
    <div style="max-width: 680px; margin: 0 auto;">
        <div style="display: inline-flex; align-items: center; justify-content: center; width: 96px; height: 96px; background: linear-gradient(135deg, var(--primary-light), #e0ebff); color: var(--primary); border-radius: 24px; margin-bottom: 1.5rem; box-shadow: var(--shadow-md);">
            <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 0A3 3 0 104.5 4.5a3 3 0 004.621 4.621zm0 5.758a3 3 0 10-4.621 4.621 3 3 0 004.621-4.621z"></path></svg>
        </div>

        <h1 style="font-family: 'Outfit', sans-serif; font-size: 3.5rem; font-weight: 800; color: var(--text-main); line-height: 1.1; margin-bottom: 1rem;">
            404 - Page Background Removed!
        </h1>

        <p style="font-size: 1.15rem; color: var(--text-muted); margin-bottom: 2.5rem; line-height: 1.6;">
            Oops! The page you are looking for seems to have been erased, renamed, or never existed in the first place.
        </p>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 4rem;">
            <a href="/" class="upload-btn-main" style="text-decoration: none; width: auto; padding: 0.9rem 2.2rem; font-size: 1rem;">
                ← Back to Home Page
            </a>
            <a href="/#tool-section" class="btn-restart" style="text-decoration: none; padding: 0.9rem 2rem; font-size: 1rem; border-radius: var(--radius-pill); background: var(--bg-secondary);">
                Upload Image Tool
            </a>
        </div>

        <!-- Helpful Suggestions Grid -->
        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 2.5rem 2rem; border: 1px solid var(--border-color); text-align: left;">
            <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; margin-bottom: 1.25rem; text-align: center;">
                Need help finding something?
            </h3>

            <div class="features-grid" style="grid-template-columns: repeat(3, 1fr); gap: 1.25rem;">
                <div class="feature-card" style="background: var(--bg-card);">
                    <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span class="icon-badge-inline">
                            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m-6 4h4"></path></svg>
                        </span>
                        <a href="/blog">Read Blog &amp; Guides</a>
                    </h4>
                    <p style="font-size: 0.88rem; color: var(--text-muted);">Explore 15 in-depth guides on AI segmentation and e-commerce.</p>
                </div>

                <div class="feature-card" style="background: var(--bg-card);">
                    <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span class="icon-badge-inline">
                            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </span>
                        <a href="/about">About ClearBG Pro</a>
                    </h4>
                    <p style="font-size: 0.88rem; color: var(--text-muted);">Learn about our zero-upload client-side WebAssembly AI technology.</p>
                </div>

                <div class="feature-card" style="background: var(--bg-card);">
                    <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span class="icon-badge-inline">
                            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </span>
                        <a href="/contact">Contact Support</a>
                    </h4>
                    <p style="font-size: 0.88rem; color: var(--text-muted);">Reach out to our team if you need assistance or reported a broken link.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include BASE_DIR . '/includes/footer.php'; ?>
