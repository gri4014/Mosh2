import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const postRouter = Router();

// Apply auth middleware to all routes in this router
postRouter.use(authMiddleware);

// Example protected route: Placeholder for getting upcoming posts
postRouter.get('/upcoming', (req: Request, res: Response) => {
  const userId = req.user?.userId;
  res.json({ message: `User ${userId} fetching upcoming posts (placeholder)` });
});

// Example protected route: Placeholder for approving a post
postRouter.post('/:postId/approve', (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const postId = req.params.postId;
  res.json({ message: `User ${userId} approving post ${postId} (placeholder)` });
});

// Add other post-related routes here (e.g., create post, edit post)

export default postRouter;
