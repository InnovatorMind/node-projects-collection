import express from "express";
import cors from "cors";
import checkAuth from "./middlewares/auth.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import { connectDB } from "./db.js";

const app = express();
const PORT = 4000;
try {
const db = await connectDB();

app.use(cors({
  origin: "http://localhost:5500",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.end("hi");
});

app.use((req, res, next) => {
  req.db = db;
  // console.log("In global route ->", db.namespace);
  next();
}); 

app.use("/dashboard", checkAuth, dashboardRoutes);
app.use("/user", userRoutes)

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`listening at http://loacalhost:${PORT}`);
})

} catch (err) {
  console.log("Could not connect to database!");
  console.log(err);
}