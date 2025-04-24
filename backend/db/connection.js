import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`Database connected with ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Mongodb connection error :", error.message);
        process.exit(1)
    }
};

export default connectDb