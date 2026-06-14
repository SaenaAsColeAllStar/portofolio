const DEFAULT_SECRET = 'ctos_super_secret_session_key_2026';

function stringToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate HMAC SHA-256 signature
export async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    stringToBuffer(secret) as any,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, stringToBuffer(payload) as any);
  return bufferToHex(signature);
}

// Verify HMAC SHA-256 signature
export async function verifySignature(payload: string, signatureHex: string, secret: string): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      stringToBuffer(secret) as any,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const signatureBuffer = hexToBuffer(signatureHex);
    return await crypto.subtle.verify('HMAC', key, signatureBuffer as any, stringToBuffer(payload) as any);
  } catch (e) {
    console.error('Signature verification error:', e);
    return false;
  }
}

// Create a session token
export async function createSessionToken(username: string, secret: string, maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<string> {
  const exp = Date.now() + maxAgeMs;
  const payloadObj = { username, exp };
  const payloadStr = JSON.stringify(payloadObj);
  // Base64 encode payload safely
  const payloadB64 = btoa(payloadStr);
  const signature = await signPayload(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

// Verify a session token and return the payload if valid
export async function verifySessionToken(token: string | null | undefined, secret: string): Promise<{ username: string } | null> {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const isValid = await verifySignature(payloadB64, signature, secret);
  if (!isValid) return null;

  try {
    const payloadStr = atob(payloadB64);
    const payload = JSON.parse(payloadStr);
    
    // Check expiration
    if (payload.exp < Date.now()) {
      return null;
    }
    
    return { username: payload.username };
  } catch (e) {
    return null;
  }
}

// Get auth config from env
export function getAuthConfig(env: any) {
  const username = env?.ADMIN_USERNAME || 'admin';
  const password = env?.ADMIN_PASSWORD || 'admin123';
  const secret = env?.SESSION_SECRET || DEFAULT_SECRET;
  return { username, password, secret };
}

// Secure password hashing using Web Crypto API (SHA-256)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'ctos_salt_2026_secure');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

