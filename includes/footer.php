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
                    <li><a href="/blog">Blog &amp; Articles</a></li>
                    <li><a href="/about">About ClearBG Pro</a></li>
                    <li><a href="/sitemap.xml">Sitemap XML</a></li>
                    <li><a href="/robots.txt">Robots.txt</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Legal &amp; Support</h4>
                <ul class="footer-links">
                    <li><a href="/privacy">Privacy Policy</a></li>
                    <li><a href="/terms">Terms of Service</a></li>
                    <li><a href="/cookies">Cookie Policy</a></li>
                    <li><a href="/disclaimer">Disclaimer</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Partner Tools</h4>
                <ul class="footer-links">
                    <li><a href="https://www.effectivecpmnetwork.com/gsyrzt51ha?key=e5f730e78662f544ed4d9d52a201d8e9" target="_blank" rel="noopener sponsored" style="color: var(--primary); font-weight: 600;">★ AI Photo Upscaler</a></li>
                    <li><a href="https://www.effectivecpmnetwork.com/gsyrzt51ha?key=e5f730e78662f544ed4d9d52a201d8e9" target="_blank" rel="noopener sponsored" style="color: var(--primary); font-weight: 600;">★ Vector SVG Converter</a></li>
                    <li><a href="https://www.effectivecpmnetwork.com/gsyrzt51ha?key=e5f730e78662f544ed4d9d52a201d8e9" target="_blank" rel="noopener sponsored" style="color: var(--primary); font-weight: 600;">★ Background Blur AI</a></li>
                </ul>
            </div>
        <!-- Footer Horizontal Ad Banner -->
        <div class="footer-ad-container" style="margin: 20px auto 10px; text-align: center; max-width: 100%; overflow: hidden;">
            <?php echo render_cpm_responsive_banner(); ?>
        </div>

        <div class="footer-bottom">
            <div>&copy; <?php echo date('Y'); ?> <?php echo $siteName; ?>. All rights reserved. 100% Private Client-Side AI.</div>
            <div>Designed for speed, SEO &amp; CPM monetizability.</div>
        </div>
    </div>
</footer>

<!-- Social Bar Ad for bgcleaner.online -->
<script src="https://pl30873280.effectivecpmnetwork.com/74/64/b6/7464b60087c89c482af40208c95e6e2d.js"></script>

</body>
</html>
