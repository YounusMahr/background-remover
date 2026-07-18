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

interface AdminDashboardProps {
  posts: Post[];
  settings: Settings;
  onUpdatePosts: (newPosts: Post[]) => void;
  onUpdateSettings: (newSettings: Settings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  posts,
  settings,
  onUpdatePosts,
  onUpdateSettings,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Tab management: 'posts' or 'settings'
  const [activeTab, setActiveTab] = useState<'posts' | 'settings'>('posts');
  
  // Post editing states
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [postSummary, setPostSummary] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postAuthor, setPostAuthor] = useState('Fiduciary Editor');
  const [postReadTime, setPostReadTime] = useState('5 min read');
  const [postTags, setPostTags] = useState('');
  const [postError, setPostError] = useState('');

  // Settings states
  const [analyticsId, setAnalyticsId] = useState(settings.googleAnalyticsId);
  const [adsenseId, setAdsenseId] = useState(settings.googleAdsenseClientId);
  const [robotsContent, setRobotsContent] = useState(settings.robotsTxt);
  const [siteUrl, setSiteUrl] = useState(settings.siteUrl);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [isProductionMode, setIsProductionMode] = useState(false);

  // Sync settings when props load
  useEffect(() => {
    setAnalyticsId(settings.googleAnalyticsId);
    setAdsenseId(settings.googleAdsenseClientId);
    setRobotsContent(settings.robotsTxt);
    setSiteUrl(settings.siteUrl);
  }, [settings]);

  // Check if API endpoints are functional (indicates local dev server)
  useEffect(() => {
    // If we're not running on localhost, notify the user it's read-only/localStorage fallback
    if (
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      setIsProductionMode(true);
    }
  }, []);

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
    setPostAuthor(post.author);
    setPostReadTime(post.readTime);
    setPostTags(post.tags.join(', '));
    setPostError('');
  };

  const handleCreateClick = () => {
    setEditingPost(null);
    setIsCreating(true);
    setPostTitle('');
    setPostSlug('');
    setPostSummary('');
    setPostContent('');
    setPostAuthor('Fiduciary Editor');
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
    };

    if (isProductionMode) {
      // Fallback local memory changes (warning shown to user)
      if (editingPost) {
        const updated = posts.map((p) =>
          p.id === editingPost.id ? { ...p, ...payload } : p
        );
        onUpdatePosts(updated);
      } else {
        const newPost: Post = {
          id: String(Date.now()),
          ...payload,
          createdAt: new Date().toISOString().split('T')[0],
        };
        onUpdatePosts([newPost, ...posts]);
      }
      setEditingPost(null);
      setIsCreating(false);
      return;
    }

    // Call local dev API
    try {
      const url = '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPost ? { id: editingPost.id, ...payload } : payload),
      });

      if (!response.ok) throw new Error('API failed');

      const savedPost = await response.json();

      if (editingPost) {
        onUpdatePosts(posts.map((p) => (p.id === editingPost.id ? savedPost : p)));
      } else {
        onUpdatePosts([savedPost, ...posts]);
      }

      setEditingPost(null);
      setIsCreating(false);
    } catch (err) {
      setPostError('Failed to communicate with dev server API. Check that "npm run dev" is running.');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    if (isProductionMode) {
      onUpdatePosts(posts.filter((p) => p.id !== id));
      return;
    }

    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('API failed');

      onUpdatePosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete post on local dev server.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess('');

    const newSettings: Settings = {
      googleAnalyticsId: analyticsId,
      googleAdsenseClientId: adsenseId,
      robotsTxt: robotsContent,
      siteUrl: siteUrl,
    };

    if (isProductionMode) {
      onUpdateSettings(newSettings);
      setSettingsSuccess('Settings cached in local preview mode. Run locally in dev server to write config files.');
      return;
    }

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) throw new Error('API failed');

      const resData = await response.json();
      onUpdateSettings(resData.settings);
      setSettingsSuccess('Settings saved. robots.txt and sitemap.xml files generated successfully.');
    } catch (err) {
      setSettingsSuccess('Error: Failed to save configurations to dev server API.');
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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Control Dashboard</h1>
          {isProductionMode && (
            <span className="badge warning">Production Preview (Read-Only Mode)</span>
          )}
          {!isProductionMode && (
            <span className="badge success">Local API Active (GitOps Mode)</span>
          )}
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

      {isProductionMode && (
        <div className="dashboard-alert">
          <p><strong>Notice:</strong> You are currently viewing the website in production. You can preview CRUD and settings adjustments here, but updates will not save to the permanent JSON files unless you run the project locally via <code>npm run dev</code> and commit the generated changes to Git.</p>
        </div>
      )}

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
                  placeholder="e.g. The Medicare IRMAA Cliff..."
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
                    placeholder="e.g. the-medicare-irmaa-cliff"
                  />
                </div>
                <div className="form-group">
                  <label>Author</label>
                  <input
                    type="text"
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    placeholder="Fiduciary Editor"
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
                    placeholder="Retirement, Taxes, Medicare"
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
                  placeholder="Paste your HTML article content here. Support headings (h2, h3), paragraph classes, tables, lists, and formula boxes (<div class='formula'>...</div>)."
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
          <p className="section-desc">Configure trackers and legal crawlers. Changes made here locally compile configuration scripts and generate validation documents in your public directory.</p>

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
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
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
              <label>Robots.txt Content</label>
              <textarea
                value={robotsContent}
                onChange={(e) => setRobotsContent(e.target.value)}
                rows={5}
                required
                placeholder="User-agent: *\nDisallow: /admin"
              />
              <span className="help-text">Controls spider-crawlers parameters. Automatically updates public/robots.txt on save.</span>
            </div>

            <div className="form-actions-footer">
              <button type="submit" className="save-settings-btn">Save Configurations & Generate Sitemap</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
