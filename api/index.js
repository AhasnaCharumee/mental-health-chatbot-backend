// Vercel Serverless Wrapper for Express + CORS
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

module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    return res.end();
  }
  
  const app = require('../dist/index').default;
  return app(req, res);
};


