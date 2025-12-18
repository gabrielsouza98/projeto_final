// Rotas de Eventos

import { Router } from 'express';
import { EventoController } from '../controllers/EventoController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { organizerMiddleware } from '../middlewares/organizer.middleware';

const router = Router();

// GET /events - Listar eventos (público, mas pode ter filtros)
router.get('/', EventoController.list);

// GET /events/:id - Buscar evento por ID (público)
router.get('/:id', EventoController.getById);

// POST /events - Criar evento (protegida - precisa autenticação)
router.post('/', authMiddleware, organizerMiddleware, EventoController.create);

// PUT /events/:id - Atualizar evento (protegida - precisa ser o organizador)
router.put('/:id', authMiddleware, organizerMiddleware, EventoController.update);

// DELETE /events/:id - Deletar evento (protegida - precisa ser o organizador)
router.delete('/:id', authMiddleware, organizerMiddleware, EventoController.delete);

export default router;









