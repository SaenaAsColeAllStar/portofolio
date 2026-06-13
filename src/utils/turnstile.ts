export async function verifyTurnstile(token: string, secretKey: string, ip?: string): Promise<boolean> {
  if (!token) return false;
  
  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (ip) {
      formData.append('remoteip', ip);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });

    const data: any = await res.json();
    return !!data.success;
  } catch (e) {
    console.error('Turnstile verification error:', e);
    return false;
  }
}
