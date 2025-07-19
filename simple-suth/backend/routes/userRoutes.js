import express from "express";
import { writeFile } from "fs/promises";
import userTodos from "../todosDB.json" with { type: "json" };
import usersData from '../usersDB.json' with {type: "json"}

const router = express.Router();

// Registration
router.post("/register", async (req, res) => {
    console.log("You are in the USER Routes")
    console.log(req.body);

    const { username, password } = req.body;
    const foundUser = usersData.find((user) => user.username === username)
    console.log(foundUser);
    if (foundUser) {
        return res.status(409).json({
            error: "User already exists",
            message: "A user with this email address already exists. Please try logging in or use a different email."
        })
    }

    const userId = crypto.randomUUID()
    usersData.push({
        uid: userId,
        username,
        password,
    })
    userTodos.push({
        uid: userId,
        tasks: []
    })

    // dummy response
    try {
        await writeFile('./usersDB.json', JSON.stringify(usersData))
        await writeFile('./todosDB.json', JSON.stringify(userTodos))
        res.status(201).json({ message: "User Registered" })
    } catch (err) {
        next(err)
    }
});

// Login
router.post('/login', async (req, res, next) => {
    console.log("You arre in Login page!!!")
    const { username, password } = req.body
    console.log(username, " ", password)
    const user = usersData.find((user) => user.username === username)
    if (!user || user.password !== password) {
        return res.status(404).json({ error: 'Invalid Credentials' })
    }
    // console.log(user)
    res.cookie('uid', user.uid, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: 'None',
        path: "/",
        secure: true
    });
    res.json({ message: 'logged in' });

})

router.get('/me', (req, res) => {
    const uid = req.cookies.uid;
    if (!uid) return res.status(401).json({ error: 'Not logged in' });

    const user = usersData.find(u => u.uid == uid);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ username: user.username });
});


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

