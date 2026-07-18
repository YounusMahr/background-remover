import React from 'react';

export const AboutUs: React.FC = () => {
  return (
    <div className="legal-container">
      <h1>About Us</h1>
      <p className="last-updated">Last Updated: July 18, 2026</p>
      
      <section className="legal-section">
        <p>Welcome to BGCleaner (accessible via bgcleaner.online), your premier destination for high-quality, privacy-centric image background removal. We are dedicated to providing state-of-the-art web utility software that operates directly within your browser, ensuring your images and sensitive data never upload to external servers.</p>
      </section>

      <section className="legal-section">
        <h2>Our Mission</h2>
        <p>Our mission is simple: to make professional-grade image editing tools accessible, instantaneous, and completely secure for everyone. By leveraging advanced WebAssembly and client-side artificial intelligence models, we bypass the need for traditional cloud processing, providing our users with maximum privacy and speed without the overhead of cloud subscription plans.</p>
      </section>

      <section className="legal-section">
        <h2>How BGCleaner Works</h2>
        <p>Unlike traditional background removal sites that upload your photos to remote servers (leaving them vulnerable to storage, profiling, or unauthorized access), BGCleaner works 100% locally. The neural network model is downloaded directly to your browser's local cache on the first run, and all subsequent segmentation is processed entirely by your machine's CPU/GPU.</p>
        <p>This localized architecture guarantees:</p>
        <ul>
          <li><strong>Absolute Privacy:</strong> Your photos never leave your device.</li>
          <li><strong>High Performance:</strong> Processing speeds are governed by local hardware, bypassing internet bandwidth lag.</li>
          <li><strong>Offline Usability:</strong> Once cached, the tool can function without an active internet connection.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>Our Commitment to Standards</h2>
        <p>BGCleaner maintains rigorous compliance with global user privacy standards. We operate on a model of minimal data collection. We do not store personal photos, metadata, or session activity. Our platform is funded through transparent programmatic advertising (Google AdSense) and anonymous traffic metrics (Google Analytics) to keep the core tool 100% free for public use.</p>
      </section>

      <section className="legal-section">
        <h2>Contact Information</h2>
        <p>If you have any questions about our technology, platform, or business practices, please contact us at:</p>
        <p><strong>Primary Support:</strong> support@bgcleaner.online</p>
        <p><strong>General Inquiries:</strong> contact@bgcleaner.online</p>
      </section>
    </div>
  );
};
