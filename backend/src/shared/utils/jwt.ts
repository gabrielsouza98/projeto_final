// Utilitário para geração e validação de JWT

import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'seu-secret-aqui';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Gera token JWT
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Valida e decodifica token JWT
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado. Faça login novamente.');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido. Verifique se o token está correto.');
    }
    if (error.name === 'NotBeforeError') {
      throw new Error('Token ainda não é válido.');
    }
    throw new Error('Token inválido ou expirado');
  }
}

