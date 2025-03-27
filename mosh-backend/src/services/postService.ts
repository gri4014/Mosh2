import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';
// Removed problematic imports

interface PostUpdateData {
  title?: string;
  description?: string;
  hashtags?: string[];
  // Add other editable fields as needed
}

/**
 * Updates a post for a specific user.
 * Ensures that the user owns the post before updating.
 *
 * @param postId The ID of the post to update.
 * @param userId The ID of the user attempting the update.
 * @param data The data to update the post with.
 * @returns The updated post object.
 * @throws Error if the post is not found or the user does not own it.
 */
export const updatePost = async (postId: string, userId: string, data: PostUpdateData) => {
  try {
    // Use 'any' type as a workaround for persistent type issues
    const updatePayload: any = {};
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.description !== undefined) updatePayload.description = data.description;
    // Prisma expects JSON for array fields if defined as Json in schema
    if (data.hashtags !== undefined) updatePayload.hashtags = data.hashtags;

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
        userId: userId, // Ensure the post belongs to this user
      },
      data: updatePayload,
    });

    return updatedPost;
  } catch (error: unknown) { // Explicitly type caught error as unknown
    // Workaround for error type checking: Check for 'code' property directly
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const prismaError = error as { code: string; message: string }; // Type assertion
      // P2025: Record to update not found.
      if (prismaError.code === 'P2025') {
        throw new Error(`Post with ID ${postId} not found or you do not have permission to edit it.`);
      }
    }
    // Log the original error for debugging, regardless of type
    console.error(`Error updating post ${postId}:`, error);
    // Throw a generic error to the caller
    throw new Error('Failed to update post.');
  }
};

/**
 * Retrieves posts for a specific user.
 *
 * @param userId The ID of the user whose posts are to be retrieved.
 * @returns A promise that resolves to an array of post objects.
 * @throws Error if there's an issue fetching posts.
 */
export const getPostsForUser = async (userId: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        description: true, // Include description if needed for display
        scheduledFor: true,
        status: true,
        imageUrls: true, // Include images if they need to be previewed
        hashtags: true,
        // Add any other fields needed by the frontend display
      },
      orderBy: {
        scheduledFor: 'asc', // Order by schedule time, upcoming first
      },
    });
    return posts;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    throw new Error('Failed to retrieve posts.');
  }
};

// Add other post-related service functions here (e.g., getPostById, createPost, deletePost)
