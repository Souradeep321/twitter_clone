import { app } from "./app.js";
import dotenv from "dotenv";
import connectDb from "./db/connection.js";
import { v2 as cloudinary } from 'cloudinary';

dotenv.config({
    path: "backend/.env",
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const port = process.env.PORT || 5001;


connectDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port http://localhost:${port}`);
        });
    }).catch((error) => {
        console.log("Mongodb connection error :", error);
        process.exit(1)
    })
