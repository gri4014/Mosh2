import prisma from '../lib/prisma';
// Remove explicit imports - rely on inference

/**
 * Finds a user by their ID.
 * @param userId - The ID of the user to find.
 * @returns The user object or null if not found. (Type inferred by Prisma)
 */
export const findUserById = async (userId: string) => { // Let return type be inferred
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

/**
 * Updates the subscription tier for a given user.
 * @param userId - The ID of the user to update.
 * @param tier - The new subscription tier ('BASELINE' or 'PROMOTION').
 * @returns The updated user object. (Type inferred by Prisma)
 * @throws Error if the user is not found.
 */
export const updateUserSubscription = async (userId: string, tier: 'BASELINE' | 'PROMOTION') => { // Use string literal union type
  // First, check if the user exists
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true } // Only select id for efficiency
  });

  if (!userExists) {
    throw new Error('User not found');
  }

  // Update the user's subscription tier
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: tier,
      // Consider also updating the Subscription model if you want a history
      // This might involve creating or updating a record in the Subscription table
      // For MVP, just updating the User model might suffice as per the plan.
    },
  });

  return updatedUser;
};

// Add other user-related service functions as needed
