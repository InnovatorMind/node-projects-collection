import express from "express";

const app = express();
const port = 4000;

// =============================
// 🧠 In-Memory Store
// =============================
const requestCounts = {}; // { ip: { count: 1, startTime: 123456789 } }

// =============================
// 🚦 Rate Limiting Middleware
// =============================

const LIMIT = 5;           // Max 5 requests
const WINDOW_MS = 10_000;  // Per 10 seconds

app.use((req, res, next) => {
  const ip = req.ip;

  const currentTime = Date.now();
  const record = requestCounts[ip];

  if (!record) {
    // First request from this IP
    requestCounts[ip] = { count: 1, startTime: currentTime };
    return next();
  }

  const elapsed = currentTime - record.startTime;

  if (elapsed < WINDOW_MS) {
    // Still within window
    if (record.count >= LIMIT) {
      return res
        .status(429)
        .send(`⛔ Rate limit exceeded. Try again after ${((WINDOW_MS - elapsed) / 1000).toFixed(1)} seconds.`);
    }

    record.count++;
    return next();
  }

  // Window expired → reset counter
  requestCounts[ip] = { count: 1, startTime: currentTime };
  next();
});

// =============================
// 🛣️ Routes
// =============================

app.get("/", (req, res) => {
  console.log(requestCounts);
  res.send("✅ You're within the rate limit.");
});

// =============================
// 🚀 Server Start
// =============================

app.listen(port, () => {
  console.log(`Rate Limiter running at http://localhost:${port}`);
});
