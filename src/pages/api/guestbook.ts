export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../db';
import { guestbook } from '../../db/schema';
import { desc } from 'drizzle-orm';
import { verifyTurnstile } from '../../utils/turnstile';

// GET list of guestbook entries
export const GET: APIRoute = async ({ locals }) => {
  try {
    const env = locals.runtime?.env;
    const db = getDb(env);

    const entries = await db.select()
      .from(guestbook)
      .orderBy(desc(guestbook.createdAt));

    return new Response(JSON.stringify({ entries }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('Guestbook GET error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch guestbook entries.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};

// POST add new guestbook entry
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { name, message, 'cf-turnstile-response': turnstileResponse } = body;

    if (!name || !message) {
      return new Response(JSON.stringify({ error: 'Name and message are required.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Turnstile verification
    const env = locals.runtime?.env;
    const turnstileSecret = env?.TURNSTILE_SECRET_KEY || '0x4AAAAAADkIU9mGAs4or8oWnnk0sQMomdo';
    
    const ip = request.headers.get('cf-connecting-ip') || undefined;
    const isVerified = await verifyTurnstile(turnstileResponse, turnstileSecret, ip);

    if (!isVerified) {
      return new Response(JSON.stringify({ error: 'Security check failed. Please try again.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const db = getDb(env);
    
    // Insert into guestbook table
    const result = await db.insert(guestbook)
      .values({
        name: String(name),
        message: String(message),
      })
      .returning();

    return new Response(JSON.stringify({ success: true, entry: result[0] }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error('Guestbook POST error:', err);
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
