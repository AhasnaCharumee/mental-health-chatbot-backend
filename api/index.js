// api/index.js  (Vercel Serverless Handler)

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://mental-health-chatbot-frontend-dxerfkuc4.vercel.app",
  "https://mental-health-chatbot-frontend-g1ginbxqle.vercel.app",
  "https://mental-health-chatbot-frontend-g1ginbxyr.vercel.app",
  "https://mental-health-chatbot-frontend-dq4daxqle.vercel.app",
  "https://mental-health-chatbot-frontend-beta.vercel.app",
  "https://mental-health-chatbot-frontend-1teqhfw1v.vercel.app",
];

function isAllowed(origin) {
  if (!origin) return false;
  if (allowedOrigins.includes(origin)) return true;
  return false;
}

module.exports = (req, res) => {
  const origin = req.headers.origin || "";

  // 🔥 CORS set ALWAYS
  if (isAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"] ||
      "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Max-Age", "3600");

  // 🔥 OPTIONS MUST STOP HERE — FIXES YOUR ERROR
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 🔥 Forward to built Express app
  try {
    const app = require("../dist/index").default;
    return app(req, res);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.end(
      JSON.stringify({
        error: "Server wrapper error",
        details: String(err),
      })
    );
  }
};
