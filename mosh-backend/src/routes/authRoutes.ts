import { Router } from 'express';
import { authController } from '../controllers/authController';

const authRouter = Router();

// Define authentication routes
authRouter.post('/signup', authController.handleSignup);
authRouter.post('/login', authController.handleLogin);

export default authRouter;
