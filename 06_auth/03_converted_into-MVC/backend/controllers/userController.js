// import { randomUUID } from "crypto"
import { Types } from "mongoose";
import User from '../models/user.js'; // if needed for lookup/auth

// Register user
export const register = async (req, res) => {
    // console.log("You are in the register Routes");
    const { username, email, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const existingUser = await User.findOne({ email });  // 💡 Mongoose method
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered." });
        }

        const uid = new Types.ObjectId();
        const newUser = new User({
            username,
            email,       // Add to schema if using it
            password,     // Add to schema if using it
            uid,
        });
        await newUser.save();  // ✅ Mongoose saves it

        res.status(201).json({ message: "Registration successful." });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error during registration." });
    }
};


// Login user
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.cookie("uid", user.uid, {
            httpOnly: true,
            sameSite: "Lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

        res.json({ message: "Logged in" });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Get user name
export const getCurrentUser = async (req, res) => {
    const { uid } = req.cookies;

    if (!uid) {
        return res.status(401).json({ error: "Not logged in" });
    }
    
    try {
        const user = await User.findOne({ uid });
        // const user = await db.collection("users").findOne({ uid });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ username: user.username });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Logout 
export const logout = (req, res) => {
    console.log("im in logout route")
    res.clearCookie('uid', {
        path: '/',
        httpOnly: true,
        sameSite: 'Lax'
    });
    res.json({ message: 'Logged out' });
};
