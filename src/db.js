import mongoose from "mongoose";
import { MONGO_URI } from "./config/env.config.js";
export const dbConnection = async() => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Database is connected")
    } catch (error) {
        console.log(error)
    }
}