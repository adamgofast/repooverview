import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined
}

// Only create Prisma client if DATABASE_URL is set
const createPrismaClient = (): PrismaClient | null => {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set. Prisma client will not be initialized.')
    return null
  }
  try {
    return new PrismaClient()
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    return null
  }
}

export const prisma: PrismaClient | null = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

