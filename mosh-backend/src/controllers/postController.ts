import { Request, Response } from 'express';
import * as postService from '../services/postService'; // Assuming postService exports updatePost

// Extend Express Request type to include user from authMiddleware
interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

/**
 * Controller to handle updating a post.
 */
export const updatePostController = async (req: AuthenticatedRequest, res: Response) => {
  const postId = req.params.postId;
  const userId = req.user?.userId; // Get userId from the authenticated request
  const postData = req.body; // { title, description, hashtags }

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. User ID not found.' });
  }

  if (!postId) {
    return res.status(400).json({ message: 'Post ID is required.' });
  }

  // Basic validation for incoming data (can be expanded)
  if (!postData || Object.keys(postData).length === 0) {
    return res.status(400).json({ message: 'No update data provided.' });
  }
  // Add more specific validation if needed (e.g., check types, lengths)

  try {
    const updatedPost = await postService.updatePost(postId, userId, postData);
    res.status(200).json(updatedPost);
  } catch (error) {
    // Handle specific errors from the service, like 'not found'
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    // Generic error handler
    console.error(`Error in updatePostController for post ${postId}:`, error);
    res.status(500).json({ message: 'Failed to update post.' });
  }
};

/**
 * Controller to handle fetching posts for the authenticated user.
 */
export const getPostsController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId; // Get userId from the authenticated request

  if (!userId) {
    // This should technically be caught by authMiddleware, but good practice to check
    return res.status(401).json({ message: 'Unauthorized. User ID not found.' });
  }

  try {
    const posts = await postService.getPostsForUser(userId);
    res.status(200).json(posts);
  } catch (error) {
    // Generic error handler
    console.error(`Error in getPostsController for user ${userId}:`, error);
    res.status(500).json({ message: 'Failed to retrieve posts.' });
  }
};

// Add other post-related controller functions here
