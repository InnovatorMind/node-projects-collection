import express from "express";
import Todo from '../models/todo.js';

const router = express.Router();

// POST new todo for logged-in user
export const createTodo = async (req, res) => {
    // console.log("📥 In the POST /todos route");
    const { task, completed = false } = req.body;

    try {
        const user = req.user;
        if (!user) return res.status(401).json({ error: "Unauthorized" });
        if (!task) return res.status(400).json({ error: "Task is required" });

        const todo = {
            task,
            completed,
            userId: user._id, // ✅ now it's valid!
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const newTodo = await Todo.create(todo); // 👈 use .create with Mongoose
        res.status(201).json(newTodo);
    } catch (err) {
        console.error("Error creating todo:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// GET todos for logged-in user
export const getTodos = async (req, res) => {
    // console.log("In dashboard/todos ->", db.namespace);
    try {
        const user = req.user;
        if (!user) return res.status(404).json({ error: "User not found" });
        // 📋 Find todos for that user
        const todos = await Todo.find({ userId: user._id });

        res.json(todos);
        // console.log(todos);
    } catch (err) {
        console.error("Error fetching todos:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Check-UnCheck todo
export const toggleTodo = async (req, res) => {
    try {
        const user = req.user;
        const todoId = req.params.id;

        if (!req.user) return res.status(401).json({ error: "Unauthorized" });

        // First, find the todo to check current status
        const existingTodo = await Todo.findOne({
            _id: todoId,
            userId: user._id
        });
        if (!existingTodo) return res.status(404).json({ error: "Todo not found" });

        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId, userId: user._id },
            { $set: { completed: !existingTodo.completed, updatedAt: new Date() } },
            { new: true }
        );

        res.json(updatedTodo);
    } catch (err) {
        console.error("Error updating todo:", err);
        res.status(500).json({ error: "Failed to update todo" });
    }
};

// Delete any task
export const deleteTodo = async (req, res) => {
    try {
        const user = req.user;
        const todoId = req.params.id;

        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const result = await Todo.deleteOne({
            _id: todoId,
            userId: user._id  // 🔐 ensure ownership before deleting
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Todo not found or unauthorized" });
        }

        res.json({ success: true, deletedId: todoId });
    } catch (err) {
        console.error("Error deleting todo:", err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
};

// Get user name
export const getCurrentUser = async (req, res) => {

    try{
        const user = req.user;
        res.json({ username: user.username });
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Server error" });
    }
};




export default router;
