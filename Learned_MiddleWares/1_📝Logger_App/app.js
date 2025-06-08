import express from "express";

const app = express();
const port = 4000;

// ========================
// 📝 Logger Middleware
// ========================
const logger = (req, res, next) => {
  console.log("you are in logger");
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// ========================
// ⏱️ Response Time Tracker
// ========================
const responseTimer = (req, res, next) => {
    console.log("you are in response timeer!!! ")
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`⏱️ Request processed in ${duration}ms`);
  });

  next();
};

// ========================
// 🔐 Auth Middleware
// ========================
const auth = (req, res, next) => {
  // console.log("Entered in auth route!!! ");
  const token = req.headers["x-auth"];
  if (token === "12345") {
    next();
  } else {
    const err = new Error("Unauthorized! Invalid token.");
    err.status = 401;
    next(err); // pass error to error middleware
  }
};

// ========================
// 🚫 Error Handler Middleware
// ========================
const errorHandler = (err, req, res, next) => {
  console.log("🔥 Error Middleware Triggered");
  console.log("Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
};

// ========================
// ✅ Use Middlewares Globally
// ========================
app.use(responseTimer);
app.use(logger);

// ========================
// 🛣️ Routes
// ========================

app.get("/", (req, res) => {
  res.send("Welcome to the home page! 🚀");
});

app.get("/secret", auth, (req, res) => {
  // console.log("I will run after auth");
  res.send("You've accessed a protected route! 🔐");
});

app.get("/cause-error", (req, res, next) => {
  next(new Error("This is a manual error for testing!"));
});

// ========================
// 🧯 Error Middleware (always last)
// ========================
app.use(errorHandler);

// ========================
// 🚀 Start the Server
// ========================
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
