import express from "express";
import mongoose from "mongoose";
import Session from "../models/Session.js";
import User from "../models/User.js";
import Todo from "../models/Todo.js";

const router = express.Router();

// POST new todo for logged-in user
export const createTodo = async (req, res) => {
  const { task, completed = false } = req.body;
  const sessionId = req.signedCookies.sid;

  if (!task) return res.status(400).json({ error: "Task is required" });

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // 🎯 Case 1: Logged-in user -> Save in Todo collection
    if (session.userId) {
      const newTodo = await Todo.create({
        _id: new mongoose.Types.ObjectId(),
        userId: session.userId,
        task,
        completed,
      });

      return res.json({ success: true, task: newTodo });
    }

    // 🎯 Case 2: Guest user -> Save inside session.data.tasks
    const newTask = {
      _id: new mongoose.Types.ObjectId(),
      task,
      completed,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    session.data.tasks.push(newTask);
    session.markModified("data");
    await session.save();

    res.json({ success: true, task: newTask });
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// GET todos for logged-in user
export const getTodos = async (req, res) => {
  const sessionId = req.signedCookies.sid;

  try {
    // 🔍 Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      res.clearCookie("sid");
      return res.status(404).json({ error: "Session not found" });
    }

    if (!session.userId) {
      // 📋 Send back the tasks
      res.json(session.data.tasks);
    } else {
      const data = await Todo.find({ userId: session.userId });
      res.json(data);
    }


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

    // 🔍 Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // 🎯 Case 1: Logged-in user -> Update in Todo collection
    if (session.userId) {
      const todo = await Todo.findOne({ _id: taskId, userId: session.userId });
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }

      todo.completed = !todo.completed;
      todo.updatedAt = new Date();
      await todo.save();

      return res.json(todo);
    }

    console.log(taskId);
    // 🔄 Find task inside session.data.tasks 
    const task = session.data.tasks.find(t => t._id.toString() === taskId);
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
    if (!todoId) {
      return res.status(400).json({ error: "Task ID required" });
    }
    console.log("-> ", todoId);

    // 🔍 Find session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.userId) {
      // 🔑 Logged-in user → delete from Todo collection
      const deleted = await Todo.findOneAndDelete({
        _id: todoId,
        userId: session.userId,
      });

      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.json({ success: true, deletedId: deleted._id });
    } else {
      // 👤 Guest user → delete from session.data.tasks
      const index = session.data.tasks.findIndex((t) => t._id.toString() === todoId);
      console.log(index)
      if (index === -1) {
        return res.status(404).json({ error: "Task not found" });
      } session.data.tasks.splice(index, 1);
      session.markModified("data");
      await session.save();

      return res.json({ success: true, deletedId: todoId });
    }
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
};


// Get user name
export const getCurrentUser = async (req, res) => {
  try {
    const sessionId = req.signedCookies.sid;
    if (!sessionId) {
      return res.status(401).json({ error: "No session found" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.userId) {
      // 🔑 Logged-in user → fetch from DB
      const user = await User.findById(session.userId).select("username");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({ username: user.username, isGuest: false });
    } else {
      // 👤 Guest user → just return Guest
      return res.json({ username: "Guest", isGuest: true });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
};



export default router;
