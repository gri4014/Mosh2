import prisma from '../lib/prisma';
// Remove explicit imports - rely on inference

/**
 * Finds a user by their ID.
 * @param userId - The ID of the user to find.
 * @returns The user object with selected fields or null if not found.
 */
export const findUserById = async (userId: string) => {
  // Select specific fields to avoid sending sensitive data like password hash
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      subscriptionTier: true,
      reviewModeEnabled: true, // Include the new setting
      // Add other fields needed by the frontend here
    }
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


/**
 * Updates specific settings for a user.
 * @param userId - The ID of the user to update.
 * @param settings - An object containing the settings to update (e.g., { reviewModeEnabled: true }).
 * @returns The updated user object with selected fields.
 * @throws Error if the user is not found or if data is invalid.
 */
export const updateUserSettings = async (userId: string, settings: { reviewModeEnabled?: boolean }) => {
  // Validate settings input - ensure reviewModeEnabled is a boolean if provided
  if (settings.reviewModeEnabled !== undefined && typeof settings.reviewModeEnabled !== 'boolean') {
    throw new Error('Invalid value for reviewModeEnabled. Must be a boolean.');
  }

  // Prepare data for update, only including fields that are actually provided
  const dataToUpdate: { reviewModeEnabled?: boolean } = {};
  if (settings.reviewModeEnabled !== undefined) {
    dataToUpdate.reviewModeEnabled = settings.reviewModeEnabled;
  }

  // Check if there's anything to update
  if (Object.keys(dataToUpdate).length === 0) {
    // If nothing to update, maybe just return the current user data or throw an error
    // For now, let's return current data to avoid unnecessary DB call
    const currentUser = await findUserById(userId);
    if (!currentUser) throw new Error('User not found');
    return currentUser;
    // Alternatively: throw new Error('No valid settings provided for update.');
  }

  // Perform the update
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
    select: { // Return the same selected fields as findUserById
      id: true,
      email: true,
      subscriptionTier: true,
      reviewModeEnabled: true,
    }
  });

  return updatedUser;
};


// Add other user-related service functions as needed
