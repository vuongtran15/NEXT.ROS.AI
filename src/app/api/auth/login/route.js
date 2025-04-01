import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';
import apiClient from '@/utils/apiClient';

// This would normally come from a database
const USERS = [
  { id: 1, username: 'kito', password: '1', empid: "A246780" },
  { id: 2, username: 'user', password: 'user123', empid: "A246781" },
];

// In production, use a secure environment variable for the secret
const JWT_SECRET = "EcRpYu5qBM51MFTsWvJYDGAOKuSlxOpjBp5HuEUqXJxez7HfbJhyy4jcZriIGrEl";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Make sure username and password are provided
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    try {
      console.log("Calling API with username:", username, "and password:", password);
      // Call the API with proper error handling
      const response = await apiClient.post("user/login", {
        username: username.trim(),
        password: password.trim()
      });
      console.log("API response:", response);

      // Get the user data from the response
      const user = response.data || response;
      // Create a JWT token
      const token = sign(
        {
          empid: user.EmpId,
          username: user.EmpName,
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
        userInfo: {
          empid: user.EmpId,
          username: user.EmpName,
        }
      });
    } catch (apiError) {
      console.error('Error during login:', apiError.response?.data?.message || apiError.message);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid username or password',
          details: apiError.response?.data?.message || apiError.message
        },
        { status: apiError.response?.status || 500 }
      );
    }
  } catch (error) {
    
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
