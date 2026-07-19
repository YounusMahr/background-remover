import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import SettingsModel from '../../../models/Settings';
import initialSettings from '../../../data/settings.json';

const Settings = SettingsModel as any;

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne({});
    
    if (!settings) {
      console.log('No settings found in database. Auto-seeding default settings...');
      settings = await Settings.create(initialSettings);
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    let settings = await Settings.findOne({});
    if (settings) {
      settings.googleAnalyticsId = body.googleAnalyticsId;
      settings.googleAdsenseClientId = body.googleAdsenseClientId;
      settings.robotsTxt = body.robotsTxt;
      settings.siteUrl = body.siteUrl;
      if (body.siteName !== undefined) settings.siteName = body.siteName;
      if (body.footerTagline !== undefined) settings.footerTagline = body.footerTagline;
      await settings.save();
    } else {
      settings = await Settings.create(body);
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
