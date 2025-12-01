import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prefer DATABASE_URL, but allow PRISMA_DATABASE_URL for Prisma Accelerate if present
const rawDbUrl = process.env.DATABASE_URL ?? process.env.PRISMA_DATABASE_URL;

function shortDbUrl(url?: string) {
  try {
    if (!url) return "undefined";
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}:${parsed.port}`;
  } catch (error) {
    return "invalid-url";
  }
}

if (!rawDbUrl) {
  console.warn(
    `⚠️  DATABASE_URL not set. Please set DATABASE_URL=... to your Prisma Postgres (Vercel).`
  );
} else {
  console.info(`Using database: ${shortDbUrl(rawDbUrl)}`);
}

// In production, enforce the DATABASE_URL points to Vercel-hosted DB
// Enforce that DATABASE_URL is set and points to Vercel-hosted Postgres.
// The project intentionally requires the same Vercel Postgres instance for local
// development and production to keep environments synchronized.
try {
  if (!rawDbUrl) {
    throw new Error(
      "DATABASE_URL must be set and point to your Vercel Postgres DB. Please set this value in your environment."
    );
  }

  const parsed = new URL(rawDbUrl);
  const host = parsed.hostname.toLowerCase();
  const isVercel =
    host.includes("vercel") ||
    host.includes("vercel-storage") ||
    host.includes("vercel-storage.com") ||
    host.includes("ephemeral.vercel");
  if (!isVercel) {
    throw new Error(
      `DATABASE_URL does not appear to be a Vercel-hosted Postgres (host: ${host}). Please use your Vercel Postgres DATABASE_URL in both local and production environments.`
    );
  }
} catch (err) {
  console.error(
    "❌ Invalid DATABASE_URL:",
    err instanceof Error ? err.message : String(err)
  );
  // Fail fast so the developer fixes the environment variables.
  throw err;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error"],
    // Provide the url explicitly to make it obvious which env var is in use
    ...(rawDbUrl
      ? { datasources: { db: { url: rawDbUrl } as unknown } as any }
      : {}),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Export a helper function to verify DB connectivity from Node
export async function testDatabaseConnection() {
  if (!rawDbUrl) {
    console.error(
      "DATABASE_URL environment variable is missing. Please set it to your Prisma Postgres URL."
    );
    return false;
  }
  try {
    // Use $queryRaw to perform a fast check
    await db.$connect();
    await db.$queryRaw`SELECT 1;`;
    await db.$disconnect();
    console.info("✅ Database connection test passed");
    return true;
  } catch (error) {
    console.error(
      "❌ Database connection test failed:",
      (error as Error).message
    );
    return false;
  }
}
