import mongoose from "mongoose";

export const connectDB = async(url: string)=>{
    try {
        await mongoose.connect(url);
        console.log("Connection successfull to mongoDB...");
    } catch (error) {
        console.log("Connection failed to mongoDB, Error : ", error);
        process.exit(1);
    }
}