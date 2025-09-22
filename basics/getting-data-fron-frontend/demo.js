import express from "express";

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
    console.log(req);
    res.end("yoo!!");
})

app.post("/", (req, res) => {

    // ================= read headers =======================
    // console.log(req.headers); // to get all headers data
    // console.log(req.header("content-type")); // to get a specific header pass the key(name) as an parameter here


    // =========== Query params / Route params ==============
    // If data comes in the URL: localhost:4000/test?id=123&name=abc
    // console.log(req.query); // { id: "123", name: "abc" }

    // if the  route params are like that :something e.g. >>>>> "/test/:id", (req, res)
    // console.log(req.params); 
    


    // ===== lets read the chunks of data that we are getting in the req =====
    let body = "";
    req.on("data", (chunk) => {
        console.log("Chunk:", chunk.toString());
        body += chunk;
    });
    req.on("end", () => {
        console.log("Full body:", body);
        res.send("Received raw data");
    });
})

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})