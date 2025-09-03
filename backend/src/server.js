import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"

dotenv.config({
    path: "src/.env"
})
const app = express()

app.use(cors())
app.use(express.json())

// Routes
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";  
import chartRoutes from "./routes/charts.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/userRoutes.js"
// import analyzeRoutes from "./routes/analyze.js"

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chart", chartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes)
// app.use("/api/analyze", analyzeRoutes)

//MongoDB Connection
connectDB()
.then(() => {
    app.listen(5000, () => console.log("Server running on port 5000"))
})
.catch(err => console.log(err))

// health
app.get("/", (req, res) => res.send("API running"))

// upload APIs
app.use("/api/upload", uploadRoutes)