import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const userRouter = Router();

// Apply auth middleware to all routes in this router
userRouter.use(authMiddleware);

// Example protected route: Get current user info
userRouter.get('/me', (req: Request, res: Response) => {
  // Access user ID attached by the middleware
  const userId = req.user?.userId;
  if (!userId) {
    // This should theoretically not happen if middleware is working
    return res.status(401).json({ message: 'Unauthorized: User ID not found' });
  }
  // In a real scenario, you might fetch user details from the DB using userId
  res.json({ message: `Protected route accessed by user ${userId}`, userId });
});

// Add other user-related routes here (e.g., update settings)

export default userRouter;
