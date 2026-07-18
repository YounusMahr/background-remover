import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function bgcleanerApiPlugin() {
  return {
    name: 'bgcleaner-api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url || '';
        const method = req.method || 'GET';

        const postsPath = path.resolve(__dirname, 'src/data/posts.json');
        const settingsPath = path.resolve(__dirname, 'src/data/settings.json');

        const getBody = (request: any): Promise<any> => {
          return new Promise((resolve) => {
            let body = '';
            request.on('data', (chunk: any) => { body += chunk; });
            request.on('end', () => {
              try {
                resolve(JSON.parse(body));
              } catch {
                resolve({});
              }
            });
          });
        };

        const sendJson = (response: any, data: any, status = 200) => {
          response.statusCode = status;
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify(data));
        };

        // 1. API Settings Endpoint
        if (url.startsWith('/api/settings')) {
          if (method === 'GET') {
            try {
              if (fs.existsSync(settingsPath)) {
                const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
                return sendJson(res, settings);
              } else {
                return sendJson(res, {});
              }
            } catch (err) {
              return sendJson(res, { error: 'Failed to read settings' }, 500);
            }
          } else if (method === 'POST') {
            try {
              const body = await getBody(req);
              fs.writeFileSync(settingsPath, JSON.stringify(body, null, 2), 'utf8');

              // Write robots.txt to public directory
              const publicDir = path.resolve(__dirname, 'public');
              if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir);
              }
              fs.writeFileSync(path.join(publicDir, 'robots.txt'), body.robotsTxt || '', 'utf8');

              // Generate sitemap.xml
              let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
              sitemapContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
              
              const siteUrl = body.siteUrl || 'https://bgcleaner.online';
              const staticPages = ['', 'about', 'contact', 'privacy', 'terms', 'disclaimer', 'cookies', 'blog'];
              
              const today = new Date().toISOString().split('T')[0];
              
              staticPages.forEach((p) => {
                const pathStr = p ? `/${p}` : '';
                sitemapContent += `  <url>\n    <loc>${siteUrl}${pathStr}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${p === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
              });

              // Add blog posts
              if (fs.existsSync(postsPath)) {
                try {
                  const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
                  if (Array.isArray(posts)) {
                    posts.forEach((post: any) => {
                      if (post.slug) {
                        sitemapContent += `  <url>\n    <loc>${siteUrl}/blog/${post.slug}</loc>\n    <lastmod>${post.createdAt || today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
                      }
                    });
                  }
                } catch (e) {
                  console.error('Error reading posts for sitemap:', e);
                }
              }

              sitemapContent += `</urlset>`;
              fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf8');

              return sendJson(res, { success: true, settings: body });
            } catch (err) {
              return sendJson(res, { error: 'Failed to save settings' }, 500);
            }
          }
        }

        // 2. API Blog Posts Endpoint
        if (url.startsWith('/api/posts')) {
          if (method === 'GET') {
            try {
              if (fs.existsSync(postsPath)) {
                const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
                return sendJson(res, posts);
              } else {
                return sendJson(res, []);
              }
            } catch (err) {
              return sendJson(res, { error: 'Failed to read posts' }, 500);
            }
          } else if (method === 'POST') {
            try {
              const body = await getBody(req);
              let posts = [];
              if (fs.existsSync(postsPath)) {
                posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
              }
              const newPost = {
                id: String(Date.now()),
                title: body.title || '',
                slug: body.slug || '',
                summary: body.summary || '',
                content: body.content || '',
                createdAt: new Date().toISOString().split('T')[0],
                author: body.author || 'Admin',
                readTime: body.readTime || '5 min read',
                tags: body.tags || []
              };
              posts.unshift(newPost);
              fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf8');
              return sendJson(res, newPost);
            } catch (err) {
              return sendJson(res, { error: 'Failed to create post' }, 500);
            }
          } else if (method === 'PUT') {
            try {
              const body = await getBody(req);
              if (!fs.existsSync(postsPath)) {
                return sendJson(res, { error: 'No posts found' }, 404);
              }
              let posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
              const index = posts.findIndex((p: any) => p.id === body.id);
              if (index === -1) {
                return sendJson(res, { error: 'Post not found' }, 404);
              }
              posts[index] = {
                ...posts[index],
                title: body.title,
                slug: body.slug,
                summary: body.summary,
                content: body.content,
                author: body.author,
                readTime: body.readTime,
                tags: body.tags
              };
              fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf8');
              return sendJson(res, posts[index]);
            } catch (err) {
              return sendJson(res, { error: 'Failed to update post' }, 500);
            }
          }
        }

        // Handle DELETE for a specific post: /api/posts?id=xxx
        if (url.startsWith('/api/posts') && method === 'DELETE') {
          try {
            const urlObj = new URL(url, 'http://localhost');
            const id = urlObj.searchParams.get('id');
            if (!id) {
              return sendJson(res, { error: 'ID is required' }, 400);
            }
            if (!fs.existsSync(postsPath)) {
              return sendJson(res, { error: 'No posts found' }, 404);
            }
            let posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
            posts = posts.filter((p: any) => p.id !== id);
            fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf8');
            return sendJson(res, { success: true });
          } catch (err) {
            return sendJson(res, { error: 'Failed to delete post' }, 500);
          }
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), bgcleanerApiPlugin()],
  server: {
    allowedHosts: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})
