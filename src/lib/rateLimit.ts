import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
}

export function createRateLimiter(config: RateLimitConfig) {
  return function rateLimit(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const now = Date.now();

    // Get or create rate limit data for this IP
    const rateLimitData = rateLimitStore.get(ip) || { count: 0, resetTime: now + config.windowMs };

    // Reset if window has passed
    if (now > rateLimitData.resetTime) {
      rateLimitData.count = 0;
      rateLimitData.resetTime = now + config.windowMs;
    }

    // Increment request count
    rateLimitData.count++;
    rateLimitStore.set(ip, rateLimitData);

    // Check if limit exceeded
    if (rateLimitData.count > config.maxRequests) {
      const response = NextResponse.json(
        { 
          error: config.message || 'Too many requests',
          retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000)
        },
        { status: 429 }
      );

      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', new Date(rateLimitData.resetTime).toISOString());
      response.headers.set('Retry-After', Math.ceil((rateLimitData.resetTime - now) / 1000).toString());

      return response;
    }

    // Add rate limit headers for successful requests
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', (config.maxRequests - rateLimitData.count).toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitData.resetTime).toISOString());

    return response;
  };
}

// Predefined rate limiters
export const loginRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts. Please try again later.'
});

export const apiRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  message: 'Too many API requests. Please slow down.'
});

export const adminRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
  message: 'Too many admin requests. Please slow down.'
});
