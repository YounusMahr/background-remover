<?php
require_once __DIR__ . '/config.php';

$pageTitle = "Contact Us - ClearBG Pro | Support & Feedback";
$pageDesc = "Get in touch with the ClearBG Pro team. Send us your questions, feedback, bug reports, or business partnership inquiries.";
$currentPage = "contact";

$submitted = false;
$errorMsg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $subject = trim($_POST['subject'] ?? '');
    $messageText = trim($_POST['message'] ?? '');

    if (!empty($name) && !empty($email) && !empty($messageText)) {
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            add_contact($name, $email, $subject, $messageText);
            $submitted = true;
        } else {
            $errorMsg = "Please enter a valid email address.";
        }
    } else {
        $errorMsg = "Please fill in all required fields.";
    }
}

include BASE_DIR . '/includes/header.php';
?>

<div class="container article-container" style="padding-top: 3rem; padding-bottom: 4rem;">
    <header class="article-header" style="text-align: center; margin-bottom: 2.5rem;">
        <span class="blog-tag">Get in Touch</span>
        <h1 class="article-title" style="margin-top: 0.8rem;">Contact Us</h1>
        <p class="section-subtitle" style="margin-bottom: 0;">Have a question, suggestion, or feedback? We’d love to hear from you!</p>
    </header>

    <main class="article-body">
        <?php if ($submitted): ?>
            <div style="background: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 2rem; border-radius: var(--radius-md); text-align: center; margin-bottom: 2rem;">
                <h2 style="color: #166534; margin-top: 0;">Message Sent Successfully!</h2>
                <p>Thank you for reaching out to ClearBG Pro. Your message has been saved and our team will review it shortly. A confirmation email has been noted for <strong><?php echo htmlspecialchars($email); ?></strong>.</p>
                <a href="/" class="nav-cta" style="display: inline-block; margin-top: 1rem;">Back to Home</a>
            </div>
        <?php else: ?>

            <?php if (!empty($errorMsg)): ?>
                <div style="background: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; padding: 1rem 1.5rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <span><?php echo htmlspecialchars($errorMsg); ?></span>
                </div>
            <?php endif; ?>

            <div class="contact-grid" style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 3rem; margin-bottom: 3rem;">
                <div>
                    <h2>Direct Contact Information</h2>
                    <p>For support, API inquiries, or feature suggestions, feel free to contact us through any of the channels below:</p>

                    <div style="margin-top: 1.5rem;">
                        <div style="margin-bottom: 1.25rem; display: flex; gap: 0.75rem; align-items: flex-start;">
                            <div class="icon-badge-inline">
                                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <div>
                                <strong>Support Email:</strong><br>
                                <a href="mailto:support@bgcleaner.online" style="font-size: 1.05rem;">support@bgcleaner.online</a>
                            </div>
                        </div>
                        <div style="margin-bottom: 1.25rem; display: flex; gap: 0.75rem; align-items: flex-start;">
                            <div class="icon-badge-inline">
                                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                            </div>
                            <div>
                                <strong>Website:</strong><br>
                                <a href="https://bgcleaner.online" target="_blank" style="font-size: 1.05rem;">https://bgcleaner.online</a>
                            </div>
                        </div>
                        <div style="margin-bottom: 1.25rem; display: flex; gap: 0.75rem; align-items: flex-start;">
                            <div class="icon-badge-inline">
                                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <strong>Average Response Time:</strong><br>
                                <span style="color: var(--text-muted);">Within 24 Hours</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-md);">
                    <h2 style="margin-top: 0; font-size: 1.4rem;">Send Us a Message</h2>

                    <form method="POST" action="/contact.php">
                        <div class="form-group">
                            <label for="contact-name">Your Name *</label>
                            <input type="text" id="contact-name" name="name" class="form-control" placeholder="John Doe" required>
                        </div>

                        <div class="form-group">
                            <label for="contact-email">Email Address *</label>
                            <input type="email" id="contact-email" name="email" class="form-control" placeholder="john@example.com" required>
                        </div>

                        <div class="form-group">
                            <label for="contact-subject">Subject</label>
                            <input type="text" id="contact-subject" name="subject" class="form-control" placeholder="Feature Request / Support Question">
                        </div>

                        <div class="form-group">
                            <label for="contact-message">Message *</label>
                            <textarea id="contact-message" name="message" class="form-control" rows="5" placeholder="Write your message here..." required></textarea>
                        </div>

                        <button type="submit" class="btn-download" style="width: 100%; justify-content: center; margin-top: 1rem;">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

        <?php endif; ?>
    </main>
</div>

<?php include BASE_DIR . '/includes/footer.php'; ?>
