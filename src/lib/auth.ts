import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: JWTPayload): string {
  if (process.env.NODE_ENV === 'development') {
    console.log('Generating token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'Secret missing');
    console.log('Token payload:', payload);
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
  if (process.env.NODE_ENV === 'development') {
    console.log('Generated token:', token.substring(0, 20) + '...');
  }
  return token;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'Secret missing');
      console.log('Token to verify:', token.substring(0, 20) + '...');
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    if (process.env.NODE_ENV === 'development') {
      console.log('Token verification successful:', payload);
    }
    return payload;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Token verification failed:', error);
    }
    return null;
  }
}

export async function authenticateUser(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role
  };
}
