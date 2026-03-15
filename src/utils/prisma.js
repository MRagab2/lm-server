const { PrismaClient } = require('../generated/prisma/client');
const { PrismaPg }     = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Single shared instance across the entire app
const prisma = new PrismaClient({ adapter });

module.exports = prisma;