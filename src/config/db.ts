// src/config/db.ts
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";

// 1. Create a native PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Initialize the Prisma 7 Database Driver Adapter
const adapter = new PrismaPg(pool);

// 3. Hand the adapter over to the client instance
const prisma = new PrismaClient({ adapter });

export default prisma;