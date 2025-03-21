import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import 'express-async-errors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import hpp from 'hpp';
import morgan from 'morgan';
import connectDB from './config/db';
import routes from './routes/v1/index';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();
const app = express();

app.use(helmet());

// Enable CORS with Whitelist
const allowedOrigins = process.env.CORS_WHITELIST?.split(',') || [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);

// Prevent HTTP Parameter Pollution
app.use(hpp());

app.use(morgan('combined'));
// Prevent NoSQL Injection
app.use(mongoSanitize());

// Rate Limiting (Prevent DDoS Attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Connect to MongoDB
connectDB();

// Enable JSON Parsing & Compression
app.use(express.json());
app.use(compression());

app.get('/', (req, res) => {
  res.send('hello world new backend');
});

// Import Routes
app.use('/api/v1', routes);

// Send back a 404 error for any unknown api request
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: StatusCodes.NOT_FOUND,
    message: ReasonPhrases.NOT_FOUND,
  });
});

app.use(errorHandler);

export default app;

// TODO:
// need to add validation for check  values define in the .env file
