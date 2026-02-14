import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import router from "./routes/router";


dotenv.config();
const app = express();
const port = process.env.PORT || 3300;
const context = process.env.CONTEXT as string;
const dbUrl = process.env.MONGO_URL as string;

connectDB(dbUrl);

app.use(cors());
app.use(express.json());
app.use(context, router);

app.listen(port, ()=>{
    console.log(`server is up and running at ${port}`);
})