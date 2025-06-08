import express from "express";

const app = express();
const port = 4000;

// ====================================
// ⏳ Response Time Tracking Middleware
// ====================================
app.use((req, res, next) => {
  const start = Date.now(); // Mark start time

  // When the response is finished, calculate elapsed time
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`⏱️ [${req.method}] ${req.url} - ${duration}ms`);
  });

  next(); // Continue to next middleware/route
});

// ==============================
// 🛣️ Dummy Routes for Testing
// ==============================

app.get("/", (req, res) => {
  res.send("🌍 Welcome to the home route.");
});

app.get("/slow", (req, res) => {
  // Simulate delay
  setTimeout(() => {
    res.send("🐢 This response was delayed by 3 second.");
  }, 3000);
});

app.get("/fast", (req, res) => {
  res.send("⚡ This response is quick!");
});

// ==============================
// 🧯 Error Middleware (optional)
// ==============================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).send("Something went wrong.");
});

// ==============================
// 🚀 Start the Server
// ==============================
app.listen(port, () => {
  console.log(`Response Tracker running at http://localhost:${port}`);
});
