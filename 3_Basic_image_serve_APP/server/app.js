import express from "express";
import { readdir } from "fs/promises";

const app = express();

// Enabling CORS
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});

// Serving File
app.use((req, res, next) => {
  // console.log(req.url.split("?")[0].trim(0));
  const requestImage =req.url.split("?")[0].trim(0);

  if (req.query.action === "download") {
    res.set("Content-Disposition", "attachment");
  }
  console.log(requestImage + " is " + (req.query.action === "download" ? "downloaded" : "viewed") + " by user");
  express.static("storage")(req, res, next);
});

// Serving Dir Content
app.get("/", async (req, res) => {
  const filesList = await readdir("./storage");
  console.log(filesList);
  res.json(filesList);
});

app.listen(4000, () => {
  console.log(`Server Started`);
});
