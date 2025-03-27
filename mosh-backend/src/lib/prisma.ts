import { PrismaClient } from '@prisma/client';

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Optional: Add logging or extensions if needed later
// prisma.$use(...) 

export default prisma;
