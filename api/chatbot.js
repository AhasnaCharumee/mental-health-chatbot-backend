const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://mental-health-chatbot-frontend.vercel.app",
  "https://mental-health-chatbot-frontend-*.*.vercel.app",
];

module.exports = (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  const app = require("../dist/index.js").default;
  return app(req, res);
};
