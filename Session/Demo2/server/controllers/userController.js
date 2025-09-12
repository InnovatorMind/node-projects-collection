import { Types } from "mongoose";
import User from '../models/User.js'; // if needed for lookup/auth
import bcrypt from "bcrypt";
import Session from "../models/Session.js";
import Todo from "../models/Todo.js"

// Register user
export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const existingUser = await User.findOne({ email });  // 💡 Mongoose method
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
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

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(404).json({ error: "Invalid Credentials" });
        }

        const sessionId = req.signedCookies.sid;
        const session = await Session.findById(sessionId);
        console.log(session);

        if (session) {
            session.expires = Math.round(Date.now() / 1000) + 60 * 60 * 24 * 30;
            session.userId = user._id;

            const tasks = session.data?.tasks || [];  // 👈 ensure it's an array
            console.log("-> ", tasks);

            if (tasks.length > 0) {
                const todos = await Promise.all(
                    tasks.map(task =>
                        Todo.create({
                            _id: task._id,
                            userId: user._id,
                            task: task.task,
                            completed: task.completed || false,
                            createdAt: task.createdAt,
                            updatedAt: task.updatedAt
                        })
                    )
                );
                console.log("Created Todos:", todos);
            } else {
                console.log("⚠️ No tasks found in session");
            }

            session.data = {};
            await session.save();

            res.cookie("sid", session.id, {
                httpOnly: true,
                signed: true,
                maxAge: 1000 * 60 * 60 * 24 * 30,
            });

            return res.json({
                message: "Login successful",
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                },
            });
        }

        const newSession = await Session.create({ userId: user._id });
        newSession.data = {};
        await newSession.save();
        res.cookie("sid", newSession.id, {
            httpOnly: true,
            signed: true,
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });

        return res.json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Logout 
export const logout = async (req, res) => {
    const sessionId = req.signedCookies.sid;
    const session = await Session.findById(sessionId);
    console.log(session);
    if (session.userId) {
        await Session.findByIdAndDelete(sessionId);
        res.clearCookie("sid");
        res.json({ message: "Logout Successful" });
    }
};

