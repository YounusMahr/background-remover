<?php
/**
 * Footer Component (remove.bg style)
 */
$settings = get_settings();
$siteName = htmlspecialchars($settings['siteName'] ?? 'ClearBG Pro');
$footerTagline = htmlspecialchars($settings['footerTagline'] ?? '100% Private client-side background removal.');
?>
<footer class="site-footer">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-about">
                <a href="/" class="site-logo">
                    <div class="logo-badge">BG</div>
                    <span><?php echo $siteName; ?></span>
                </a>
                <p><?php echo $footerTagline; ?></p>
            </div>

            <div class="footer-col">
                <h4>Product</h4>
                <ul class="footer-links">
                    <li><a href="/#tool-section">Remove Background</a></li>
                    <li><a href="/#how-to-use">How to Use</a></li>
                    <li><a href="/#features">Why Choose Us</a></li>
                    <li><a href="/#faq">Frequently Asked Questions</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Resources &amp; SEO</h4>
                <ul class="footer-links">
                    <li><a href="/blog.php">Blog &amp; Articles</a></li>
                    <li><a href="/about.php">About ClearBG Pro</a></li>
                    <li><a href="/sitemap.php">Sitemap XML</a></li>
                    <li><a href="/robots.txt">Robots.txt</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Legal &amp; Support</h4>
                <ul class="footer-links">
                    <li><a href="/privacy.php">Privacy Policy</a></li>
                    <li><a href="/terms.php">Terms of Service</a></li>
                    <li><a href="/cookies.php">Cookie Policy</a></li>
                    <li><a href="/disclaimer.php">Disclaimer</a></li>
                    <li><a href="/contact.php">Contact Us</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <div>&copy; <?php echo date('Y'); ?> <?php echo $siteName; ?>. All rights reserved. 100% Private Client-Side AI.</div>
            <div>Designed for speed, SEO &amp; AdSense monetizability.</div>
        </div>
    </div>
</footer>

</body>
</html>
