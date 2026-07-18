import { MetadataRoute } from 'next';
import dbConnect from '../lib/mongodb';
import SettingsModel from '../models/Settings';

const Settings = SettingsModel as any;


const FALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bgcleaner.online';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let siteUrl = FALLBACK_URL;

  try {
    await dbConnect();
    const settings = await Settings.findOne({});
    siteUrl = settings?.siteUrl || FALLBACK_URL;
  } catch (error) {
    siteUrl = FALLBACK_URL;
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
