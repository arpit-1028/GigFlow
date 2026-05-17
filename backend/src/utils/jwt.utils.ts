import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined in environment variables');
  return secret;
};

const getJwtExpiry = (): string => {
  return process.env.JWT_EXPIRES_IN ?? '7d';
};

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: getJwtExpiry() as any,
  });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, getJwtSecret()) as JWTPayload;
};
