export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../db';
import { guestbook } from '../../db/schema';
import { desc } from 'drizzle-orm';
import { verifyTurnstile } from '../../utils/turnstile';
import { checkRateLimit } from '../../utils/rateLimit';
import { sendNotificationEmail } from '../../utils/email';

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
  const env = locals.runtime?.env;
  const ip = request.headers.get('cf-connecting-ip') || '127.0.0.1';

  try {
    // Check rate limit: Max 5 guestbook signings per 10 minutes
    const limitCheck = await checkRateLimit(env, ip, 'guestbook', 5, 10);
    if (!limitCheck.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Too many guestbook signings. Please wait 10 minutes before trying again.' 
      }), { status: 429, headers: { 'content-type': 'application/json' } });
    }

    const body = await request.json() as any;
    const { name, message, 'cf-turnstile-response': turnstileResponse } = body;

    if (!name || !message) {
      return new Response(JSON.stringify({ error: 'Name and message are required.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Turnstile verification
    const turnstileSecret = (env as any)?.TURNSTILE_SECRET_KEY || 'x';
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

    // Send email notification
    const emailPromise = sendNotificationEmail(env, {
      subject: `New Guestbook Signature: ${name}`,
      text: `Name: ${name} signed your guestbook.\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111;">
          <h2>New Guestbook Signature</h2>
          <p><strong>Name:</strong> ${name} just signed your portfolio guestbook!</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 4px solid #2ecc71; padding-left: 15px; margin: 15px 0; font-style: italic;">
            ${String(message).replace(/\n/g, '<br>')}
          </blockquote>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">Manage this signature from your Admin Dashboard.</p>
        </div>
      `
    });

    if (locals.runtime?.ctx?.waitUntil) {
      locals.runtime.ctx.waitUntil(emailPromise);
    } else {
      await emailPromise;
    }

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
