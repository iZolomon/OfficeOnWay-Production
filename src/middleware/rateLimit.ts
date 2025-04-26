// Rate Limiting Middleware
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for rate limiting
// In production, use Redis or similar for distributed systems
const rateLimitStore = new Map<string, { count: number, timestamp: number }>();

export function rateLimit(handler: (req: NextRequest) => Promise<NextResponse>, options = { limit: 100, window: 60 * 1000 }) {
  return async (req: NextRequest) => {
    // Get client IP
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    // Get current rate limit data for this IP
    const rateData = rateLimitStore.get(ip) || { count: 0, timestamp: now };
    
    // Reset count if outside window
    if (now - rateData.timestamp > options.window) {
      rateData.count = 0;
      rateData.timestamp = now;
    }
    
    // Increment count
    rateData.count++;
    rateLimitStore.set(ip, rateData);
    
    // Check if rate limit exceeded
    if (rateData.count > options.limit) {
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return handler(req);
  };
}
