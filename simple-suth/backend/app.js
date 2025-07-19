import express from "express";
import cors from "cors";
import checkAuth from "./auth.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";

const app = express();
const PORT = 4000;

app.use(cors({
  origin:"http://localhost:5501",
  credentials:true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.end("hi");
});

app.use("/dashboard", checkAuth, dashboardRoutes);
app.use("/user", userRoutes)

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () =>{
    console.log(`listening at http://loacalhost:${PORT}`);
})