import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string }; // Add user property to Request
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_VERY_SECRET_KEY_REPLACE_ME'; // Use the same secret as in authService

/**
 * Middleware to verify JWT token from Authorization header.
 * Attaches user payload to request object if token is valid.
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = { userId: decoded.userId }; // Attach user ID to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Unauthorized: Token expired' });
    }
    // Handle other potential errors during verification
    console.error('JWT Verification Error:', error);
    return res.status(500).json({ message: 'Internal server error during token verification' });
  }
};
