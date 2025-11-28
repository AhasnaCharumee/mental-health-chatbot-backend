// Vercel serverless wrapper that handles CORS preflight and delegates
// to the compiled Express app exported from `dist/index.js`.
// It responds to OPTIONS before attempting to require the compiled app
// so preflight requests always receive proper CORS headers.
const DEFAULT_ALLOWLIST = [
  'http://localhost:3001',
  'http://localhost:3000',
  'https://mental-health-chatbot-frontend-biwcaeoc7.vercel.app',
  'https://mental-health-chatbot-frontend-beta.vercel.app'
];

function getAllowedOrigins() {
  const env = process.env.CORS_ALLOWLIST || process.env.CORS_ORIGIN || '';
  if (!env) return DEFAULT_ALLOWLIST;
  // Allow comma-separated list or single origin
  return env.split(',').map(s => s.trim()).filter(Boolean);
}

const allowedOrigins = getAllowedOrigins();

module.exports = (req, res) => {
  try {
    const origin = req.headers.origin;
    const allowed = allowedOrigins.includes(origin) ? origin : (process.env.CORS_ORIGIN || '*');

    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    // If you need cookies/auth between origins, set this to 'true' and ensure allowed is not '*'
    // res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    // Delegate to compiled Express app
    const mod = require('../dist/index');
    const app = mod && mod.default ? mod.default : mod;
    return app(req, res);
  } catch (e) {
    // If dist isn't present or an error occurs, return a helpful 500
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('Server error or dist/index.js missing. Build the project before deploying.');
  }
};
