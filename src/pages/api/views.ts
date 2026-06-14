export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../db';
import { pageViews, countryViews } from '../../db/schema';
import { eq, sql } from 'drizzle-orm';

// GET view count for a path
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path');

    if (!path) {
      return new Response(JSON.stringify({ error: 'Path parameter is required.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const env = locals.runtime?.env;
    const db = getDb(env);

    const record = await db.select({ count: pageViews.count })
      .from(pageViews)
      .where(eq(pageViews.path, path))
      .limit(1);

    const count = record[0]?.count || 0;

    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('Views GET API error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch views.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};

// POST increment view count for a path
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { path } = body;

    if (!path) {
      return new Response(JSON.stringify({ error: 'Path is required.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const env = locals.runtime?.env;
    const db = getDb(env);

    // Upsert query to increment page view
    const result = await db.insert(pageViews)
      .values({ path, count: 1 })
      .onConflictDoUpdate({
        target: pageViews.path,
        set: { count: sql`${pageViews.count} + 1`, updatedAt: sql`now()` },
      })
      .returning({ count: pageViews.count });

    const count = result[0]?.count || 1;

    // Track client country views
    const countryCode = request.headers.get('cf-ipcountry') || request.headers.get('CF-IPCountry') || (request as any).cf?.country || 'US';
    
    await db.insert(countryViews)
      .values({ countryCode, visits: 1, lastSeen: new Date() })
      .onConflictDoUpdate({
        target: countryViews.countryCode,
        set: { visits: sql`${countryViews.visits} + 1`, lastSeen: sql`now()` },
      });

    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('Views POST API error:', err);
    return new Response(JSON.stringify({ error: 'Failed to increment views.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
