import express from "express";

const app = express();
const port = 4000;

// Parse incoming JSON
app.use(express.json());

// ==============================
// 🔥 Intentional Error Routes
// ==============================

// 1. Manual error via `next(new Error(...))`
app.get("/manual-error", (req, res, next) => {
  const err = new Error("This is a manually triggered error!");
  err.status = 400;
  next(err);
});

// 2. Error via `throw` (sync error)
app.get("/throw-error", (req, res) => {
  throw new Error("Oops! Something broke with `throw`.");
});

// 3. Async error using rejected promise
app.get("/async-error", async (req, res, next) => {
  try {
    await Promise.reject(new Error("This async error was rejected!"));
  } catch (err) {
    next(err);
  }
});

// 4. Invalid JSON body (handled by express.json())
app.post("/bad-json", (req, res) => {
  res.send("If you see this, JSON was valid!");
});

// ==============================
// 🧯 Error Handling Middleware
// ==============================
app.use((err, req, res, next) => {
  console.error("🧯 Caught Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message,
    stack: err.stack, // Optional: for debugging
  });
});

// ==============================
// 🚀 Start the Server
// ==============================
app.listen(port, () => {
  console.log(`Error Playground running at http://localhost:${port}`);
});
