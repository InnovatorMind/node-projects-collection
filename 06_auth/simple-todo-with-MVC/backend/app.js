import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import checkAuth from "./middlewares/authMiddleware.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import "./config/db.js"

const app = express();
const PORT = 4000;

try {

app.use(cors({
  origin: "http://localhost:5500",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/dashboard", checkAuth, dashboardRoutes);
app.use("/user", userRoutes)

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`listening at http://loacalhost:${PORT}`);
})

} catch (err) {
  console.log("Could not connect to database!");
  console.log(err);
}