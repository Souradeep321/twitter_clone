import path from 'path'
import express from 'express'
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import { v2 as cloudinary } from 'cloudinary';
import cors from "cors"

// import routes
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import notificationRoutes from './routes/notification.routes.js'

import connectDb from './db/connection.js';

dotenv.config({
    path: "backend/.env",
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express()
const port = process.env.PORT || 5001;

const __dirname = path.resolve();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)
// common middleware
app.use(express.json({ limit: "5mb" }))  // to parse req.body 
// Limit shouldn't be too high to prevent Dos attack
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}


connectDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port http://localhost:${port}`);
        });
    }).catch((error) => {
        console.log("Mongodb connection error :", error);
        process.exit(1)
    })