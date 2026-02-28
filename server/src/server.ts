import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import serverlessExpress from "@vendia/serverless-express";
import { connectDB } from "./config/db";
import authRouter from "./routes/auth.route";
import appRouter from "./routes/app.route";

dotenv.config();

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL is not defined in environment variables");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
const port = process.env.PORT || 5000;
const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Rate limiting (important for auth routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", limiter);


// Morgan HTTP logger
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use("/api/auth", authRouter);
app.use("/api/habit", appRouter);

app.use(compression());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date(),
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({success: false, message: "Route not found"})
});

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    console.error("ERROR:", {
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
      path: req.path,
      method: req.method,
    });

    res.status(err.status || 500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : err.message,
    });
  }
);

connectDB(process.env.MONGO_URL);

if (process.env.IS_OFFLINE || process.env.NODE_ENV !== "production") {
    app.listen(port, () => {
        console.log(`Server running at: http://localhost:${port}`);
    });
}

console.log("Server file loaded at:", new Date().toISOString());
export const handler = serverlessExpress({ app });