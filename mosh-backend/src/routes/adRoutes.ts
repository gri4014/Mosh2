import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const adRouter = Router();

// Apply auth middleware to all routes in this router
adRouter.use(authMiddleware);

// Example protected route: Placeholder for getting ad campaigns
adRouter.get('/', (req: Request, res: Response) => {
  const userId = req.user?.userId;
  res.json({ message: `User ${userId} fetching ad campaigns (placeholder)` });
});

// Example protected route: Placeholder for creating an ad campaign
adRouter.post('/', (req: Request, res: Response) => {
  const userId = req.user?.userId;
  res.json({ message: `User ${userId} creating ad campaign (placeholder)` });
});

// Add other ad-related routes here (e.g., update budget, get performance)

export default adRouter;
