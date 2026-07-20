# ClearBG Pro - Vanilla PHP AI Background Remover (remove.bg Design)

A lightweight, high-performance, and privacy-focused AI background remover application built with **Vanilla PHP**, styled with the **remove.bg** color scheme and layout aesthetics, optimized for **SEO** and **Google AdSense**.

## Features

- **remove.bg Design Palette & Layout**: Royal Blue (`#2f6beb`) theme, crisp white cards, rounded drag-and-drop zone, and dual-tab editor view ("Original" vs "Removed Background").
- **100% Private Client-Side AI**: Neural network processing runs locally inside your browser via WebAssembly (`@imgly/background-removal`). Your photos are **never uploaded** to any server.
- **Full HD Cutout Exports**: Export high-resolution transparent PNG, WebP, and JPEG files with edge defringing and custom solid/gradient background replacements.
- **SEO Optimized**: Dynamic XML Sitemap (`sitemap.php`), `robots.txt`, OpenGraph metadata, and Schema.org JSON-LD structured data (`WebApplication`, `FAQPage`, `BlogPosting`).
- **Google AdSense Integration**: Built-in ad slots helper component and `ads.txt` support.
- **SEO Blog Section**: 9 comprehensive articles included out-of-the-box in `data/posts.json` with tag filters and article views.
- **Admin Dashboard (`admin.php`)**: Edit site settings, AdSense Client ID, Google Analytics ID, and manage blog posts without needing MySQL database setup.

## How to Run Locally

Start the built-in PHP development server:
```bash
php -S localhost:8000
```

Open your browser to:
- App: `http://localhost:8000`
- Blog: `http://localhost:8000/blog.php`
- Admin: `http://localhost:8000/admin.php`

## Deployment

Upload all project files directly to any standard PHP web hosting provider (cPanel, Apache, Nginx, LiteSpeed, VPS) under `public_html`. No `npm build` or Node.js runtime required!
