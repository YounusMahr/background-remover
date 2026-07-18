import { MetadataRoute } from 'next';
import dbConnect from '../lib/mongodb';
import PostModel from '../models/Post';
import SettingsModel from '../models/Settings';

const Post = PostModel as any;
const Settings = SettingsModel as any;


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await dbConnect();
    const settings = await Settings.findOne({});
    const siteUrl = settings?.siteUrl || 'https://bgcleaner.online';

    // Static page definitions
    const staticPages = [
      '',
      '/blog',
      '/about',
      '/contact',
      '/privacy',
      '/terms',
      '/disclaimer',
      '/cookies',
    ].map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1.0 : 0.8,
    }));

    // Dynamic posts from MongoDB
    const posts = await Post.find({});
    const dynamicPosts = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.createdAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...dynamicPosts];
  } catch (error) {
    console.error('Sitemap generation failed, using fallback:', error);
    return [
      {
        url: 'https://bgcleaner.online',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}
