import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

let dbInstance: any = null;

export function getDb(env?: any) {
  if (dbInstance) return dbInstance;

  const connectionString = env?.DATABASE_URL || process.env.DATABASE_URL || import.meta.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in env, process.env, or import.meta.env');
  }

  const pool = new pg.Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Bypass SSL validation for self-signed or Aiven certificates
    },
  });

  dbInstance = drizzle(pool, { schema });
  return dbInstance;
}
