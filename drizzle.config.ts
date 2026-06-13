import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import fs from 'fs';
import path from 'path';

const sslConfig = fs.existsSync(path.resolve('./aiven-ca.pem'))
  ? {
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.resolve('./aiven-ca.pem')).toString(),
    }
  : {
      rejectUnauthorized: false,
    };

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: sslConfig,
  },
});

