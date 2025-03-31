import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

// This would normally come from a database
const USERS = [
  { id: 1, username: 'kito', password: '1',empid:"A246780" },
  { id: 2, username: 'user', password: 'user123', empid:"A246781" },
];

// In production, use a secure environment variable for the secret
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-strong-and-secure-key-12345!@#$%';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Find the user
    const user = USERS.find(u => 
      u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create a JWT token
    const token = sign(
      { 
        id: user.id, 
        username: user.username,
        empid: user.empid,
        // Don't include sensitive data like password in the token
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Set the token in a cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60, // 8 hours in seconds
      path: '/',
      sameSite: 'lax'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
