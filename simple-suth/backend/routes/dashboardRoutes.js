import express from "express";
import userTodos from "../todosDB.json" with { type: "json" };
import { writeFile } from "fs/promises";

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

// Check-UnCheck todo
router.patch("/todos/:id", express.json(), async (req, res) => {
  const { uid } = req.cookies;
  const { id } = req.params;
//   console.log(id)

  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const user = userTodos.find(item => item.uid === uid);
  if (!user) return res.status(404).json({ error: "User not found" });

  const todo = user.tasks.find(t => t.id === parseInt(id));
  if (!todo) return res.status(404).json({ error: "Todo not found" });

  todo.completed = !todo.completed;
  todo.updatedAt = new Date().toISOString();
//   console.log(todo);

  try {
    await writeFile('./todosDB.json', JSON.stringify(userTodos, null, 2), 'utf8');
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
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
