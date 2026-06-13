export const prerender = false;

import type { APIRoute } from 'astro';
import { getDb } from '../../db';
import { contactSubmissions } from '../../db/schema';
import { verifyTurnstile } from '../../utils/turnstile';
import { checkRateLimit } from '../../utils/rateLimit';
import { sendNotificationEmail } from '../../utils/email';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  const ip = request.headers.get('cf-connecting-ip') || '127.0.0.1';

  try {
    // Check rate limit: Max 3 contact messages per 10 minutes
    const limitCheck = await checkRateLimit(env, ip, 'contact', 3, 10);
    if (!limitCheck.allowed) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Too many contact submissions. Please wait 10 minutes before trying again.' 
      }), { status: 429, headers: { 'content-type': 'application/json' } });
    }

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
    const turnstileSecret = env?.TURNSTILE_SECRET_KEY || '0x4AAAAAADkIU9mGAs4or8oWnnk0sQMomdo';
    
    // Verify turnstile using client IP
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

    // Send email notification
    const emailPromise = sendNotificationEmail(env, {
      subject: `New Portfolio Message: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111;">
          <h2>New Message from Portfolio</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 4px solid #4f8cff; padding-left: 15px; margin: 15px 0; font-style: italic;">
            ${String(message).replace(/\n/g, '<br>')}
          </blockquote>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">This email was sent dynamically by your System Portfolio Node.</p>
        </div>
      `
    });

    if (locals.runtime?.ctx?.waitUntil) {
      locals.runtime.ctx.waitUntil(emailPromise);
    } else {
      await emailPromise;
    }

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
