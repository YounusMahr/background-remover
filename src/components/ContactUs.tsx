import React, { useState } from 'react';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate submission to support@bgcleaner.online
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="legal-container">
      <h1>Contact Us</h1>
      <p className="last-updated">We look forward to assisting you. Please expect a response within 24 to 48 business hours.</p>

      <div className="contact-layout">
        <div className="contact-info-panel">
          <h2>Get in Touch</h2>
          <p>For technical inquiries, bug reports, and API partnership discussions, please reach out to our dedicated support channels:</p>
          
          <div className="contact-details">
            <div className="detail-item">
              <span className="detail-label">Support Email:</span>
              <span className="detail-val"><a href="mailto:support@bgcleaner.online">support@bgcleaner.online</a></span>
            </div>
            <div className="detail-item">
              <span className="detail-label">General Contact:</span>
              <span className="detail-val"><a href="mailto:contact@bgcleaner.online">contact@bgcleaner.online</a></span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Office Hours:</span>
              <span className="detail-val">Monday - Friday, 9:00 AM - 5:00 PM EST</span>
            </div>
          </div>

          <p className="info-notice">Note: Because all image processing is performed client-side on your local device, our support team cannot retrieve or examine any images you process. Your data remains entirely private to you.</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <h2>Send a Message</h2>
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="How can we help you?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Write your detailed message here..."
            />
          </div>

          <button type="submit" disabled={status === 'loading'} className="contact-submit-btn">
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <p className="status-message success">Thank you. Your message has been sent successfully. We will get back to you shortly.</p>
          )}
          {status === 'error' && (
            <p className="status-message error">An error occurred while sending your message. Please try again or email us directly.</p>
          )}
        </form>
      </div>
    </div>
  );
};
