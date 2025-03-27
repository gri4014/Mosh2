import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma'; // Use default import

// Input validation schemas
const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password cannot be empty' }),
});

// JWT Secret - Should be moved to environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_VERY_SECRET_KEY_REPLACE_ME'; // TODO: Replace with env var

if (JWT_SECRET === 'YOUR_VERY_SECRET_KEY_REPLACE_ME') {
  console.warn(
    'WARNING: JWT_SECRET is using a default value. Set a strong secret in your .env file.'
  );
}

export const authService = {
  /**
   * Registers a new user.
   * @param data - User email and password.
   * @returns A JWT token for the new user.
   * @throws Error if email is already taken or validation fails.
   */
  async signup(data: unknown) {
    // 1. Validate input
    const validatedData = signupSchema.parse(data);
    const { email, password } = validatedData;

    // 2. Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error('Email address is already in use.'); // Consider a more specific error type
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // 4. Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // 5. Generate JWT
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: '7d', // Token expires in 7 days
    });

    // 6. Return token (excluding password)
    return { token };
  },

  /**
   * Logs in an existing user.
   * @param data - User email and password.
   * @returns A JWT token for the logged-in user.
   * @throws Error if credentials are invalid or validation fails.
   */
  async login(data: unknown) {
    // 1. Validate input
    const validatedData = loginSchema.parse(data);
    const { email, password } = validatedData;

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error('Invalid email or password.'); // Generic error for security
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password.'); // Generic error for security
    }

    // 4. Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d', // Token expires in 7 days
    });

    // 5. Return token
    return { token };
  },
};
