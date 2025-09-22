import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json()); // built-in body parser for JSON Content-Type: application/json
app.use(express.urlencoded({ extended: true })); // built-in body parser handle HTML form Content-Type: application/x-www-form-urlencoded
app.use(express.text()); // built-in body parser for text Content-Type: text/plain


app.post("/", (req, res) => {
    console.log(req.body);
    res.end("success");
});

app.post("/test", (req, res) => {
    console.log(req.body);
    res.end("success");
});

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});