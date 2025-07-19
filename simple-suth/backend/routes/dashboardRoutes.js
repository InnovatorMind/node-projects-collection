import express from "express";
import userTodos from "../todosDB.json" with { type: "json" };
import { writeFile } from "fs/promises";
import path from "path";


const router = express.Router();

// GET todos for logged-in user
router.get("/todos", (req, res) => {
  const { uid } = req.cookies;
  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const user = userTodos.find(item => item.uid === uid);
//   console.log(user)
  const todos = user?.tasks || [];
  res.json(todos);
});


// POST new todo for logged-in user
router.post("/todos", express.json(), async (req, res) => {
    console.log("here in the todos")
    const { uid } = req.cookies;
    const { task } = req.body;
    console.log({ uid: uid, task: task});

    if (!uid) return res.status(401).json({ error: "Unauthorized" });
    if (!task) return res.status(400).json({ error: "Task is required" });


    const user = userTodos.find((item) => item.uid === uid);
    const newTodo = {
        id: Date.now(),
        task,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    // console.log(user)
    if (!user) {
        // userTodos.push({ uid, todos: [newTodo] });
        // res.end("user not found");
        console.log("User not found!!!");
    } else {
        user.tasks.push(newTodo);
    }

    try {
        await writeFile("./todosDB.json", JSON.stringify(userTodos));
        res.status(201).json(newTodo);
    } catch (err) {
        console.error("Write error:", err);
        res.status(500).json({ error: "Failed to save todo" });
    }
});

export default router;
