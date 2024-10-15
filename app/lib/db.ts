import { createPool } from '@vercel/postgres';

export const db = createPool({
  connectionString: process.env.POSTGRES_URL
});

export { sql } from '@vercel/postgres';