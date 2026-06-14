export const prerender = false;

import type { APIRoute } from "astro";
import { getAuthConfig, verifySessionToken } from "../../../utils/auth";
import { getDb } from "../../../db";
import { guestbook } from "../../../db/schema";
import { sql } from "drizzle-orm";

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  try {
    const env = locals.runtime?.env;
    const { secret } = getAuthConfig(env);

    // 1. Verify Authenticated Session
    const cookieToken = cookies.get("ctos_session")?.value;
    const session = await verifySessionToken(cookieToken, secret);

    if (!session) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Unauthorized action. Secure admin token required." 
      }), { 
        status: 401, 
        headers: { "content-type": "application/json" } 
      });
    }

    // 2. Parse request parameters
    const body = await request.json() as any;
    const { id } = body;

    if (id === undefined || typeof id !== "number") {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Missing or invalid guestbook entry ID." 
      }), { 
        status: 400, 
        headers: { "content-type": "application/json" } 
      });
    }

    // 3. Connect to DB and delete
    const db = getDb(env);
    
    await db.delete(guestbook)
      .where(sql`id = ${id}`);

    return new Response(JSON.stringify({ 
      success: true,
      message: "Signature successfully deleted from public directory."
    }), { 
      status: 200, 
      headers: { "content-type": "application/json" } 
    });

  } catch (err: any) {
    console.error("Guestbook deletion API error:", err);
    return new Response(JSON.stringify({ 
      success: false, 
      error: err.message || "An internal error occurred while deleting guestbook entry." 
    }), { 
      status: 500, 
      headers: { "content-type": "application/json" } 
    });
  }
};
