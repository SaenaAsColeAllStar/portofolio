import { getDb } from '../db';
import { rateLimits } from '../db/schema';
import { and, eq, gt, sql } from 'drizzle-orm';

/**
 * Checks if a client IP address has exceeded the request limits for a specific action.
 * Self-heals the table if it is not present.
 * 
 * @param env Cloudflare bindings environment object
 * @param ip Client IP address (from CF-Connecting-IP)
 * @param action Name of the action ('contact', 'guestbook', 'chat')
 * @param limitCount Maximum allowed attempts in the time window
 * @param durationMinutes Window duration in minutes
 */
export async function checkRateLimit(
  env: any,
  ip: string,
  action: string,
  limitCount: number,
  durationMinutes: number
): Promise<{ allowed: boolean; attempts: number }> {
  const db = getDb(env);

  // Self-heal rate_limits table
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS rate_limits (
        id SERIAL PRIMARY KEY,
        ip TEXT NOT NULL,
        action TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
  } catch (err) {
    console.error('Self-healing rate_limits table error:', err);
  }

  // Calculate cutoff time
  const cutoffTime = new Date(Date.now() - durationMinutes * 60 * 1000);

  try {
    // Count recent attempts
    const recentAttempts = await db.select({ count: sql<number>`count(*)` })
      .from(rateLimits)
      .where(
        and(
          eq(rateLimits.ip, ip),
          eq(rateLimits.action, action),
          gt(rateLimits.createdAt, cutoffTime)
        )
      );

    const attemptsCount = Number(recentAttempts[0]?.count || 0);

    if (attemptsCount >= limitCount) {
      return { allowed: false, attempts: attemptsCount };
    }

    // Insert new attempt
    await db.insert(rateLimits).values({
      ip,
      action
    });

    return { allowed: true, attempts: attemptsCount + 1 };
  } catch (err) {
    console.error('Rate limit query check failed, permitting access:', err);
    // If query fails, default to allowing the request to avoid locking out legitimate users
    return { allowed: true, attempts: 0 };
  }
}
