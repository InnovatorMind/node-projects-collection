import express from "express";

const app = express();
const port = 4000;

// Enable JSON parsing
app.use(express.json());

// ==========================
// 🔐 Auth Middleware
// ==========================
const authMiddleware = (req, res, next) => {
  const token = req.headers["x-auth"];
  if (token === "letmein") {
    next(); // Authorized
  } else {
    const err = new Error("Access Denied: Invalid or missing token.");
    err.status = 401;
    next(err); // Pass to error middleware
  }
};

// ==========================
// 🛣️ Routes
// ==========================

// Public route
app.get("/", (req, res) => {
  res.send("🌍 Welcome to the Public API! No token needed.");
});

// Protected route
app.get("/dashboard", authMiddleware, (req, res) => {
  res.send("🔐 Welcome to your dashboard. You are authenticated.");
});

// Bonus: POST route (optional)
app.post("/data", authMiddleware, (req, res) => {
  const userData = req.body;
  res.json({
    message: "✅ Data received securely!",
    data: userData,
  });
});

// ==========================
// 🧯 Error Handler Middleware
// ==========================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

// ==========================
// 🚀 Start Server
// ==========================
app.listen(port, () => {
  console.log(`Auth API running at http://localhost:${port}`);
});
