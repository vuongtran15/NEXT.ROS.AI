import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

// Use the same secret as in your login route
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Get user information from the JWT token stored in cookies
 * @returns {Object|null} The decoded token payload or null if not authenticated
 */
export function getUserFromToken() {
  try {
    // Get the cookie
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    // Verify and decode the token
    const decoded = verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

/**
 * Check if the user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export function isAuthenticated() {
  return getUserFromToken() !== null;
}

/**
 * Get a specific user property from the token
 * @param {string} property - The property to retrieve (e.g., 'username', 'id')
 * @returns {any|null} The property value or null if not authenticated or property doesn't exist
 */
export function getUserProperty(property) {
  const user = getUserFromToken();
  return user ? user[property] : null;
}