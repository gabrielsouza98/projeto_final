// Middleware de autenticação JWT

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../shared/utils/jwt';

// Estender o tipo Request para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      userRole?: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Pegar token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Formato: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const token = parts[1];

    // Verificar e decodificar token
    const decoded = verifyToken(token);

    // Adicionar informações do usuário na requisição
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;

    next();
  } catch (error: any) {
    return res.status(401).json({ error: error.message || 'Token inválido' });
  }
}



