// Rotas de Amizades

import { Router } from 'express';
import { AmizadeController } from '../controllers/AmizadeController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /friends/request - Solicitar amizade (autenticado)
router.post('/friends/request', authMiddleware, AmizadeController.solicitar);

// PUT /friends/:id/accept - Aceitar amizade (autenticado)
router.put('/friends/:id/accept', authMiddleware, AmizadeController.aceitar);

// PUT /friends/:id/reject - Recusar amizade (autenticado)
router.put('/friends/:id/reject', authMiddleware, AmizadeController.recusar);

// GET /friends - Listar amizades (autenticado)
router.get('/friends', authMiddleware, AmizadeController.list);

export default router;



