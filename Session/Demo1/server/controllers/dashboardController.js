import express from "express";
import { nanoid } from "nanoid";
import Todo from '../models/todo.js';
import Session from "../models/Session.js";

const router = express.Router();

// POST new todo for logged-in user
export const createTodo = async (req, res) => {
    const { task, completed = false } = req.body;
    const sessionId = req.signedCookies.sid;
    if (!task) return res.status(400).json({ error: "Task is required" });

    try {
        const newTask = {
            taskId: nanoid(),
            task,
            completed: completed || false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await Session.updateOne(
            { _id: sessionId },
            { $push: { "data.tasks": newTask } }
        );

        res.json({ success: true, task: newTask });
    } catch (err) {
        console.error("Error creating todo:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// GET todos for logged-in user
export const getTodos = async (req, res) => {
    console.log("In dashboard/todos ->");
    const sessionId = req.signedCookies.sid;

    try {
        // 🔍 Find the session
        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        // 📋 Send back the tasks
        res.json(session.data.tasks);
    } catch (err) {
        console.error("Error fetching todos:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Check-UnCheck todo
export const toggleTodo = async (req, res) => {
    try {
        const sessionId = req.signedCookies.sid;
        const taskId = req.params.id;

        console.log(taskId);
        // 🔍 Find the session
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        // res.json(updatedTask);
        // 🔄 Find task inside session.data.tasks
        const task = session.data.tasks.find(t => t.taskId === taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        // ✅ Toggle completion
        task.completed = !task.completed;
        task.updatedAt = new Date();

        // ⚠️ Tell Mongoose the nested field changed
        session.markModified("data");

        // 💾 Save the session back
        await session.save();

        // 🎯 Send updated task
        res.json(task);
    } catch (err) {
        console.error("Error updating todo:", err);
        res.status(500).json({ error: "Failed to update todo" });
    }
};

// Delete any task
export const deleteTodo = async (req, res) => {
  try {
    const sessionId = req.signedCookies.sid;
    const todoId = req.params.id;

    // 🔍 Find session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // 📉 Find index of task to delete
    const index = session.data.tasks.findIndex(t => t.taskId === todoId);
    if (index === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    // ❌ Remove it
    session.data.tasks.splice(index, 1);

    // ⚠️ Tell Mongoose the nested field changed
        session.markModified("data");

    // 💾 Save changes
    await session.save();

    res.json({ success: true, deletedId: todoId });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
};


// Get user name
export const getCurrentUser = async (req, res) => {
    const session = req.signedCookies.sid;
    try {
        const user = req.user;
        res.json({ username: user.username });
    } catch (err) {
        console.error("Error fetching user:");
        res.status(500).json({ error: "Server error" });
    }
};




export default router;
