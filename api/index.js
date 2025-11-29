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
  try {
    const origin = req.headers.origin || '';

    const allowed = allowedOrigins.includes(origin)
      ? origin
      : "*";

    res.setHeader("Access-Control-Allow-Origin", allowed);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      return res.end();
    }

    const expressApp = require("../dist/index").default;
    return expressApp(req, res);

  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    return res.end("Server error or dist/index.js missing. Run `npm run build`.");
  }
};
