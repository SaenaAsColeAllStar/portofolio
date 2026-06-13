export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../db';
import { contactSubmissions } from '../../db/schema';
import { verifyTurnstile } from '../../utils/turnstile';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body: any = {};

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        'cf-turnstile-response': formData.get('cf-turnstile-response'),
      };
    }

    const { name, email, subject, message, 'cf-turnstile-response': turnstileResponse } = body;

    // Server-side validation
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'All fields are required.' 
      }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    // Turnstile verification
    const env = locals.runtime?.env;
    const turnstileSecret = env?.TURNSTILE_SECRET_KEY || '0x4AAAAAADkIU9mGAs4or8oWnnk0sQMomdo';
    
    // Obtain client IP if available
    const ip = request.headers.get('cf-connecting-ip') || undefined;
    const isVerified = await verifyTurnstile(turnstileResponse, turnstileSecret, ip);

    if (!isVerified) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Security check failed. Please refresh the page and try again.' 
      }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    // Save to database
    const db = getDb(env);
    await db.insert(contactSubmissions).values({
      name: String(name),
      email: String(email),
      subject: String(subject),
      message: String(message),
    });

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { 'content-type': 'application/json' } 
    });

  } catch (err) {
    console.error('Contact API error:', err);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'An internal server error occurred. Please try again.' 
    }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
};
