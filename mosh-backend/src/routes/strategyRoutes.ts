import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const strategyRouter = Router();

// Apply auth middleware to all routes in this router
strategyRouter.use(authMiddleware);

// Example protected route: Placeholder for getting global strategy
strategyRouter.get('/global', (req: Request, res: Response) => {
  const userId = req.user?.userId;
  res.json({ message: `User ${userId} fetching global strategy (placeholder)` });
});

// Example protected route: Placeholder for getting monthly strategy
strategyRouter.get('/monthly', (req: Request, res: Response) => {
  const userId = req.user?.userId;
  res.json({ message: `User ${userId} fetching monthly strategy (placeholder)` });
});

// Add other strategy-related routes here (e.g., submit survey, update strategy)

export default strategyRouter;
