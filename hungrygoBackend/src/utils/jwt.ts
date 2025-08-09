import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for a user
 * @param id User ID to include in the token
 * @returns JWT token string
 */
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};