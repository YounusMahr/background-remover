import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  createdAt: string;
  author: string;
  readTime: string;
  tags: string[];
}

interface BlogListProps {
  posts: Post[];
}

export const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="blog-container">
      <div className="blog-hero">
        <h1>Resources & Insights</h1>
        <p>Expert articles on tech, privacy, taxes, and optimization.</p>
      </div>

      <div className="blog-controls">
        <div className="search-bar-wrapper">
          <input
            type="text"
            className="blog-search"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="tag-filter-list">
          <button 
            className={`tag-filter-btn ${selectedTag === null ? 'active' : ''}`}
            onClick={() => setSelectedTag(null)}
          >
            All Topics
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag-filter-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="blog-empty">
          <p>No articles found matching your criteria.</p>
        </div>
      ) : (
        <div className="blog-grid">
          {filteredPosts.map(post => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span className="blog-card-date">{post.createdAt}</span>
                  <span className="blog-card-divider">•</span>
                  <span className="blog-card-readtime">{post.readTime}</span>
                </div>
                
                <h2 className="blog-card-title">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                
                <p className="blog-card-summary">{post.summary}</p>
                
                <div className="blog-card-tags">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="blog-tag"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Link to={`/blog/${post.slug}`} className="blog-read-more">
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
