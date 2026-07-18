'use client';

import React, { useState, useEffect } from 'react';

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
}

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
    siteUrl: 'https://bgcleaner.online'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Tab management: 'posts' or 'settings'
  const [activeTab, setActiveTab] = useState<'posts' | 'settings'>('posts');
  
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
  const [settingsSuccess, setSettingsSuccess] = useState('');

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
      setSettingsSuccess('Settings and crawler configurations updated successfully in MongoDB database.');
    } catch (err: any) {
      setSettingsSuccess('Error: ' + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <form onSubmit={handleLogin} className="admin-login-form">
          <h2>Admin Authentication</h2>
          <p className="form-subtitle">Manage blog articles and tracking configurations.</p>
          
          {loginError && <p className="error-message">{loginError}</p>}
          
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

          <button type="submit" className="login-submit-btn">Authenticate</button>
        </form>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="processing-container">
        <p className="processing-title">Connecting to MongoDB Database...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Control Dashboard</h1>
          <span className="badge success">Database Connected (MongoDB Active)</span>
        </div>
        <div className="header-actions">
          <button 
            className={`header-tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => { setActiveTab('posts'); handleCancelEdit(); }}
          >
            Blog Posts
          </button>
          <button 
            className={`header-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); handleCancelEdit(); }}
          >
            Site Settings
          </button>
          <button className="logout-btn" onClick={() => setIsAuthenticated(false)}>Logout</button>
        </div>
      </header>

      {activeTab === 'posts' && (
        <div className="dashboard-content">
          {!editingPost && !isCreating ? (
            <>
              <div className="section-actions">
                <h2>Manage Blog Posts ({posts.length})</h2>
                <button onClick={handleCreateClick} className="create-post-btn">+ Write New Post</button>
              </div>

              <div className="posts-list-table">
                <div className="table-header">
                  <div className="col-title">Article Title</div>
                  <div className="col-slug">SEO Slug</div>
                  <div className="col-date">Date</div>
                  <div className="col-actions">Actions</div>
                </div>
                {posts.map((post) => (
                  <div key={post.id} className="table-row">
                    <div className="col-title font-medium">{post.title}</div>
                    <div className="col-slug text-muted">/blog/{post.slug}</div>
                    <div className="col-date">{post.createdAt}</div>
                    <div className="col-actions">
                      <button onClick={() => handleEditClick(post)} className="action-edit-btn">Edit</button>
                      <button onClick={() => handleDeletePost(post.id)} className="action-delete-btn">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleSavePost} className="post-editor-form">
              <h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
              
              {postError && <p className="error-message">{postError}</p>}

              <div className="form-group">
                <label>Article Title*</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  required
                  placeholder="e.g. How AI-Powered Image Segmentation Works..."
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>SEO Slug*</label>
                  <input
                    type="text"
                    value={postSlug}
                    onChange={(e) => setPostSlug(e.target.value)}
                    required
                    placeholder="e.g. how-ai-image-segmentation-works"
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
                  <label>Read Time Estimation</label>
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
                <label>Article Summary (Meta Description)*</label>
                <textarea
                  value={postSummary}
                  onChange={(e) => setPostSummary(e.target.value)}
                  required
                  rows={2}
                  placeholder="Short 2-sentence summary that appears in search engine listing pages."
                />
              </div>

              <div className="form-group">
                <label>Body Content (Rich HTML Structure)*</label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  required
                  rows={15}
                  placeholder="Paste your HTML article content here. Support headings (h2, h3), tables, lists, and formula boxes."
                />
              </div>

              <div className="form-submit-row">
                <button type="submit" className="save-post-btn">Save Article</button>
                <button type="button" onClick={handleCancelEdit} className="cancel-post-btn">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="dashboard-content">
          <h2>Website SEO & Advertisement Setup</h2>
          <p className="section-desc">Configure trackers and legal crawlers. Changes made here dynamically update sitemaps and analytics scripts across all clients in real-time.</p>

          {settingsSuccess && (
            <p className={`status-banner ${settingsSuccess.startsWith('Error') ? 'error' : 'success'}`}>
              {settingsSuccess}
            </p>
          )}

          <form onSubmit={handleSaveSettings} className="settings-form">
            <div className="form-group">
              <label>Target Site URL</label>
              <input
                type="url"
                value={siteUrlVal}
                onChange={(e) => setSiteUrlVal(e.target.value)}
                placeholder="https://bgcleaner.online"
                required
              />
              <span className="help-text">Used for canonical tag mapping and Sitemap generation headers.</span>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Google Analytics ID (G-XXXXXXXXXX)</label>
                <input
                  type="text"
                  value={analyticsId}
                  onChange={(e) => setAnalyticsId(e.target.value)}
                  placeholder="e.g. G-H2B89CSLPD"
                />
                <span className="help-text">Automatically loads measurement tags across routes. Leave blank to disable tracking.</span>
              </div>

              <div className="form-group">
                <label>Google Adsense Client ID (ca-pub-XXXXXXXXXXXXXXXX)</label>
                <input
                  type="text"
                  value={adsenseId}
                  onChange={(e) => setAdsenseId(e.target.value)}
                  placeholder="e.g. ca-pub-5928190582910582"
                />
                <span className="help-text">Embeds mandatory ad tags in head. Leave blank to disable adsense.</span>
              </div>
            </div>

            <div className="form-group">
              <label>Robots.txt Directives</label>
              <textarea
                value={robotsContent}
                onChange={(e) => setRobotsContent(e.target.value)}
                rows={5}
                required
                placeholder="User-agent: *\nDisallow: /admin"
              />
              <span className="help-text">Controls spider-crawlers parameters.</span>
            </div>

            <div className="form-actions-footer">
              <button type="submit" className="save-settings-btn">Save Configurations</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
