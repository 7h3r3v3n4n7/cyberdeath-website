import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

// In-memory store for CSRF tokens (use Redis in production)
const csrfTokens = new Map<string, { token: string; expires: number }>();

export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

export function createCSRFToken(sessionId: string): string {
  const token = generateCSRFToken();
  const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  
  csrfTokens.set(sessionId, { token, expires });
  
  // Clean up expired tokens
  for (const [id, data] of csrfTokens.entries()) {
    if (data.expires < Date.now()) {
      csrfTokens.delete(id);
    }
  }
  
  return token;
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored || stored.expires < Date.now()) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  if (stored.token !== token) {
    return false;
  }
  
  // Remove token after successful validation (one-time use)
  csrfTokens.delete(sessionId);
  return true;
}

export function getCSRFToken(sessionId: string): string | null {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored || stored.expires < Date.now()) {
    csrfTokens.delete(sessionId);
    return null;
  }
  
  return stored.token;
}

// CSRF middleware for API routes
export function csrfProtection(request: NextRequest) {
  // Skip CSRF for GET requests
  if (request.method === 'GET') {
    return null;
  }
  
  const sessionId = request.cookies.get('auth-token')?.value;
  if (!sessionId) {
    return NextResponse.json(
      { error: 'Authentication required for CSRF protection' },
      { status: 401 }
    );
  }
  
  const csrfToken = request.headers.get('x-csrf-token') || 
                   request.nextUrl.searchParams.get('csrf_token');
  
  if (!csrfToken) {
    return NextResponse.json(
      { error: 'CSRF token required' },
      { status: 403 }
    );
  }
  
  if (!validateCSRFToken(sessionId, csrfToken)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }
  
  return null; // Continue with request
}
