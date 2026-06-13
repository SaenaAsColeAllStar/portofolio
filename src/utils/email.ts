/**
 * Sends a transactional HTML notification email via Resend API.
 * Falls back to simulated console logs if RESEND_API_KEY is not configured.
 * 
 * @param env Cloudflare bindings environment object
 * @param options Email components: subject, text (plain), and html (rich)
 */
export async function sendNotificationEmail(
  env: any,
  options: { subject: string; text: string; html: string }
): Promise<{ success: boolean; id?: string; simulated?: boolean; error?: string }> {
  const apiKey = env?.RESEND_API_KEY;
  const toEmail = env?.NOTIFICATION_EMAIL || env?.ADMIN_EMAIL || 'Saepulhusna70@gmail.com';
  const fromEmail = env?.SENDER_EMAIL || 'portfolio@ctos.web.id';

  if (!apiKey) {
    console.log(`[Email Simulation]
=========================================
TO: ${toEmail}
FROM: CTOS Portfolio <${fromEmail}>
SUBJECT: ${options.subject}
-----------------------------------------
${options.text}
=========================================`);
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `CTOS Portfolio <${fromEmail}>`,
        to: toEmail,
        subject: options.subject,
        text: options.text,
        html: options.html,
      }),
    });

    if (response.ok) {
      const data = await response.json() as any;
      return { success: true, id: data.id };
    } else {
      const errorText = await response.text();
      console.error('Failed to send email via Resend API:', errorText);
      return { success: false, error: errorText };
    }
  } catch (err: any) {
    console.error('Error executing sendNotificationEmail:', err);
    return { success: false, error: err.message || String(err) };
  }
}
