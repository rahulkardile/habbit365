import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRouter from "./routes/auth.route";
import appRouter from "./routes/app.route";

dotenv.config();
const app = express();
const port = process.env.PORT || 3300;
const dbUrl = process.env.MONGO_URL as string;

connectDB(dbUrl);

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/app", appRouter);

app.listen(port, ()=>{
    console.log(`server is up and running at ${port}`);
})