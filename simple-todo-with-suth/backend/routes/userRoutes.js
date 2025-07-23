import express from "express";
import { randomUUID } from "crypto";
// import { Db } from "mongodb";

const router = express.Router();

// Registration
router.post("/register", async (req, res) => {
    console.log("You are in the register Routes");
    const db = req.db;
    const { username, email, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if email already exists
        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered." });
        }

        // Create user object
        const uid = randomUUID();
        const newUser = {
            username,
            email,
            password,
            uid,
            createdAt: new Date().toISOString()
        };

        // Save to DB
        await db.collection("users").insertOne(newUser);

        // Set session cookie
        res.cookie("uid", uid, {
            httpOnly: true,
            sameSite: "Lax",
            path: "/"
        });
        res.status(201).json({ message: "Registration successful." });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error during registration." });
    }
});

// Login
router.post("/login", async (req, res) => {
  const db = req.db;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Plain password comparison (NOT SECURE — just for dev/testing!)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Set the cookie
    res.cookie("uid", user.uid, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "Lax",
      path: "/"
    });

    res.json({ message: "Logged in" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get user name
router.get("/me", async (req, res) => {
  const db = req.db;
  const { uid } = req.cookies;

  if (!uid) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const user = await db.collection("users").findOne({ uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ username: user.username });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// logout
router.post('/logout', (req, res) => {
    console.log("im in logout route")
    res.clearCookie('uid', {
        path: '/',
        httpOnly: true,
        sameSite: 'Lax'
    });
    res.json({ message: 'Logged out' });
});


export default router;

