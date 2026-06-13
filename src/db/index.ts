import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

export async function connectDb(env?: any) {
  const connectionString = env?.DATABASE_URL || process.env.DATABASE_URL || import.meta.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in env, process.env, or import.meta.env');
  }

  const client = new pg.Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Bypass SSL validation for self-signed or Aiven certificates
    },
  });

  await client.connect();

  const db = drizzle(client, { schema });

  return {
    db,
    close: async () => {
      try {
        await client.end();
      } catch (err) {
        console.error('Error closing database client:', err);
      }
    }
  };
}
