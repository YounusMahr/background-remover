import dbConnect from '../../../lib/mongodb';
import PostModel from '../../../models/Post';
import SettingsModel from '../../../models/Settings';
import Link from 'next/link';

const Post = PostModel as any;
const Settings = SettingsModel as any;

import { AdUnit } from '../../../components/AdUnit';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPostData(slug: string) {
  try {
    await dbConnect();
    const post = await Post.findOne({ slug });
    return post ? post.toObject() : null;
  } catch (error) {
    console.error("Failed to fetch post detail:", error);
    return null;
  }
}

async function getAdsenseClientId() {
  try {
    await dbConnect();
    const settings = await Settings.findOne({});
    return settings?.googleAdsenseClientId || '';
  } catch (e) {
    return '';
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bgcleaner.online';

export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);

  if (!post) {
    return {
      title: 'Article Not Found - ClearBG Pro',
    };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} - ClearBG Pro`,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url,
      publishedTime: post.createdAt,
      authors: [post.author || 'ClearBG Pro Team'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);
  const adsenseClientId = await getAdsenseClientId();

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    author: { '@type': 'Organization', name: post.author || 'ClearBG Pro Team' },
    publisher: {
      '@type': 'Organization',
      name: 'ClearBG Pro',
      url: SITE_URL,
    },
    datePublished: post.createdAt,
    keywords: (post.tags || []).join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <article className="blog-post-view">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="blog-post-header">
        <div className="blog-post-nav">
          <Link href="/blog">← Resources</Link>
          <span className="nav-separator">/</span>
          <span className="nav-current">{post.tags[0] || 'Article'}</span>
        </div>

        <h1>{post.title}</h1>
        
        <div className="post-meta-details">
          <div className="meta-author">
            <span className="meta-label">By</span> {post.author || 'ClearBG Pro Team'}
          </div>
          <span className="meta-separator">•</span>
          <div className="meta-date">{post.createdAt}</div>
          <span className="meta-separator">•</span>
          <div className="meta-readtime">{post.readTime}</div>
        </div>

        <div className="post-tags-row">
          {post.tags.map((tag: string) => (
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
          <Link href="/blog" className="back-to-blog-btn">← View More Articles</Link>
        </div>
      </div>
    </article>
  );
}
