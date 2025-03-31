import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

// In production, use a secure environment variable for the secret
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-strong-and-secure-key-12345!@#$%';

export async function GET(request) {
  try {
    // Get the cookie
    const cookieStore = cookies();
    let token = cookieStore.get('auth-token')?.value;
    
    // If no cookie token, check Authorization header (which can be set from localStorage on client)
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false, 
        message: 'No authentication token found' 
      }, { status: 401 });
    }

    // Verify and decode the token
    const decoded = verify(token, JWT_SECRET);
    
    // Return user info without sensitive data
    return NextResponse.json({ 
      authenticated: true, 
      user: {
        id: decoded.id,
        username: decoded.username,
        empid: decoded.empid
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ 
      authenticated: false, 
      message: 'Invalid or expired token' 
    }, { status: 401 });
  }
}