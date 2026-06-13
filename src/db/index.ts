import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let dbInstance: any = null;
let clientInstance: any = null;

export function getDb(env?: any) {
  if (dbInstance) return dbInstance;

  const isHyperdrive = !!env?.HYPERDRIVE?.connectionString;
  const connectionString = env?.HYPERDRIVE?.connectionString || env?.DATABASE_URL || process.env.DATABASE_URL || import.meta.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('Neither env.HYPERDRIVE, env.DATABASE_URL, process.env, or import.meta.env is set');
  }

  // postgres.js automatically uses the optimized cloudflare:sockets driver on Workers
  clientInstance = postgres(connectionString as string, { 
    prepare: false,
    max: 1,           // Serverless environment: only need 1 connection
    max_retries: 0,   // Fail immediately on connection error to avoid subrequest loops
    connect_timeout: 5, // Timeout after 5 seconds
    // Hyperdrive handles the SSL connection to the DB, so we don't need manual SSL options when using it
    ssl: isHyperdrive ? undefined : { rejectUnauthorized: false }
  });
  dbInstance = drizzle(clientInstance, { schema });
  
  return dbInstance;
}
