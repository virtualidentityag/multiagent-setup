import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './prisma/generated'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString });

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter }).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma as PrismaClient

export default prisma
export * from './prisma/generated'