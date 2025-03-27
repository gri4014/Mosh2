import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const instagramRouter = Router();

// Apply auth middleware to all routes in this router
instagramRouter.use(authMiddleware);

// Example protected route: Placeholder for connecting Instagram
instagramRouter.post('/connect', (req: Request, res: Response) => {
  const userId = req.user?.userId;
  res.json({ message: `User ${userId} attempting to connect Instagram (placeholder)` });
});

// Add other Instagram-related routes here (e.g., get status, disconnect)

export default instagramRouter;
