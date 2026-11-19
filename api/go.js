// GET /go/<channel> (rewritten to /api/go?channel=<channel>).
// Server-side 302 so it works in in-app browsers with no JavaScript.
import { goTarget } from './_app-flow.js';

export default function handler(req, res) {
  const query = req.query || {};
  const channel = String(Array.isArray(query.channel) ? query.channel[0] : query.channel || '').toLowerCase();
  const single = {};
  for (const [key, value] of Object.entries(query)) {
    // A key sent twice is ambiguous; drop it rather than guess.
    if (key !== 'channel' && !Array.isArray(value)) single[key] = value;
  }
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.statusCode = 302;
  res.setHeader('Location', goTarget(channel, single));
  res.end();
}
