import dbConnect from '../../lib/mongodb';
import SettingsModel from '../../models/Settings';

const Settings = SettingsModel as any;

// Serves /ads.txt for Google AdSense verification.
// The publisher ID (ca-pub-XXXX) is read from Settings; ads.txt requires the
// numeric form (pub-XXXX), so we strip the "ca-" prefix if present.
export async function GET() {
  let clientId = '';

  try {
    await dbConnect();
    const settings = await Settings.findOne({});
    clientId = settings?.googleAdsenseClientId || '';
  } catch {
    clientId = '';
  }

  if (!clientId) {
    // No publisher configured yet — return an empty (but valid) file.
    return new Response('', {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const pubId = clientId.replace(/^ca-/, '');
  const body = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain',
      // Cache for a day; ads.txt changes rarely.
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
