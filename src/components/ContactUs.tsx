'use client';

import React, { useState } from 'react';
import { Mail, Clock, ShieldCheck, Send, MessageSquare } from 'lucide-react';

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
    <div className="contact-page">
      <header className="contact-hero">
        <h1>Contact Us</h1>
        <p>
          Questions, bug reports, or partnership ideas? We would love to hear from you.
          Expect a response within 24 to 48 business hours.
        </p>
      </header>

      <div className="contact-layout">
        <aside className="contact-info-panel">
          <h2>Get in Touch</h2>
          <p className="contact-info-intro">
            For technical inquiries, bug reports, and API partnership discussions, reach
            out through any of the channels below.
          </p>

          <div className="contact-details">
            <div className="detail-item">
              <div className="detail-icon">
                <Mail size={18} />
              </div>
              <div className="detail-body">
                <span className="detail-label">Support Email</span>
                <span className="detail-val">
                  <a href="mailto:support@bgcleaner.online">support@bgcleaner.online</a>
                </span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <MessageSquare size={18} />
              </div>
              <div className="detail-body">
                <span className="detail-label">General Contact</span>
                <span className="detail-val">
                  <a href="mailto:contact@bgcleaner.online">contact@bgcleaner.online</a>
                </span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Clock size={18} />
              </div>
              <div className="detail-body">
                <span className="detail-label">Office Hours</span>
                <span className="detail-val">Mon – Fri, 9:00 AM – 5:00 PM EST</span>
              </div>
            </div>
          </div>

          <div className="info-notice">
            <ShieldCheck size={18} />
            <p>
              All image processing happens locally on your device, so our support team
              can never access or examine any image you process. Your data stays private
              to you.
            </p>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="contact-form">
          <h2>Send a Message</h2>

          <div className="form-row">
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
                placeholder="you@example.com"
              />
            </div>
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
            {status === 'loading' ? (
              'Sending...'
            ) : (
              <>
                <Send size={16} />
                Send Message
              </>
            )}
          </button>

          {status === 'success' && (
            <p className="status-message success">
              Thank you. Your message has been sent successfully. We will get back to you shortly.
            </p>
          )}
          {status === 'error' && (
            <p className="status-message error">
              An error occurred while sending your message. Please try again or email us directly.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
