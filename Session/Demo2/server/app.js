import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sessionCheck from "./middlewares/sessionCheck.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import "./config/db.js"

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5500",
    credentials: true
}));
app.use(cookieParser("Amarjeet-123$#"));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Okey");
});

app.use(sessionCheck);
app.use("/dashboard", dashboardRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
