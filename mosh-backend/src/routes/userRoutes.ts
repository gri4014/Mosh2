import { Router } from 'express'; // Request, Response might not be needed if using controllers
import { authMiddleware } from '../middleware/authMiddleware';
import { getUserProfile, updateSubscription } from '../controllers/userController'; // Import controllers

const userRouter = Router();

// Apply auth middleware to all routes in this router
// Apply auth middleware to all routes in this router
// Note: If some user routes shouldn't be protected, apply middleware individually
userRouter.use(authMiddleware);

// Route to get the current user's profile (including subscription)
userRouter.get('/me', getUserProfile);

// Route to update the user's subscription tier
userRouter.put('/me/subscribe', updateSubscription);


// Add other user-related routes here (e.g., update settings)

export default userRouter;
