import express from "express";
import { ObjectId } from 'mongodb';

const router = express.Router();

// GET todos for logged-in user
router.get("/todos", async (req, res) => {
  const db = req.db;
  // console.log("In dashboard/todos ->", db.namespace);

  const { uid } = req.cookies;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  try {
    // First, find the user using the UID
    const user = await db.collection("users").findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Then, get all todos belonging to that user
    const todos = await db.collection("todos")
      .find({ userId: user._id })
      .toArray();

    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Check-UnCheck todo
router.patch("/todos/:id", express.json(), async (req, res) => {
  try {
    const db = req.db;
    const user = req.user;
    const todoId = req.params.id;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // First, find the todo to check current status
    const existingTodo = await db.collection("todos").findOne({
      _id: new ObjectId(todoId),
      userId: user._id
    });

    if (!existingTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    // Invert the completed value manually
    const result = await db.collection("todos").findOneAndUpdate(
      {
        _id: new ObjectId(todoId),
        userId: user._id
      },
      {
        $set: {
          completed: !existingTodo.completed,
          updatedAt: new Date()
        }
      },
      { returnDocument: "after" }
    );

    res.json(result.value);
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});


// Delete any task
router.delete("/todos/:id", async (req, res) => {
  try {
    const db = req.db;
    const user = req.user;
    const todoId = req.params.id;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await db.collection("todos").deleteOne({
      _id: new ObjectId(todoId),
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
});


// POST new todo for logged-in user
router.post("/todos", async (req, res) => {
  console.log("In the post todos ruote");
  try {
    const db = req.db;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { task, completed = false } = req.body;

    if (!task) {
      return res.status(400).json({ error: "Task is required" });
    }

    const newTodo = {
      task,
      completed,
      userId: user._id,        // 👈 establishes relationship
      createdAt: new Date(),
      updatedAt: new Date().toISOString()
    };
    const result = await db.collection("todos").insertOne(newTodo);

    // Attach the MongoDB generated _id to the object and return it
    newTodo._id = result.insertedId;
    res.status(201).json(newTodo);  // 👈 full todo returned here
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
