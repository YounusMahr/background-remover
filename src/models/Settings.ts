import mongoose, { Schema } from 'mongoose';

const SettingsSchema = new Schema({
  googleAnalyticsId: { type: String, default: '' },
  googleAdsenseClientId: { type: String, default: '' },
  robotsTxt: { type: String, default: 'User-agent: *\nDisallow: /admin\nSitemap: https://bgcleaner.online/sitemap.xml' },
  siteUrl: { type: String, default: 'https://bgcleaner.online' }
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
