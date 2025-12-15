// Rotas de Mensagens

import { Router } from 'express';
import { MensagemController } from '../controllers/MensagemController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /messages - Enviar mensagem (autenticado)
router.post('/messages', authMiddleware, MensagemController.enviar);

// GET /messages - Listar mensagens (autenticado)
router.get('/messages', authMiddleware, MensagemController.list);

// PUT /messages/:id/read - Marcar mensagem como lida (autenticado)
router.put('/messages/:id/read', authMiddleware, MensagemController.marcarLida);

export default router;



