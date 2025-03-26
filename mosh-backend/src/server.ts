import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app: Express = express();
const port = process.env.PORT || 3000; // Default to 3000 if PORT not set

app.get('/', (req: Request, res: Response) => {
  res.send('Mosh Backend Server is running!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
