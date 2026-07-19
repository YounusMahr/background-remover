'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Globe,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Menu,
  X,
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  createdAt: string;
  author: string;
  readTime: string;
  tags: string[];
}

interface Settings {
  googleAnalyticsId: string;
  googleAdsenseClientId: string;
  robotsTxt: string;
  siteUrl: string;
  siteName: string;
  footerTagline: string;
}

type TabKey = 'overview' | 'posts' | 'analytics' | 'seo';

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [posts, setPosts] = useState<Post[]>([]);
  const [settings, setSettings] = useState<Settings>({
    googleAnalyticsId: '',
    googleAdsenseClientId: '',
    robotsTxt: '',
    siteUrl: 'https://bgcleaner.online',
    siteName: 'ClearBG Pro',
    footerTagline: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Post editing states
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [postSummary, setPostSummary] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postAuthor, setPostAuthor] = useState('ClearBG Pro Team');
  const [postReadTime, setPostReadTime] = useState('5 min read');
  const [postTags, setPostTags] = useState('');
  const [postError, setPostError] = useState('');

  // Settings states
  const [analyticsId, setAnalyticsId] = useState('');
  const [adsenseId, setAdsenseId] = useState('');
  const [robotsContent, setRobotsContent] = useState('');
  const [siteUrlVal, setSiteUrlVal] = useState('');
  const [siteNameVal, setSiteNameVal] = useState('');
  const [footerTaglineVal, setFooterTaglineVal] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  const [copied, setCopied] = useState('');

  const siteUrl = (siteUrlVal || settings.siteUrl || 'https://bgcleaner.online').replace(/\/$/, '');
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  const robotsUrl = `${siteUrl}/robots.txt`;

  // Load Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const postsRes = await fetch('/api/posts');
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }

      const settingsRes = await fetch('/api/settings');
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
        setAnalyticsId(settingsData.googleAnalyticsId || '');
        setAdsenseId(settingsData.googleAdsenseClientId || '');
        setRobotsContent(settingsData.robotsTxt || '');
        setSiteUrlVal(settingsData.siteUrl || 'https://bgcleaner.online');
        setSiteNameVal(settingsData.siteName || 'ClearBG Pro');
        setFooterTaglineVal(settingsData.footerTagline || '');
      }
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@bgcleaner.online' && password === 'BGCleanerSecure2026!') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email credentials or password.');
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setIsCreating(false);
    setPostTitle(post.title);
    setPostSlug(post.slug);
    setPostSummary(post.summary);
    setPostContent(post.content);
    setPostAuthor(post.author || 'ClearBG Pro Team');
    setPostReadTime(post.readTime || '5 min read');
    setPostTags(post.tags ? post.tags.join(', ') : '');
    setPostError('');
  };

  const handleCreateClick = () => {
    setEditingPost(null);
    setIsCreating(true);
    setPostTitle('');
    setPostSlug('');
    setPostSummary('');
    setPostContent('');
    setPostAuthor('ClearBG Pro Team');
    setPostReadTime('5 min read');
    setPostTags('');
    setPostError('');
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setIsCreating(false);
    setPostError('');
  };

  // Auto-generate a URL-friendly slug from the title when creating a new post.
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleTitleChange = (value: string) => {
    setPostTitle(value);
    // Only auto-fill the slug while creating and the user hasn't typed a custom one.
    if (isCreating && (!postSlug || postSlug === slugify(postTitle))) {
      setPostSlug(slugify(value));
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError('');

    if (!postTitle || !postSlug || !postSummary || !postContent) {
      setPostError('Please fill out all required fields.');
      return;
    }

    const payload = {
      title: postTitle,
      slug: postSlug,
      summary: postSummary,
      content: postContent,
      author: postAuthor,
      readTime: postReadTime,
      tags: postTags.split(',').map((t) => t.trim()).filter((t) => t !== ''),
      createdAt: editingPost ? editingPost.createdAt : new Date().toISOString().split('T')[0],
    };

    try {
      const url = '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPost ? { id: editingPost.id, ...payload } : payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to save post');
      }

      if (editingPost) {
        setPosts(posts.map((p) => (p.id === editingPost.id ? resData : p)));
      } else {
        setPosts([resData, ...posts]);
      }

      setEditingPost(null);
      setIsCreating(false);
    } catch (err: any) {
      setPostError(err.message || 'Failed to communicate with the database.');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE',
      });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to delete');
      }

      setPosts(posts.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete post.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess('');

    const newSettings: Settings = {
      googleAnalyticsId: analyticsId,
      googleAdsenseClientId: adsenseId,
      robotsTxt: robotsContent,
      siteUrl: siteUrlVal,
      siteName: siteNameVal,
      footerTagline: footerTaglineVal,
    };

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to save settings');
      }

      setSettings(resData);
      setSettingsSuccess('Settings saved successfully to the MongoDB database.');
    } catch (err: any) {
      setSettingsSuccess('Error: ' + err.message);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(''), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  // Open Google's ping endpoint so the freshly generated sitemap gets re-crawled.
  const pingGoogle = () => {
    window.open(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  // ---------------------------------------------------------------- Login
  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-login-brand">
            <ShieldCheck size={28} />
          </div>
          <h2>Admin Portal</h2>
          <p className="form-subtitle">Sign in to manage articles, analytics, and SEO.</p>

          {loginError && (
            <p className="error-message">
              <AlertCircle size={15} /> {loginError}
            </p>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@bgcleaner.online"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="login-submit-btn">Sign In</button>
        </form>
      </div>
    );
  }

  // ---------------------------------------------------------------- Loading
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Connecting to database…</p>
      </div>
    );
  }

  const navItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { key: 'posts', label: 'Blog Posts', icon: <FileText size={18} /> },
    { key: 'analytics', label: 'Analytics & Ads', icon: <BarChart3 size={18} /> },
    { key: 'seo', label: 'SEO & Sitemap', icon: <Globe size={18} /> },
  ];

  const isEditing = editingPost || isCreating;

  // ---------------------------------------------------------------- Dashboard
  return (
    <div className="admin-shell">
      {/* Mobile Sticky Header */}
      <header className="admin-mobile-header">
        <div className="admin-sidebar-brand">
          <span className="admin-logo-mark">B</span>
          <div>
            <span className="admin-logo-text">{siteNameVal || 'ClearBG Pro'}</span>
            <span className="admin-logo-sub">Admin</span>
          </div>
        </div>
        <button
          type="button"
          className="admin-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Drawer Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-brand">
          <span className="admin-logo-mark">B</span>
          <div>
            <span className="admin-logo-text">{siteNameVal || 'ClearBG Pro'}</span>
            <span className="admin-logo-sub">Admin</span>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`admin-nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.key);
                handleCancelEdit();
                setIsMobileMenuOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-view-site">
            <ExternalLink size={16} /> View Site
          </a>
          <button className="admin-logout" onClick={() => {
            setIsAuthenticated(false);
            setIsMobileMenuOpen(false);
          }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {/* ---------------------------------------------------- Overview */}
        {activeTab === 'overview' && (
          <div className="admin-page">
            <div className="admin-page-head">
              <div>
                <h1>Overview</h1>
                <p className="admin-page-sub">A quick snapshot of your site.</p>
              </div>
              <span className="admin-status-pill">
                <span className="status-dot" /> Database connected
              </span>
            </div>

            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-icon"><FileText size={20} /></div>
                <div className="stat-value">{posts.length}</div>
                <div className="stat-label">Published Articles</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><BarChart3 size={20} /></div>
                <div className="stat-value">{settings.googleAnalyticsId ? 'On' : 'Off'}</div>
                <div className="stat-label">Google Analytics</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><ShieldCheck size={20} /></div>
                <div className="stat-value">{settings.googleAdsenseClientId ? 'On' : 'Off'}</div>
                <div className="stat-label">AdSense Verified</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><Globe size={20} /></div>
                <div className="stat-value">{posts.length + 8}</div>
                <div className="stat-label">Sitemap URLs</div>
              </div>
            </div>

            <div className="admin-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <button onClick={() => { setActiveTab('posts'); handleCreateClick(); }} className="quick-action">
                  <Plus size={16} /> Write a new article
                </button>
                <button onClick={() => setActiveTab('analytics')} className="quick-action">
                  <BarChart3 size={16} /> Configure analytics
                </button>
                <button onClick={() => setActiveTab('seo')} className="quick-action">
                  <Globe size={16} /> Manage sitemap &amp; SEO
                </button>
              </div>
            </div>

            {!settings.googleAdsenseClientId && (
              <div className="admin-notice">
                <AlertCircle size={18} />
                <p>
                  AdSense is not configured yet. Add your publisher ID in
                  <button className="link-btn" onClick={() => setActiveTab('analytics')}> Analytics &amp; Ads </button>
                  to activate verification, the ads.txt file, and ad slots.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- Posts */}
        {activeTab === 'posts' && (
          <div className="admin-page">
            {!isEditing ? (
              <>
                <div className="admin-page-head">
                  <div>
                    <h1>Blog Posts</h1>
                    <p className="admin-page-sub">{posts.length} article{posts.length === 1 ? '' : 's'} published.</p>
                  </div>
                  <button onClick={handleCreateClick} className="btn-primary">
                    <Plus size={16} /> New Post
                  </button>
                </div>

                <div className="admin-card no-pad">
                  <div className="posts-table">
                    <div className="posts-table-head">
                      <div className="col-title">Article</div>
                      <div className="col-slug">Slug</div>
                      <div className="col-date">Date</div>
                      <div className="col-actions">Actions</div>
                    </div>
                    {posts.length === 0 && (
                      <div className="posts-empty">No articles yet. Click “New Post” to write your first one.</div>
                    )}
                    {posts.map((post) => (
                      <div key={post.id} className="posts-table-row">
                        <div className="col-title">
                          <span className="post-title-cell">{post.title}</span>
                          <span className="post-tags-cell">{(post.tags || []).slice(0, 2).join(', ')}</span>
                        </div>
                        <div className="col-slug"><code>/blog/{post.slug}</code></div>
                        <div className="col-date">{post.createdAt}</div>
                        <div className="col-actions">
                          <button onClick={() => handleEditClick(post)} className="icon-btn" title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => handleDeletePost(post.id)} className="icon-btn danger" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="admin-page-head">
                  <div>
                    <h1>{editingPost ? 'Edit Article' : 'New Article'}</h1>
                    <p className="admin-page-sub">Content is published to the live blog instantly on save.</p>
                  </div>
                </div>

                <form onSubmit={handleSavePost} className="admin-card">
                  {postError && (
                    <p className="error-message"><AlertCircle size={15} /> {postError}</p>
                  )}

                  <div className="form-group">
                    <label>Article Title *</label>
                    <input
                      type="text"
                      value={postTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      required
                      placeholder="e.g. How AI-Powered Image Segmentation Works"
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>SEO Slug *</label>
                      <input
                        type="text"
                        value={postSlug}
                        onChange={(e) => setPostSlug(e.target.value)}
                        required
                        placeholder="how-ai-image-segmentation-works"
                      />
                    </div>
                    <div className="form-group">
                      <label>Author</label>
                      <input
                        type="text"
                        value={postAuthor}
                        onChange={(e) => setPostAuthor(e.target.value)}
                        placeholder="ClearBG Pro Team"
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Read Time</label>
                      <input
                        type="text"
                        value={postReadTime}
                        onChange={(e) => setPostReadTime(e.target.value)}
                        placeholder="5 min read"
                      />
                    </div>
                    <div className="form-group">
                      <label>Tags (comma separated)</label>
                      <input
                        type="text"
                        value={postTags}
                        onChange={(e) => setPostTags(e.target.value)}
                        placeholder="AI Technology, Web Performance"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Summary (Meta Description) *</label>
                    <textarea
                      value={postSummary}
                      onChange={(e) => setPostSummary(e.target.value)}
                      required
                      rows={2}
                      placeholder="Short 2-sentence summary shown in search results and blog cards."
                    />
                  </div>

                  <div className="form-group">
                    <label>Body Content (HTML) *</label>
                    <textarea
                      className="mono"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      required
                      rows={16}
                      placeholder="Paste HTML article content here. Supports h2, h3, tables, lists, etc."
                    />
                  </div>

                  <div className="form-submit-row">
                    <button type="submit" className="btn-primary">
                      {editingPost ? 'Update Article' : 'Publish Article'}
                    </button>
                    <button type="button" onClick={handleCancelEdit} className="btn-ghost">Cancel</button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- Analytics & Ads */}
        {activeTab === 'analytics' && (
          <div className="admin-page">
            <div className="admin-page-head">
              <div>
                <h1>Analytics &amp; Ads</h1>
                <p className="admin-page-sub">Connect Google Analytics and AdSense. Changes apply site-wide instantly.</p>
              </div>
            </div>

            {settingsSuccess && (
              <p className={`status-banner ${settingsSuccess.startsWith('Error') ? 'error' : 'success'}`}>
                {settingsSuccess}
              </p>
            )}

            <div className="admin-card">
              <div className="card-row">
                <div>
                  <h3>Google Analytics</h3>
                  <p className="card-hint">Measurement ID loads the gtag script across all pages.</p>
                </div>
                <span className={`feature-pill ${settings.googleAnalyticsId ? 'on' : 'off'}`}>
                  {settings.googleAnalyticsId ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="form-group">
                <label>Measurement ID</label>
                <input
                  type="text"
                  value={analyticsId}
                  onChange={(e) => setAnalyticsId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>

            <div className="admin-card">
              <div className="card-row">
                <div>
                  <h3>Google AdSense</h3>
                  <p className="card-hint">Publisher ID powers verification, ads.txt, and the ad slots.</p>
                </div>
                <span className={`feature-pill ${settings.googleAdsenseClientId ? 'on' : 'off'}`}>
                  {settings.googleAdsenseClientId ? 'Verified' : 'Not set'}
                </span>
              </div>
              <div className="form-group">
                <label>Publisher ID</label>
                <input
                  type="text"
                  value={adsenseId}
                  onChange={(e) => setAdsenseId(e.target.value)}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                />
              </div>
              {adsenseId && (
                <div className="inline-check">
                  <ShieldCheck size={15} />
                  <span>ads.txt will serve at </span>
                  <code>{robotsUrl.replace('/robots.txt', '/ads.txt')}</code>
                </div>
              )}
            </div>

            <div className="form-submit-row">
              <button onClick={handleSaveSettings} className="btn-primary">Save Changes</button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- SEO & Sitemap */}
        {activeTab === 'seo' && (
          <div className="admin-page">
            <div className="admin-page-head">
              <div>
                <h1>SEO &amp; Sitemap</h1>
                <p className="admin-page-sub">Site identity, crawler rules, and your live XML sitemap.</p>
              </div>
            </div>

            {settingsSuccess && (
              <p className={`status-banner ${settingsSuccess.startsWith('Error') ? 'error' : 'success'}`}>
                {settingsSuccess}
              </p>
            )}

            <div className="admin-card">
              <h3>Site Identity</h3>
              <p className="card-hint">These feed the header logo, page titles, and footer.</p>
              <div className="form-grid">
                <div className="form-group">
                  <label>Site Name</label>
                  <input
                    type="text"
                    value={siteNameVal}
                    onChange={(e) => setSiteNameVal(e.target.value)}
                    placeholder="ClearBG Pro"
                  />
                </div>
                <div className="form-group">
                  <label>Site URL</label>
                  <input
                    type="url"
                    value={siteUrlVal}
                    onChange={(e) => setSiteUrlVal(e.target.value)}
                    placeholder="https://bgcleaner.online"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Footer Tagline</label>
                <input
                  type="text"
                  value={footerTaglineVal}
                  onChange={(e) => setFooterTaglineVal(e.target.value)}
                  placeholder="Completely private client-side background removal."
                />
              </div>
            </div>

            <div className="admin-card">
              <div className="card-row">
                <div>
                  <h3>XML Sitemap</h3>
                  <p className="card-hint">
                    Auto-generated from your {posts.length} articles plus 8 static pages. Updates whenever you publish.
                  </p>
                </div>
                <span className="feature-pill on">Live</span>
              </div>

              <div className="resource-row">
                <code className="resource-url">{sitemapUrl}</code>
                <div className="resource-actions">
                  <button className="icon-btn" title="Copy URL" onClick={() => handleCopy(sitemapUrl, 'sitemap')}>
                    {copied === 'sitemap' ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                  <a className="icon-btn" href={sitemapUrl} target="_blank" rel="noopener noreferrer" title="Open">
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>

              <div className="resource-row">
                <code className="resource-url">{robotsUrl}</code>
                <div className="resource-actions">
                  <button className="icon-btn" title="Copy URL" onClick={() => handleCopy(robotsUrl, 'robots')}>
                    {copied === 'robots' ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                  <a className="icon-btn" href={robotsUrl} target="_blank" rel="noopener noreferrer" title="Open">
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>

              <button className="btn-secondary" onClick={pingGoogle}>
                <Globe size={16} /> Submit sitemap to Google
              </button>
            </div>

            <div className="admin-card">
              <h3>Robots.txt Directives</h3>
              <p className="card-hint">Controls what search engine crawlers can access.</p>
              <div className="form-group">
                <textarea
                  className="mono"
                  value={robotsContent}
                  onChange={(e) => setRobotsContent(e.target.value)}
                  rows={5}
                  placeholder={'User-agent: *\nDisallow: /admin'}
                />
              </div>
            </div>

            <div className="form-submit-row">
              <button onClick={handleSaveSettings} className="btn-primary">Save Changes</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
