// CSRF Protection Middleware
import { NextRequest, NextResponse } from 'next/server';

export function csrfProtection(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Get CSRF token from request header
    const csrfToken = req.headers.get('X-CSRF-Token');
    const sessionToken = req.cookies.get('session_token')?.value;
    
    // Skip CSRF check for GET requests
    if (req.method === 'GET') {
      return handler(req);
    }
    
    // Validate CSRF token
    if (!csrfToken || !sessionToken) {
      return new NextResponse(
        JSON.stringify({ error: 'CSRF token validation failed' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // In a real implementation, validate the token against the session
    // For this example, we'll just check if it exists
    
    return handler(req);
  };
}
