// Middleware para verificar se usuário é organizador

import { Request, Response, NextFunction } from 'express';

export function organizerMiddleware(req: Request, res: Response, next: NextFunction) {
  // O authMiddleware já adicionou req.userRole
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  // Verificar se é organizador (pode ser USER ou ORGANIZER)
  // Por enquanto, qualquer usuário autenticado pode criar eventos
  // Você pode adicionar verificação de role se necessário:
  // if (req.userRole !== 'ORGANIZER') {
  //   return res.status(403).json({ error: 'Apenas organizadores podem realizar esta ação' });
  // }

  next();
}









