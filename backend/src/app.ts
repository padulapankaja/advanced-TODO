import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import "express-async-errors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

dotenv.config();
const app = express();

app.use(helmet());

// Enable CORS with Whitelist
const allowedOrigins = process.env.CORS_WHITELIST?.split(",") || [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Prevent NoSQL Injection
app.use(mongoSanitize());

// Rate Limiting (Prevent DDoS Attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Enable JSON Parsing & Compression
app.use(express.json());
app.use(compression());


export default app;
