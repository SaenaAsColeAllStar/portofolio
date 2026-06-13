import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let dbInstance: any = null;
let clientInstance: any = null;

export function getDb(env?: any) {
  if (dbInstance) return dbInstance;

  const connectionString = env?.DATABASE_URL || process.env.DATABASE_URL || import.meta.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in env, process.env, or import.meta.env');
  }

  // postgres.js automatically uses the optimized cloudflare:sockets driver on Workers
  clientInstance = postgres(connectionString as string, { prepare: false });
  dbInstance = drizzle(clientInstance, { schema });
  
  return dbInstance;
}
