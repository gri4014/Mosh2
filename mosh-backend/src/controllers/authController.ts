import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { ZodError } from 'zod';

export const authController = {
  /**
   * Handles user signup requests.
   */
  async handleSignup(req: Request, res: Response) {
    try {
      const result = await authService.signup(req.body);
      res.status(201).json(result); // 201 Created
    } catch (error) {
      if (error instanceof ZodError) {
        // Validation error
        return res
          .status(400)
          .json({ message: 'Validation failed', errors: error.errors });
      }
      if (error instanceof Error && error.message.includes('already in use')) {
        // Specific error for existing email
        return res.status(409).json({ message: error.message }); // 409 Conflict
      }
      // Generic server error
      console.error('Signup Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  /**
   * Handles user login requests.
   */
  async handleLogin(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result); // 200 OK
    } catch (error) {
      if (error instanceof ZodError) {
        // Validation error
        return res
          .status(400)
          .json({ message: 'Validation failed', errors: error.errors });
      }
      if (error instanceof Error && error.message.includes('Invalid')) {
        // Specific error for bad credentials
        return res.status(401).json({ message: error.message }); // 401 Unauthorized
      }
      // Generic server error
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};
