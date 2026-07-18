import type { Metadata } from 'next';
import ToolLoader from '../components/ToolLoader';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bgcleaner.online';

export const metadata: Metadata = {
  title: 'ClearBG Pro - Free Private Background Remover',
  description:
    'Remove image backgrounds instantly in your browser. 100% private, no uploads — ClearBG Pro processes photos locally with AI and exports transparent PNG, WebP, and JPEG in Full HD.',
  alternates: { canonical: '/' },
};

const faqs = [
  {
    q: 'Is ClearBG Pro really free?',
    a: 'Yes. ClearBG Pro is completely free to use with no sign-up, watermark, or usage limits. You can remove backgrounds from as many images as you like.',
  },
  {
    q: 'Are my images uploaded to a server?',
    a: 'No. All processing happens locally in your browser using WebAssembly and AI. Your photos never leave your device, which makes ClearBG Pro fully private.',
  },
  {
    q: 'What image formats are supported?',
    a: 'You can upload PNG, JPEG, and WebP images. Results can be exported as transparent PNG, WebP, or JPEG in up to Full HD resolution.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No installation is required. ClearBG Pro runs entirely in modern web browsers on desktop and mobile.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'ClearBG Pro',
      url: SITE_URL,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any (web browser)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'Free, private, browser-based AI background remover. Removes backgrounds from images locally with no uploads.',
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="home-hero">
        <h1>Free Private Background Remover</h1>
        <p className="home-hero-lead">
          Remove the background from any image in seconds. ClearBG Pro uses AI that
          runs entirely in your browser — your photos are never uploaded, so your
          work stays 100% private. Export transparent PNG, WebP, or JPEG in Full HD.
        </p>
      </section>

      {/* Interactive tool (client-side / WASM) */}
      <ToolLoader />

      <section className="how-to-use-section">
        <h2>How to Use ClearBG Pro</h2>
        <p className="section-subtitle">
          Remove backgrounds from your images locally in three simple steps.
        </p>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Upload Image</h3>
            <p>
              Drag and drop your image, select from your local drive, or pick a sample
              photo to start. We support PNG, JPEG, and WebP formats.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3>AI Processing</h3>
            <p>
              Our client-side neural networks process the image instantly in your
              browser window. Your private files never upload to external servers.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Customize &amp; Download</h3>
            <p>
              Adjust edge defringing, add solid background colors or presets, compress
              the output, and export in full high-definition quality.
            </p>
          </div>
        </div>
      </section>

      <section className="home-features">
        <h2>Why Choose ClearBG Pro</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>100% Private</h3>
            <p>
              Images are processed on your device with WebAssembly. Nothing is ever
              sent to a server, so sensitive photos and product shots stay yours.
            </p>
          </div>
          <div className="feature-card">
            <h3>Instant &amp; Free</h3>
            <p>
              No accounts, no watermarks, no limits. Get a clean, transparent
              cutout in seconds, every time.
            </p>
          </div>
          <div className="feature-card">
            <h3>High-Quality Export</h3>
            <p>
              Precise edge handling and Full HD output in PNG, WebP, or JPEG make
              results ready for e-commerce, design, and print.
            </p>
          </div>
        </div>
      </section>

      <section className="home-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
