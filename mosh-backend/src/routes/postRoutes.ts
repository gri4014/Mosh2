import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { updatePostController, getPostsController } from '../controllers/postController'; // Import controllers

const postRouter = Router();

// Apply auth middleware to all routes in this router
postRouter.use(authMiddleware);

// Route for fetching all posts for the authenticated user
postRouter.get('/', getPostsController);

// Example protected route: Placeholder for getting upcoming posts (can be removed or refined later)
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

// Route for updating a post
postRouter.patch('/:postId', updatePostController);

// Add other post-related routes here (e.g., create post)

export default postRouter;
