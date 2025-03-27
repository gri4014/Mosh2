import { Request, Response } from 'express';
import * as userService from '../services/userService'; // Revert: Remove .ts extension
// Remove explicit Prisma type import

// Extend the Express Request type to include the user object from authMiddleware
// Note: The actual extension is done globally in authMiddleware.ts
// This interface helps with type checking within this controller.
interface AuthenticatedRequest extends Request {
  user?: { userId: string }; // Match the structure added by authMiddleware
}

export const updateSubscription = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId; // Use userId here
  const { tier } = req.body;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Validate the tier input against known string literal values
  const validTiers: ('BASELINE' | 'PROMOTION')[] = ['BASELINE', 'PROMOTION'];
  if (!tier || !validTiers.includes(tier as 'BASELINE' | 'PROMOTION')) {
      res.status(400).json({ message: 'Invalid subscription tier provided. Must be BASELINE or PROMOTION.' });
      return;
  }

  try {
    // Pass the validated tier directly
    const updatedUser = await userService.updateUserSubscription(userId, tier as 'BASELINE' | 'PROMOTION');
    res.status(200).json({ message: 'Subscription updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating subscription:', error);
    // Consider more specific error handling based on potential errors from the service
    if (error instanceof Error && error.message.includes('User not found')) {
        res.status(404).json({ message: 'User not found' });
    } else {
        res.status(500).json({ message: 'Failed to update subscription' });
    }
  }
};

// Placeholder for fetching user data - adjust as needed
export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId; // Use userId here

    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        // Assuming a service function exists to get user details
        const user = await userService.findUserById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Exclude password before sending response
        const { password, ...userProfile } = user;
        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
};
