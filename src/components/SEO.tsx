import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  siteUrl?: string;
  post?: {
    title: string;
    summary: string;
    createdAt: string;
    author: string;
    slug: string;
  };
}

export const SEO: React.FC<SEOProps> = ({ title, description, siteUrl = 'https://bgcleaner.online', post }) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Update document title
    document.title = title;

    // 2. Update description tag
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // 3. Update canonical link tag
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    const canonicalUrl = `${siteUrl}${location.pathname}`;
    linkCanonical.setAttribute('href', canonicalUrl);

    // 4. Update Open Graph Meta Tags (helpful for search and sharing)
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:url': canonicalUrl,
      'og:type': 'website'
    };

    Object.entries(ogTags).forEach(([property, value]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', value);
    });

    // 5. Manage JSON-LD Structured Data
    const existingSchemaScript = document.getElementById('json-ld-schema');
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    let schema: any = null;

    if (location.pathname === '/') {
      schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "ClearBG Pro",
        "operatingSystem": "All",
        "applicationCategory": "MultimediaApplication",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        },
        "description": description,
        "browserRequirements": "Requires HTML5, WebAssembly, and WebGL support."
      };
    } else if (post && location.pathname.startsWith('/blog/')) {
      schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.summary,
        "datePublished": post.createdAt,
        "author": {
          "@type": "Person",
          "name": post.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "ClearBG Pro",
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/favicon.svg`
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${siteUrl}/blog/${post.slug}`
        }
      };
    } else {
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ClearBG Pro",
        "url": siteUrl
      };
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    }

  }, [title, description, location.pathname, siteUrl, post]);

  return null; // This component handles side effects, no layout footprint.
};
