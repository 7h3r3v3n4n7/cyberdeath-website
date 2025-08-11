import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request: NextRequest) {
  // Check if the request is for admin routes (but exclude login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('auth-token')?.value;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Middleware - URL:', request.nextUrl.pathname);
      console.log('Middleware - Token exists:', !!token);
    }

    if (!token) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Middleware - No token, redirecting to login');
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyToken(token);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Middleware - Token payload:', payload);
    }
    
    if (!payload || payload.role !== 'ADMIN') {
      if (process.env.NODE_ENV === 'development') {
        console.log('Middleware - Invalid token or not admin, redirecting to login');
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Middleware - Authentication successful');
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
