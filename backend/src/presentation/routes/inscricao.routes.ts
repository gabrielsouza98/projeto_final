// Rotas de Inscrições

import { Router } from 'express';
import { InscricaoController } from '../controllers/InscricaoController';
import { CheckinController } from '../controllers/CheckinController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { organizerMiddleware } from '../middlewares/organizer.middleware';

const router = Router();

// POST /events/:eventoId/register - Inscrever-se em evento (autenticado)
router.post('/events/:eventoId/register', authMiddleware, InscricaoController.inscrever);

// GET /registrations - Listar minhas inscrições (autenticado)
router.get('/registrations', authMiddleware, InscricaoController.listMyRegistrations);

// GET /events/:eventoId/registrations - Listar inscrições de um evento (organizador)
router.get('/events/:eventoId/registrations', authMiddleware, organizerMiddleware, InscricaoController.listByEvento);

// PUT /registrations/:id/approve - Aprovar inscrição (organizador)
router.put('/registrations/:id/approve', authMiddleware, organizerMiddleware, InscricaoController.approve);

// PUT /registrations/:id/reject - Recusar inscrição (organizador)
router.put('/registrations/:id/reject', authMiddleware, organizerMiddleware, InscricaoController.reject);

// PUT /registrations/:id/confirm-payment - Confirmar pagamento (organizador)
router.put('/registrations/:id/confirm-payment', authMiddleware, organizerMiddleware, InscricaoController.confirmPayment);

// PUT /registrations/:id/cancel - Cancelar inscrição (participante ou organizador)
router.put('/registrations/:id/cancel', authMiddleware, InscricaoController.cancel);

// GET /registrations/:inscricaoId/card - Obter cartão virtual (autenticado)
router.get('/registrations/:inscricaoId/card', authMiddleware, CheckinController.obterCartaoVirtual);

// GET /registrations/:inscricaoId/checkins - Listar check-ins (autenticado)
router.get('/registrations/:inscricaoId/checkins', authMiddleware, CheckinController.listCheckins);

export default router;

