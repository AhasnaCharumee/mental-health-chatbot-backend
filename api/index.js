// Vercel Serverless Wrapper for Express + CORS
// Always handle OPTIONS preflight early and set CORS headers
const DEFAULT_ALLOWLIST = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://mental-health-chatbot-frontend-g1ginbxqle.vercel.app',
  'https://mental-health-chatbot-frontend-g1ginbxyr.vercel.app',
  'https://mental-health-chatbot-frontend-dq4daxqle.vercel.app'
];

function getAllowedOrigins() {
  const env = process.env.CORS_ALLOWLIST || process.env.CORS_ORIGIN || '';
  if (!env) return DEFAULT_ALLOWLIST;
  return env.split(',').map(s => s.trim()).filter(Boolean);
}

const allowedOrigins = getAllowedOrigins();

function isOriginAllowed(origin) {
  if (!origin) return false;
  if (allowedOrigins.includes(origin)) return true;
  // allow wildcard for testing convenience
  if (allowedOrigins.includes('*')) return true;
  return false;
}

module.exports = (req, res) => {
  try {
    const origin = req.headers.origin;

    // choose what to return for Access-Control-Allow-Origin
    if (isOriginAllowed(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      // in test/dev it can be useful to allow any origin; in prod set CORS_ALLOWLIST
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    // Common CORS headers
    res.setHeader('Vary', 'Origin');
    const allowHeaders = req.headers['access-control-request-headers'] || 'Content-Type, Authorization';
    res.setHeader('Access-Control-Allow-Headers', allowHeaders);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    // allow credentials if explicitly enabled in env
    const allowCredentials = String(process.env.CORS_ALLOW_CREDENTIALS || 'false').toLowerCase() === 'true';
    if (allowCredentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    // Cache preflight for 1 hour
    res.setHeader('Access-Control-Max-Age', '3600');

    // Always respond to OPTIONS preflight without invoking the Express app
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    // Forward all other requests to the compiled Express app
    const app = require('../dist/index').default;
    return app(req, res);
  } catch (err) {
    // If something unexpected happens here, return a JSON error (helps debugging from browser)
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.end(JSON.stringify({ error: 'Server wrapper error', details: String(err) }));
  }
};


