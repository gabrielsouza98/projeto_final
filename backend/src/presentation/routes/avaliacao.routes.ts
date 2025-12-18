// Rotas de Avaliações

import { Router } from 'express';
import { AvaliacaoController } from '../controllers/AvaliacaoController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /events/:eventoId/rate - Criar avaliação (autenticado)
router.post('/events/:eventoId/rate', authMiddleware, AvaliacaoController.criar);

// GET /events/:eventoId/ratings - Listar avaliações de um evento (público)
router.get('/events/:eventoId/ratings', AvaliacaoController.listByEvento);

// GET /ratings - Listar minhas avaliações (autenticado)
router.get('/ratings', authMiddleware, AvaliacaoController.listMyRatings);

export default router;









