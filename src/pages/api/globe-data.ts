export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../db';
import { countryViews } from '../../db/schema';
import { desc } from 'drizzle-orm';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const env = locals.runtime?.env;
    const db = getDb(env);

    const data = await db.select()
      .from(countryViews)
      .orderBy(desc(countryViews.visits));

    // Return the response with edge caching headers to reduce DB query stress
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=60, s-maxage=120'
      },
    });
  } catch (err) {
    console.error('Globe telemetry query failed:', err);
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
