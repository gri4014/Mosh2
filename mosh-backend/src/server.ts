import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import authRouter from './routes/authRoutes'; // Import the auth router
import userRouter from './routes/userRoutes';
import instagramRouter from './routes/instagramRoutes';
import strategyRouter from './routes/strategyRoutes';
import postRouter from './routes/postRoutes';
import adRouter from './routes/adRoutes';

dotenv.config(); // Load environment variables from .env file

const app: Express = express();
const port = process.env.PORT || 3000; // Default to 3000 if PORT not set

// --- CORS Configuration ---
// Allow requests specifically from the frontend development server (port 3002)
const corsOptions = {
  origin: 'http://localhost:3002',
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// --- Routes ---
app.get('/', (req: Request, res: Response) => {
  res.send('Mosh Backend Server is running!');
});

// Mount authentication routes
app.use('/api/auth', authRouter);

// Mount other protected routes
app.use('/api/users', userRouter);
app.use('/api/instagram', instagramRouter);
app.use('/api/strategies', strategyRouter);
app.use('/api/posts', postRouter);
app.use('/api/ads', adRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
