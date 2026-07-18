import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdUnit } from './AdUnit';

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

interface BlogPostProps {
  posts: Post[];
  adsenseClientId?: string;
}

export const BlogPost: React.FC<BlogPostProps> = ({ posts, adsenseClientId = '' }) => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="blog-container empty-state">
        <h1>Article Not Found</h1>
        <p>The requested article could not be located. It may have been relocated or deleted.</p>
        <Link to="/blog" className="back-btn">← Back to Resources</Link>
      </div>
    );
  }

  return (
    <article className="blog-post-view">
      <div className="blog-post-header">
        <div className="blog-post-nav">
          <Link to="/blog">← Resources</Link>
          <span className="nav-separator">/</span>
          <span className="nav-current">{post.tags[0] || 'Article'}</span>
        </div>

        <h1>{post.title}</h1>
        
        <div className="post-meta-details">
          <div className="meta-author">
            <span className="meta-label">By</span> {post.author}
          </div>
          <span className="meta-separator">•</span>
          <div className="meta-date">{post.createdAt}</div>
          <span className="meta-separator">•</span>
          <div className="meta-readtime">{post.readTime}</div>
        </div>

        <div className="post-tags-row">
          {post.tags.map(tag => (
            <span key={tag} className="blog-tag">{tag}</span>
          ))}
        </div>
      </div>

      <div style={{ margin: '1.5rem 0' }}>
        <AdUnit client={adsenseClientId} slot="blog-top" format="auto" />
      </div>

      <div 
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div style={{ margin: '2rem 0' }}>
        <AdUnit client={adsenseClientId} slot="blog-bottom" format="auto" />
      </div>

      <div className="blog-post-footer">
        <h3>Share & Reference</h3>
        <p>This article is built strictly for educational and informational purposes. Reference URI: <a href={`https://bgcleaner.online/blog/${post.slug}`}>https://bgcleaner.online/blog/{post.slug}</a></p>
        <div className="footer-action-row">
          <Link to="/blog" className="back-to-blog-btn">← View More Articles</Link>
        </div>
      </div>
    </article>
  );
};
